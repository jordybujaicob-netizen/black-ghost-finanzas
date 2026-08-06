import { useEffect, useMemo, useState } from "react";

import { supabase } from "../services/supabase";

const ZONA_HORARIA = "America/Lima";
const DESFASE_LIMA = "-05:00";

function normalizarMoneda(moneda) {
  return moneda === "USD" ? "USD" : "PEN";
}

function getSimboloMoneda(moneda) {
  return normalizarMoneda(moneda) === "USD" ? "$" : "S/";
}

function obtenerPartesFechaHoraLima(fecha = new Date()) {
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
    if (parte.type !== "literal") {
      resultado[parte.type] = parte.value;
    }
  });

  return resultado;
}

function obtenerFechaActualLima() {
  const partes = obtenerPartesFechaHoraLima();

  return `${partes.year}-${partes.month}-${partes.day}`;
}

function convertirFechaLimaAUtc(fechaLima) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fechaLima || ""))) {
    return null;
  }

  const partesHora = obtenerPartesFechaHoraLima();

  const horaLocal = [
    partesHora.hour,
    partesHora.minute,
    partesHora.second,
  ].join(":");

  const instante = new Date(
    `${fechaLima}T${horaLocal}${DESFASE_LIMA}`
  );

  if (Number.isNaN(instante.getTime())) {
    return null;
  }

  const fechaIso = instante.toISOString();

  return {
    fecha: fechaIso.slice(0, 10),
    hora: fechaIso.slice(11, 19),
  };
}

function MovimientoForm({ onSaved }) {
  const [tipo, setTipo] = useState("GASTO");
  const [monto, setMonto] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [cuentas, setCuentas] = useState([]);
  const [cuentaId, setCuentaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaMovimiento, setFechaMovimiento] = useState(() =>
    obtenerFechaActualLima()
  );

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const fechaMaxima = obtenerFechaActualLima();

  useEffect(() => {
    cargarCategorias();
    cargarCuentas();
  }, []);

  const cuentaSeleccionada = useMemo(
    () =>
      cuentas.find(
        (cuenta) => String(cuenta.id) === String(cuentaId)
      ) || null,
    [cuentas, cuentaId]
  );

  const monedaSeleccionada = normalizarMoneda(
    cuentaSeleccionada?.moneda
  );

  const simboloSeleccionado = getSimboloMoneda(
    monedaSeleccionada
  );

  async function cargarCategorias() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .or(`usuario_id.is.null,usuario_id.eq.${user.id}`)
      .order("nombre");

    if (error) {
      console.log(error);
      return;
    }

    setCategorias(data || []);
  }

  async function cargarCuentas() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("cuentas")
      .select("id,nombre,moneda,activo")
      .eq("usuario_id", user.id)
      .or("activo.is.null,activo.eq.true")
      .order("nombre");

    if (error) {
      console.log(error);
      return;
    }

    setCuentas(data || []);
  }

  function mostrarMensaje(texto, tipoMensajeNuevo) {
    setMensaje(texto);
    setTipoMensaje(tipoMensajeNuevo);

    window.setTimeout(() => {
      setMensaje("");
    }, 3000);
  }

  async function guardarMovimiento(e) {
    e.preventDefault();

    if (guardando) return;

    if (!cuentaId || !cuentaSeleccionada) {
      mostrarMensaje("Selecciona una cuenta", "error");
      return;
    }

    const valorMonto = Number(monto);

    if (!Number.isFinite(valorMonto) || valorMonto <= 0) {
      mostrarMensaje("Ingresa un monto válido", "error");
      return;
    }

    if (tipo === "GASTO" && !categoriaId) {
      mostrarMensaje("Selecciona una categoría", "error");
      return;
    }

    if (!fechaMovimiento) {
      mostrarMensaje(
        "Selecciona la fecha del movimiento",
        "error"
      );
      return;
    }

    if (fechaMovimiento > fechaMaxima) {
      mostrarMensaje(
        "La fecha del movimiento no puede ser futura",
        "error"
      );
      return;
    }

    const fechaHoraUtc =
      convertirFechaLimaAUtc(fechaMovimiento);

    if (!fechaHoraUtc) {
      mostrarMensaje(
        "La fecha seleccionada no es válida",
        "error"
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      mostrarMensaje(
        "Tu sesión terminó. Vuelve a iniciar sesión",
        "error"
      );
      return;
    }

    setGuardando(true);

    try {
      const { error } = await supabase
        .from("movimientos")
        .insert({
          usuario_id: user.id,
          tipo,
          monto: Number(valorMonto.toFixed(2)),
          categoria_id: categoriaId || null,
          cuenta_id: cuentaId,
          descripcion: descripcion.trim(),
          fecha: fechaHoraUtc.fecha,
          hora: fechaHoraUtc.hora,
        });

      if (error) {
        console.log(error);
        mostrarMensaje(
          "Error guardando movimiento",
          "error"
        );
        return;
      }

      setMonto("");
      setDescripcion("");
      setCategoriaId("");
      setCuentaId("");
      setTipo("GASTO");
      setFechaMovimiento(obtenerFechaActualLima());

      mostrarMensaje(
        "Movimiento registrado correctamente",
        "success"
      );

      if (onSaved) {
        await onSaved();
      }
    } finally {
      setGuardando(false);
    }
  }

  const fieldClass = `
    mt-2
    h-12
    w-full
    rounded-xl
    border
    border-white/10
    bg-black/35
    px-4
    text-sm
    text-white
    outline-none
    transition
    placeholder:text-slate-600
    focus:border-red-500/55
    focus:ring-2
    focus:ring-red-500/10
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <form
      onSubmit={guardarMovimiento}
      className="
        rounded-[26px]
        border
        border-red-500/20
        bg-[#080c14]/62
        p-7
        shadow-[0_28px_80px_rgba(0,0,0,0.24)]
        backdrop-blur-xl
        sm:p-8
      "
    >
      <div
        className="
          mb-8
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Nuevo movimiento
          </h2>

          <p className="mt-1.5 text-sm text-slate-400">
            Registra un ingreso o gasto con su fecha real.
          </p>
        </div>

        <div
          className="
            w-fit
            rounded-full
            border
            border-red-500/25
            bg-red-500/10
            px-3.5
            py-1.5
            text-[11px]
            font-bold
            tracking-[0.12em]
            text-red-300
          "
        >
          FINANCE
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-x-6
          gap-y-6
          md:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="movimiento-tipo"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Tipo
          </label>

          <select
            id="movimiento-tipo"
            value={tipo}
            disabled={guardando}
            onChange={(e) => {
              setTipo(e.target.value);
              setCategoriaId("");
            }}
            className={`${fieldClass} bg-[#06090f]`}
          >
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="movimiento-fecha"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Fecha del movimiento
          </label>

          <input
            id="movimiento-fecha"
            type="date"
            value={fechaMovimiento}
            max={fechaMaxima}
            disabled={guardando}
            onChange={(e) =>
              setFechaMovimiento(e.target.value)
            }
            className={`${fieldClass} [color-scheme:dark]`}
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Selecciona el día real en que ocurrió el ingreso o
            gasto.
          </p>
        </div>

        <div>
          <label
            htmlFor="movimiento-cuenta"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Cuenta
          </label>

          <select
            id="movimiento-cuenta"
            value={cuentaId}
            disabled={guardando}
            onChange={(e) => setCuentaId(e.target.value)}
            className={`${fieldClass} bg-[#06090f]`}
          >
            <option value="">Seleccionar cuenta</option>

            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre} ·{" "}
                {normalizarMoneda(cuenta.moneda)}
              </option>
            ))}
          </select>

          {cuentaSeleccionada && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-blue-500/20
                bg-blue-500/[0.06]
                px-4
                py-3
                text-xs
              "
            >
              <span className="font-semibold text-slate-400">
                Moneda de la cuenta
              </span>

              <span className="font-black text-blue-300">
                {monedaSeleccionada} · {simboloSeleccionado}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="movimiento-categoria"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Categoría
          </label>

          <select
            id="movimiento-categoria"
            value={categoriaId}
            disabled={guardando}
            onChange={(e) =>
              setCategoriaId(e.target.value)
            }
            className={`${fieldClass} bg-[#06090f]`}
          >
            <option value="">
              {tipo === "GASTO"
                ? "Seleccionar categoría"
                : "Sin categoría"}
            </option>

            {categorias
              .filter(
                (categoria) =>
                  categoria.tipo === tipo || !categoria.tipo
              )
              .map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nombre}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="movimiento-monto"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Monto ({simboloSeleccionado})
          </label>

          <input
            id="movimiento-monto"
            type="number"
            min="0.01"
            step="0.01"
            disabled={guardando}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder={`${simboloSeleccionado} 0.00`}
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="movimiento-descripcion"
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.09em]
              text-slate-400
            "
          >
            Descripción
          </label>

          <input
            id="movimiento-descripcion"
            value={descripcion}
            disabled={guardando}
            onChange={(e) =>
              setDescripcion(e.target.value)
            }
            placeholder="Ej.: Pago de servicios"
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="
          mt-8
          h-12
          w-full
          rounded-xl
          border
          border-red-400/35
          bg-gradient-to-r
          from-red-700
          via-red-600
          to-rose-600
          px-5
          text-sm
          font-black
          tracking-[0.04em]
          text-white
          shadow-[0_16px_44px_rgba(239,68,68,0.20)]
          transition
          duration-300
          hover:-translate-y-0.5
          hover:from-red-600
          hover:to-rose-500
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR MOVIMIENTO"}
      </button>

      {mensaje && (
        <div
          className={`
            mt-5
            rounded-xl
            border
            px-4
            py-3
            text-center
            text-sm
            font-bold
            ${
              tipoMensaje === "success"
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/25 bg-red-500/10 text-red-300"
            }
          `}
        >
          {mensaje}
        </div>
      )}
    </form>
  );
}

export default MovimientoForm;