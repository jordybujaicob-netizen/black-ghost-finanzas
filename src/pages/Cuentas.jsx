// BLACK GHOST CUENTAS MULTIMONEDA V2 — PEN/USD + TIPO DE CAMBIO MANUAL
import { useEffect, useMemo, useState } from "react";

import { supabase } from "../services/supabase";
import CuentaForm from "../components/CuentaForm";

const ZONA_HORARIA = "America/Lima";

/* =========================================================
   ICONOS
========================================================= */

function Icon({ name, className = "h-5 w-5" }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const icons = {
    wallet: (
      <>
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6.5A2.5 2.5 0 0 1 4 16.5Z" />
        <path d="M4 9h16" />
        <path d="M16 13h4" />
      </>
    ),

    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),

    trendUp: (
      <>
        <path d="m4 17 6-6 4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),

    trendDown: (
      <>
        <path d="m4 7 6 6 4-4 6 8" />
        <path d="M15 17h5v-5" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),

    list: (
      <>
        <path d="M9 6h11" />
        <path d="M9 12h11" />
        <path d="M9 18h11" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </>
    ),

    bank: (
      <>
        <path d="m3 10 9-6 9 6" />
        <path d="M5 10v8" />
        <path d="M9 10v8" />
        <path d="M15 10v8" />
        <path d="M19 10v8" />
        <path d="M3 20h18" />
      </>
    ),

    cash: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9H6a1 1 0 0 1-1-1" />
        <path d="M17 15h1a1 1 0 0 1 1 1" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
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

    transfer: (
      <>
        <path d="M7 7h11" />
        <path d="m15 4 3 3-3 3" />
        <path d="M17 17H6" />
        <path d="m9 14-3 3 3 3" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),

    archive: (
      <>
        <rect x="3" y="4" width="18" height="5" rx="1.5" />
        <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
        <path d="M9 13h6" />
      </>
    ),

    restore: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v6h6" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    alert: (
      <>
        <path d="M10.3 4.2 2.7 17.4A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.6L13.7 4.2a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    chevronDown: <path d="m6 9 6 6 6-6" />,

    activity: (
      <>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}

function esTransferencia(movimiento) {
  if (movimiento?.transferencia_id) return true;

  const descripcion = String(
    movimiento?.descripcion || ""
  )
    .trim()
    .toLowerCase();

  return descripcion.startsWith("transferencia");
}

function convertirMovimientoAFechaLocal(movimiento) {
  if (!movimiento?.fecha) return null;

  const textoFecha = String(movimiento.fecha);

  if (textoFecha.includes("T")) {
    const fechaISO = new Date(textoFecha);
    return Number.isNaN(fechaISO.getTime()) ? null : fechaISO;
  }

  const fecha = textoFecha.slice(0, 10);
  const horaOriginal = String(movimiento.hora || "00:00:00");
  const coincidencia = horaOriginal.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );

  const hora = String(
    Number(coincidencia?.[1] || 0)
  ).padStart(2, "0");

  const minutos = String(
    Number(coincidencia?.[2] || 0)
  ).padStart(2, "0");

  const segundos = String(
    Number(coincidencia?.[3] || 0)
  ).padStart(2, "0");

  const fechaUTC = new Date(
    `${fecha}T${hora}:${minutos}:${segundos}Z`
  );

  return Number.isNaN(fechaUTC.getTime())
    ? null
    : fechaUTC;
}

function formatearFechaMovimiento(movimiento) {
  const fecha = convertirMovimientoAFechaLocal(movimiento);

  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA_HORARIA,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fecha);
}

function formatearHoraMovimiento(movimiento) {
  const fecha = convertirMovimientoAFechaLocal(movimiento);

  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA_HORARIA,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(fecha);
}

/* =========================================================
   ESTILOS DE CUENTAS
========================================================= */

const accountThemes = [
  {
    border: "border-blue-500/45",
    glow: "shadow-[0_22px_60px_rgba(37,99,235,0.08)]",
    icon: "border-cyan-400/35 bg-cyan-500/15 text-cyan-300",
    badge: "border-blue-400/30 bg-blue-500/15 text-blue-300",
    amount: "text-white",
    line: "text-blue-500",
  },
  {
    border: "border-emerald-500/40",
    glow: "shadow-[0_22px_60px_rgba(16,185,129,0.08)]",
    icon: "border-emerald-400/35 bg-emerald-500/15 text-emerald-300",
    badge: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
    amount: "text-white",
    line: "text-emerald-500",
  },
  {
    border: "border-violet-500/45",
    glow: "shadow-[0_22px_60px_rgba(139,92,246,0.08)]",
    icon: "border-violet-400/35 bg-violet-500/15 text-violet-300",
    badge: "border-violet-400/30 bg-violet-500/15 text-violet-300",
    amount: "text-red-300",
    line: "text-violet-500",
  },
  {
    border: "border-orange-500/45",
    glow: "shadow-[0_22px_60px_rgba(249,115,22,0.08)]",
    icon: "border-orange-400/35 bg-orange-500/15 text-orange-300",
    badge: "border-orange-400/30 bg-orange-500/15 text-orange-300",
    amount: "text-red-300",
    line: "text-orange-500",
  },
];

const chartColors = [
  "#2563eb",
  "#10b981",
  "#9333ea",
  "#f97316",
  "#ef4444",
  "#06b6d4",
];

const accountColorOptions = [
  "#2563EB",
  "#10B981",
  "#8B5CF6",
  "#F97316",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#EAB308",
];

const accountIconOptions = [
  "💳",
  "🏦",
  "💵",
  "📱",
  "🪙",
  "🐷",
  "📈",
  "💼",
];

const currencyOptions = [
  {
    value: "PEN",
    label: "Soles peruanos",
    shortLabel: "Soles",
    code: "PEN",
  },
  {
    value: "USD",
    label: "Dólares estadounidenses",
    shortLabel: "Dólares",
    code: "USD",
  },
];

function normalizarMoneda(moneda) {
  return moneda === "USD" ? "USD" : "PEN";
}

function getCurrencyInfo(moneda) {
  const value = normalizarMoneda(moneda);

  return (
    currencyOptions.find((opcion) => opcion.value === value) ||
    currencyOptions[0]
  );
}

function formatearDinero(valor, moneda = "PEN") {
  const monedaNormalizada = normalizarMoneda(moneda);
  const simbolo = monedaNormalizada === "USD" ? "$" : "S/";
  const monto = Number(valor || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${simbolo} ${monto}`;
}

function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value || "");
}

function hexToRgba(hex, alpha = 1) {
  if (!isHexColor(hex)) return `rgba(59, 130, 246, ${alpha})`;

  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getAccountColor(cuenta, index) {
  const color = cuenta?.color?.toUpperCase();

  /*
    #E60000 era el color predeterminado anterior.
    Mientras la cuenta no haya sido personalizada, conservamos
    una paleta variada para que las tarjetas no se vean iguales.
  */
  if (isHexColor(color) && color !== "#E60000") return color;

  return chartColors[index % chartColors.length];
}

function getAccountIcon(cuenta) {
  if (cuenta?.icono?.trim()) return cuenta.icono.trim();
  return cuenta?.nombre?.slice(0, 3).toUpperCase() || "CTA";
}

function getRpcErrorMessage(error) {
  const detail = [
    error?.message,
    error?.details,
    error?.hint,
    error?.code,
  ]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  if (detail.includes("SALDO_INSUFICIENTE")) {
    return "La cuenta de origen no tiene saldo suficiente";
  }

  if (detail.includes("CUENTAS_IGUALES")) {
    return "La cuenta de origen y destino deben ser diferentes";
  }

  if (detail.includes("TIPO_CAMBIO_REQUERIDO")) {
    return "Ingresa el tipo de cambio para convertir entre soles y dólares";
  }

  if (detail.includes("TIPO_CAMBIO_INVALIDO")) {
    return "Ingresa un tipo de cambio válido mayor que cero";
  }

  if (detail.includes("CONVERSION_INVALIDA")) {
    return "No se pudo calcular el monto convertido";
  }

  if (detail.includes("MONEDAS_NO_SOPORTADAS")) {
    return "La combinación de monedas seleccionada no está disponible";
  }

  if (detail.includes("MONEDAS_DIFERENTES")) {
    return "Actualiza la función de transferencias para habilitar conversiones entre PEN y USD";
  }

  if (detail.includes("MONTO_INVALIDO")) {
    return "Ingresa un monto válido";
  }

  if (detail.includes("CUENTA_NO_DISPONIBLE")) {
    return "Una de las cuentas no está disponible";
  }

  if (detail.includes("CUENTA_NO_ENCONTRADA")) {
    return "La cuenta ya no está disponible";
  }

  if (detail.includes("CUENTA_CON_MOVIMIENTOS")) {
    return "Esta cuenta tiene movimientos y no puede eliminarse. Puedes archivarla para conservar su historial";
  }

  if (detail.includes("USUARIO_NO_AUTENTICADO")) {
    return "Tu sesión terminó. Vuelve a iniciar sesión";
  }

  return "Ocurrió un error. Inténtalo nuevamente";
}

function getTheme(index) {
  return accountThemes[index % accountThemes.length];
}

function MiniChart({ index, className = "", color }) {
  const paths = [
    "M2 31 C12 29 17 35 28 28 C38 21 43 32 53 25 C63 18 69 8 79 20 C89 32 94 21 104 28 C114 35 121 27 132 32",
    "M2 31 C22 31 31 31 43 31 C58 31 68 31 82 31 C98 31 112 31 132 31",
    "M2 28 C11 29 17 19 27 23 C37 27 41 38 52 31 C62 24 68 9 78 18 C88 27 91 36 102 30 C112 24 119 28 132 25",
    "M2 25 C12 29 18 10 29 17 C40 24 43 35 54 26 C65 17 70 11 80 22 C90 33 94 37 104 27 C114 17 120 32 132 29",
  ];

  return (
    <svg
      viewBox="0 0 134 42"
      className={`h-10 w-32 ${className}`}
      fill="none"
      aria-hidden="true"
      style={color ? { color } : undefined}
    >
      <path
        d={paths[index % paths.length]}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d={`${paths[index % paths.length]} L132 42 L2 42 Z`}
        fill="currentColor"
        opacity="0.07"
      />
    </svg>
  );
}

function CuentasSkeleton() {
  return (
    <div className="space-y-12" aria-label="Cargando cuentas">
      <section
        className="
          grid
          grid-cols-1
          gap-5
          rounded-[28px]
          border-2
          border-white/[0.10]
          bg-[#080c14]/62
          p-7
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex animate-pulse items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.08]" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
              <div className="h-6 w-32 rounded-full bg-white/[0.10]" />
              <div className="h-3 w-16 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-7 xl:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              min-h-[250px]
              animate-pulse
              rounded-[26px]
              border-2
              border-white/[0.10]
              bg-[#080c14]/62
              p-7
            "
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/[0.08]" />
              <div className="space-y-3">
                <div className="h-5 w-32 rounded-full bg-white/[0.10]" />
                <div className="h-3 w-20 rounded-full bg-white/[0.06]" />
              </div>
            </div>

            <div className="mt-10 h-8 w-40 rounded-full bg-white/[0.10]" />
            <div className="mt-9 h-11 w-full rounded-xl bg-white/[0.07]" />
          </div>
        ))}
      </section>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [cuentasArchivadas, setCuentasArchivadas] = useState([]);
  const [cuentasFiltradas, setCuentasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("GRID");
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);

  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Banco");
  const [colorEdit, setColorEdit] = useState("#2563EB");
  const [iconoEdit, setIconoEdit] = useState("💳");
  const [saldoInicialEdit, setSaldoInicialEdit] = useState("");
  const [monedaEdit, setMonedaEdit] = useState("PEN");
  const [monedaResumen, setMonedaResumen] = useState("PEN");

  const [cuentaParaArchivar, setCuentaParaArchivar] = useState(null);
  const [cuentaParaEliminar, setCuentaParaEliminar] = useState(null);
  const [procesandoCuentaId, setProcesandoCuentaId] = useState(null);

  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [transfiriendo, setTransfiriendo] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  const [transferencia, setTransferencia] = useState({
    origen: "",
    destino: "",
    monto: "",
  });
  const [tipoCambio, setTipoCambio] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(
      "black-ghost-tipo-cambio-usd-pen"
    ) || "";
  });

  useEffect(() => {
    cargarCuentas();
  }, []);

  useEffect(() => {
    let lista = [...cuentas];

    if (busqueda.trim()) {
      lista = lista.filter((cuenta) =>
        cuenta.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setCuentasFiltradas(lista);
  }, [cuentas, busqueda]);

  useEffect(() => {
    if (!cuentas.length) return;

    const existeMonedaSeleccionada = cuentas.some(
      (cuenta) => normalizarMoneda(cuenta.moneda) === monedaResumen
    );

    if (!existeMonedaSeleccionada) {
      setMonedaResumen(normalizarMoneda(cuentas[0].moneda));
    }
  }, [cuentas, monedaResumen]);

  const totalCuentas = cuentas.length + cuentasArchivadas.length;
  const puedeEditarSaldoInicial =
    editando?.cantidad_movimientos === 0;

  const cuentasPorMoneda = useMemo(() => {
    return {
      PEN: cuentas.filter(
        (cuenta) => normalizarMoneda(cuenta.moneda) === "PEN"
      ),
      USD: cuentas.filter(
        (cuenta) => normalizarMoneda(cuenta.moneda) === "USD"
      ),
    };
  }, [cuentas]);

  const totalesPorMoneda = useMemo(() => {
    return cuentas.reduce(
      (totales, cuenta) => {
        const moneda = normalizarMoneda(cuenta.moneda);
        totales[moneda] += Number(cuenta.saldo_actual || 0);
        return totales;
      },
      { PEN: 0, USD: 0 }
    );
  }, [cuentas]);

  const cuentasResumen = cuentasPorMoneda[monedaResumen] || [];

  const totalAbsolutoResumen = useMemo(() => {
    return cuentasResumen.reduce(
      (total, cuenta) =>
        total + Math.abs(Number(cuenta.saldo_actual || 0)),
      0
    );
  }, [cuentasResumen]);

  const cuentaOrigenSeleccionada = useMemo(
    () =>
      cuentas.find(
        (cuenta) => cuenta.id === transferencia.origen
      ) || null,
    [cuentas, transferencia.origen]
  );

  const cuentaDestinoSeleccionada = useMemo(
    () =>
      cuentas.find(
        (cuenta) => cuenta.id === transferencia.destino
      ) || null,
    [cuentas, transferencia.destino]
  );

  const cuentasDestinoDisponibles = useMemo(() => {
    if (!cuentaOrigenSeleccionada) return [];

    return cuentas.filter(
      (cuenta) => cuenta.id !== cuentaOrigenSeleccionada.id
    );
  }, [cuentas, cuentaOrigenSeleccionada]);

  const requiereConversion = Boolean(
    cuentaOrigenSeleccionada &&
      cuentaDestinoSeleccionada &&
      normalizarMoneda(cuentaOrigenSeleccionada.moneda) !==
        normalizarMoneda(cuentaDestinoSeleccionada.moneda)
  );

  const montoDestinoCalculado = useMemo(() => {
    if (!cuentaOrigenSeleccionada || !cuentaDestinoSeleccionada) {
      return 0;
    }

    const montoOrigen = Number(transferencia.monto);

    if (!Number.isFinite(montoOrigen) || montoOrigen <= 0) {
      return 0;
    }

    const monedaOrigen = normalizarMoneda(
      cuentaOrigenSeleccionada.moneda
    );
    const monedaDestino = normalizarMoneda(
      cuentaDestinoSeleccionada.moneda
    );

    if (monedaOrigen === monedaDestino) {
      return Number(montoOrigen.toFixed(2));
    }

    const cambio = Number(tipoCambio);

    if (!Number.isFinite(cambio) || cambio <= 0) {
      return 0;
    }

    if (monedaOrigen === "USD" && monedaDestino === "PEN") {
      return Number((montoOrigen * cambio).toFixed(2));
    }

    if (monedaOrigen === "PEN" && monedaDestino === "USD") {
      return Number((montoOrigen / cambio).toFixed(2));
    }

    return 0;
  }, [
    cuentaOrigenSeleccionada,
    cuentaDestinoSeleccionada,
    transferencia.monto,
    tipoCambio,
  ]);

  const donutBackground = useMemo(() => {
    if (!cuentasResumen.length || totalAbsolutoResumen === 0) {
      return "conic-gradient(#1f2937 0deg 360deg)";
    }

    let acumulado = 0;

    const partes = cuentasResumen.map((cuenta, index) => {
      const porcentaje =
        Math.abs(Number(cuenta.saldo_actual || 0)) /
        totalAbsolutoResumen;

      const inicio = acumulado * 360;
      acumulado += porcentaje;
      const fin = acumulado * 360;

      return `${getAccountColor(cuenta, index)} ${inicio}deg ${fin}deg`;
    });

    return `conic-gradient(${partes.join(", ")})`;
  }, [cuentasResumen, totalAbsolutoResumen]);

  function mostrarMensaje(texto, tipo = "success") {
    setMensaje(texto);
    setTipoMensaje(tipo);

    window.setTimeout(() => {
      setMensaje("");
    }, 3500);
  }

  function actualizar() {
    return cargarCuentas();
  }

  async function cargarCuentas(mostrarCarga = true) {
    if (mostrarCarga) setCargando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("cuentas")
        .select("*")
        .eq("usuario_id", user.id)
        .order("fecha_creacion", { ascending: true });

      if (error) {
        console.log(error);
        mostrarMensaje("No se pudieron cargar las cuentas", "error");
        return;
      }

      const cuentasConSaldo = await Promise.all(
        (data || []).map(async (cuenta) => {
          const { data: movimientosCuenta, error: errorMov } =
            await supabase
              .from("movimientos")
              .select("tipo,monto")
              .eq("cuenta_id", cuenta.id)
              .eq("usuario_id", user.id);

          if (errorMov) {
            console.log(errorMov);
          }

          let saldo = Number(cuenta.saldo_inicial || 0);

          movimientosCuenta?.forEach((mov) => {
            if (mov.tipo === "INGRESO") {
              saldo += Number(mov.monto);
            }

            if (mov.tipo === "GASTO") {
              saldo -= Number(mov.monto);
            }
          });

          return {
            ...cuenta,
            moneda: normalizarMoneda(cuenta.moneda),
            saldo_actual: saldo,
            cantidad_movimientos: errorMov
              ? null
              : movimientosCuenta?.length || 0,
          };
        })
      );

      const activas = cuentasConSaldo
        .filter((cuenta) => cuenta.activo !== false)
        .sort(
          (a, b) => Number(b.saldo_actual) - Number(a.saldo_actual)
        );

      const archivadas = cuentasConSaldo
        .filter((cuenta) => cuenta.activo === false)
        .sort((a, b) => {
          const fechaA = new Date(a.archivado_en || a.fecha_creacion || 0);
          const fechaB = new Date(b.archivado_en || b.fecha_creacion || 0);
          return fechaB - fechaA;
        });

      setCuentas(activas);
      setCuentasArchivadas(archivadas);
    } finally {
      if (mostrarCarga) setCargando(false);
    }
  }

  function editarCuenta(cuenta) {
    setEditando(cuenta);
    setNombre(cuenta.nombre);
    setTipo(cuenta.tipo || "Banco");
    setColorEdit(
      isHexColor(cuenta.color) ? cuenta.color : "#2563EB"
    );
    setIconoEdit(cuenta.icono?.trim() || "💳");
    setSaldoInicialEdit(String(Number(cuenta.saldo_inicial || 0)));
    setMonedaEdit(normalizarMoneda(cuenta.moneda));
  }

  async function guardarEdicion(e) {
    e.preventDefault();

    if (!editando) return;

    if (!nombre.trim()) {
      mostrarMensaje("El nombre no puede estar vacío", "error");
      return;
    }

    const saldoInicial = Number(saldoInicialEdit);

    if (
      puedeEditarSaldoInicial &&
      !Number.isFinite(saldoInicial)
    ) {
      mostrarMensaje("Ingresa un saldo inicial válido", "error");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      mostrarMensaje("Tu sesión terminó. Vuelve a iniciar sesión", "error");
      return;
    }

    const cambios = {
      nombre: nombre.trim(),
      tipo,
      color: colorEdit,
      icono: iconoEdit,
    };

    if (puedeEditarSaldoInicial) {
      const { count, error: errorConteo } = await supabase
        .from("movimientos")
        .select("id", { count: "exact", head: true })
        .eq("cuenta_id", editando.id)
        .eq("usuario_id", user.id);

      if (errorConteo) {
        console.log(errorConteo);
        mostrarMensaje(
          "No se pudo comprobar el historial de la cuenta",
          "error"
        );
        return;
      }

      if (Number(count || 0) > 0) {
        setEditando((actual) => ({
          ...actual,
          cantidad_movimientos: Number(count || 0),
        }));
        mostrarMensaje(
          "El saldo inicial quedó bloqueado porque la cuenta ya tiene movimientos",
          "error"
        );
        return;
      }

      cambios.saldo_inicial = saldoInicial;
      cambios.moneda = normalizarMoneda(monedaEdit);
    }

    const { error } = await supabase
      .from("cuentas")
      .update(cambios)
      .eq("id", editando.id)
      .eq("usuario_id", user.id);

    if (error) {
      console.log(error);
      mostrarMensaje("Error actualizando cuenta", "error");
      return;
    }

    setEditando(null);
    setNombre("");
    setTipo("Banco");
    setColorEdit("#2563EB");
    setIconoEdit("💳");
    setSaldoInicialEdit("");
    setMonedaEdit("PEN");

    mostrarMensaje("Cuenta actualizada correctamente");
    cargarCuentas(false);
  }

  function solicitarEliminar(cuenta) {
    if (cuenta.cantidad_movimientos !== 0) {
      mostrarMensaje(
        "Esta cuenta tiene movimientos y no puede eliminarse. Puedes archivarla para conservar su historial",
        "error"
      );
      return;
    }

    setCuentaParaEliminar(cuenta);
  }

  async function confirmarEliminacion() {
    if (!cuentaParaEliminar) return;

    const cuenta = cuentaParaEliminar;
    setProcesandoCuentaId(cuenta.id);

    try {
      const { error } = await supabase.rpc("eliminar_cuenta_vacia", {
        p_cuenta_id: cuenta.id,
      });

      if (error) {
        console.log(error);
        mostrarMensaje(getRpcErrorMessage(error), "error");
        return;
      }

      if (cuentaSeleccionada?.id === cuenta.id) {
        cerrarDetalle();
      }

      if (editando?.id === cuenta.id) {
        cerrarEdicion();
      }

      setTransferencia((actual) => ({
        origen: actual.origen === cuenta.id ? "" : actual.origen,
        destino: actual.destino === cuenta.id ? "" : actual.destino,
        monto: actual.monto,
      }));

      setCuentaParaEliminar(null);
      mostrarMensaje(`${cuenta.nombre} fue eliminada definitivamente`);
      await cargarCuentas(false);
    } finally {
      setProcesandoCuentaId(null);
    }
  }

  function solicitarArchivar(cuenta) {
    setCuentaParaArchivar(cuenta);
  }

  async function confirmarArchivado() {
    if (!cuentaParaArchivar) return;

    const cuenta = cuentaParaArchivar;
    setProcesandoCuentaId(cuenta.id);

    try {
      const { error } = await supabase.rpc("archivar_cuenta", {
        p_cuenta_id: cuenta.id,
      });

      if (error) {
        console.log(error);
        mostrarMensaje(getRpcErrorMessage(error), "error");
        return;
      }

      if (cuentaSeleccionada?.id === cuenta.id) {
        cerrarDetalle();
      }

      setTransferencia((actual) => ({
        origen: actual.origen === cuenta.id ? "" : actual.origen,
        destino: actual.destino === cuenta.id ? "" : actual.destino,
        monto: actual.monto,
      }));

      setCuentaParaArchivar(null);
      mostrarMensaje(
        `${cuenta.nombre} fue archivada sin perder su historial`
      );
      await cargarCuentas(false);
    } finally {
      setProcesandoCuentaId(null);
    }
  }

  async function restaurarCuenta(cuenta) {
    setProcesandoCuentaId(cuenta.id);

    try {
      const { error } = await supabase.rpc("restaurar_cuenta", {
        p_cuenta_id: cuenta.id,
      });

      if (error) {
        console.log(error);
        mostrarMensaje(getRpcErrorMessage(error), "error");
        return;
      }

      mostrarMensaje(`${cuenta.nombre} fue restaurada correctamente`);
      await cargarCuentas(false);
    } finally {
      setProcesandoCuentaId(null);
    }
  }

  async function transferir() {
    if (transfiriendo) return;

    const { origen, destino, monto } = transferencia;

    if (!origen || !destino || !monto) {
      mostrarMensaje(
        "Completa todos los datos de transferencia",
        "error"
      );
      return;
    }

    if (origen === destino) {
      mostrarMensaje(
        "La cuenta de origen y destino deben ser diferentes",
        "error"
      );
      return;
    }

    const cantidad = Number(monto);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      mostrarMensaje("Ingresa un monto válido", "error");
      return;
    }

    const cuentaOrigen = cuentas.find(
      (cuenta) => cuenta.id === origen
    );
    const cuentaDestino = cuentas.find(
      (cuenta) => cuenta.id === destino
    );

    if (!cuentaOrigen || !cuentaDestino) {
      mostrarMensaje("Una de las cuentas no está disponible", "error");
      return;
    }

    const monedaOrigen = normalizarMoneda(cuentaOrigen.moneda);
    const monedaDestino = normalizarMoneda(cuentaDestino.moneda);
    const conversionNecesaria = monedaOrigen !== monedaDestino;
    const cambio = Number(tipoCambio);

    if (
      conversionNecesaria &&
      (!Number.isFinite(cambio) || cambio <= 0)
    ) {
      mostrarMensaje(
        "Ingresa un tipo de cambio válido. Ejemplo: 3.60",
        "error"
      );
      return;
    }

    if (Number(cuentaOrigen.saldo_actual || 0) < cantidad) {
      mostrarMensaje(
        `Saldo insuficiente. Disponible: ${formatearDinero(
          cuentaOrigen.saldo_actual,
          cuentaOrigen.moneda
        )}`,
        "error"
      );
      return;
    }

    let montoRecibido = cantidad;

    if (conversionNecesaria) {
      montoRecibido =
        monedaOrigen === "USD"
          ? Number((cantidad * cambio).toFixed(2))
          : Number((cantidad / cambio).toFixed(2));
    }

    if (!Number.isFinite(montoRecibido) || montoRecibido <= 0) {
      mostrarMensaje("No se pudo calcular el monto convertido", "error");
      return;
    }

    setTransfiriendo(true);

    try {
      const { data: transferenciaId, error } = await supabase.rpc(
        "transferir_entre_cuentas",
        {
          p_cuenta_origen: origen,
          p_cuenta_destino: destino,
          p_monto: cantidad,
          p_tipo_cambio: conversionNecesaria ? cambio : null,
        }
      );

      if (error) {
        console.log(error);
        mostrarMensaje(getRpcErrorMessage(error), "error");
        return;
      }

      setTransferencia({
        origen: "",
        destino: "",
        monto: "",
      });

      const referencia =
        typeof transferenciaId === "string"
          ? transferenciaId.slice(0, 8).toUpperCase()
          : "";

      const detalleConversion = conversionNecesaria
        ? ` · ${formatearDinero(
            cantidad,
            monedaOrigen
          )} → ${formatearDinero(montoRecibido, monedaDestino)}`
        : "";

      mostrarMensaje(
        referencia
          ? `Transferencia realizada${detalleConversion} · Ref. ${referencia}`
          : `Transferencia realizada correctamente${detalleConversion}`
      );

      await cargarCuentas(false);

      if (cuentaSeleccionada) {
        await verMovimientos(cuentaSeleccionada);
      }
    } finally {
      setTransfiriendo(false);
    }
  }

  async function verMovimientos(cuenta) {
    setCuentaSeleccionada(cuenta);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("movimientos")
      .select(`
        id,
        tipo,
        monto,
        descripcion,
        fecha,
        hora,
        transferencia_id,
        categorias(
          nombre
        )
      `)
      .eq("cuenta_id", cuenta.id)
      .eq("usuario_id", user.id)
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setMovimientos(data || []);

    let ingresos = 0;
    let gastos = 0;

    data?.forEach((mov) => {
      if (esTransferencia(mov)) return;

      if (mov.tipo === "INGRESO") {
        ingresos += Number(mov.monto);
      }

      if (mov.tipo === "GASTO") {
        gastos += Number(mov.monto);
      }
    });

    setTotalIngresos(ingresos);
    setTotalGastos(gastos);
  }

  function cerrarDetalle() {
    setCuentaSeleccionada(null);
    setMovimientos([]);
    setTotalIngresos(0);
    setTotalGastos(0);
  }

  function cerrarEdicion() {
    setEditando(null);
    setNombre("");
    setTipo("Banco");
    setColorEdit("#2563EB");
    setIconoEdit("💳");
    setSaldoInicialEdit("");
    setMonedaEdit("PEN");
  }

  function irANuevaCuenta() {
    document
      .getElementById("nueva-cuenta")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const inputClass = `
    h-12
    w-full
    rounded-xl
    border-2
    border-white/[0.12]
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
      {/* =====================================================
          CABECERA
      ====================================================== */}

      <header
        className="
          mb-10
          flex
          flex-col
          gap-6
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-[38px]
              font-black
              tracking-[-0.045em]
              text-white
            "
          >
            Cuentas
          </h1>

          <p className="mt-2 text-base font-medium text-slate-300">
            Gestiona y organiza todas tus cuentas en un solo lugar.
          </p>
        </div>

        <button
          type="button"
          onClick={irANuevaCuenta}
          className="
            flex
            h-12
            w-fit
            items-center
            gap-2
            rounded-xl
            border-2
            border-red-400/35
            bg-gradient-to-r
            from-red-700
            via-red-600
            to-rose-600
            px-5
            text-sm
            font-black
            text-white
            shadow-[0_16px_44px_rgba(239,68,68,0.20)]
            transition
            hover:-translate-y-0.5
            hover:from-red-600
            hover:to-rose-500
          "
        >
          <Icon name="plus" className="h-4 w-4" />
          Nueva cuenta
        </button>
      </header>

      {cargando && <CuentasSkeleton />}

      <div className={cargando ? "hidden" : "block"}>
      {/* =====================================================
          RESUMEN SUPERIOR
      ====================================================== */}

      <section
        className="
          mb-12
          rounded-[28px]
          border-2
          border-white/[0.13]
          bg-[#080c14]/68
          px-7
          py-7
          shadow-[0_28px_80px_rgba(0,0,0,0.24)]
          backdrop-blur-xl
          sm:px-8
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-7
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-red-500/30 bg-red-500/12 text-red-300">
              <Icon name="wallet" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Patrimonio en soles
              </p>

              <p
                className={`mt-2 text-[22px] font-black tracking-tight ${
                  totalesPorMoneda.PEN >= 0
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {formatearDinero(totalesPorMoneda.PEN, "PEN")}
              </p>

              <span className="mt-2 inline-flex rounded-lg border border-red-500/25 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-300">
                {cuentasPorMoneda.PEN.length} cuentas PEN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/12 text-emerald-300">
              <Icon name="trendUp" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Patrimonio en dólares
              </p>

              <p
                className={`mt-2 text-[22px] font-black tracking-tight ${
                  totalesPorMoneda.USD >= 0
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {formatearDinero(totalesPorMoneda.USD, "USD")}
              </p>

              <span className="mt-2 inline-flex rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                {cuentasPorMoneda.USD.length} cuentas USD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-500/30 bg-blue-500/12 text-blue-300">
              <Icon name="layers" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Total cuentas
              </p>

              <p className="mt-2 text-[22px] font-black text-white">
                {cuentas.length}
              </p>

              <span className="mt-2 inline-flex rounded-lg border border-blue-500/25 bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-300">
                Activas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-violet-500/30 bg-violet-500/12 text-violet-300">
              <Icon name="activity" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Monedas activas
              </p>

              <p className="mt-2 text-[22px] font-black text-white">
                {(cuentasPorMoneda.PEN.length > 0 ? 1 : 0) +
                  (cuentasPorMoneda.USD.length > 0 ? 1 : 0)}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-300">
                PEN y USD separados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MIS CUENTAS
      ====================================================== */}

      <section className="mb-12">
        <div
          className="
            mb-7
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Mis cuentas
            </h2>

            <p className="mt-1.5 text-sm text-slate-400">
              Consulta, edita y administra tus saldos.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-[300px]">
              <div
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              >
                <Icon name="search" className="h-4 w-4" />
              </div>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cuenta..."
                className={`${inputClass} pl-11`}
              />
            </div>

            <div
              className="
                flex
                h-12
                overflow-hidden
                rounded-xl
                border-2
                border-white/[0.12]
                bg-black/35
              "
            >
              <button
                type="button"
                onClick={() => setVista("GRID")}
                className={`
                  flex
                  h-full
                  w-12
                  items-center
                  justify-center
                  transition
                  ${
                    vista === "GRID"
                      ? "bg-red-500/15 text-red-300"
                      : "text-slate-500 hover:text-white"
                  }
                `}
                title="Vista en cuadrícula"
              >
                <Icon name="grid" className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setVista("LIST")}
                className={`
                  flex
                  h-full
                  w-12
                  items-center
                  justify-center
                  border-l
                  border-white/[0.10]
                  transition
                  ${
                    vista === "LIST"
                      ? "bg-red-500/15 text-red-300"
                      : "text-slate-500 hover:text-white"
                  }
                `}
                title="Vista en lista"
              >
                <Icon name="list" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {cuentasFiltradas.length === 0 ? (
          <div
            className="
              rounded-[28px]
              border-2
              border-dashed
              border-white/[0.12]
              bg-[#080c14]/55
              px-8
              py-16
              text-center
              backdrop-blur-xl
            "
          >
            <p className="text-base font-bold text-slate-200">
              No hay cuentas disponibles
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Crea una cuenta nueva o cambia el término de búsqueda.
            </p>
          </div>
        ) : (
          <div
            className={
              vista === "GRID"
                ? "grid grid-cols-1 gap-7 xl:grid-cols-2"
                : "space-y-5"
            }
          >
            {cuentasFiltradas.map((cuenta, index) => {
              const theme = getTheme(index);
              const saldo = Number(cuenta.saldo_actual || 0);
              const esPrincipal =
                cuentasPorMoneda[normalizarMoneda(cuenta.moneda)]?.[0]?.id ===
                cuenta.id;
              const accountColor = getAccountColor(cuenta, index);
              const accountIcon = getAccountIcon(cuenta);
              const sinMovimientos = cuenta.cantidad_movimientos === 0;

              return (
                <article
                  key={cuenta.id}
                  className={`
                    relative
                    overflow-hidden
                    rounded-[26px]
                    border-2
                    bg-[#080c14]/70
                    px-7
                    py-7
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#0b1018]/80
                    ${theme.border}
                    ${theme.glow}
                  `}
                  style={{
                    borderColor: hexToRgba(accountColor, 0.58),
                    boxShadow: `0 22px 60px ${hexToRgba(
                      accountColor,
                      0.10
                    )}`,
                  }}
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-36
                      w-36
                      rounded-full
                      bg-white/[0.025]
                      blur-2xl
                    "
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border-2
                            text-sm
                            font-black
                            uppercase
                          "
                          style={{
                            borderColor: hexToRgba(accountColor, 0.48),
                            backgroundColor: hexToRgba(accountColor, 0.14),
                            color: accountColor,
                          }}
                        >
                          {accountIcon}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                              truncate
                              text-xl
                              font-black
                              tracking-tight
                              text-white
                            "
                          >
                            {cuenta.nombre}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-sm text-slate-400">
                              {cuenta.tipo || "Sin tipo"}
                            </p>
                            <span className="rounded-md border border-white/[0.10] bg-white/[0.05] px-2 py-0.5 text-[10px] font-black text-slate-300">
                              {normalizarMoneda(cuenta.moneda)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {esPrincipal && (
                        <span
                          className="
                            shrink-0
                            rounded-lg
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.08em]
                          "
                          style={{
                            borderColor: hexToRgba(accountColor, 0.38),
                            backgroundColor: hexToRgba(accountColor, 0.14),
                            color: accountColor,
                          }}
                        >
                          Principal
                        </span>
                      )}
                    </div>

                    <div
                      className="
                        mt-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                      "
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-400">
                          Saldo actual
                        </p>

                        <p
                          className={`
                            mt-2
                            text-[28px]
                            font-black
                            tracking-[-0.035em]
                            ${
                              saldo >= 0
                                ? theme.amount
                                : "text-red-300"
                            }
                          `}
                        >
                          {formatearDinero(saldo, cuenta.moneda)}
                        </p>
                      </div>

                      <MiniChart
                        index={index}
                        className={theme.line}
                        color={accountColor}
                      />
                    </div>

                    <div
                      className="
                        mt-7
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-[1fr_1fr_auto]
                      "
                    >
                      <button
                        type="button"
                        onClick={() => verMovimientos(cuenta)}
                        className="
                          flex
                          h-11
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-white/[0.10]
                          bg-white/[0.055]
                          px-4
                          text-sm
                          font-bold
                          text-slate-200
                          transition
                          hover:border-white/[0.18]
                          hover:bg-white/[0.09]
                          hover:text-white
                        "
                      >
                        <Icon name="arrow" className="h-4 w-4" />
                        Movimientos
                      </button>

                      <button
                        type="button"
                        onClick={() => editarCuenta(cuenta)}
                        className="
                          flex
                          h-11
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-white/[0.10]
                          bg-white/[0.055]
                          px-4
                          text-sm
                          font-bold
                          text-slate-200
                          transition
                          hover:border-blue-500/30
                          hover:bg-blue-500/10
                          hover:text-blue-300
                        "
                      >
                        <Icon name="edit" className="h-4 w-4" />
                        Editar
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => solicitarArchivar(cuenta)}
                          className="
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-amber-500/20
                            bg-amber-500/[0.07]
                            px-4
                            text-amber-300
                            transition
                            hover:border-amber-500/40
                            hover:bg-amber-500/14
                            sm:w-11
                          "
                          title="Archivar cuenta"
                        >
                          <Icon name="archive" className="h-4 w-4" />
                        </button>

                        {sinMovimientos && (
                          <button
                            type="button"
                            onClick={() => solicitarEliminar(cuenta)}
                            className="
                              flex
                              h-11
                              w-full
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-red-500/25
                              bg-red-500/[0.08]
                              px-4
                              text-red-300
                              transition
                              hover:border-red-500/50
                              hover:bg-red-500/15
                              sm:w-11
                            "
                            title="Eliminar cuenta definitivamente"
                          >
                            <Icon name="trash" className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          CUENTAS ARCHIVADAS
      ====================================================== */}

      {cuentasArchivadas.length > 0 && (
        <section
          className="
            mb-12
            overflow-hidden
            rounded-[28px]
            border-2
            border-amber-500/20
            bg-[#080c14]/66
            shadow-[0_28px_80px_rgba(0,0,0,0.22)]
            backdrop-blur-xl
          "
        >
          <button
            type="button"
            onClick={() => setMostrarArchivadas((valor) => !valor)}
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              px-7
              py-6
              text-left
              transition
              hover:bg-white/[0.025]
              sm:px-8
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-amber-500/25
                  bg-amber-500/10
                  text-amber-300
                "
              >
                <Icon name="archive" className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-black text-white">
                  Cuentas archivadas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {cuentasArchivadas.length}{" "}
                  {cuentasArchivadas.length === 1
                    ? "cuenta conserva"
                    : "cuentas conservan"}{" "}
                  todo su historial
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span
                className="
                  rounded-full
                  border
                  border-amber-500/25
                  bg-amber-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-black
                  text-amber-300
                "
              >
                {cuentasArchivadas.length}
              </span>

              <span
                className={`
                  text-slate-400
                  transition-transform
                  duration-300
                  ${mostrarArchivadas ? "rotate-180" : ""}
                `}
              >
                <Icon name="chevronDown" className="h-5 w-5" />
              </span>
            </div>
          </button>

          {mostrarArchivadas && (
            <div
              className="
                grid
                grid-cols-1
                gap-4
                border-t
                border-white/[0.08]
                p-6
                sm:p-7
                xl:grid-cols-2
              "
            >
              {cuentasArchivadas.map((cuenta, index) => {
                const accountColor = getAccountColor(cuenta, index);
                const accountIcon = getAccountIcon(cuenta);
                const restaurando = procesandoCuentaId === cuenta.id;
                const sinMovimientos = cuenta.cantidad_movimientos === 0;

                return (
                  <article
                    key={cuenta.id}
                    className="
                      rounded-[22px]
                      border
                      border-white/[0.10]
                      bg-black/20
                      p-5
                    "
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          text-sm
                          font-black
                        "
                        style={{
                          borderColor: hexToRgba(accountColor, 0.35),
                          backgroundColor: hexToRgba(accountColor, 0.10),
                          color: accountColor,
                        }}
                      >
                        {accountIcon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-black text-white">
                              {cuenta.nombre}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <p className="text-sm text-slate-500">
                                {cuenta.tipo || "Sin tipo"}
                              </p>
                              <span className="rounded-md border border-white/[0.10] bg-white/[0.05] px-2 py-0.5 text-[10px] font-black text-slate-400">
                                {normalizarMoneda(cuenta.moneda)}
                              </span>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-lg border border-amber-500/20 bg-amber-500/[0.08] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-amber-300">
                            Archivada
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.10em] text-slate-500">
                              Saldo conservado
                            </p>

                            <p
                              className={`
                                mt-2
                                text-xl
                                font-black
                                ${
                                  Number(cuenta.saldo_actual) >= 0
                                    ? "text-emerald-300"
                                    : "text-red-300"
                                }
                              `}
                            >
                              {formatearDinero(
                                cuenta.saldo_actual,
                                cuenta.moneda
                              )}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => verMovimientos(cuenta)}
                              className="
                                flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-white/[0.10]
                                bg-white/[0.05]
                                px-3
                                text-xs
                                font-bold
                                text-slate-300
                                transition
                                hover:bg-white/[0.09]
                                hover:text-white
                              "
                            >
                              <Icon name="arrow" className="h-3.5 w-3.5" />
                              Historial
                            </button>

                            <button
                              type="button"
                              disabled={restaurando}
                              onClick={() => restaurarCuenta(cuenta)}
                              className="
                                flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-emerald-500/25
                                bg-emerald-500/[0.08]
                                px-3
                                text-xs
                                font-black
                                text-emerald-300
                                transition
                                hover:border-emerald-500/45
                                hover:bg-emerald-500/14
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                              "
                            >
                              {restaurando ? (
                                <>
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-300/30 border-t-emerald-300" />
                                  Restaurando
                                </>
                              ) : (
                                <>
                                  <Icon
                                    name="restore"
                                    className="h-3.5 w-3.5"
                                  />
                                  Restaurar
                                </>
                              )}
                            </button>

                            {sinMovimientos && (
                              <button
                                type="button"
                                disabled={restaurando}
                                onClick={() => solicitarEliminar(cuenta)}
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-red-500/25
                                  bg-red-500/[0.08]
                                  text-red-300
                                  transition
                                  hover:border-red-500/50
                                  hover:bg-red-500/15
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                "
                                title="Eliminar cuenta definitivamente"
                              >
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          DETALLE DE MOVIMIENTOS
      ====================================================== */}

      {cuentaSeleccionada && (
        <section
          className="
            mb-12
            overflow-hidden
            rounded-[28px]
            border-2
            border-emerald-500/25
            bg-[#080c14]/72
            shadow-[0_28px_80px_rgba(0,0,0,0.26)]
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
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
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                Movimientos de {cuentaSeleccionada.nombre}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Historial registrado en esta cuenta.
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarDetalle}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.05]
                text-slate-400
                transition
                hover:bg-white/[0.09]
                hover:text-white
              "
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-5
              border-b
              border-white/[0.09]
              px-7
              py-6
              sm:grid-cols-2
              sm:px-8
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-emerald-500/25
                bg-emerald-500/[0.07]
                p-5
              "
            >
              <p className="text-sm font-semibold text-slate-400">
                Ingresos reales
              </p>

              <p className="mt-2 text-2xl font-black text-emerald-300">
                {formatearDinero(
                  totalIngresos,
                  cuentaSeleccionada.moneda
                )}
              </p>

              <p className="mt-2 text-xs text-emerald-300/70">
                Transferencias internas excluidas
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-red-500/25
                bg-red-500/[0.07]
                p-5
              "
            >
              <p className="text-sm font-semibold text-slate-400">
                Gastos reales
              </p>

              <p className="mt-2 text-2xl font-black text-red-300">
                {formatearDinero(
                  totalGastos,
                  cuentaSeleccionada.moneda
                )}
              </p>

              <p className="mt-2 text-xs text-red-300/70">
                Transferencias internas excluidas
              </p>
            </div>
          </div>

          {movimientos.length === 0 ? (
            <div className="px-8 py-14 text-center text-sm text-slate-500">
              Esta cuenta todavía no tiene movimientos.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.08]">
              {movimientos.map((mov) => {
                const ingreso = mov.tipo === "INGRESO";
                const transferenciaInterna = esTransferencia(mov);
                const fechaMovimiento =
                  formatearFechaMovimiento(mov);
                const horaMovimiento =
                  formatearHoraMovimiento(mov);

                return (
                  <div
                    key={mov.id}
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      px-7
                      py-5
                      transition
                      hover:bg-white/[0.025]
                      sm:grid-cols-[125px_minmax(0,1fr)_170px_130px]
                      sm:items-center
                      sm:px-8
                    "
                  >
                    <span
                      className={`
                        w-fit
                        rounded-lg
                        border
                        px-2.5
                        py-1.5
                        text-xs
                        font-black
                        ${
                          transferenciaInterna
                            ? "border-blue-500/25 bg-blue-500/10 text-blue-300"
                            : ingreso
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                              : "border-red-500/25 bg-red-500/10 text-red-300"
                        }
                      `}
                    >
                      {transferenciaInterna
                        ? "TRANSFERENCIA"
                        : mov.tipo}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {mov.descripcion || "Sin descripción"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-xs text-slate-500">
                          {mov.categorias?.nombre ||
                            (transferenciaInterna
                              ? "Transferencia interna"
                              : "Sin categoría")}
                        </p>

                        {transferenciaInterna &&
                          mov.transferencia_id && (
                          <span
                            className="
                              rounded-md
                              border
                              border-violet-500/20
                              bg-violet-500/[0.08]
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.08em]
                              text-violet-300
                            "
                          >
                            Ref. {mov.transferencia_id
                              .slice(0, 8)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-400">
                      {fechaMovimiento}
                      {horaMovimiento
                        ? ` · ${horaMovimiento}`
                        : ""}
                    </p>

                    <p
                      className={`
                        text-right
                        text-base
                        font-black
                        ${
                          transferenciaInterna
                            ? "text-blue-300"
                            : ingreso
                              ? "text-emerald-300"
                              : "text-red-300"
                        }
                      `}
                    >
                      {ingreso ? "+" : "-"}
                      {formatearDinero(
                        mov.monto,
                        cuentaSeleccionada.moneda
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          TRANSFERENCIA Y NUEVA CUENTA
      ====================================================== */}

      <section
        className="
          mb-12
          grid
          grid-cols-1
          items-start
          gap-8
          xl:grid-cols-2
        "
      >
        {/* TRANSFERIR */}

        <article
          className="
            rounded-[28px]
            border-2
            border-violet-500/30
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div
            className="
              mb-7
              flex
              items-center
              gap-3
              border-b
              border-white/[0.09]
              pb-6
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-violet-500/25
                bg-violet-500/10
                text-violet-300
              "
            >
              <Icon name="transfer" className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-black text-white">
                Transferir dinero
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Mueve saldo entre tus cuentas.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                Cuenta de origen
              </label>

              <select
                value={transferencia.origen}
                disabled={transfiriendo}
                onChange={(e) => {
                  const origen = e.target.value;

                  setTransferencia((actual) => ({
                    ...actual,
                    origen,
                    destino:
                      actual.destino === origen ? "" : actual.destino,
                  }));
                }}
                className={inputClass}
              >
                <option value="">Seleccionar cuenta de origen</option>

                {cuentas.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre} · {normalizarMoneda(cuenta.moneda)}
                  </option>
                ))}
              </select>

              {cuentaOrigenSeleccionada && (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-violet-500/20
                    bg-violet-500/[0.06]
                    px-4
                    py-3
                    text-xs
                  "
                >
                  <span className="font-semibold text-slate-400">
                    Saldo disponible
                  </span>

                  <span
                    className={`
                      font-black
                      ${
                        Number(cuentaOrigenSeleccionada.saldo_actual) >= 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    `}
                  >
                    {formatearDinero(
                      cuentaOrigenSeleccionada.saldo_actual,
                      cuentaOrigenSeleccionada.moneda
                    )}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                Cuenta de destino
              </label>

              <select
                value={transferencia.destino}
                disabled={transfiriendo || !transferencia.origen}
                onChange={(e) =>
                  setTransferencia({
                    ...transferencia,
                    destino: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">Seleccionar cuenta de destino</option>

                {cuentasDestinoDisponibles.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre} · {normalizarMoneda(cuenta.moneda)}
                  </option>
                ))}
              </select>

              {cuentaOrigenSeleccionada &&
                cuentasDestinoDisponibles.length === 0 && (
                  <p className="mt-2 text-xs leading-5 text-amber-300">
                    Necesitas al menos otra cuenta activa para transferir.
                  </p>
                )}
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                Monto a enviar
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                disabled={transfiriendo}
                placeholder={
                  cuentaOrigenSeleccionada?.moneda === "USD"
                    ? "$ 0.00"
                    : "S/ 0.00"
                }
                value={transferencia.monto}
                onChange={(e) =>
                  setTransferencia({
                    ...transferencia,
                    monto: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {requiereConversion && (
              <div
                className="
                  rounded-2xl
                  border
                  border-amber-500/25
                  bg-amber-500/[0.07]
                  p-4
                "
              >
                <label className="block text-sm font-semibold text-amber-200">
                  Tipo de cambio manual
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <span className="shrink-0 text-sm font-bold text-slate-300">
                    1 USD = S/
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    disabled={transfiriendo}
                    value={tipoCambio}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setTipoCambio(valor);

                      if (typeof window !== "undefined") {
                        window.localStorage.setItem(
                          "black-ghost-tipo-cambio-usd-pen",
                          valor
                        );
                      }
                    }}
                    placeholder="3.6000"
                    className={inputClass}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Tú decides el tipo de cambio utilizado. El último valor queda
                  guardado en este navegador y puedes actualizarlo cuando cambie.
                </p>
              </div>
            )}

            {cuentaOrigenSeleccionada &&
              cuentaDestinoSeleccionada &&
              Number(transferencia.monto) > 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-violet-500/25
                    bg-violet-500/[0.07]
                    p-5
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-400">
                      La cuenta de destino recibirá
                    </span>

                    <span className="text-xl font-black text-white">
                      {montoDestinoCalculado > 0
                        ? formatearDinero(
                            montoDestinoCalculado,
                            cuentaDestinoSeleccionada.moneda
                          )
                        : "—"}
                    </span>
                  </div>

                  {requiereConversion && Number(tipoCambio) > 0 && (
                    <p className="mt-2 text-xs text-violet-300">
                      Conversión aplicada: 1 USD = S/ {Number(
                        tipoCambio
                      ).toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                  )}
                </div>
              )}

            <button
              type="button"
              disabled={
                transfiriendo ||
                !cuentaOrigenSeleccionada ||
                !cuentaDestinoSeleccionada ||
                !Number(transferencia.monto) ||
                (requiereConversion &&
                  (!Number(tipoCambio) || Number(tipoCambio) <= 0))
              }
              onClick={transferir}
              className="
                mt-2
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border-2
                border-violet-400/30
                bg-gradient-to-r
                from-violet-700
                to-purple-600
                px-5
                text-sm
                font-black
                text-white
                shadow-[0_16px_44px_rgba(139,92,246,0.18)]
                transition
                hover:-translate-y-0.5
                hover:from-violet-600
                hover:to-purple-500
                disabled:cursor-not-allowed
                disabled:opacity-55
                disabled:hover:translate-y-0
              "
            >
              {transfiriendo ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Procesando transferencia...
                </>
              ) : (
                <>
                  <Icon name="transfer" className="h-4 w-4" />
                  Transferir dinero
                </>
              )}
            </button>
          </div>
        </article>

        {/* NUEVA CUENTA */}

        <article
          id="nueva-cuenta"
          className="
            scroll-mt-10
            rounded-[28px]
            border-2
            border-red-500/30
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div
            className="
              mb-7
              flex
              items-center
              gap-3
              border-b
              border-white/[0.09]
              pb-6
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-red-500/25
                bg-red-500/10
                text-red-300
              "
            >
              <Icon name="plus" className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-black text-white">
                Nueva cuenta
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Registra una nueva cuenta financiera.
              </p>
            </div>
          </div>

          <div
            className="
              [&_form]:!m-0
              [&_form]:!w-full
              [&_form]:!max-w-none
              [&_form]:!border-0
              [&_form]:!bg-transparent
              [&_form]:!p-0
              [&_form]:!shadow-none

              [&_form_h1]:!hidden
              [&_form_h2]:!hidden

              [&_form_input]:!h-12
              [&_form_input]:!w-full
              [&_form_input]:!rounded-xl
              [&_form_input]:!border-2
              [&_form_input]:!border-white/[0.12]
              [&_form_input]:!bg-black/35
              [&_form_input]:!px-4
              [&_form_input]:!text-sm
              [&_form_input]:!font-medium
              [&_form_input]:!text-white
              [&_form_input]:placeholder:!text-slate-500
              [&_form_input]:focus:!border-red-500/55

              [&_form_select]:!h-12
              [&_form_select]:!w-full
              [&_form_select]:!rounded-xl
              [&_form_select]:!border-2
              [&_form_select]:!border-white/[0.12]
              [&_form_select]:!bg-[#06090f]
              [&_form_select]:!px-4
              [&_form_select]:!text-sm
              [&_form_select]:!font-medium
              [&_form_select]:!text-white
              [&_form_select]:focus:!border-red-500/55

              [&_form_button]:!h-12
              [&_form_button]:!w-full
              [&_form_button]:!rounded-xl
              [&_form_button]:!border-2
              [&_form_button]:!border-red-400/30
              [&_form_button]:!bg-gradient-to-r
              [&_form_button]:!from-red-700
              [&_form_button]:!to-rose-600
              [&_form_button]:!px-5
              [&_form_button]:!text-sm
              [&_form_button]:!font-black
              [&_form_button]:!text-white

              [&_form>div]:!space-y-5
            "
          >
            <CuentaForm actualizar={actualizar} />
          </div>
        </article>
      </section>

      {/* =====================================================
          RESUMEN DE SALDOS
      ====================================================== */}

      <section
        className="
          rounded-[28px]
          border-2
          border-white/[0.13]
          bg-[#080c14]/70
          p-7
          shadow-[0_28px_80px_rgba(0,0,0,0.24)]
          backdrop-blur-xl
          sm:p-8
        "
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              Resumen de saldos
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Distribución separada por moneda, sin mezclar soles y dólares.
            </p>
          </div>

          <div className="flex h-11 overflow-hidden rounded-xl border border-white/[0.10] bg-black/25">
            {currencyOptions.map((opcion) => (
              <button
                key={opcion.value}
                type="button"
                onClick={() => setMonedaResumen(opcion.value)}
                className={`px-4 text-xs font-black transition ${
                  monedaResumen === opcion.value
                    ? "bg-red-500/15 text-red-300"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {opcion.value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[180px_minmax(0,1fr)_310px]">
          <div className="flex justify-center">
            <div
              className="relative h-36 w-36 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.12)]"
              style={{ background: donutBackground }}
            >
              <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#080c14]">
                <span className="text-sm font-black text-white">
                  {monedaResumen}
                </span>
                <span className="mt-1 text-[10px] font-bold text-slate-500">
                  {cuentasResumen.length} cuentas
                </span>
              </div>
            </div>
          </div>

          <div>
            {cuentasResumen.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-black/15 px-6 py-9 text-center">
                <p className="text-sm font-bold text-slate-300">
                  No tienes cuentas activas en {monedaResumen}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cuentasResumen.slice(0, 6).map((cuenta, index) => {
                  const porcentaje =
                    totalAbsolutoResumen > 0
                      ? (Math.abs(Number(cuenta.saldo_actual || 0)) /
                          totalAbsolutoResumen) *
                        100
                      : 0;

                  return (
                    <div
                      key={cuenta.id}
                      className="grid grid-cols-[minmax(0,1fr)_130px_65px] items-center gap-4 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: getAccountColor(cuenta, index),
                          }}
                        />
                        <span className="truncate font-semibold text-slate-300">
                          {cuenta.nombre}
                        </span>
                      </div>

                      <span className="text-right font-bold text-white">
                        {formatearDinero(
                          cuenta.saldo_actual,
                          cuenta.moneda
                        )}
                      </span>

                      <span className="text-right text-slate-400">
                        {porcentaje.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-white/[0.10] bg-black/20 p-6">
            <p className="text-sm font-semibold text-slate-400">
              Saldo total en {getCurrencyInfo(monedaResumen).shortLabel}
            </p>

            <p
              className={`mt-2 text-[28px] font-black tracking-tight ${
                totalesPorMoneda[monedaResumen] >= 0
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {formatearDinero(
                totalesPorMoneda[monedaResumen],
                monedaResumen
              )}
            </p>

            <div className="mt-7 h-px bg-white/[0.08]" />

            <p className="mt-6 text-sm text-slate-400">
              Cuentas activas en {monedaResumen}
            </p>

            <p className="mt-2 text-base font-black text-white">
              {cuentasResumen.length} de {totalCuentas}
            </p>
          </div>
        </div>
      </section>

      </div>

      {/* =====================================================
          MODAL ARCHIVAR CUENTA
      ====================================================== */}

      {cuentaParaArchivar && (
        <div
          className="
            fixed
            inset-0
            z-[110]
            flex
            items-center
            justify-center
            bg-black/75
            p-5
            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !procesandoCuentaId
            ) {
              setCuentaParaArchivar(null);
            }
          }}
        >
          <section
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[28px]
              border-2
              border-amber-500/30
              bg-[#080c14]/98
              shadow-[0_34px_120px_rgba(0,0,0,0.78)]
            "
          >
            <div className="border-b border-white/[0.09] px-7 py-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-amber-500/30
                    bg-amber-500/10
                    text-amber-300
                  "
                >
                  <Icon name="archive" className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-white">
                    Archivar cuenta
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    La cuenta dejará de aparecer entre tus cuentas
                    activas, pero conservará todos sus movimientos.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-7 py-6">
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.10]
                  bg-white/[0.04]
                  p-5
                "
              >
                <p className="truncate text-lg font-black text-white">
                  {cuentaParaArchivar.nombre}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Saldo conservado
                    </p>

                    <p
                      className={`
                        mt-2
                        text-2xl
                        font-black
                        ${
                          Number(cuentaParaArchivar.saldo_actual) >= 0
                            ? "text-emerald-300"
                            : "text-red-300"
                        }
                      `}
                    >
                      {formatearDinero(
                        cuentaParaArchivar.saldo_actual,
                        cuentaParaArchivar.moneda
                      )}
                    </p>
                  </div>

                  <span className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-300">
                    Se puede restaurar
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={Boolean(procesandoCuentaId)}
                  onClick={() => setCuentaParaArchivar(null)}
                  className="
                    h-12
                    flex-1
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-white/[0.05]
                    px-5
                    text-sm
                    font-bold
                    text-slate-300
                    transition
                    hover:bg-white/[0.09]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={Boolean(procesandoCuentaId)}
                  onClick={confirmarArchivado}
                  className="
                    flex
                    h-12
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border-2
                    border-amber-400/30
                    bg-gradient-to-r
                    from-amber-700
                    to-orange-600
                    px-5
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:from-amber-600
                    hover:to-orange-500
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {procesandoCuentaId ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Archivando...
                    </>
                  ) : (
                    <>
                      <Icon name="archive" className="h-4 w-4" />
                      Archivar cuenta
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================
          MODAL ELIMINAR CUENTA
      ====================================================== */}

      {cuentaParaEliminar && (
        <div
          className="
            fixed
            inset-0
            z-[115]
            flex
            items-center
            justify-center
            bg-black/80
            p-5
            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !procesandoCuentaId
            ) {
              setCuentaParaEliminar(null);
            }
          }}
        >
          <section
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[28px]
              border-2
              border-red-500/35
              bg-[#080c14]/98
              shadow-[0_34px_120px_rgba(0,0,0,0.80)]
            "
          >
            <div className="border-b border-white/[0.09] px-7 py-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-500/35
                    bg-red-500/10
                    text-red-300
                  "
                >
                  <Icon name="trash" className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-white">
                    Eliminar cuenta
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    Esta acción es permanente. Solo se permite porque la
                    cuenta no tiene movimientos registrados.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-7 py-6">
              <div
                className="
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/[0.05]
                  p-5
                "
              >
                <p className="truncate text-lg font-black text-white">
                  {cuentaParaEliminar.nombre}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Saldo actual
                    </p>

                    <p
                      className={`
                        mt-2
                        text-2xl
                        font-black
                        ${
                          Number(cuentaParaEliminar.saldo_actual) >= 0
                            ? "text-emerald-300"
                            : "text-red-300"
                        }
                      `}
                    >
                      {formatearDinero(
                          cuentaParaEliminar.saldo_actual,
                          cuentaParaEliminar.moneda
                        )}
                    </p>
                  </div>

                  <span className="rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-300">
                    0 movimientos
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-xs leading-5 text-slate-400">
                  Después de eliminarla no podrás restaurarla.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={Boolean(procesandoCuentaId)}
                  onClick={() => setCuentaParaEliminar(null)}
                  className="
                    h-12
                    flex-1
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-white/[0.05]
                    px-5
                    text-sm
                    font-bold
                    text-slate-300
                    transition
                    hover:bg-white/[0.09]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={Boolean(procesandoCuentaId)}
                  onClick={confirmarEliminacion}
                  className="
                    flex
                    h-12
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border-2
                    border-red-400/35
                    bg-gradient-to-r
                    from-red-700
                    to-rose-600
                    px-5
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:from-red-600
                    hover:to-rose-500
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {procesandoCuentaId === cuentaParaEliminar.id ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Icon name="trash" className="h-4 w-4" />
                      Eliminar definitivamente
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================
          MODAL EDITAR CUENTA
      ====================================================== */}

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
              max-w-lg
              max-h-[calc(100vh-40px)]
              overflow-y-auto
              rounded-[28px]
              border-2
              border-blue-500/25
              bg-[#080c14]/96
              shadow-[0_32px_110px_rgba(0,0,0,0.72)]
            "
          >
            <header
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/[0.09]
                px-6
                py-5
              "
            >
              <div>
                <h2 className="text-xl font-black text-white">
                  Editar cuenta
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Actualiza los datos de la cuenta y su saldo inicial.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarEdicion}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.10]
                  bg-white/[0.05]
                  text-slate-400
                  transition
                  hover:bg-white/[0.09]
                  hover:text-white
                "
              >
                <Icon name="close" />
              </button>
            </header>

            <form
              onSubmit={guardarEdicion}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Nombre
                </label>

                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre de la cuenta"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Tipo
                </label>

                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={inputClass}
                >
                  <option value="Banco">Banco</option>
                  <option value="Billetera">Billetera</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Información de seguridad
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Saldo inicial
                    </p>
                    <p className="mt-1 text-sm font-black text-white">
                      {formatearDinero(
                        editando.saldo_inicial,
                        editando.moneda
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Movimientos
                    </p>
                    <p className="mt-1 text-sm font-black text-white">
                      {editando.cantidad_movimientos ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Estado
                    </p>
                    <p className={`mt-1 text-sm font-black ${
                      puedeEditarSaldoInicial
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }`}>
                      {puedeEditarSaldoInicial
                        ? "Editable"
                        : "Saldo protegido"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-300">
                    Moneda
                  </label>

                  <span
                    className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                      puedeEditarSaldoInicial
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/25 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {puedeEditarSaldoInicial ? "Editable" : "Protegida"}
                  </span>
                </div>

                <select
                  value={monedaEdit}
                  disabled={!puedeEditarSaldoInicial}
                  onChange={(e) => setMonedaEdit(e.target.value)}
                  className={inputClass}
                >
                  {currencyOptions.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label} ({opcion.code})
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {puedeEditarSaldoInicial
                    ? "Puedes cambiarla porque esta cuenta todavía no tiene movimientos."
                    : "La moneda está bloqueada para mantener consistente todo el historial financiero."}
                </p>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-300">
                    Saldo inicial
                  </label>

                  <span
                    className={`
                      rounded-lg
                      border
                      px-2
                      py-1
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.08em]
                      ${
                        puedeEditarSaldoInicial
                          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                          : "border-amber-500/25 bg-amber-500/10 text-amber-300"
                      }
                    `}
                  >
                    {puedeEditarSaldoInicial ? "Editable" : "Bloqueado"}
                  </span>
                </div>

                <input
                  type="number"
                  step="0.01"
                  value={saldoInicialEdit}
                  disabled={!puedeEditarSaldoInicial}
                  onChange={(e) => setSaldoInicialEdit(e.target.value)}
                  placeholder={monedaEdit === "USD" ? "$ 0.00" : "S/ 0.00"}
                  className={inputClass}
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {puedeEditarSaldoInicial
                    ? "Puedes corregirlo porque esta cuenta todavía no tiene movimientos."
                    : "No se puede modificar porque cambiaría el historial y los saldos registrados."}
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-300">
                  Color
                </label>

                <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                  {accountColorOptions.map((color) => {
                    const seleccionado = colorEdit === color;

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setColorEdit(color)}
                        className={`
                          relative
                          h-10
                          rounded-xl
                          border-2
                          transition
                          hover:-translate-y-0.5
                          ${
                            seleccionado
                              ? "border-white shadow-[0_0_0_3px_rgba(255,255,255,0.10)]"
                              : "border-white/[0.10]"
                          }
                        `}
                        style={{ backgroundColor: color }}
                        aria-label={`Elegir color ${color}`}
                      >
                        {seleccionado && (
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white drop-shadow">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-300">
                  Icono
                </label>

                <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                  {accountIconOptions.map((icono) => {
                    const seleccionado = iconoEdit === icono;

                    return (
                      <button
                        key={icono}
                        type="button"
                        onClick={() => setIconoEdit(icono)}
                        className={`
                          flex
                          h-11
                          items-center
                          justify-center
                          rounded-xl
                          border
                          text-lg
                          transition
                          hover:-translate-y-0.5
                          ${
                            seleccionado
                              ? "border-blue-400/50 bg-blue-500/15 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
                              : "border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08]"
                          }
                        `}
                        aria-label={`Elegir icono ${icono}`}
                      >
                        {icono}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.10]
                  bg-white/[0.035]
                  p-4
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    text-lg
                  "
                  style={{
                    borderColor: hexToRgba(colorEdit, 0.48),
                    backgroundColor: hexToRgba(colorEdit, 0.14),
                    color: colorEdit,
                  }}
                >
                  {iconoEdit}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Vista previa
                  </p>

                  <p className="mt-1 truncate text-base font-black text-white">
                    {nombre.trim() || "Nombre de la cuenta"}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {normalizarMoneda(monedaEdit)} · {formatearDinero(
                      Number(saldoInicialEdit || 0),
                      monedaEdit
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={cerrarEdicion}
                  className="
                    h-12
                    flex-1
                    rounded-xl
                    border
                    border-white/[0.10]
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
                    text-white
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
          className={`
            fixed
            bottom-6
            right-6
            z-[120]
            max-w-[calc(100vw-48px)]
            rounded-2xl
            border-2
            bg-[#080c14]/95
            px-5
            py-4
            text-sm
            font-semibold
            text-white
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            backdrop-blur-2xl
            ${
              tipoMensaje === "error"
                ? "border-red-500/35"
                : "border-emerald-500/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span
              className={`
                h-2.5
                w-2.5
                rounded-full
                ${
                  tipoMensaje === "error"
                    ? "bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.75)]"
                    : "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.75)]"
                }
              `}
            />
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cuentas;