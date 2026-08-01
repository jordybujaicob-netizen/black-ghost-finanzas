// BLACK GHOST DASHBOARD MULTIMONEDA — PEN / USD
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "../services/supabase";

import "../styles/dashboard/dashboard.css";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ChartCard from "../components/dashboard/ChartCard";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import RecentMovements from "../components/dashboard/RecentMovements";
import BudgetCard from "../components/dashboard/BudgetCard";


const ZONA_HORARIA = "America/Lima";

const FILTROS = [
  ["dia", "Día"],
  ["semana", "Semana"],
  ["mes", "Mes"],
  ["año", "Año"],
];

const MONEDAS = [
  {
    codigo: "PEN",
    etiqueta: "Soles",
    simbolo: "S/",
  },
  {
    codigo: "USD",
    etiqueta: "Dólares",
    simbolo: "$",
  },
];

const CLAVE_MONEDA_DASHBOARD =
  "black-ghost-dashboard-moneda";


function Icon({
  name,
  className = "h-5 w-5",
}) {
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
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="3"
        />
        <path d="M3 9h18" />
        <path d="M16 13h5" />
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

    savings: (
      <>
        <path d="M5 9a7 7 0 0 1 14 0v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z" />
        <path d="M8 9h8" />
        <path d="M12 5v4" />
        <path d="M9 14h.01" />
        <path d="M15 14h.01" />
      </>
    ),

    activity: (
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    ),

    percentage: (
      <>
        <path d="m19 5-14 14" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),

    tag: (
      <>
        <path d="M20 13 11 22l-9-9V4h9Z" />
        <circle cx="7" cy="9" r="1.5" />
      </>
    ),

    average: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19H2" />
      </>
    ),

    pie: (
      <>
        <path d="M11 3a9 9 0 1 0 10 10h-10Z" />
        <path d="M14 3.5A7.5 7.5 0 0 1 20.5 10H14Z" />
      </>
    ),

    calendar: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="3"
        />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M3 10h18" />
      </>
    ),

    chevronLeft: (
      <path d="m15 18-6-6 6-6" />
    ),

    chevronRight: (
      <path d="m9 18 6-6-6-6" />
    ),

    refresh: (
      <>
        <path d="M20 6v5h-5" />
        <path d="M4 18v-5h5" />
        <path d="M6.1 9a7 7 0 0 1 11.4-2.5L20 11" />
        <path d="M17.9 15a7 7 0 0 1-11.4 2.5L4 13" />
      </>
    ),

    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
}


function InsightCard({
  icon,
  label,
  value,
  detail,
  theme = "red",
}) {
  const themes = {
    red: {
      border:
        "border-red-500/18",

      background:
        "bg-red-500/[0.045]",

      icon:
        "border-red-500/25 bg-red-500/10 text-red-300",

      value:
        "text-red-200",
    },

    green: {
      border:
        "border-emerald-500/18",

      background:
        "bg-emerald-500/[0.045]",

      icon:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",

      value:
        "text-emerald-200",
    },

    purple: {
      border:
        "border-violet-500/18",

      background:
        "bg-violet-500/[0.045]",

      icon:
        "border-violet-500/25 bg-violet-500/10 text-violet-300",

      value:
        "text-violet-200",
    },

    blue: {
      border:
        "border-blue-500/18",

      background:
        "bg-blue-500/[0.045]",

      icon:
        "border-blue-500/25 bg-blue-500/10 text-blue-300",

      value:
        "text-blue-200",
    },
  };

  const styles =
    themes[theme] ||
    themes.red;

  return (
    <article
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[21px]
        border
        p-4
        shadow-[0_16px_48px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
        transition
        duration-300
        hover:-translate-y-0.5

        ${styles.border}
        ${styles.background}
      `}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(125deg,rgba(255,255,255,0.025),transparent_42%)]
        "
      />

      <div
        className="
          relative
          flex
          items-start
          gap-3
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border

            ${styles.icon}
          `}
        >
          <Icon
            name={icon}
            className="h-[18px] w-[18px]"
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate
              text-[9px]
              font-black
              uppercase
              tracking-[0.13em]
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className={`
              mt-1.5
              truncate
              text-lg
              font-black
              tracking-tight

              ${styles.value}
            `}
            title={String(value)}
          >
            {value}
          </p>

          <p
            className="
              mt-1
              truncate
              text-[10px]
              font-medium
              text-slate-600
            "
            title={detail}
          >
            {detail}
          </p>
        </div>
      </div>
    </article>
  );
}


/* =========================================================
   FECHA Y HORA DE PERÚ
   ========================================================= */

function obtenerPartesLima(fecha) {
  const partes =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          ZONA_HORARIA,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hourCycle: "h23",
      }
    ).formatToParts(fecha);

  const resultado = {};

  partes.forEach((parte) => {
    if (
      parte.type !== "literal"
    ) {
      resultado[parte.type] =
        parte.value;
    }
  });

  return resultado;
}


function obtenerFechaActualLima() {
  const partes =
    obtenerPartesLima(
      new Date()
    );

  return new Date(
    Number(partes.year),
    Number(partes.month) - 1,
    Number(partes.day),
    0,
    0,
    0,
    0
  );
}


function convertirFecha(fecha) {
  if (!fecha) {
    return obtenerFechaActualLima();
  }

  if (fecha instanceof Date) {
    return new Date(fecha);
  }

  const [año, mes, dia] =
    String(fecha)
      .slice(0, 10)
      .split("-")
      .map(Number);

  return new Date(
    año,
    mes - 1,
    dia,
    0,
    0,
    0,
    0
  );
}


/*
  Los campos fecha y hora fueron guardados
  utilizando UTC.

  Convertimos el instante UTC a la fecha y hora
  equivalente en America/Lima.
*/

function convertirFechaMovimiento(
  movimiento
) {
  if (!movimiento?.fecha) {
    return new Date(0);
  }

  const fechaTexto =
    String(
      movimiento.fecha
    ).slice(0, 10);

  const horaTexto =
    String(
      movimiento.hora ||
      "00:00:00"
    );

  const coincidencia =
    horaTexto.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?/
    );

  const hora =
    Number(
      coincidencia?.[1] || 0
    );

  const minuto =
    Number(
      coincidencia?.[2] || 0
    );

  const segundo =
    Number(
      coincidencia?.[3] || 0
    );

  const [
    año,
    mes,
    dia,
  ] = fechaTexto
    .split("-")
    .map(Number);

  const instanteUTC =
    new Date(
      Date.UTC(
        año,
        mes - 1,
        dia,
        hora,
        minuto,
        segundo,
        0
      )
    );

  const partes =
    obtenerPartesLima(
      instanteUTC
    );

  return new Date(
    Number(partes.year),
    Number(partes.month) - 1,
    Number(partes.day),
    Number(partes.hour),
    Number(partes.minute),
    Number(partes.second),
    0
  );
}


function inicioDelDia(fecha) {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    0,
    0,
    0,
    0
  );
}


function finalDelDia(fecha) {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    23,
    59,
    59,
    999
  );
}


function inicioSemana(fecha) {
  const resultado =
    inicioDelDia(fecha);

  const diaSemana =
    resultado.getDay();

  const diferencia =
    diaSemana === 0
      ? 6
      : diaSemana - 1;

  resultado.setDate(
    resultado.getDate() -
      diferencia
  );

  return resultado;
}


function fechaParaInput(fecha) {
  const año =
    fecha.getFullYear();

  const mes = String(
    fecha.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    fecha.getDate()
  ).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}


function formatearFechaCorta(fecha) {
  return fecha.toLocaleDateString(
    "es-PE",
    {
      day: "2-digit",
      month: "short",
    }
  );
}


function formatearRelacion(relacion) {
  if (Array.isArray(relacion)) {
    return relacion[0] || null;
  }

  return relacion || null;
}


function normalizarMoneda(valor) {
  return String(valor || "PEN")
    .trim()
    .toUpperCase() === "USD"
    ? "USD"
    : "PEN";
}


function simboloMoneda(moneda) {
  return normalizarMoneda(moneda) === "USD"
    ? "$"
    : "S/";
}


function formatearDinero(
  valor,
  moneda = "PEN"
) {
  const numero = Number(valor || 0);

  const monto = new Intl.NumberFormat(
    "es-PE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    Number.isFinite(numero)
      ? numero
      : 0
  );

  return `${simboloMoneda(moneda)} ${monto}`;
}


function obtenerMonedaMovimiento(
  movimiento
) {
  const cuenta = formatearRelacion(
    movimiento?.cuentas
  );

  return normalizarMoneda(
    cuenta?.moneda
  );
}


function esTransferencia(
  movimiento
) {
  if (
    movimiento?.transferencia_id
  ) {
    return true;
  }

  const descripcion =
    String(
      movimiento?.descripcion || ""
    )
      .trim()
      .toLowerCase();

  return descripcion.startsWith(
    "transferencia"
  );
}


/* =========================================================
   PERIODOS
   ========================================================= */

function obtenerPeriodo(
  filtro,
  fechaSeleccionada
) {
  const fechaBase = new Date(
    fechaSeleccionada
  );

  const año =
    fechaBase.getFullYear();

  const mes =
    fechaBase.getMonth();

  let inicio;
  let fin;
  let etiqueta;
  let bloques = [];
  let puntoInicial = null;


  if (filtro === "dia") {
    inicio =
      inicioDelDia(fechaBase);

    fin =
      finalDelDia(fechaBase);

    etiqueta =
      fechaBase.toLocaleDateString(
        "es-PE",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

    puntoInicial = "00:00";

    /*
      Los datos se agrupan así:

      00:00 - 03:59  -> punto 04:00
      04:00 - 07:59  -> punto 08:00
      08:00 - 11:59  -> punto 12:00
      12:00 - 15:59  -> punto 16:00
      16:00 - 19:59  -> punto 20:00
      20:00 - 23:59  -> punto 24:00
    */

    bloques = Array.from(
      {
        length: 6,
      },
      (_, indice) => {
        const horaInicio =
          indice * 4;

        const horaFinal =
          (indice + 1) * 4;

        const bloqueInicio =
          new Date(
            año,
            mes,
            fechaBase.getDate(),
            horaInicio,
            0,
            0,
            0
          );

        const bloqueFin =
          horaFinal === 24
            ? finalDelDia(fechaBase)
            : new Date(
                año,
                mes,
                fechaBase.getDate(),
                horaFinal,
                0,
                0,
                -1
              );

        return {
          inicio: bloqueInicio,
          fin: bloqueFin,

          etiqueta: `${String(
            horaFinal
          ).padStart(2, "0")}:00`,
        };
      }
    );
  }


  if (filtro === "semana") {
    inicio =
      inicioSemana(fechaBase);

    fin =
      new Date(inicio);

    fin.setDate(
      inicio.getDate() + 6
    );

    fin =
      finalDelDia(fin);

    etiqueta = `${formatearFechaCorta(
      inicio
    )} – ${formatearFechaCorta(
      fin
    )}`;

    bloques = Array.from(
      {
        length: 7,
      },
      (_, indice) => {
        const fecha =
          new Date(inicio);

        fecha.setDate(
          inicio.getDate() +
          indice
        );

        return {
          inicio:
            inicioDelDia(fecha),

          fin:
            finalDelDia(fecha),

          etiqueta:
            fecha.toLocaleDateString(
              "es-PE",
              {
                weekday: "short",
              }
            ),
        };
      }
    );
  }


  if (filtro === "mes") {
    inicio = new Date(
      año,
      mes,
      1,
      0,
      0,
      0,
      0
    );

    fin = new Date(
      año,
      mes + 1,
      0,
      23,
      59,
      59,
      999
    );

    etiqueta =
      fechaBase.toLocaleDateString(
        "es-PE",
        {
          month: "long",
          year: "numeric",
        }
      );

    const cantidadDias =
      fin.getDate();

    bloques = Array.from(
      {
        length: cantidadDias,
      },
      (_, indice) => {
        const fecha =
          new Date(
            año,
            mes,
            indice + 1
          );

        return {
          inicio:
            inicioDelDia(fecha),

          fin:
            finalDelDia(fecha),

          etiqueta: String(
            indice + 1
          ).padStart(2, "0"),
        };
      }
    );
  }


  if (filtro === "año") {
    inicio = new Date(
      año,
      0,
      1,
      0,
      0,
      0,
      0
    );

    fin = new Date(
      año,
      11,
      31,
      23,
      59,
      59,
      999
    );

    etiqueta =
      String(año);

    bloques = Array.from(
      {
        length: 12,
      },
      (_, indice) => {
        const bloqueInicio =
          new Date(
            año,
            indice,
            1,
            0,
            0,
            0,
            0
          );

        const bloqueFin =
          new Date(
            año,
            indice + 1,
            0,
            23,
            59,
            59,
            999
          );

        return {
          inicio:
            bloqueInicio,

          fin:
            bloqueFin,

          etiqueta:
            bloqueInicio.toLocaleDateString(
              "es-PE",
              {
                month: "short",
              }
            ),
        };
      }
    );
  }


  return {
    inicio,
    fin,
    etiqueta,
    bloques,
    puntoInicial,
  };
}


function moverFechaPeriodo(
  fecha,
  filtro,
  direccion
) {
  const actual =
    new Date(fecha);

  if (filtro === "dia") {
    actual.setDate(
      actual.getDate() +
      direccion
    );

    return actual;
  }

  if (filtro === "semana") {
    actual.setDate(
      actual.getDate() +
      direccion * 7
    );

    return actual;
  }

  if (filtro === "mes") {
    const año =
      actual.getFullYear();

    const mesObjetivo =
      actual.getMonth() +
      direccion;

    const ultimoDia =
      new Date(
        año,
        mesObjetivo + 1,
        0
      ).getDate();

    const dia = Math.min(
      actual.getDate(),
      ultimoDia
    );

    return new Date(
      año,
      mesObjetivo,
      dia
    );
  }

  const añoObjetivo =
    actual.getFullYear() +
    direccion;

  const mes =
    actual.getMonth();

  const ultimoDia =
    new Date(
      añoObjetivo,
      mes + 1,
      0
    ).getDate();

  const dia = Math.min(
    actual.getDate(),
    ultimoDia
  );

  return new Date(
    añoObjetivo,
    mes,
    dia
  );
}


function movimientoEnRango(
  movimiento,
  inicio,
  fin
) {
  const fecha =
    convertirFechaMovimiento(
      movimiento
    );

  return (
    fecha >= inicio &&
    fecha <= fin
  );
}


function sumarMovimientos(
  movimientos,
  tipo
) {
  return movimientos
    .filter(
      (movimiento) =>
        movimiento.tipo === tipo
    )
    .reduce(
      (total, movimiento) =>
        total +
        Number(
          movimiento.monto || 0
        ),
      0
    );
}


function calcularMovimientoNeto(
  movimientos
) {
  return movimientos.reduce(
    (total, movimiento) => {
      const monto =
        Number(
          movimiento.monto || 0
        );

      if (
        movimiento.tipo ===
        "INGRESO"
      ) {
        return total + monto;
      }

      if (
        movimiento.tipo ===
        "GASTO"
      ) {
        return total - monto;
      }

      return total;
    },
    0
  );
}


function calcularResumen(
  movimientos
) {
  const ingresos =
    sumarMovimientos(
      movimientos,
      "INGRESO"
    );

  const gastos =
    sumarMovimientos(
      movimientos,
      "GASTO"
    );

  const ahorro =
    ingresos - gastos;

  const tasaAhorro =
    ingresos > 0
      ? (
          ahorro /
          ingresos
        ) * 100
      : gastos > 0
        ? -100
        : 0;

  return {
    ingresos,
    gastos,
    ahorro,
    tasaAhorro,
  };
}


function porcentajeCambio(
  actual,
  anterior
) {
  const valorActual =
    Number(actual || 0);

  const valorAnterior =
    Number(anterior || 0);

  if (
    valorActual === 0 &&
    valorAnterior === 0
  ) {
    return 0;
  }

  if (valorAnterior === 0) {
    return valorActual > 0
      ? 100
      : -100;
  }

  const porcentaje =
    (
      (
        valorActual -
        valorAnterior
      ) /
      Math.abs(
        valorAnterior
      )
    ) * 100;

  return Math.max(
    -999,
    Math.min(
      999,
      porcentaje
    )
  );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  const [usuario, setUsuario] =
    useState(null);

  const [nombre, setNombre] =
    useState("");

  const [cuentas, setCuentas] =
    useState([]);

  const [
    movimientos,
    setMovimientos,
  ] = useState([]);

  const [moneda, setMoneda] =
    useState(() => {
      const monedaGuardada =
        window.localStorage.getItem(
          CLAVE_MONEDA_DASHBOARD
        );

      return normalizarMoneda(
        monedaGuardada
      );
    });

  const monedaInicializada =
    useRef(false);

  const [filtro, setFiltro] =
    useState("mes");

  const [
    fechaSeleccionada,
    setFechaSeleccionada,
  ] = useState(
    () => obtenerFechaActualLima()
  );

  const [cargando, setCargando] =
    useState(true);

  const [
    sincronizando,
    setSincronizando,
  ] = useState(false);

  const [error, setError] =
    useState("");


  const cargarDatos =
    useCallback(
      async (
        modo = "inicial"
      ) => {
        if (
          modo === "inicial"
        ) {
          setCargando(true);
        }

        if (
          modo === "manual"
        ) {
          setSincronizando(true);
        }

        setError("");

        try {
          const {
            data: {
              user,
            },
            error:
              errorUsuario,
          } =
            await supabase.auth.getUser();

          if (
            errorUsuario ||
            !user
          ) {
            throw new Error(
              "No existe una sesión activa."
            );
          }

          setUsuario(user);

          const [
            resultadoCuentas,
            resultadoMovimientos,
            resultadoPerfil,
          ] = await Promise.all([
            supabase
              .from("cuentas")
              .select("*")
              .eq(
                "usuario_id",
                user.id
              ),

            supabase
              .from("movimientos")
              .select(`
                id,
                cuenta_id,
                tipo,
                monto,
                descripcion,
                fecha,
                hora,
                transferencia_id,
                categorias(
                  nombre,
                  color
                ),
                cuentas(
                  nombre,
                  moneda
                )
              `)
              .eq(
                "usuario_id",
                user.id
              )
              .order(
                "fecha",
                {
                  ascending:
                    false,
                }
              )
              .order(
                "hora",
                {
                  ascending:
                    false,
                }
              ),

            supabase
              .from("perfiles")
              .select(`
                nombre,
                moneda_principal
              `)
              .eq(
                "id",
                user.id
              )
              .maybeSingle(),
          ]);

          if (
            resultadoCuentas.error
          ) {
            throw resultadoCuentas.error;
          }

          if (
            resultadoMovimientos.error
          ) {
            throw resultadoMovimientos.error;
          }

          if (
            resultadoPerfil.error
          ) {
            throw resultadoPerfil.error;
          }

          setCuentas(
            resultadoCuentas.data ||
            []
          );

          setMovimientos(
            resultadoMovimientos.data ||
            []
          );

          setNombre(
            resultadoPerfil.data
              ?.nombre ||
            user.user_metadata
              ?.nombre ||
            user.user_metadata
              ?.full_name ||
            ""
          );

          if (
            !monedaInicializada.current
          ) {
            const monedaGuardada =
              window.localStorage.getItem(
                CLAVE_MONEDA_DASHBOARD
              );

            const monedaInicial =
              monedaGuardada
                ? normalizarMoneda(
                    monedaGuardada
                  )
                : normalizarMoneda(
                    resultadoPerfil.data
                      ?.moneda_principal
                  );

            setMoneda(
              monedaInicial
            );

            monedaInicializada.current =
              true;
          }
        } catch (errorCarga) {
          console.error(
            "Error cargando dashboard:",
            errorCarga
          );

          setError(
            "No se pudo cargar la información financiera."
          );
        } finally {
          setCargando(false);
          setSincronizando(false);
        }
      },
      []
    );


  useEffect(() => {
    cargarDatos("inicial");
  }, [cargarDatos]);


  /*
    Actualización automática:

    - Cambios en movimientos.
    - Cambios en cuentas.
    - Regreso a la pestaña.
    - Regreso desde otra ventana.
  */

  useEffect(() => {
    if (!usuario?.id) {
      return undefined;
    }

    let temporizador = null;

    function actualizarSilenciosamente() {
      window.clearTimeout(
        temporizador
      );

      temporizador =
        window.setTimeout(
          () => {
            cargarDatos(
              "silencioso"
            );
          },
          250
        );
    }


    const canal =
      supabase
        .channel(
          `dashboard-${usuario.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "movimientos",

            filter:
              `usuario_id=eq.${usuario.id}`,
          },
          actualizarSilenciosamente
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "cuentas",

            filter:
              `usuario_id=eq.${usuario.id}`,
          },
          actualizarSilenciosamente
        )
        .subscribe();


    function comprobarVisibilidad() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        actualizarSilenciosamente();
      }
    }


    window.addEventListener(
      "focus",
      actualizarSilenciosamente
    );

    document.addEventListener(
      "visibilitychange",
      comprobarVisibilidad
    );


    return () => {
      window.clearTimeout(
        temporizador
      );

      window.removeEventListener(
        "focus",
        actualizarSilenciosamente
      );

      document.removeEventListener(
        "visibilitychange",
        comprobarVisibilidad
      );

      supabase.removeChannel(
        canal
      );
    };
  }, [
    usuario?.id,
    cargarDatos,
  ]);


  const periodo = useMemo(
    () =>
      obtenerPeriodo(
        filtro,
        fechaSeleccionada
      ),
    [
      filtro,
      fechaSeleccionada,
    ]
  );


  const fechaPeriodoAnterior =
    useMemo(
      () =>
        moverFechaPeriodo(
          fechaSeleccionada,
          filtro,
          -1
        ),
      [
        fechaSeleccionada,
        filtro,
      ]
    );


  const periodoAnterior =
    useMemo(
      () =>
        obtenerPeriodo(
          filtro,
          fechaPeriodoAnterior
        ),
      [
        filtro,
        fechaPeriodoAnterior,
      ]
    );


  const movimientosMonedaSeleccionada =
    useMemo(
      () =>
        movimientos.filter(
          (movimiento) =>
            obtenerMonedaMovimiento(
              movimiento
            ) === moneda
        ),
      [movimientos, moneda]
    );


  const movimientosReales =
    useMemo(
      () =>
        movimientosMonedaSeleccionada.filter(
          (movimiento) =>
            !esTransferencia(
              movimiento
            )
        ),
      [movimientosMonedaSeleccionada]
    );


  const movimientosFiltrados =
    useMemo(
      () =>
        movimientosMonedaSeleccionada.filter(
          (movimiento) =>
            movimientoEnRango(
              movimiento,
              periodo.inicio,
              periodo.fin
            )
        ),
      [
        movimientosMonedaSeleccionada,
        periodo,
      ]
    );


  const movimientosRealesFiltrados =
    useMemo(
      () =>
        movimientosReales.filter(
          (movimiento) =>
            movimientoEnRango(
              movimiento,
              periodo.inicio,
              periodo.fin
            )
        ),
      [
        movimientosReales,
        periodo,
      ]
    );


  const movimientosPeriodoAnterior =
    useMemo(
      () =>
        movimientosReales.filter(
          (movimiento) =>
            movimientoEnRango(
              movimiento,
              periodoAnterior.inicio,
              periodoAnterior.fin
            )
        ),
      [
        movimientosReales,
        periodoAnterior,
      ]
    );


  const resumen = useMemo(
    () =>
      calcularResumen(
        movimientosRealesFiltrados
      ),
    [
      movimientosRealesFiltrados,
    ]
  );


  const resumenAnterior =
    useMemo(
      () =>
        calcularResumen(
          movimientosPeriodoAnterior
        ),
      [
        movimientosPeriodoAnterior,
      ]
    );


  /*
    El patrimonio se calcula desde el saldo inicial y todos los
    movimientos de cada cuenta. No usamos cuentas.saldo_actual
    porque ese campo puede quedar desactualizado cuando se registra
    un ingreso o gasto directamente en la tabla movimientos.
  */

  const patrimonioActual =
    useMemo(() => {
      const variacionPorCuenta =
        movimientos.reduce(
          (acumulado, movimiento) => {
            const cuentaId =
              movimiento.cuenta_id;

            if (!cuentaId) {
              return acumulado;
            }

            const monto = Number(
              movimiento.monto || 0
            );

            const variacion =
              movimiento.tipo === "INGRESO"
                ? monto
                : movimiento.tipo === "GASTO"
                  ? -monto
                  : 0;

            acumulado[cuentaId] =
              Number(
                acumulado[cuentaId] || 0
              ) + variacion;

            return acumulado;
          },
          {}
        );

      return cuentas
        .filter(
          (cuenta) =>
            cuenta.activo !== false &&
            !cuenta.archivado_en &&
            normalizarMoneda(
              cuenta.moneda
            ) === moneda
        )
        .reduce(
          (total, cuenta) => {
            const saldoInicial = Number(
              cuenta.saldo_inicial || 0
            );

            const variacion = Number(
              variacionPorCuenta[cuenta.id] || 0
            );

            return total +
              saldoInicial +
              variacion;
          },
          0
        );
    }, [
      cuentas,
      movimientos,
      moneda,
    ]);


  const gastosCategoria =
    useMemo(() => {
      const agrupadas = {};

      movimientosRealesFiltrados
        .filter(
          (movimiento) =>
            movimiento.tipo ===
            "GASTO"
        )
        .forEach(
          (movimiento) => {
            const relacionCategoria =
              formatearRelacion(
                movimiento.categorias
              );

            const nombreCategoria =
              relacionCategoria
                ?.nombre ||
              "Sin categoría";

            const colorCategoria =
              relacionCategoria
                ?.color ||
              "#ef4444";

            if (
              !agrupadas[
                nombreCategoria
              ]
            ) {
              agrupadas[
                nombreCategoria
              ] = {
                nombre:
                  nombreCategoria,

                total: 0,

                color:
                  colorCategoria,
              };
            }

            agrupadas[
              nombreCategoria
            ].total +=
              Number(
                movimiento.monto ||
                0
              );
          }
        );

      const ordenadas =
        Object.values(
          agrupadas
        ).sort(
          (a, b) =>
            b.total -
            a.total
        );

      if (
        ordenadas.length <= 7
      ) {
        return ordenadas;
      }

      const principales =
        ordenadas.slice(
          0,
          6
        );

      const restantes =
        ordenadas.slice(6);

      const totalRestantes =
        restantes.reduce(
          (
            total,
            categoria
          ) =>
            total +
            categoria.total,
          0
        );

      return [
        ...principales,

        {
          nombre:
            "Otras categorías",

          total:
            totalRestantes,

          color:
            "#64748b",
        },
      ];
    }, [
      movimientosRealesFiltrados,
    ]);


  const series = useMemo(() => {
    const datosBloques =
      periodo.bloques.map(
        (bloque) => {
          /*
            Ingresos y gastos excluyen transferencias. El patrimonio,
            en cambio, sí considera todas las entradas y salidas de la
            moneda seleccionada. Así una conversión USD → PEN reduce
            el patrimonio USD y aumenta el patrimonio PEN sin tratarla
            como ingreso o gasto real.
          */

          const movimientosRealesBloque =
            movimientosReales.filter(
              (movimiento) =>
                movimientoEnRango(
                  movimiento,
                  bloque.inicio,
                  bloque.fin
                )
            );

          const movimientosPatrimonioBloque =
            movimientosMonedaSeleccionada.filter(
              (movimiento) =>
                movimientoEnRango(
                  movimiento,
                  bloque.inicio,
                  bloque.fin
                )
            );

          const ingresos =
            sumarMovimientos(
              movimientosRealesBloque,
              "INGRESO"
            );

          const gastos =
            sumarMovimientos(
              movimientosRealesBloque,
              "GASTO"
            );

          return {
            fecha:
              bloque.etiqueta,

            ingresos,
            gastos,

            variacionPatrimonio:
              calcularMovimientoNeto(
                movimientosPatrimonioBloque
              ),
          };
        }
      );


    const movimientosDesdeInicio =
      movimientosMonedaSeleccionada.filter(
        (movimiento) =>
          convertirFechaMovimiento(
            movimiento
          ) >= periodo.inicio
      );

    const patrimonioInicial =
      patrimonioActual -
      calcularMovimientoNeto(
        movimientosDesdeInicio
      );

    let patrimonioAcumulado =
      patrimonioInicial;


    const patrimonio = [];
    const ingresos = [];
    const gastos = [];


    /*
      En vista diaria añadimos el punto inicial
      00:00 y los bloques terminan en 24:00.
    */

    if (
      filtro === "dia" &&
      periodo.puntoInicial
    ) {
      patrimonio.push({
        fecha:
          periodo.puntoInicial,

        valor: Number(
          patrimonioInicial.toFixed(
            2
          )
        ),
      });

      ingresos.push({
        fecha:
          periodo.puntoInicial,

        valor: 0,
      });

      gastos.push({
        fecha:
          periodo.puntoInicial,

        valor: 0,
      });
    }


    datosBloques.forEach(
      (bloque) => {
        patrimonioAcumulado +=
          bloque.variacionPatrimonio;

        patrimonio.push({
          fecha:
            bloque.fecha,

          valor: Number(
            patrimonioAcumulado.toFixed(
              2
            )
          ),
        });

        ingresos.push({
          fecha:
            bloque.fecha,

          valor: Number(
            bloque.ingresos.toFixed(
              2
            )
          ),
        });

        gastos.push({
          fecha:
            bloque.fecha,

          valor: Number(
            bloque.gastos.toFixed(
              2
            )
          ),
        });
      }
    );


    return {
      patrimonio,
      ingresos,
      gastos,
      patrimonioInicial,
    };
  }, [
    filtro,
    periodo,
    movimientosReales,
    movimientosMonedaSeleccionada,
    patrimonioActual,
  ]);


  const categoriaPrincipal =
    gastosCategoria[0] || null;


  const cantidadGastos =
    movimientosRealesFiltrados.filter(
      (movimiento) =>
        movimiento.tipo ===
        "GASTO"
    ).length;


  const cantidadTransferencias =
    movimientosFiltrados.filter(
      esTransferencia
    ).length;


  const promedioGasto =
    cantidadGastos > 0
      ? resumen.gastos /
        cantidadGastos
      : 0;


  const progresoGastos =
    resumen.ingresos > 0
      ? (
          resumen.gastos /
          resumen.ingresos
        ) * 100
      : resumen.gastos > 0
        ? 101
        : 0;


  const patrimonioPeriodoFinal =
    series.patrimonio.length > 0
      ? series.patrimonio[
          series.patrimonio.length -
          1
        ].valor
      : patrimonioActual;


  const variacionPatrimonio =
    series.patrimonioInicial !== 0
      ? (
          resumen.ahorro /
          Math.abs(
            series.patrimonioInicial
          )
        ) * 100
      : resumen.ahorro === 0
        ? 0
        : resumen.ahorro > 0
          ? 100
          : -100;


  const comparaciones =
    useMemo(() => {
      const ingresos =
        porcentajeCambio(
          resumen.ingresos,
          resumenAnterior.ingresos
        );

      const cambioGastos =
        porcentajeCambio(
          resumen.gastos,
          resumenAnterior.gastos
        );

      const ahorro =
        porcentajeCambio(
          resumen.ahorro,
          resumenAnterior.ahorro
        );

      return {
        ingresos,

        /*
          Gastar menos es una mejora positiva.
        */

        gastos:
          -cambioGastos,

        ahorro,

        patrimonio:
          Math.max(
            -999,
            Math.min(
              999,
              variacionPatrimonio
            )
          ),
      };
    }, [
      resumen,
      resumenAnterior,
      variacionPatrimonio,
    ]);


  function formatearMoneda(
    valor,
    monedaObjetivo = moneda
  ) {
    return formatearDinero(
      valor,
      monedaObjetivo
    );
  }


  function cambiarMoneda(
    nuevaMoneda
  ) {
    const monedaNormalizada =
      normalizarMoneda(
        nuevaMoneda
      );

    setMoneda(
      monedaNormalizada
    );

    window.localStorage.setItem(
      CLAVE_MONEDA_DASHBOARD,
      monedaNormalizada
    );
  }


  function cambiarPeriodo(
    direccion
  ) {
    setFechaSeleccionada(
      (fechaActual) =>
        moverFechaPeriodo(
          fechaActual,
          filtro,
          direccion
        )
    );
  }


  function volverHoy() {
    setFechaSeleccionada(
      obtenerFechaActualLima()
    );
  }


  if (cargando) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="animate-pulse space-y-8">
            <div className="h-[210px] rounded-[30px] border border-white/[0.08] bg-white/[0.035]" />

            <div className="flex justify-end">
              <div className="h-12 w-[480px] max-w-full rounded-2xl bg-white/[0.045]" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 rounded-[24px] border border-white/[0.08] bg-white/[0.035]"
                  />
                )
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[390px] rounded-[28px] border border-white/[0.08] bg-white/[0.035]"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <DashboardHeader
          email={usuario?.email}
          nombre={nombre}
          periodo={periodo.etiqueta}
          onRefresh={() =>
            cargarDatos("manual")
          }
          sincronizando={
            sincronizando
          }
        />


        {error && (
          <div
            className="
              mb-6
              flex
              flex-col
              gap-4
              rounded-[22px]
              border
              border-red-500/30
              bg-red-500/[0.08]
              px-5
              py-4
              text-sm
              text-red-200
              shadow-[0_18px_55px_rgba(0,0,0,0.20)]

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <Icon
                name="alert"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-300"
              />

              <div>
                <p className="font-black">
                  Error de sincronización
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/75">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                cargarDatos("manual")
              }
              className="
                flex
                h-10
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                px-4
                text-xs
                font-black
                text-red-200
                transition
                hover:bg-red-500/18
              "
            >
              <Icon
                name="refresh"
                className="h-4 w-4"
              />

              Reintentar
            </button>
          </div>
        )}


        {/* CONTROLES DEL PERIODO */}

        <section
          className="
            relative
            z-20
            mb-6
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.09]
            bg-[#070a11]/62
            p-4
            shadow-[0_20px_65px_rgba(0,0,0,0.22)]
            backdrop-blur-2xl

            sm:p-5
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_8%_10%,rgba(239,68,68,0.11),transparent_30%),linear-gradient(125deg,rgba(255,255,255,0.02),transparent_40%)]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5

              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
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
                  border-red-500/25
                  bg-red-500/10
                  text-red-300
                "
              >
                <Icon
                  name="calendar"
                  className="h-5 w-5"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-slate-600
                  "
                >
                  Periodo seleccionado
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    font-black
                    capitalize
                    text-white
                  "
                  title={
                    periodo.etiqueta
                  }
                >
                  {periodo.etiqueta}
                </p>
              </div>
            </div>


            <div
              className="
                flex
                flex-col
                gap-3

                lg:flex-row
                lg:items-center
                lg:justify-end
              "
            >
              <div
                className="
                  flex
                  h-[47px]
                  overflow-hidden
                  rounded-[13px]
                  border
                  border-white/[0.09]
                  bg-black/30
                "
                aria-label="Moneda del análisis"
              >
                {MONEDAS.map(
                  (opcion) => (
                    <button
                      key={opcion.codigo}
                      type="button"
                      onClick={() =>
                        cambiarMoneda(
                          opcion.codigo
                        )
                      }
                      className={`
                        flex
                        min-w-[112px]
                        items-center
                        justify-center
                        gap-2
                        px-4
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.08em]
                        transition

                        ${
                          moneda === opcion.codigo
                            ? "bg-red-500/14 text-red-200"
                            : "text-slate-500 hover:bg-white/[0.035] hover:text-white"
                        }

                        ${
                          opcion.codigo === "USD"
                            ? "border-l border-white/[0.08]"
                            : ""
                        }
                      `}
                      title={`Analizar en ${opcion.etiqueta}`}
                    >
                      <span className="text-sm">
                        {opcion.simbolo}
                      </span>

                      <span>
                        {opcion.codigo}
                      </span>
                    </button>
                  )
                )}
              </div>


              <div className="dashboard-filter">
                {FILTROS.map(
                  ([valor, texto]) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() =>
                        setFiltro(
                          valor
                        )
                      }
                      className={
                        filtro === valor
                          ? "active"
                          : ""
                      }
                    >
                      {texto}
                    </button>
                  )
                )}
              </div>


              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    cambiarPeriodo(-1)
                  }
                  className="
                    flex
                    h-[47px]
                    w-[47px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    border
                    border-white/[0.09]
                    bg-black/30
                    text-slate-400
                    transition
                    hover:border-red-500/30
                    hover:bg-red-500/[0.08]
                    hover:text-red-300
                  "
                  title="Periodo anterior"
                >
                  <Icon
                    name="chevronLeft"
                    className="h-5 w-5"
                  />
                </button>


                <input
                  type="date"
                  className="date-selector"
                  value={fechaParaInput(
                    fechaSeleccionada
                  )}
                  onChange={(e) => {
                    if (
                      !e.target.value
                    ) {
                      return;
                    }

                    const [
                      año,
                      mes,
                      dia,
                    ] = e.target.value
                      .split("-")
                      .map(Number);

                    setFechaSeleccionada(
                      new Date(
                        año,
                        mes - 1,
                        dia
                      )
                    );
                  }}
                />


                <button
                  type="button"
                  onClick={() =>
                    cambiarPeriodo(1)
                  }
                  className="
                    flex
                    h-[47px]
                    w-[47px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    border
                    border-white/[0.09]
                    bg-black/30
                    text-slate-400
                    transition
                    hover:border-red-500/30
                    hover:bg-red-500/[0.08]
                    hover:text-red-300
                  "
                  title="Periodo siguiente"
                >
                  <Icon
                    name="chevronRight"
                    className="h-5 w-5"
                  />
                </button>


                <button
                  type="button"
                  onClick={volverHoy}
                  className="
                    hidden
                    h-[47px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    border
                    border-red-500/22
                    bg-red-500/[0.07]
                    px-4
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.09em]
                    text-red-300
                    transition
                    hover:border-red-500/35
                    hover:bg-red-500/12

                    sm:flex
                  "
                >
                  Hoy
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* TARJETAS PRINCIPALES */}

        <div className="stats-grid">
          <StatCard
            title="Patrimonio actual"
            value={formatearMoneda(
              patrimonioActual
            )}
            icon={
              <Icon
                name="wallet"
                className="h-6 w-6"
              />
            }
            color="red"
            subtitle={`Saldo de cuentas activas en ${moneda}`}
            badge={moneda}
            trend={{
              value:
                comparaciones.patrimonio,

              label:
                "Variación del periodo",
            }}
          />

          <StatCard
            title="Ingresos"
            value={formatearMoneda(
              resumen.ingresos
            )}
            icon={
              <Icon
                name="income"
                className="h-6 w-6"
              />
            }
            color="green"
            subtitle={`Ingresos reales en ${moneda}`}
            badge={moneda}
            trend={{
              value:
                comparaciones.ingresos,

              label:
                "Vs. periodo anterior",
            }}
          />

          <StatCard
            title="Gastos"
            value={formatearMoneda(
              resumen.gastos
            )}
            icon={
              <Icon
                name="expense"
                className="h-6 w-6"
              />
            }
            color="orange"
            subtitle={`Transferencias excluidas · ${moneda}`}
            badge={moneda}
            trend={{
              value:
                comparaciones.gastos,

              label:
                "Mejora vs. periodo anterior",
            }}
          />

          <StatCard
            title="Ahorro"
            value={formatearMoneda(
              resumen.ahorro
            )}
            icon={
              <Icon
                name="savings"
                className="h-6 w-6"
              />
            }
            color={
              resumen.ahorro >= 0
                ? "purple"
                : "red"
            }
            subtitle={`Ingresos menos gastos en ${moneda}`}
            badge={
              resumen.ahorro >= 0
                ? "Positivo"
                : "Déficit"
            }
            trend={{
              value:
                comparaciones.ahorro,

              label:
                "Vs. periodo anterior",
            }}
          />
        </div>


        {/* INDICADORES RÁPIDOS */}

        <section
          className="
            mb-6
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <InsightCard
            icon="activity"
            label="Movimientos reales"
            value={
              movimientosRealesFiltrados.length
            }
            detail={`${cantidadTransferencias} transferencias excluidas`}
            theme="blue"
          />

          <InsightCard
            icon="percentage"
            label="Tasa de ahorro"
            value={`${resumen.tasaAhorro.toFixed(
              1
            )}%`}
            detail="Porcentaje del ingreso conservado"
            theme={
              resumen.tasaAhorro >= 0
                ? "green"
                : "red"
            }
          />

          <InsightCard
            icon="tag"
            label="Mayor categoría"
            value={
              categoriaPrincipal?.nombre ||
              "Sin gastos"
            }
            detail={
              categoriaPrincipal
                ? formatearMoneda(
                    categoriaPrincipal.total
                  )
                : "Sin consumo registrado"
            }
            theme="red"
          />

          <InsightCard
            icon="average"
            label="Promedio por gasto"
            value={formatearMoneda(
              promedioGasto
            )}
            detail={`${cantidadGastos} gastos registrados`}
            theme="purple"
          />
        </section>


        {movimientosRealesFiltrados.length ===
          0 && (
          <section
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-[22px]
              border
              border-amber-500/20
              bg-amber-500/[0.055]
              px-5
              py-4
              shadow-[0_16px_45px_rgba(0,0,0,0.16)]
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-amber-500/25
                bg-amber-500/10
                text-amber-300
              "
            >
              <Icon
                name="activity"
                className="h-4 w-4"
              />
            </div>

            <div>
              <p className="text-sm font-black text-amber-200">
                No hay ingresos ni gastos en este periodo
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Los gráficos mostrarán valores en cero para {moneda} y el
                patrimonio de esta moneda permanecerá constante hasta que
                registres nuevos movimientos.
              </p>
            </div>
          </section>
        )}


        {/* GRÁFICOS */}

        <div className="charts-grid">
          <ChartCard
            title="Evolución patrimonio"
            icon={
              <Icon
                name="wallet"
                className="h-5 w-5"
              />
            }
            height="290px"
            accent="red"
            badge="Acumulado"
            subtitle="Comportamiento del patrimonio dentro del periodo"
            value={formatearMoneda(
              patrimonioPeriodoFinal
            )}
          >
            <ExpenseChart
              data={
                series.patrimonio
              }
              color="#ef4444"
              nombre="Patrimonio"
              moneda={moneda}
            />
          </ChartCard>


          <ChartCard
            title="Gastos por categoría"
            icon={
              <Icon
                name="pie"
                className="h-5 w-5"
              />
            }
            height="290px"
            accent="purple"
            badge="Distribución"
            subtitle="Participación de cada categoría en el gasto"
            value={formatearMoneda(
              resumen.gastos
            )}
          >
            <ExpensePieChart
              data={
                gastosCategoria
              }
              moneda={moneda}
            />
          </ChartCard>


          <ChartCard
            title="Evolución ingresos"
            icon={
              <Icon
                name="income"
                className="h-5 w-5"
              />
            }
            height="290px"
            accent="green"
            badge="Ingresos"
            subtitle="Ingresos registrados en cada intervalo"
            value={formatearMoneda(
              resumen.ingresos
            )}
          >
            <ExpenseChart
              data={
                series.ingresos
              }
              color="#22c55e"
              nombre="Ingresos"
              moneda={moneda}
            />
          </ChartCard>


          <ChartCard
            title="Evolución gastos"
            icon={
              <Icon
                name="expense"
                className="h-5 w-5"
              />
            }
            height="290px"
            accent="orange"
            badge="Gastos"
            subtitle="Gastos reales registrados en cada intervalo"
            value={formatearMoneda(
              resumen.gastos
            )}
          >
            <ExpenseChart
              data={
                series.gastos
              }
              color="#f97316"
              nombre="Gastos"
              moneda={moneda}
            />
          </ChartCard>
        </div>


        {/* MOVIMIENTOS Y RESUMEN */}

        <div className="bottom-grid">
          <RecentMovements
            movimientos={
              movimientosFiltrados.slice(
                0,
                8
              )
            }
            moneda={moneda}
            maxHeight="540px"
          />

          <BudgetCard
            title="Resumen financiero"
            value={formatearMoneda(
              resumen.ahorro
            )}
            progress={
              progresoGastos
            }
            moneda={moneda}
            periodo={
              periodo.etiqueta
            }
            ingresos={
              resumen.ingresos
            }
            gastos={
              resumen.gastos
            }
            tasaAhorro={
              resumen.tasaAhorro
            }
            movimientos={
              movimientosRealesFiltrados.length
            }
            categoriaPrincipal={
              categoriaPrincipal?.nombre ||
              "Sin gastos"
            }
          />
        </div>
      </div>
    </div>
  );
}


export default Dashboard;