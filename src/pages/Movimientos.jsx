import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import MovimientoForm from "../components/MovimientoForm";

const ZONA_HORARIA = "America/Lima";
const DESFASE_LIMA = "-05:00";

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
    transfer: (
      <>
        <path d="M4 7h14" />
        <path d="m14 3 4 4-4 4" />
        <path d="M20 17H6" />
        <path d="m10 13-4 4 4 4" />
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
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 8.1 7 10 4.2-1.9 7-5.5 7-10V6Z" />
        <path d="m9 12 2 2 4-4" />
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

function obtenerRelacion(relacion) {
  if (Array.isArray(relacion)) return relacion[0] || null;
  return relacion || null;
}

function normalizarMoneda(moneda) {
  return String(moneda || "PEN").trim().toUpperCase() === "USD"
    ? "USD"
    : "PEN";
}

function simboloMoneda(moneda) {
  return normalizarMoneda(moneda) === "USD" ? "$" : "S/";
}

function esTransferencia(movimiento) {
  if (movimiento?.transferencia_id) return true;

  return String(movimiento?.descripcion || "")
    .trim()
    .toLowerCase()
    .startsWith("transferencia");
}

function obtenerPartesLima(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);

  const resultado = {};

  partes.forEach((parte) => {
    if (parte.type !== "literal") resultado[parte.type] = parte.value;
  });

  return resultado;
}

function obtenerFechaActualLima() {
  const partes = obtenerPartesLima();
  return `${partes.year}-${partes.month}-${partes.day}`;
}

function obtenerHoraActualLima() {
  const partes = obtenerPartesLima();
  return `${partes.hour}:${partes.minute}:${partes.second}`;
}

function convertirMovimientoAFechaLocal(movimiento) {
  if (!movimiento?.fecha) return null;

  const fecha = String(movimiento.fecha).slice(0, 10);
  const horaOriginal = String(movimiento.hora || "00:00:00");
  const coincidencia = horaOriginal.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );

  const hora = String(Number(coincidencia?.[1] || 0)).padStart(2, "0");
  const minutos = String(Number(coincidencia?.[2] || 0)).padStart(2, "0");
  const segundos = String(Number(coincidencia?.[3] || 0)).padStart(2, "0");
  const fechaUtc = new Date(`${fecha}T${hora}:${minutos}:${segundos}Z`);

  return Number.isNaN(fechaUtc.getTime()) ? null : fechaUtc;
}

function fechaMovimientoParaInput(movimiento) {
  const fechaLocal = convertirMovimientoAFechaLocal(movimiento);
  if (!fechaLocal) return obtenerFechaActualLima();

  const partes = obtenerPartesLima(fechaLocal);
  return `${partes.year}-${partes.month}-${partes.day}`;
}

function horaMovimientoLocal(movimiento) {
  const fechaLocal = convertirMovimientoAFechaLocal(movimiento);
  if (!fechaLocal) return obtenerHoraActualLima();

  const partes = obtenerPartesLima(fechaLocal);
  return `${partes.hour}:${partes.minute}:${partes.second}`;
}

function convertirFechaHoraLimaAUtc(fechaLima, horaLima) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fechaLima || ""))) {
    return null;
  }

  const coincidencia = String(horaLima || "00:00:00").match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );

  const hora = String(Number(coincidencia?.[1] || 0)).padStart(2, "0");
  const minutos = String(Number(coincidencia?.[2] || 0)).padStart(2, "0");
  const segundos = String(Number(coincidencia?.[3] || 0)).padStart(2, "0");

  const instante = new Date(
    `${fechaLima}T${hora}:${minutos}:${segundos}${DESFASE_LIMA}`
  );

  if (Number.isNaN(instante.getTime())) return null;

  const iso = instante.toISOString();

  return {
    fecha: iso.slice(0, 10),
    hora: iso.slice(11, 19),
  };
}

function formatearMonto(valor) {
  return Number(valor || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatearDinero(valor, moneda = "PEN") {
  return `${simboloMoneda(moneda)} ${formatearMonto(valor)}`;
}

function formatearFechaMovimiento(movimiento) {
  const fechaLocal = convertirMovimientoAFechaLocal(movimiento);
  if (!fechaLocal) return "Sin fecha";

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA_HORARIA,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fechaLocal);
}

function formatearHoraMovimiento(movimiento) {
  const fechaLocal = convertirMovimientoAFechaLocal(movimiento);
  if (!fechaLocal) return "";

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA_HORARIA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(fechaLocal);
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
  const [fechaEdit, setFechaEdit] = useState(obtenerFechaActualLima());
  const [horaLocalEdit, setHoraLocalEdit] = useState(obtenerHoraActualLima());

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);

  const fechaMaxima = obtenerFechaActualLima();

  useEffect(() => {
    cargarDatos();
  }, []);

  function mostrarMensaje(texto, tipo = "success") {
    setMensaje(texto);
    setTipoMensaje(tipo);

    window.setTimeout(() => {
      setMensaje("");
    }, 3500);
  }

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
        hora,
        transferencia_id,
        tipo_cambio,
        categoria_id,
        cuenta_id,
        categorias(
          nombre,
          color
        ),
        cuentas(
          nombre,
          moneda
        )
      `)
      .eq("usuario_id", user.id)
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false });

    if (movError) {
      console.log(movError);
      mostrarMensaje("No se pudieron cargar los movimientos", "error");
      return;
    }

    const { data: cats, error: catError } = await supabase
      .from("categorias")
      .select("*")
      .or(`usuario_id.is.null,usuario_id.eq.${user.id}`)
      .order("nombre");

    if (catError) console.log(catError);

    const { data: cuents, error: cuentaError } = await supabase
      .from("cuentas")
      .select("*")
      .eq("usuario_id", user.id)
      .order("nombre");

    if (cuentaError) console.log(cuentaError);

    setMovimientos(movs || []);
    setCategorias(cats || []);
    setCuentas(cuents || []);
  }

  const movimientosFiltrados = useMemo(() => {
    let lista = [...movimientos];

    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();

      lista = lista.filter((mov) => {
        const categoria = obtenerRelacion(mov.categorias);
        const cuenta = obtenerRelacion(mov.cuentas);

        return (
          mov.descripcion?.toLowerCase().includes(texto) ||
          categoria?.nombre?.toLowerCase().includes(texto) ||
          cuenta?.nombre?.toLowerCase().includes(texto) ||
          (esTransferencia(mov) && "transferencia".includes(texto))
        );
      });
    }

    if (filtroTipo === "TRANSFERENCIA") {
      lista = lista.filter(esTransferencia);
    } else if (filtroTipo !== "TODOS") {
      lista = lista.filter(
        (mov) => !esTransferencia(mov) && mov.tipo === filtroTipo
      );
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

  const movimientosRealesFiltrados = useMemo(
    () => movimientosFiltrados.filter((mov) => !esTransferencia(mov)),
    [movimientosFiltrados]
  );

  const cantidadTransferencias = useMemo(() => {
    const referencias = new Set();

    movimientosFiltrados.forEach((mov) => {
      if (!esTransferencia(mov)) return;

      referencias.add(
        mov.transferencia_id || `transferencia-antigua-${mov.id}`
      );
    });

    return referencias.size;
  }, [movimientosFiltrados]);

  const resumen = useMemo(() => {
    let ingresos = 0;
    let gastos = 0;

    movimientosRealesFiltrados.forEach((mov) => {
      const valor = Number(mov.monto || 0);

      if (mov.tipo === "INGRESO") ingresos += valor;
      if (mov.tipo === "GASTO") gastos += valor;
    });

    return {
      ingresos,
      gastos,
      balance: ingresos - gastos,
      cantidad: movimientosRealesFiltrados.length,
    };
  }, [movimientosRealesFiltrados]);

  const mayorGasto = useMemo(() => {
    return (
      movimientosRealesFiltrados
        .filter((mov) => mov.tipo === "GASTO")
        .sort((a, b) => Number(b.monto) - Number(a.monto))[0] || null
    );
  }, [movimientosRealesFiltrados]);

  const ultimoIngreso = useMemo(() => {
    return (
      movimientosRealesFiltrados.find((mov) => mov.tipo === "INGRESO") ||
      null
    );
  }, [movimientosRealesFiltrados]);

  function editarMovimiento(mov) {
    if (esTransferencia(mov)) {
      mostrarMensaje(
        "Las transferencias están protegidas y se gestionan desde Cuentas",
        "error"
      );
      return;
    }

    setEditando(mov);
    setTipoEdit(mov.tipo);
    setMonto(String(mov.monto ?? ""));
    setDescripcion(mov.descripcion || "");
    setCategoriaEdit(mov.categoria_id || "");
    setCuentaEdit(mov.cuenta_id || "");
    setFechaEdit(fechaMovimientoParaInput(mov));
    setHoraLocalEdit(horaMovimientoLocal(mov));
  }

  function cerrarEdicion() {
    setEditando(null);
    setTipoEdit("GASTO");
    setMonto("");
    setDescripcion("");
    setCategoriaEdit("");
    setCuentaEdit("");
    setFechaEdit(obtenerFechaActualLima());
    setHoraLocalEdit(obtenerHoraActualLima());
  }

  async function ajustarSaldoCuenta(cuentaId, tipo, valor, accion) {
    if (!cuentaId) return false;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: cuenta, error } = await supabase
      .from("cuentas")
      .select("saldo_actual")
      .eq("id", cuentaId)
      .eq("usuario_id", user.id)
      .single();

    if (error || !cuenta) {
      console.log(error);
      return false;
    }

    let saldo = Number(cuenta.saldo_actual || 0);
    const montoNumerico = Number(valor || 0);

    if (accion === "QUITAR") {
      if (tipo === "GASTO") saldo += montoNumerico;
      if (tipo === "INGRESO") saldo -= montoNumerico;
    }

    if (accion === "APLICAR") {
      if (tipo === "GASTO") saldo -= montoNumerico;
      if (tipo === "INGRESO") saldo += montoNumerico;
    }

    const { error: errorUpdate } = await supabase
      .from("cuentas")
      .update({ saldo_actual: Number(saldo.toFixed(2)) })
      .eq("id", cuentaId)
      .eq("usuario_id", user.id);

    if (errorUpdate) {
      console.log(errorUpdate);
      return false;
    }

    return true;
  }

  async function guardarEdicion(e) {
    e.preventDefault();

    if (!editando || guardandoEdicion) return;

    if (esTransferencia(editando)) {
      mostrarMensaje(
        "Las transferencias no pueden editarse como movimientos individuales",
        "error"
      );
      return;
    }

    const valorMonto = Number(monto);

    if (!Number.isFinite(valorMonto) || valorMonto <= 0) {
      mostrarMensaje("Monto inválido", "error");
      return;
    }

    if (!cuentaEdit) {
      mostrarMensaje("Selecciona una cuenta", "error");
      return;
    }

    if (tipoEdit === "GASTO" && !categoriaEdit) {
      mostrarMensaje("Selecciona una categoría", "error");
      return;
    }

    if (!fechaEdit) {
      mostrarMensaje("Selecciona la fecha del movimiento", "error");
      return;
    }

    if (fechaEdit > fechaMaxima) {
      mostrarMensaje("La fecha no puede ser futura", "error");
      return;
    }

    const fechaHoraUtc = convertirFechaHoraLimaAUtc(
      fechaEdit,
      horaLocalEdit
    );

    if (!fechaHoraUtc) {
      mostrarMensaje("La fecha seleccionada no es válida", "error");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      mostrarMensaje("Tu sesión terminó. Vuelve a iniciar sesión", "error");
      return;
    }

    setGuardandoEdicion(true);

    try {
      const { error } = await supabase
        .from("movimientos")
        .update({
          tipo: tipoEdit,
          monto: Number(valorMonto.toFixed(2)),
          descripcion: descripcion.trim(),
          categoria_id: categoriaEdit || null,
          cuenta_id: cuentaEdit,
          fecha: fechaHoraUtc.fecha,
          hora: fechaHoraUtc.hora,
        })
        .eq("id", editando.id)
        .eq("usuario_id", user.id)
        .is("transferencia_id", null);

      if (error) {
        console.log(error);
        mostrarMensaje("Error actualizando movimiento", "error");
        return;
      }

      await ajustarSaldoCuenta(
        editando.cuenta_id,
        editando.tipo,
        editando.monto,
        "QUITAR"
      );

      await ajustarSaldoCuenta(
        cuentaEdit,
        tipoEdit,
        valorMonto,
        "APLICAR"
      );

      cerrarEdicion();
      mostrarMensaje("Movimiento actualizado correctamente");
      await cargarDatos();
    } finally {
      setGuardandoEdicion(false);
    }
  }

  async function eliminarMovimiento(movimiento) {
    if (!movimiento || eliminandoId) return;

    if (esTransferencia(movimiento)) {
      mostrarMensaje(
        "Las transferencias están protegidas y no pueden eliminarse por partes",
        "error"
      );
      return;
    }

    const confirmar = window.confirm("¿Eliminar movimiento?");
    if (!confirmar) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      mostrarMensaje("Tu sesión terminó. Vuelve a iniciar sesión", "error");
      return;
    }

    setEliminandoId(movimiento.id);

    try {
      const { error: errorDelete } = await supabase
        .from("movimientos")
        .delete()
        .eq("id", movimiento.id)
        .eq("usuario_id", user.id)
        .is("transferencia_id", null);

      if (errorDelete) {
        console.log(errorDelete);
        mostrarMensaje("No se pudo eliminar el movimiento", "error");
        return;
      }

      await ajustarSaldoCuenta(
        movimiento.cuenta_id,
        movimiento.tipo,
        movimiento.monto,
        "QUITAR"
      );

      mostrarMensaje("Movimiento eliminado correctamente");
      await cargarDatos();
    } finally {
      setEliminandoId(null);
    }
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
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <div className="w-full min-w-0">
      <header className="mb-11 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-red-500/40 bg-red-500/12 text-red-300 shadow-[0_18px_48px_rgba(239,68,68,0.12)]">
            <Icon name="movement" className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-[38px] font-black tracking-[-0.05em] text-white">
              Movimientos
            </h1>

            <p className="mt-1.5 text-base font-medium text-slate-300">
              Control total de ingresos, gastos y transferencias.
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2.5 rounded-full border-2 border-white/14 bg-[#080c14]/62 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-[0_14px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
          Registro financiero activo
        </div>
      </header>

      <section className="mb-16 grid grid-cols-1 gap-x-7 gap-y-7 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          type="income"
          title="Ingresos"
          value={`S/ ${formatearMonto(resumen.ingresos)}`}
          detail="Transferencias internas excluidas"
          icon="income"
        />

        <StatCard
          type="expense"
          title="Gastos"
          value={`S/ ${formatearMonto(resumen.gastos)}`}
          detail="Transferencias internas excluidas"
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
          title="Movimientos reales"
          value={resumen.cantidad}
          detail={`${cantidadTransferencias} transferencias excluidas`}
          icon="list"
        />
      </section>

      <section className="grid grid-cols-1 items-start gap-x-9 gap-y-12 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <MovimientoForm onSaved={cargarDatos} />

        <aside className="h-fit rounded-[30px] border-2 border-white/[0.14] bg-[#080c14]/68 px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl 2xl:sticky 2xl:top-8">
          <div className="mb-8 flex items-start gap-3 border-b border-white/[0.09] pb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-red-500/28 bg-red-500/10 text-red-300">
              <Icon name="wallet" className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 pr-2">
              <h2 className="text-[16px] font-bold tracking-tight text-white">
                Resumen
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Solo ingresos y gastos reales
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-slate-400">
                Mayor gasto
              </p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-white">
                {mayorGasto
                  ? formatearDinero(
                      mayorGasto.monto,
                      obtenerRelacion(mayorGasto.cuentas)?.moneda
                    )
                  : "S/ 0.00"}
              </p>
              <p className="mt-2.5 break-words text-sm leading-5 text-red-300">
                {mayorGasto?.descripcion || "Sin gastos registrados"}
              </p>
            </div>

            <div className="h-px bg-white/[0.08]" />

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Último ingreso
              </p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-emerald-300">
                {ultimoIngreso
                  ? formatearDinero(
                      ultimoIngreso.monto,
                      obtenerRelacion(ultimoIngreso.cuentas)?.moneda
                    )
                  : "S/ 0.00"}
              </p>
              <p className="mt-2.5 break-words text-sm leading-5 text-emerald-300/90">
                {ultimoIngreso?.descripcion || "Sin ingresos registrados"}
              </p>
            </div>

            <div className="h-px bg-white/[0.08]" />

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Transferencias internas
              </p>
              <p className="mt-2.5 text-[22px] font-black tracking-tight text-blue-300">
                {cantidadTransferencias}
              </p>
              <p className="mt-2.5 text-sm leading-5 text-slate-400">
                No afectan ingresos ni gastos
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
              <p className="text-sm font-semibold text-slate-300">
                Estado financiero
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`text-lg font-black tracking-tight ${
                    resumen.balance >= 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {resumen.balance >= 0 ? "Positivo" : "Déficit"}
                </span>

                <span
                  className={`h-3.5 w-3.5 rounded-full ${
                    resumen.balance >= 0
                      ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]"
                      : "bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.85)]"
                  }`}
                />
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-13 rounded-[30px] border-2 border-white/[0.14] bg-[#080c14]/64 px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-8">
        <div className="mb-7 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-red-500/28 bg-red-500/10 text-red-300">
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
                className="h-12 w-full rounded-xl border-2 border-white/14 bg-black/35 pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/55 focus:ring-2 focus:ring-red-500/10"
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
              <option value="INGRESO">Ingresos reales</option>
              <option value="GASTO">Gastos reales</option>
              <option value="TRANSFERENCIA">Transferencias</option>
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

      <section className="mt-12 overflow-hidden rounded-[30px] border-2 border-white/[0.14] bg-[#080c14]/64 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/[0.09] px-7 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-red-500/28 bg-red-500/10 text-red-300">
              <Icon name="clock" className="h-5 w-5" />
            </div>

            <div className="pr-2">
              <h2 className="text-[17px] font-bold tracking-tight text-white">
                Historial financiero
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Ingresos, gastos y transferencias registrados.
              </p>
            </div>
          </div>

          <div className="w-fit rounded-full border-2 border-white/14 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-300">
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
              const transferencia = esTransferencia(mov);
              const esIngreso = mov.tipo === "INGRESO";
              const cuenta = obtenerRelacion(mov.cuentas);
              const categoria = obtenerRelacion(mov.categorias);
              const monedaMovimiento = normalizarMoneda(cuenta?.moneda);
              const hora = formatearHoraMovimiento(mov);

              const colorIcono = transferencia
                ? "border-blue-500/36 bg-blue-500/10 text-blue-300"
                : esIngreso
                  ? "border-emerald-500/36 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/36 bg-red-500/10 text-red-300";

              const colorMonto = transferencia
                ? "text-blue-300"
                : esIngreso
                  ? "text-emerald-300"
                  : "text-red-300";

              const colorEtiqueta = transferencia
                ? "border-blue-500/24 bg-blue-500/[0.09] text-blue-300"
                : esIngreso
                  ? "border-emerald-500/24 bg-emerald-500/[0.09] text-emerald-300"
                  : "border-red-500/24 bg-red-500/[0.09] text-red-300";

              return (
                <article
                  key={mov.id}
                  className="px-6 py-5 transition duration-200 hover:bg-white/[0.035] sm:px-8"
                >
                  <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 xl:grid-cols-[48px_minmax(170px,1.4fr)_minmax(130px,0.95fr)_minmax(95px,0.8fr)_150px_150px_96px] xl:gap-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${colorIcono}`}
                    >
                      <Icon
                        name={
                          transferencia
                            ? "transfer"
                            : esIngreso
                              ? "income"
                              : "expense"
                        }
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-bold tracking-tight text-white">
                        {mov.descripcion ||
                          (transferencia
                            ? esIngreso
                              ? "Transferencia recibida"
                              : "Transferencia enviada"
                            : "Sin descripción")}
                      </p>

                      <p className="mt-1.5 truncate text-sm text-slate-400 xl:hidden">
                        {transferencia
                          ? "Transferencia"
                          : categoria?.nombre || "Sin categoría"}
                        {" · "}
                        {cuenta?.nombre || "Sin cuenta"}
                      </p>
                    </div>

                    <div className="hidden xl:block">
                      <span
                        className={`inline-flex max-w-full truncate rounded-lg border-2 px-2.5 py-1.5 text-xs font-semibold ${colorEtiqueta}`}
                      >
                        {transferencia
                          ? "Transferencia"
                          : categoria?.nombre || "Sin categoría"}
                      </span>
                    </div>

                    <div className="hidden min-w-0 xl:block">
                      <p className="truncate text-sm font-semibold text-slate-300">
                        {cuenta?.nombre || "Sin cuenta"}
                      </p>
                      <p className="mt-1 text-[10px] font-black text-slate-500">
                        {monedaMovimiento}
                      </p>
                    </div>

                    <div className="hidden xl:block">
                      <p className="text-sm text-slate-400">
                        {formatearFechaMovimiento(mov)}
                      </p>
                      {hora && (
                        <p className="mt-1 text-xs text-slate-600">{hora}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p
                        className={`whitespace-nowrap text-[17px] font-black tracking-tight ${colorMonto}`}
                      >
                        {esIngreso ? "+" : "−"}
                        {formatearDinero(mov.monto, monedaMovimiento)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 xl:hidden">
                        {formatearFechaMovimiento(mov)}
                        {hora ? ` · ${hora}` : ""}
                      </p>
                    </div>

                    <div className="col-span-3 mt-2 flex justify-end gap-2.5 xl:col-span-1 xl:mt-0">
                      {transferencia ? (
                        <button
                          type="button"
                          onClick={() =>
                            mostrarMensaje(
                              "Las transferencias están protegidas y se gestionan desde Cuentas",
                              "error"
                            )
                          }
                          title="Transferencia protegida"
                          className="flex h-11 w-[94px] items-center justify-center gap-2 rounded-xl border-2 border-blue-500/20 bg-blue-500/[0.06] text-xs font-bold text-blue-300 transition hover:bg-blue-500/10"
                        >
                          <Icon name="shield" className="h-4 w-4" />
                          Protegida
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => editarMovimiento(mov)}
                            title="Editar movimiento"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-blue-500/30 bg-blue-500/[0.09] text-blue-300 transition hover:-translate-y-0.5 hover:border-blue-400/45 hover:bg-blue-500/16"
                          >
                            <Icon name="edit" className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={eliminandoId === mov.id}
                            onClick={() => eliminarMovimiento(mov)}
                            title="Eliminar movimiento"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-red-500/30 bg-red-500/[0.09] text-red-300 transition hover:-translate-y-0.5 hover:border-red-400/45 hover:bg-red-500/16 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Icon name="trash" className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {editando && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
          <section className="w-full max-w-xl overflow-hidden rounded-[30px] border-2 border-white/14 bg-[#080c14]/96 shadow-[0_32px_110px_rgba(0,0,0,0.7)]">
            <header className="flex items-center justify-between border-b border-white/[0.09] px-6 py-5">
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Editar movimiento
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Actualiza los datos y la fecha real del registro.
                </p>
              </div>

              <button
                type="button"
                disabled={guardandoEdicion}
                onClick={cerrarEdicion}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/[0.09] hover:text-white disabled:opacity-50"
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
                    disabled={guardandoEdicion}
                    onChange={(e) => {
                      setTipoEdit(e.target.value);
                      setCategoriaEdit("");
                    }}
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
                    min="0.01"
                    step="0.01"
                    disabled={guardandoEdicion}
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Monto"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                    Fecha del movimiento
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Icon name="calendar" className="h-4 w-4" />
                    </div>

                    <input
                      type="date"
                      value={fechaEdit}
                      max={fechaMaxima}
                      disabled={guardandoEdicion}
                      onChange={(e) => setFechaEdit(e.target.value)}
                      className={`${inputClass} pl-11 [color-scheme:dark]`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                    Cuenta
                  </label>

                  <select
                    value={cuentaEdit}
                    disabled={guardandoEdicion}
                    onChange={(e) => setCuentaEdit(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar cuenta</option>

                    {cuentas.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        {cuenta.nombre} · {normalizarMoneda(cuenta.moneda)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Categoría
                </label>

                <select
                  value={categoriaEdit}
                  disabled={guardandoEdicion}
                  onChange={(e) => setCategoriaEdit(e.target.value)}
                  className={inputClass}
                >
                  <option value="">
                    {tipoEdit === "GASTO"
                      ? "Seleccionar categoría"
                      : "Sin categoría"}
                  </option>

                  {categorias
                    .filter(
                      (cat) => cat.tipo === tipoEdit || !cat.tipo
                    )
                    .map((cat) => (
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
                  disabled={guardandoEdicion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción"
                  className={inputClass}
                />
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-xs leading-5 text-blue-200/80">
                La hora original del movimiento se conservará. Solo cambiará la
                fecha seleccionada.
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  disabled={guardandoEdicion}
                  onClick={cerrarEdicion}
                  className="h-12 flex-1 rounded-xl border-2 border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.09] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardandoEdicion}
                  className="h-12 flex-1 rounded-xl border-2 border-blue-400/30 bg-blue-600 px-5 text-sm font-black tracking-tight text-white shadow-[0_14px_38px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {mensaje && (
        <div
          className={`
            fixed
            bottom-6
            right-6
            z-[120]
            max-w-[calc(100vw-48px)]
            rounded-2xl
            border-2
            px-5
            py-4
            text-sm
            font-semibold
            text-white
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            backdrop-blur-2xl
            ${
              tipoMensaje === "success"
                ? "border-emerald-500/28 bg-[#07130f]/95"
                : "border-red-500/28 bg-[#080c14]/95"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                tipoMensaje === "success" ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default Movimientos;
