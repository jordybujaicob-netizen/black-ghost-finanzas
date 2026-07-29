function Icon({
  name,
  className = "h-4 w-4",
}) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const icons = {
    up: (
      <>
        <path d="m18 15-6-6-6 6" />
      </>
    ),

    down: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),

    neutral: (
      <>
        <path d="M5 12h14" />
      </>
    ),

    spark: (
      <>
        <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4Z" />
        <path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
}


function normalizarTendencia(
  trend,
  trendLabel
) {
  if (
    trend === null ||
    trend === undefined ||
    trend === ""
  ) {
    return null;
  }

  if (
    typeof trend === "object"
  ) {
    const valor = Number(
      trend.value ?? 0
    );

    return {
      valor,
      etiqueta:
        trend.label ||
        trendLabel ||
        "Periodo anterior",

      direccion:
        trend.direction ||
        (valor > 0
          ? "up"
          : valor < 0
            ? "down"
            : "neutral"),
    };
  }

  const valor = Number(trend);

  if (!Number.isFinite(valor)) {
    return null;
  }

  return {
    valor,
    etiqueta:
      trendLabel ||
      "Periodo anterior",

    direccion:
      valor > 0
        ? "up"
        : valor < 0
          ? "down"
          : "neutral",
  };
}


function StatCard({
  title,
  value,
  icon,
  color = "red",
  subtitle = "",
  trend = null,
  trendLabel = "",
  badge = "",
  className = "",
}) {
  const themes = {
    red: {
      border:
        "border-red-500/25",

      icon:
        "border-red-500/30 bg-red-500/10 text-red-200",

      title:
        "text-red-300",

      value:
        "text-red-100",

      glow:
        "bg-[radial-gradient(circle_at_82%_18%,rgba(239,68,68,0.20),transparent_35%)]",

      line:
        "from-red-500/90 via-red-400/35 to-transparent",

      badge:
        "border-red-500/25 bg-red-500/10 text-red-300",

      sparkle:
        "text-red-400/50",
    },

    green: {
      border:
        "border-emerald-500/25",

      icon:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",

      title:
        "text-emerald-300",

      value:
        "text-emerald-100",

      glow:
        "bg-[radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.18),transparent_35%)]",

      line:
        "from-emerald-500/90 via-emerald-400/35 to-transparent",

      badge:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",

      sparkle:
        "text-emerald-400/50",
    },

    purple: {
      border:
        "border-violet-500/25",

      icon:
        "border-violet-500/30 bg-violet-500/10 text-violet-200",

      title:
        "text-violet-300",

      value:
        "text-violet-100",

      glow:
        "bg-[radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.18),transparent_35%)]",

      line:
        "from-violet-500/90 via-violet-400/35 to-transparent",

      badge:
        "border-violet-500/25 bg-violet-500/10 text-violet-300",

      sparkle:
        "text-violet-400/50",
    },

    blue: {
      border:
        "border-blue-500/25",

      icon:
        "border-blue-500/30 bg-blue-500/10 text-blue-200",

      title:
        "text-blue-300",

      value:
        "text-blue-100",

      glow:
        "bg-[radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.18),transparent_35%)]",

      line:
        "from-blue-500/90 via-blue-400/35 to-transparent",

      badge:
        "border-blue-500/25 bg-blue-500/10 text-blue-300",

      sparkle:
        "text-blue-400/50",
    },

    orange: {
      border:
        "border-orange-500/25",

      icon:
        "border-orange-500/30 bg-orange-500/10 text-orange-200",

      title:
        "text-orange-300",

      value:
        "text-orange-100",

      glow:
        "bg-[radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.18),transparent_35%)]",

      line:
        "from-orange-500/90 via-orange-400/35 to-transparent",

      badge:
        "border-orange-500/25 bg-orange-500/10 text-orange-300",

      sparkle:
        "text-orange-400/50",
    },
  };

  const theme =
    themes[color] ||
    themes.red;

  const tendencia =
    normalizarTendencia(
      trend,
      trendLabel
    );

  const tendenciaPositiva =
    tendencia?.direccion === "up";

  const tendenciaNegativa =
    tendencia?.direccion === "down";


  return (
    <article
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[24px]
        border-2
        bg-[#070a11]/76
        px-5
        py-5
        shadow-[0_22px_70px_rgba(0,0,0,0.28)]
        backdrop-blur-2xl
        transition
        duration-300

        hover:-translate-y-1
        hover:bg-[#090d16]/82
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.38)]

        ${theme.border}
        ${className}
      `}
    >
      {/* ILUMINACIÓN */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          opacity-90
          transition
          duration-500
          group-hover:opacity-100

          ${theme.glow}
        `}
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(125deg,rgba(255,255,255,0.035),transparent_38%,rgba(0,0,0,0.16))]
        "
      />

      <div
        className={`
          pointer-events-none
          absolute
          left-0
          top-0
          h-[2px]
          w-3/5
          bg-gradient-to-r

          ${theme.line}
        `}
      />

      <div
        className={`
          pointer-events-none
          absolute
          right-5
          top-4
          opacity-30
          transition
          duration-300
          group-hover:scale-110
          group-hover:opacity-60

          ${theme.sparkle}
        `}
      >
        <Icon
          name="spark"
          className="h-4 w-4"
        />
      </div>


      {/* CONTENIDO */}

      <div className="relative z-10">
        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-4
          "
        >
          {/* TEXTO */}

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
              <p
                className={`
                  truncate
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.16em]

                  ${theme.title}
                `}
              >
                {title}
              </p>

              {badge && (
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
                    tracking-[0.1em]

                    ${theme.badge}
                  `}
                >
                  {badge}
                </span>
              )}
            </div>

            <p
              className={`
                mt-3
                truncate
                text-[26px]
                font-black
                leading-none
                tracking-[-0.04em]

                sm:text-[29px]
                xl:text-[27px]
                2xl:text-[30px]

                ${theme.value}
              `}
              title={String(value)}
            >
              {value}
            </p>

            {subtitle && (
              <p
                className="
                  mt-3
                  truncate
                  text-xs
                  font-medium
                  text-slate-500
                "
                title={subtitle}
              >
                {subtitle}
              </p>
            )}
          </div>


          {/* ICONO */}

          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              text-[22px]
              shadow-[0_16px_38px_rgba(0,0,0,0.26)]
              transition
              duration-300

              group-hover:scale-[1.06]
              group-hover:-rotate-2

              ${theme.icon}
            `}
          >
            {icon}
          </div>
        </div>


        {/* TENDENCIA */}

        {tendencia && (
          <div
            className="
              mt-4
              flex
              min-w-0
              items-center
              gap-2
              border-t
              border-white/[0.07]
              pt-3.5
            "
          >
            <span
              className={`
                flex
                shrink-0
                items-center
                gap-1
                rounded-full
                border
                px-2.5
                py-1
                text-[9px]
                font-black

                ${
                  tendenciaPositiva
                    ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
                    : tendenciaNegativa
                      ? "border-red-500/20 bg-red-500/[0.08] text-red-300"
                      : "border-slate-500/20 bg-slate-500/[0.08] text-slate-400"
                }
              `}
            >
              <Icon
                name={
                  tendenciaPositiva
                    ? "up"
                    : tendenciaNegativa
                      ? "down"
                      : "neutral"
                }
                className="h-3 w-3"
              />

              {tendencia.valor > 0
                ? "+"
                : ""}
              {tendencia.valor.toFixed(1)}
              %
            </span>

            <p
              className="
                min-w-0
                truncate
                text-[10px]
                font-semibold
                text-slate-500
              "
              title={
                tendencia.etiqueta
              }
            >
              {tendencia.etiqueta}
            </p>
          </div>
        )}


        {/* LÍNEA DECORATIVA CUANDO NO HAY TENDENCIA */}

        {!tendencia && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              border-t
              border-white/[0.07]
              pt-3.5
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.8)]
              "
            />

            <p
              className="
                truncate
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              Información actualizada
            </p>
          </div>
        )}
      </div>
    </article>
  );
}


export default StatCard;