import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import MovimientoForm from "../components/MovimientoForm";

function Icon({ name, className = "h-5 w-5" }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const icons = {
    movement: (
      <>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    income: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),
    expense: (
      <>
        <path d="M12 5v14" />
        <path d="m18 13-6 6-6-6" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6.5A2.5 2.5 0 0 1 4 16.5Z" />
        <path d="M4 9h16" />
        <path d="M16 13h4" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </>
    ),
    filter: <path d="M4 5h16l-6.5 7.2V18l-3 1.5v-7.3Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6 18 21H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}

const statThemes = {
  income: {
    border: "border-emerald-500/40",
    icon: "border-emerald-400/35 bg-emerald-500/16 text-emerald-300",
    value: "text-emerald-300",
    detail: "text-emerald-400/85",
    shadow: "shadow-[0_18px_52px_rgba(16,185,129,0.08)]",
  },
  expense: {
    border: "border-red-500/40",
    icon: "border-red-400/35 bg-red-500/16 text-red-300",
    value: "text-red-300",
    detail: "text-red-400/85",
    shadow: "shadow-[0_18px_52px_rgba(239,68,68,0.08)]",
  },
  balance: {
    border: "border-violet-500/40",
    icon: "border-violet-400/35 bg-violet-500/16 text-violet-300",
    value: "text-violet-300",
    detail: "text-violet-400/85",
    shadow: "shadow-[0_18px_52px_rgba(139,92,246,0.08)]",
  },
  count: {
    border: "border-blue-500/40",
    icon: "border-blue-400/35 bg-blue-500/16 text-blue-300",
    value: "text-blue-300",
    detail: "text-blue-400/85",
    shadow: "shadow-[0_18px_52px_rgba(59,130,246,0.08)]",
  },
};

function StatCard({ type, title, value, detail, icon }) {
  const theme = statThemes[type];

  return (
    <article
      className={`
        min-h-[128px]
        rounded-[30px]
        border-2
        bg-[#080c14]/68
        px-7
        py-5
        backdrop-blur-xl
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-[#0b1018]/78
        ${theme.border}
        ${theme.shadow}
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border-2
            ${theme.icon}
          `}
        >
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0 flex-1 pr-2 pt-0.5">
          <p className="text-[15px] font-semibold tracking-tight text-slate-200">
            {title}
          </p>

          <p
            className={`
              mt-2
              truncate
              text-[20px]
              font-black
              tracking-[-0.03em]
              leading-none
              ${theme.value}
            `}
          >
            {value}
          </p>

          <p className={`mt-3 text-[13px] leading-5 ${theme.detail}`}>
            {detail}
          </p>
        </div>
      </div>
    </article>
  );
}

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cuentas, setCuentas] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroCuenta, setFiltroCuenta] = useState("");

  const [editando, setEditando] = useState(null);
  const [tipoEdit, setTipoEdit] = useState("GASTO");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaEdit, setCategoriaEdit] = useState("");
  const [cuentaEdit, setCuentaEdit] = useState("");

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: movs, error: movError } = await supabase
      .from("movimientos")
      .select(`
        id,
        tipo,
        monto,
        descripcion,
        fecha,
        categoria_id,
        cuenta_id,
        categorias(
          nombre,
          color
        ),
        cuentas(
          nombre
        )
      `)
      .eq("usuario_id", user.id)
      .order("fecha", { ascending: false });

    if (movError) {
      console.log(movError);
      return;
    }

    const { data: cats } = await supabase
      .from("categorias")
      .select("*")
      .or(`usuario_id.is.null,usuario_id.eq.${user.id}`)
      .order("nombre");

    const { data: cuents } = await supabase
      .from("cuentas")
      .select("*")
      .eq("usuario_id", user.id)
      .order("nombre");

    setMovimientos(movs || []);
    setCategorias(cats || []);
    setCuentas(cuents || []);
  }

  const movimientosFiltrados = useMemo(() => {
    let lista = [...movimientos];

    if (busqueda) {
      const texto = busqueda.toLowerCase();

      lista = lista.filter((mov) => {
        return (
          mov.descripcion?.toLowerCase().includes(texto) ||
          mov.categorias?.nombre?.toLowerCase().includes(texto) ||
          mov.cuentas?.nombre?.toLowerCase().includes(texto)
        );
      });
    }

    if (filtroTipo !== "TODOS") {
      lista = lista.filter((mov) => mov.tipo === filtroTipo);
    }

    if (filtroCategoria) {
      lista = lista.filter(
        (mov) => String(mov.categoria_id) === String(filtroCategoria)
      );
    }

    if (filtroCuenta) {
      lista = lista.filter(
        (mov) => String(mov.cuenta_id) === String(filtroCuenta)
      );
    }

    return lista;
  }, [movimientos, busqueda, filtroTipo, filtroCategoria, filtroCuenta]);

  const resumen = useMemo(() => {
    let ingresos = 0;
    let gastos = 0;

    movimientosFiltrados.forEach((mov) => {
      const valor = Number(mov.monto);

      if (mov.tipo === "INGRESO") ingresos += valor;
      else gastos += valor;
    });

    return {
      ingresos,
      gastos,
      balance: ingresos - gastos,
      cantidad: movimientosFiltrados.length,
    };
  }, [movimientosFiltrados]);

  const mayorGasto = useMemo(() => {
    return (
      movimientosFiltrados
        .filter((mov) => mov.tipo === "GASTO")
        .sort((a, b) => Number(b.monto) - Number(a.monto))[0] || null
    );
  }, [movimientosFiltrados]);

  const ultimoIngreso = useMemo(() => {
    return movimientosFiltrados.find((mov) => mov.tipo === "INGRESO") || null;
  }, [movimientosFiltrados]);

  function editarMovimiento(mov) {
    setEditando(mov);
    setTipoEdit(mov.tipo);
    setMonto(mov.monto);
    setDescripcion(mov.descripcion || "");
    setCategoriaEdit(mov.categoria_id || "");
    setCuentaEdit(mov.cuenta_id || "");
  }

  async function ajustarSaldoCuenta(cuentaId, tipo, valor, accion) {
    if (!cuentaId) return;

    const { data: cuenta, error } = await supabase
      .from("cuentas")
      .select("saldo_actual")
      .eq("id", cuentaId)
      .single();

    if (error || !cuenta) {
      console.log(error);
      return;
    }

    let saldo = Number(cuenta.saldo_actual || 0);

    if (accion === "QUITAR") {
      if (tipo === "GASTO") saldo += Number(valor);
      else saldo -= Number(valor);
    }

    if (accion === "APLICAR") {
      if (tipo === "GASTO") saldo -= Number(valor);
      else saldo += Number(valor);
    }

    await supabase
      .from("cuentas")
      .update({ saldo_actual: saldo })
      .eq("id", cuentaId);
  }

  async function guardarEdicion(e) {
    e.preventDefault();

    if (!editando) return;

    if (!monto || Number(monto) <= 0) {
      setMensaje("Monto inválido");
      return;
    }

    if (!cuentaEdit) {
      setMensaje("Selecciona una cuenta");
      return;
    }

    await ajustarSaldoCuenta(
      editando.cuenta_id,
      editando.tipo,
      editando.monto,
      "QUITAR"
    );

    await ajustarSaldoCuenta(cuentaEdit, tipoEdit, monto, "APLICAR");

    const { error } = await supabase
      .from("movimientos")
      .update({
        tipo: tipoEdit,
        monto: Number(monto),
        descripcion: descripcion.trim(),
        categoria_id: categoriaEdit || null,
        cuenta_id: cuentaEdit,
      })
      .eq("id", editando.id);

    if (error) {
      console.log(error);
      setMensaje("Error actualizando movimiento");
      return;
    }

    setMensaje("Movimiento actualizado");
    setEditando(null);
    setMonto("");
    setDescripcion("");
    cargarDatos();
  }

  async function eliminarMovimiento(id) {
    const confirmar = confirm("¿Eliminar movimiento?");

    if (!confirmar) return;

    const { data: mov, error } = await supabase
      .from("movimientos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    await ajustarSaldoCuenta(mov.cuenta_id, mov.tipo, mov.monto, "QUITAR");

    const { error: errorDelete } = await supabase
      .from("movimientos")
      .delete()
      .eq("id", id);

    if (errorDelete) {
      console.log(errorDelete);
      return;
    }

    setMensaje("Movimiento eliminado");
    cargarDatos();
  }

  function formatearMonto(valor) {
    return Number(valor || 0).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const inputClass = `
    h-12
    w-full
    rounded-xl
    border-2
    border-white/14
    bg-black/35
    px-4
    text-sm
    font-medium
    text-white
    outline-none
    transition
    placeholder:text-slate-500
    focus:border-red-500/55
    focus:ring-2
    focus:ring-red-500/10
  `;

  return (
    <div className="w-full min-w-0">
      {/* CABECERA */}
      <header className="mb-11 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              mt-0.5
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border-2
              border-red-500/40
              bg-red-500/12
              text-red-300
              shadow-[0_18px_48px_rgba(239,68,68,0.12)]
            "
          >
            <Icon name="movement" className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-[38px] font-black tracking-[-0.05em] text-white">
              Movimientos
            </h1>

            <p className="mt-1.5 text-base font-medium text-slate-300">
              Control total de ingresos y gastos.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            w-fit
            items-center
            gap-2.5
            rounded-full
            border-2
            border-white/14
            bg-[#080c14]/62
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-200
            shadow-[0_14px_40px_rgba(0,0,0,0.22)]
            backdrop-blur-xl
          "
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
          Registro financiero activo
        </div>
      </header>

      {/* TARJETAS SUPERIORES */}
      <section className="mb-16 grid grid-cols-1 gap-x-7 gap-y-7 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          type="income"
          title="Ingresos"
          value={`S/ ${formatearMonto(resumen.ingresos)}`}
          detail="Total de ingresos filtrados"
          icon="income"
        />

        <StatCard
          type="expense"
          title="Gastos"
          value={`S/ ${formatearMonto(resumen.gastos)}`}
          detail="Total de gastos filtrados"
          icon="expense"
        />

        <StatCard
          type="balance"
          title="Balance"
          value={`S/ ${formatearMonto(resumen.balance)}`}
          detail={
            resumen.balance >= 0
              ? "Balance financiero positivo"
              : "Balance financiero negativo"
          }
          icon="wallet"
        />

        <StatCard
          type="count"
          title="Movimientos"
          value={resumen.cantidad}
          detail="Registros encontrados"
          icon="list"
        />
      </section>

      {/* FORMULARIO Y RESUMEN */}
      <section className="grid grid-cols-1 items-start gap-x-9 gap-y-12 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <MovimientoForm onSaved={cargarDatos} />

        <aside
          className="
            h-fit
            rounded-[30px]
            border-2
            border-white/[0.14]
            bg-[#080c14]/68
            px-7
            py-8
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            2xl:sticky
            2xl:top-8
          "
        >
          <div className="mb-8 flex items-start gap-3 border-b border-white/[0.09] pb-6">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border-2
                border-red-500/28
                bg-red-500/10
                text-red-300
              "
            >
              <Icon name="wallet" className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 pr-2">
              <h2 className="text-[16px] font-bold tracking-tight text-white">
                Resumen
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Estado del periodo filtrado
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-slate-400">Mayor gasto</p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-white">
                {mayorGasto ? `S/ ${formatearMonto(mayorGasto.monto)}` : "S/ 0.00"}
              </p>
              <p className="mt-2.5 break-words text-sm leading-5 text-red-300">
                {mayorGasto?.descripcion || "Sin gastos registrados"}
              </p>
            </div>

            <div className="h-px bg-white/[0.08]" />

            <div>
              <p className="text-sm font-semibold text-slate-400">Último ingreso</p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-emerald-300">
                {ultimoIngreso
                  ? `S/ ${formatearMonto(ultimoIngreso.monto)}`
                  : "S/ 0.00"}
              </p>
              <p className="mt-2.5 break-words text-sm leading-5 text-emerald-300/90">
                {ultimoIngreso?.descripcion || "Sin ingresos registrados"}
              </p>
            </div>

            <div className="h-px bg-white/[0.08]" />

            <div>
              <p className="text-sm font-semibold text-slate-400">Total de movimientos</p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-blue-300">
                {resumen.cantidad}
              </p>
              <p className="mt-2.5 text-sm leading-5 text-slate-400">
                En el periodo seleccionado
              </p>
            </div>

            <div
              className={`
                rounded-2xl
                border-2
                px-4
                py-4
                ${
                  resumen.balance >= 0
                    ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                    : "border-red-500/30 bg-red-500/[0.08]"
                }
              `}
            >
              <p className="text-sm font-semibold text-slate-300">Estado financiero</p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`
                    text-lg
                    font-black
                    tracking-tight
                    ${
                      resumen.balance >= 0 ? "text-emerald-300" : "text-red-300"
                    }
                  `}
                >
                  {resumen.balance >= 0 ? "Positivo" : "Déficit"}
                </span>

                <span
                  className={`
                    h-3.5
                    w-3.5
                    rounded-full
                    ${
                      resumen.balance >= 0
                        ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]"
                        : "bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.85)]"
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* FILTROS */}
      <section
        className="
          mt-13
          rounded-[30px]
          border-2
          border-white/[0.14]
          bg-[#080c14]/64
          px-7
          py-8
          shadow-[0_28px_80px_rgba(0,0,0,0.22)]
          backdrop-blur-xl
          sm:px-8
        "
      >
        <div className="mb-7 flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border-2
              border-red-500/28
              bg-red-500/10
              text-red-300
            "
          >
            <Icon name="filter" className="h-5 w-5" />
          </div>

          <div className="pr-2">
            <h2 className="text-[17px] font-bold tracking-tight text-white">
              Filtros
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">
              Busca y organiza tus movimientos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-7 xl:grid-cols-2 2xl:grid-cols-4">
          <div>
            <label className="mb-2.5 block pl-1.5 text-sm font-semibold text-slate-300">
              Buscar movimiento
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" className="h-4 w-4" />
              </div>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar descripción..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border-2
                  border-white/14
                  bg-black/35
                  pl-12
                  pr-4
                  text-sm
                  font-medium
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-500
                  focus:border-red-500/55
                  focus:ring-2
                  focus:ring-red-500/10
                "
              />
            </div>
          </div>

          <div>
            <label className="mb-2.5 block pl-1.5 text-sm font-semibold text-slate-300">
              Tipo
            </label>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className={inputClass}
            >
              <option value="TODOS">Todos</option>
              <option value="INGRESO">Ingresos</option>
              <option value="GASTO">Gastos</option>
            </select>
          </div>

          <div>
            <label className="mb-2.5 block pl-1.5 text-sm font-semibold text-slate-300">
              Categoría
            </label>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className={inputClass}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2.5 block pl-1.5 text-sm font-semibold text-slate-300">
              Cuenta
            </label>

            <select
              value={filtroCuenta}
              onChange={(e) => setFiltroCuenta(e.target.value)}
              className={inputClass}
            >
              <option value="">Todas</option>
              {cuentas.map((cuenta) => (
                <option key={cuenta.id} value={cuenta.id}>
                  {cuenta.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* HISTORIAL */}
      <section
        className="
          mt-12
          overflow-hidden
          rounded-[30px]
          border-2
          border-white/[0.14]
          bg-[#080c14]/64
          shadow-[0_28px_80px_rgba(0,0,0,0.24)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-white/[0.09]
            px-7
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border-2
                border-red-500/28
                bg-red-500/10
                text-red-300
              "
            >
              <Icon name="clock" className="h-5 w-5" />
            </div>

            <div className="pr-2">
              <h2 className="text-[17px] font-bold tracking-tight text-white">
                Historial financiero
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Últimos movimientos registrados.
              </p>
            </div>
          </div>

          <div
            className="
              w-fit
              rounded-full
              border-2
              border-white/14
              bg-white/[0.05]
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-300
            "
          >
            {movimientosFiltrados.length} registros
          </div>
        </div>

        {movimientosFiltrados.length === 0 ? (
          <div className="px-7 py-20 text-center">
            <p className="text-base font-semibold text-slate-200">
              No hay movimientos encontrados
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Prueba cambiando los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {movimientosFiltrados.map((mov) => {
              const esIngreso = mov.tipo === "INGRESO";

              return (
                <article
                  key={mov.id}
                  className="
                    px-6
                    py-5
                    transition
                    duration-200
                    hover:bg-white/[0.035]
                    sm:px-8
                  "
                >
                  <div
                    className="
                      grid
                      grid-cols-[48px_minmax(0,1fr)_auto]
                      items-center
                      gap-4
                      xl:grid-cols-[48px_minmax(170px,1.4fr)_minmax(130px,0.95fr)_minmax(95px,0.8fr)_120px_150px_96px]
                      xl:gap-5
                    "
                  >
                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border-2
                        ${
                          esIngreso
                            ? "border-emerald-500/36 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/36 bg-red-500/10 text-red-300"
                        }
                      `}
                    >
                      <Icon
                        name={esIngreso ? "income" : "expense"}
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-bold tracking-tight text-white">
                        {mov.descripcion || "Sin descripción"}
                      </p>

                      <p className="mt-1.5 truncate text-sm text-slate-400 xl:hidden">
                        {mov.categorias?.nombre || "Sin categoría"}
                        {" · "}
                        {mov.cuentas?.nombre || "Sin cuenta"}
                      </p>
                    </div>

                    <div className="hidden xl:block">
                      <span
                        className={`
                          inline-flex
                          max-w-full
                          truncate
                          rounded-lg
                          border-2
                          px-2.5
                          py-1.5
                          text-xs
                          font-semibold
                          ${
                            esIngreso
                              ? "border-emerald-500/24 bg-emerald-500/[0.09] text-emerald-300"
                              : "border-red-500/24 bg-red-500/[0.09] text-red-300"
                          }
                        `}
                      >
                        {mov.categorias?.nombre || "Sin categoría"}
                      </span>
                    </div>

                    <div className="hidden min-w-0 xl:block">
                      <p className="truncate text-sm font-semibold text-slate-300">
                        {mov.cuentas?.nombre || "Sin cuenta"}
                      </p>
                    </div>

                    <div className="hidden xl:block">
                      <p className="text-sm text-slate-400">
                        {formatearFecha(mov.fecha)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`
                          whitespace-nowrap
                          text-[17px]
                          font-black
                          tracking-tight
                          ${
                            esIngreso ? "text-emerald-300" : "text-red-300"
                          }
                        `}
                      >
                        {esIngreso ? "+" : "-"}S/ {formatearMonto(mov.monto)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 xl:hidden">
                        {formatearFecha(mov.fecha)}
                      </p>
                    </div>

                    <div className="col-span-3 mt-2 flex justify-end gap-2.5 xl:col-span-1 xl:mt-0">
                      <button
                        type="button"
                        onClick={() => editarMovimiento(mov)}
                        title="Editar movimiento"
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          border-2
                          border-blue-500/30
                          bg-blue-500/[0.09]
                          text-blue-300
                          transition
                          hover:-translate-y-0.5
                          hover:border-blue-400/45
                          hover:bg-blue-500/16
                        "
                      >
                        <Icon name="edit" className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarMovimiento(mov.id)}
                        title="Eliminar movimiento"
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          border-2
                          border-red-500/30
                          bg-red-500/[0.09]
                          text-red-300
                          transition
                          hover:-translate-y-0.5
                          hover:border-red-400/45
                          hover:bg-red-500/16
                        "
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL DE EDICIÓN */}
      {editando && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            p-5
            backdrop-blur-md
          "
        >
          <section
            className="
              w-full
              max-w-xl
              overflow-hidden
              rounded-[30px]
              border-2
              border-white/14
              bg-[#080c14]/96
              shadow-[0_32px_110px_rgba(0,0,0,0.7)]
            "
          >
            <header className="flex items-center justify-between border-b border-white/[0.09] px-6 py-5">
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Editar movimiento
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Actualiza los datos del registro.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditando(null)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-white/10
                  bg-white/[0.05]
                  text-slate-300
                  transition
                  hover:bg-white/[0.09]
                  hover:text-white
                "
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={guardarEdicion} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                    Tipo
                  </label>

                  <select
                    value={tipoEdit}
                    onChange={(e) => setTipoEdit(e.target.value)}
                    className={inputClass}
                  >
                    <option value="GASTO">Gasto</option>
                    <option value="INGRESO">Ingreso</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                    Monto
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Monto"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Cuenta
                </label>

                <select
                  value={cuentaEdit}
                  onChange={(e) => setCuentaEdit(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar cuenta</option>

                  {cuentas.map((cuenta) => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Categoría
                </label>

                <select
                  value={categoriaEdit}
                  onChange={(e) => setCategoriaEdit(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccionar categoría</option>

                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Descripción
                </label>

                <input
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="
                    h-12
                    flex-1
                    rounded-xl
                    border-2
                    border-white/10
                    bg-white/[0.05]
                    px-5
                    text-sm
                    font-bold
                    text-slate-300
                    transition
                    hover:bg-white/[0.09]
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="
                    h-12
                    flex-1
                    rounded-xl
                    border-2
                    border-blue-400/30
                    bg-blue-600
                    px-5
                    text-sm
                    font-black
                    tracking-tight
                    text-white
                    shadow-[0_14px_38px_rgba(37,99,235,0.24)]
                    transition
                    hover:-translate-y-0.5
                    hover:bg-blue-500
                  "
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* MENSAJE */}
      {mensaje && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-[120]
            max-w-[calc(100vw-48px)]
            rounded-2xl
            border-2
            border-red-500/28
            bg-[#080c14]/95
            px-5
            py-4
            text-sm
            font-semibold
            text-white
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            backdrop-blur-2xl
          "
        >
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default Movimientos;