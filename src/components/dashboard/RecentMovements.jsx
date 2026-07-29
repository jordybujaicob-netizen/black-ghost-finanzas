import { Link } from "react-router-dom";


const ZONA_HORARIA = "America/Lima";


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
    card: (
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

    transfer: (
      <>
        <path d="M4 7h14" />
        <path d="m14 3 4 4-4 4" />
        <path d="M20 17H6" />
        <path d="m10 13-4 4 4 4" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),

    calendar: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
        />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
      </>
    ),

    tag: (
      <>
        <path d="M20 13 11 22l-9-9V4h9Z" />
        <circle
          cx="7"
          cy="9"
          r="1.5"
        />
      </>
    ),

    wallet: (
      <>
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6.5A2.5 2.5 0 0 1 4 16.5Z" />
        <path d="M4 9h16" />
        <path d="M16 13h4" />
      </>
    ),

    empty: (
      <>
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="4"
        />
        <path d="M8 12h8" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
}


function obtenerRelacion(relacion) {
  if (Array.isArray(relacion)) {
    return relacion[0] || null;
  }

  return relacion || null;
}


/*
  Supabase está guardando fecha y hora en UTC.

  Ejemplo:
  29/07/2026 03:15 UTC
  equivale a:
  28/07/2026 22:15 en Perú.
*/

function convertirMovimientoAFechaLocal(
  movimiento
) {
  if (!movimiento?.fecha) {
    return null;
  }

  const fecha = String(
    movimiento.fecha
  ).slice(0, 10);

  const horaOriginal = String(
    movimiento.hora ||
      "00:00:00"
  );

  const coincidencia =
    horaOriginal.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?/
    );

  const hora = String(
    Number(
      coincidencia?.[1] || 0
    )
  ).padStart(2, "0");

  const minutos = String(
    Number(
      coincidencia?.[2] || 0
    )
  ).padStart(2, "0");

  const segundos = String(
    Number(
      coincidencia?.[3] || 0
    )
  ).padStart(2, "0");

  const fechaUTC = new Date(
    `${fecha}T${hora}:${minutos}:${segundos}Z`
  );

  if (
    Number.isNaN(
      fechaUTC.getTime()
    )
  ) {
    return null;
  }

  return fechaUTC;
}


function obtenerPartesFecha(fecha) {
  const partes =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          ZONA_HORARIA,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
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


function claveFecha(fecha) {
  const partes =
    obtenerPartesFecha(fecha);

  return `${partes.year}-${partes.month}-${partes.day}`;
}


function formatearFechaMovimiento(
  movimiento
) {
  const fechaMovimiento =
    convertirMovimientoAFechaLocal(
      movimiento
    );

  if (!fechaMovimiento) {
    return "Fecha no disponible";
  }

  const ahora = new Date();

  const ayer = new Date(
    ahora.getTime() -
      24 * 60 * 60 * 1000
  );

  const claveMovimiento =
    claveFecha(
      fechaMovimiento
    );

  if (
    claveMovimiento ===
    claveFecha(ahora)
  ) {
    return "Hoy";
  }

  if (
    claveMovimiento ===
    claveFecha(ayer)
  ) {
    return "Ayer";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      timeZone:
        ZONA_HORARIA,

      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(fechaMovimiento);
}


function formatearHoraMovimiento(
  movimiento
) {
  const fechaMovimiento =
    convertirMovimientoAFechaLocal(
      movimiento
    );

  if (!fechaMovimiento) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      timeZone:
        ZONA_HORARIA,

      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }
  ).format(fechaMovimiento);
}


function formatearMoneda(
  valor,
  moneda = "PEN"
) {
  try {
    return new Intl.NumberFormat(
      "es-PE",
      {
        style: "currency",
        currency: moneda,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(
      Number(valor || 0)
    );
  } catch {
    return `S/ ${Number(
      valor || 0
    ).toFixed(2)}`;
  }
}


function obtenerConfiguracionMovimiento(
  movimiento
) {
  const esTransferencia =
    Boolean(
      movimiento.transferencia_id
    );

  const esIngreso =
    movimiento.tipo ===
    "INGRESO";


  if (esTransferencia) {
    return {
      icono: "transfer",

      titulo:
        esIngreso
          ? "Transferencia recibida"
          : "Transferencia enviada",

      signo:
        esIngreso ? "+" : "−",

      monto:
        esIngreso
          ? "text-blue-300"
          : "text-sky-300",

      iconoClase:
        "border-blue-500/25 bg-blue-500/10 text-blue-300",

      borde:
        "hover:border-blue-500/25",

      fondo:
        "hover:bg-blue-500/[0.035]",

      insignia:
        "border-blue-500/20 bg-blue-500/[0.08] text-blue-300",

      textoInsignia:
        "Transferencia",
    };
  }


  if (esIngreso) {
    return {
      icono: "income",
      titulo: "Ingreso",
      signo: "+",

      monto:
        "text-emerald-300",

      iconoClase:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",

      borde:
        "hover:border-emerald-500/25",

      fondo:
        "hover:bg-emerald-500/[0.035]",

      insignia:
        "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300",

      textoInsignia:
        "Ingreso",
    };
  }


  return {
    icono: "expense",
    titulo: "Gasto",
    signo: "−",

    monto:
      "text-red-300",

    iconoClase:
      "border-red-500/25 bg-red-500/10 text-red-300",

    borde:
      "hover:border-red-500/25",

    fondo:
      "hover:bg-red-500/[0.035]",

    insignia:
      "border-red-500/20 bg-red-500/[0.08] text-red-300",

    textoInsignia:
      "Gasto",
  };
}


function MovimientoItem({
  movimiento,
  moneda,
}) {
  const categoria =
    obtenerRelacion(
      movimiento.categorias
    );

  const cuenta =
    obtenerRelacion(
      movimiento.cuentas
    );

  const configuracion =
    obtenerConfiguracionMovimiento(
      movimiento
    );

  const descripcion =
    movimiento.descripcion?.trim() ||
    configuracion.titulo;

  const fecha =
    formatearFechaMovimiento(
      movimiento
    );

  const hora =
    formatearHoraMovimiento(
      movimiento
    );


  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-[20px]
        border
        border-white/[0.075]
        bg-black/15
        px-4
        py-4
        transition
        duration-300

        ${configuracion.borde}
        ${configuracion.fondo}
      `}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(115deg,rgba(255,255,255,0.018),transparent_35%)]
          opacity-0
          transition
          duration-300
          group-hover:opacity-100
        "
      />


      <div
        className="
          relative
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3.5
          "
        >
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              shadow-[0_14px_34px_rgba(0,0,0,0.22)]
              transition
              duration-300
              group-hover:scale-[1.04]

              ${configuracion.iconoClase}
            `}
          >
            <Icon
              name={
                configuracion.icono
              }
              className="h-5 w-5"
            />
          </div>


          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                min-w-0
                flex-wrap
                items-center
                gap-2
              "
            >
              <h3
                className="
                  max-w-full
                  truncate
                  text-sm
                  font-black
                  text-slate-100

                  sm:text-[15px]
                "
                title={descripcion}
              >
                {descripcion}
              </h3>

              <span
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-2
                  py-0.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.11em]

                  ${configuracion.insignia}
                `}
              >
                {
                  configuracion.textoInsignia
                }
              </span>
            </div>


            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1.5
                text-[10px]
                font-medium
                text-slate-500
              "
            >
              <span
                className="
                  flex
                  min-w-0
                  items-center
                  gap-1.5
                "
              >
                <Icon
                  name="tag"
                  className="h-3.5 w-3.5 shrink-0"
                />

                <span className="max-w-[150px] truncate">
                  {categoria?.nombre ||
                    (movimiento.transferencia_id
                      ? "Transferencia"
                      : "Sin categoría")}
                </span>
              </span>


              <span
                className="
                  flex
                  min-w-0
                  items-center
                  gap-1.5
                "
              >
                <Icon
                  name="wallet"
                  className="h-3.5 w-3.5 shrink-0"
                />

                <span className="max-w-[150px] truncate">
                  {cuenta?.nombre ||
                    "Sin cuenta"}
                </span>
              </span>
            </div>
          </div>
        </div>


        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-t
            border-white/[0.06]
            pt-3

            sm:block
            sm:min-w-[155px]
            sm:border-0
            sm:pt-0
            sm:text-right
          "
        >
          <p
            className={`
              whitespace-nowrap
              text-base
              font-black
              tracking-tight

              sm:text-lg

              ${configuracion.monto}
            `}
          >
            {configuracion.signo}
            {formatearMoneda(
              movimiento.monto,
              moneda
            )}
          </p>


          <div
            className="
              flex
              items-center
              justify-end
              gap-1.5
              text-[10px]
              font-semibold
              text-slate-500

              sm:mt-1.5
            "
          >
            <Icon
              name="calendar"
              className="h-3.5 w-3.5"
            />

            <span>
              {fecha}

              {hora
                ? ` · ${hora}`
                : ""}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}


function RecentMovements({
  movimientos = [],
  moneda = "PEN",
  maxHeight = "470px",
}) {
  return (
    <section
      className="
        group
        relative
        h-full
        min-w-0
        overflow-hidden
        rounded-[28px]
        border-2
        border-red-500/25
        bg-[#070a11]/76
        shadow-[0_28px_85px_rgba(0,0,0,0.30)]
        backdrop-blur-2xl
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_12%_5%,rgba(239,68,68,0.14),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_38%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-[2px]
          w-3/5
          bg-gradient-to-r
          from-red-500/80
          via-red-400/30
          to-transparent
        "
      />


      <header
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-white/[0.07]
          px-5
          py-5

          sm:px-6
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3.5
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
              border-red-500/30
              bg-red-500/10
              text-red-300
              shadow-[0_14px_36px_rgba(239,68,68,0.12)]
            "
          >
            <Icon
              name="card"
              className="h-5 w-5"
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                truncate
                text-base
                font-black
                tracking-[-0.025em]
                text-white

                sm:text-lg
              "
            >
              Últimos movimientos
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              Actividad financiera reciente
            </p>
          </div>
        </div>


        <Link
          to="/movimientos"
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-red-500/20
            bg-red-500/[0.07]
            px-3
            py-2
            text-[10px]
            font-black
            uppercase
            tracking-[0.08em]
            text-red-300
            transition
            hover:border-red-500/35
            hover:bg-red-500/12
            hover:text-red-200
          "
        >
          <span className="hidden sm:inline">
            Ver todos
          </span>

          <Icon
            name="arrow"
            className="h-3.5 w-3.5"
          />
        </Link>
      </header>


      <div
        className="
          relative
          z-10
          overflow-y-auto
          px-4
          py-4

          sm:px-5
          sm:py-5
        "
        style={{
          maxHeight,
        }}
      >
        {movimientos.length === 0 ? (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div>
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[22px]
                  border
                  border-white/[0.09]
                  bg-white/[0.035]
                  text-slate-600
                "
              >
                <Icon
                  name="empty"
                  className="h-7 w-7"
                />
              </div>

              <p
                className="
                  mt-5
                  text-sm
                  font-black
                  text-slate-300
                "
              >
                Sin movimientos registrados
              </p>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-[280px]
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                Los ingresos, gastos y transferencias recientes aparecerán aquí.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {movimientos.map(
              (movimiento) => (
                <MovimientoItem
                  key={movimiento.id}
                  movimiento={movimiento}
                  moneda={moneda}
                />
              )
            )}
          </div>
        )}
      </div>


      {movimientos.length > 0 && (
        <footer
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/[0.06]
            bg-black/10
            px-5
            py-3.5
            text-[10px]
            font-semibold
            text-slate-500

            sm:px-6
          "
        >
          <span>
            Mostrando{" "}
            {movimientos.length}{" "}
            {movimientos.length === 1
              ? "movimiento"
              : "movimientos"}
          </span>

          <span className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.85)]
              "
            />

            Actualizado
          </span>
        </footer>
      )}
    </section>
  );
}


export default RecentMovements;