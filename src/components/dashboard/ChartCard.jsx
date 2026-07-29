function ChartCard({
  title,
  icon,
  children,
  height = "280px",
  subtitle = "",
  value = "",
  badge = "",
  accent = "red",
  action = null,
  className = "",
}) {
  const themes = {
    red: {
      border: "border-red-500/25",
      icon: "border-red-500/30 bg-red-500/10 text-red-200",
      badge: "border-red-500/25 bg-red-500/10 text-red-200",
      glow:
        "bg-[radial-gradient(circle_at_18%_12%,rgba(239,68,68,0.17),transparent_32%)]",
      line: "from-red-500/80 via-red-400/30 to-transparent",
    },

    green: {
      border: "border-emerald-500/25",
      icon:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
      badge:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
      glow:
        "bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.15),transparent_32%)]",
      line:
        "from-emerald-500/80 via-emerald-400/30 to-transparent",
    },

    orange: {
      border: "border-orange-500/25",
      icon:
        "border-orange-500/30 bg-orange-500/10 text-orange-200",
      badge:
        "border-orange-500/25 bg-orange-500/10 text-orange-200",
      glow:
        "bg-[radial-gradient(circle_at_18%_12%,rgba(249,115,22,0.15),transparent_32%)]",
      line:
        "from-orange-500/80 via-orange-400/30 to-transparent",
    },

    purple: {
      border: "border-violet-500/25",
      icon:
        "border-violet-500/30 bg-violet-500/10 text-violet-200",
      badge:
        "border-violet-500/25 bg-violet-500/10 text-violet-200",
      glow:
        "bg-[radial-gradient(circle_at_18%_12%,rgba(139,92,246,0.15),transparent_32%)]",
      line:
        "from-violet-500/80 via-violet-400/30 to-transparent",
    },
  };

  const theme =
    themes[accent] || themes.red;

  return (
    <article
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border-2
        bg-[#070a11]/78
        shadow-[0_28px_85px_rgba(0,0,0,0.32)]
        backdrop-blur-2xl
        transition
        duration-300

        hover:-translate-y-0.5
        hover:bg-[#090d16]/82
        hover:shadow-[0_32px_95px_rgba(0,0,0,0.40)]

        ${theme.border}
        ${className}
      `}
    >
      {/* ILUMINACIÓN AMBIENTAL */}

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
          bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_36%,rgba(0,0,0,0.18))]
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

      {/* CABECERA */}

      <header
        className="
          relative
          z-10
          flex
          flex-col
          gap-4
          border-b
          border-white/[0.07]
          px-5
          pb-5
          pt-5

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
          sm:pt-6
        "
      >
        <div className="flex min-w-0 items-center gap-3.5">
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
              text-lg
              shadow-[0_15px_38px_rgba(0,0,0,0.24)]
              transition
              duration-300

              group-hover:scale-[1.04]

              ${theme.icon}
            `}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
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
                {title}
              </h2>

              {badge && (
                <span
                  className={`
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.12em]

                    ${theme.badge}
                  `}
                >
                  {badge}
                </span>
              )}
            </div>

            {subtitle && (
              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {(value || action) && (
          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-4

              sm:justify-end
            "
          >
            {value && (
              <div className="text-left sm:text-right">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.13em]
                    text-slate-600
                  "
                >
                  Total
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-black
                    text-white
                  "
                >
                  {value}
                </p>
              </div>
            )}

            {action}
          </div>
        )}
      </header>

      {/* CUERPO DEL GRÁFICO */}

      <div
        className="
          relative
          z-10
          px-2
          pb-4
          pt-4

          sm:px-4
          sm:pb-5
        "
      >
        <div
          className="
            relative
            w-full
            min-w-0
            overflow-hidden
            rounded-[20px]
            border
            border-white/[0.045]
            bg-black/10
          "
          style={{
            height,
          }}
        >
          {/* TEXTURA INTERNA */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_35%,rgba(0,0,0,0.10))]
            "
          />

          <div className="relative h-full w-full min-w-0">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}


export default ChartCard;