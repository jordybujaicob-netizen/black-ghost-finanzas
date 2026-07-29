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

    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    chart: (
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
      </>
    ),

    trendUp: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),

    trendDown: (
      <>
        <path d="m3 7 6 6 4-4 8 8" />
        <path d="M15 17h6v-6" />
      </>
    ),

    activity: (
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    ),

    tag: (
      <>
        <path d="M20 13 11 22l-9-9V4h9Z" />
        <circle cx="7" cy="9" r="1.5" />
      </>
    ),

    check: (
      <path d="m5 12 4 4L19 6" />
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
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
    ).format(Number(valor || 0));
  } catch {
    return `S/ ${Number(
      valor || 0
    ).toFixed(2)}`;
  }
}


function obtenerEstado(progreso) {
  if (progreso > 100) {
    return {
      nombre: "Déficit",
      descripcion:
        "Los gastos superaron los ingresos del periodo.",
      icono: "alert",

      text:
        "text-red-300",

      border:
        "border-red-500/25",

      background:
        "bg-red-500/[0.08]",

      icon:
        "border-red-500/30 bg-red-500/12 text-red-300",

      badge:
        "border-red-500/25 bg-red-500/10 text-red-300",

      gradient:
        "from-red-700 via-red-500 to-rose-400",

      glow:
        "shadow-[0_0_18px_rgba(239,68,68,0.42)]",
    };
  }

  if (progreso >= 85) {
    return {
      nombre: "Atención",
      descripcion:
        "El gasto está cerca del total de ingresos.",
      icono: "alert",

      text:
        "text-orange-300",

      border:
        "border-orange-500/25",

      background:
        "bg-orange-500/[0.07]",

      icon:
        "border-orange-500/30 bg-orange-500/12 text-orange-300",

      badge:
        "border-orange-500/25 bg-orange-500/10 text-orange-300",

      gradient:
        "from-orange-700 via-orange-500 to-amber-400",

      glow:
        "shadow-[0_0_18px_rgba(249,115,22,0.40)]",
    };
  }

  if (progreso >= 65) {
    return {
      nombre: "Moderado",
      descripcion:
        "Todavía tienes margen, pero conviene controlar los gastos.",
      icono: "activity",

      text:
        "text-amber-300",

      border:
        "border-amber-500/25",

      background:
        "bg-amber-500/[0.06]",

      icon:
        "border-amber-500/30 bg-amber-500/12 text-amber-300",

      badge:
        "border-amber-500/25 bg-amber-500/10 text-amber-300",

      gradient:
        "from-amber-700 via-amber-500 to-yellow-400",

      glow:
        "shadow-[0_0_18px_rgba(245,158,11,0.38)]",
    };
  }

  return {
    nombre: "Controlado",
    descripcion:
      "Los gastos se mantienen dentro de un nivel saludable.",
    icono: "shield",

    text:
      "text-emerald-300",

    border:
      "border-emerald-500/25",

    background:
      "bg-emerald-500/[0.06]",

    icon:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-300",

    badge:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",

    gradient:
      "from-emerald-700 via-emerald-500 to-teal-400",

    glow:
      "shadow-[0_0_18px_rgba(16,185,129,0.38)]",
  };
}


function MiniDato({
  icon,
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-white/[0.075]
        bg-black/20
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-slate-500
        "
      >
        <Icon
          name={icon}
          className="h-3.5 w-3.5"
        />

        <p
          className="
            truncate
            text-[9px]
            font-black
            uppercase
            tracking-[0.13em]
          "
        >
          {label}
        </p>
      </div>

      <p
        className={`
          mt-2
          truncate
          text-sm
          font-black
          tracking-tight

          ${valueClass}
        `}
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}


function BudgetCard({
  title = "Resumen financiero",
  value = "S/ 0.00",
  progress = 0,
  moneda = "PEN",
  periodo = "Periodo seleccionado",
  ingresos = null,
  gastos = null,
  tasaAhorro = null,
  movimientos = null,
  categoriaPrincipal = "",
  className = "",
}) {
  const progresoNumerico =
    Number.isFinite(Number(progress))
      ? Number(progress)
      : 0;

  const progresoVisible = Math.min(
    Math.max(progresoNumerico, 0),
    100
  );

  const estado =
    obtenerEstado(progresoNumerico);

  const tieneInformacionAdicional =
    ingresos !== null ||
    gastos !== null ||
    tasaAhorro !== null ||
    movimientos !== null ||
    Boolean(categoriaPrincipal);

  const resultadoPositivo =
    typeof tasaAhorro === "number"
      ? tasaAhorro >= 0
      : progresoNumerico <= 100;

  return (
    <section
      className={`
        group
        relative
        h-full
        min-w-0
        overflow-hidden
        rounded-[28px]
        border-2
        border-red-500/20
        bg-[#070a11]/78
        shadow-[0_28px_85px_rgba(0,0,0,0.32)]
        backdrop-blur-2xl

        ${className}
      `}
    >
      {/* FONDO */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_80%_8%,rgba(239,68,68,0.13),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_38%)]
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
          py-5

          sm:flex-row
          sm:items-center
          sm:justify-between
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
              shadow-[0_15px_38px_rgba(239,68,68,0.13)]
            "
          >
            <Icon
              name="wallet"
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
              {title}
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
              Evaluación del periodo actual
            </p>
          </div>
        </div>

        <span
          className="
            w-fit
            shrink-0
            rounded-full
            border
            border-white/[0.09]
            bg-white/[0.035]
            px-3
            py-1.5
            text-[9px]
            font-black
            uppercase
            tracking-[0.11em]
            text-slate-500
          "
        >
          {periodo}
        </span>
      </header>


      {/* CONTENIDO */}

      <div
        className="
          relative
          z-10
          space-y-5
          px-5
          py-5

          sm:px-6
          sm:py-6
        "
      >
        {/* ESTADO Y USO */}

        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:grid-cols-2
          "
        >
          <article
            className={`
              rounded-[22px]
              border
              p-4

              ${estado.border}
              ${estado.background}
            `}
          >
            <div className="flex items-start gap-3">
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

                  ${estado.icon}
                `}
              >
                <Icon
                  name={estado.icono}
                  className="h-4.5 w-4.5"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.13em]
                    text-slate-500
                  "
                >
                  Estado
                </p>

                <p
                  className={`
                    mt-1.5
                    text-lg
                    font-black
                    tracking-tight

                    ${estado.text}
                  `}
                >
                  {estado.nombre}
                </p>
              </div>
            </div>
          </article>


          <article
            className="
              rounded-[22px]
              border
              border-white/[0.08]
              bg-black/20
              p-4
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
                  border
                  border-red-500/20
                  bg-red-500/[0.08]
                  text-red-300
                "
              >
                <Icon
                  name="chart"
                  className="h-4.5 w-4.5"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.13em]
                    text-slate-500
                  "
                >
                  Uso de ingresos
                </p>

                <p
                  className={`
                    mt-1.5
                    text-lg
                    font-black
                    tracking-tight

                    ${
                      progresoNumerico > 100
                        ? "text-red-300"
                        : "text-white"
                    }
                  `}
                >
                  {progresoNumerico.toFixed(
                    0
                  )}
                  %
                </p>
              </div>
            </div>
          </article>
        </div>


        {/* RESULTADO PRINCIPAL */}

        <article
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.09]
            bg-black/25
            px-5
            py-5
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.13),transparent_38%)]
            "
          />

          <div className="relative">
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-slate-500
                "
              >
                Resultado del periodo
              </p>

              <span
                className={`
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.1em]

                  ${
                    resultadoPositivo
                      ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
                      : "border-red-500/20 bg-red-500/[0.08] text-red-300"
                  }
                `}
              >
                <Icon
                  name={
                    resultadoPositivo
                      ? "trendUp"
                      : "trendDown"
                  }
                  className="h-3 w-3"
                />

                {resultadoPositivo
                  ? "Positivo"
                  : "Negativo"}
              </span>
            </div>

            <p
              className="
                mt-3
                break-words
                text-2xl
                font-black
                tracking-[-0.035em]
                text-white

                sm:text-[28px]
              "
            >
              {value}
            </p>

            {typeof tasaAhorro ===
              "number" && (
              <p
                className={`
                  mt-2
                  text-xs
                  font-bold

                  ${
                    tasaAhorro >= 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                `}
              >
                Tasa de ahorro:{" "}
                {tasaAhorro.toFixed(1)}%
              </p>
            )}
          </div>
        </article>


        {/* BARRA DE PROGRESO */}

        <div
          className="
            rounded-[22px]
            border
            border-white/[0.075]
            bg-black/18
            p-4
          "
        >
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-slate-500
                "
              >
                Nivel de gasto
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-slate-400
                "
              >
                Gastos respecto a ingresos
              </p>
            </div>

            <span
              className={`
                rounded-full
                border
                px-2.5
                py-1
                text-[9px]
                font-black

                ${estado.badge}
              `}
            >
              {progresoNumerico.toFixed(0)}%
            </span>
          </div>

          <div
            className="
              relative
              h-2.5
              overflow-hidden
              rounded-full
              bg-white/[0.08]
            "
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              progresoVisible
            }
          >
            <div
              className={`
                h-full
                rounded-full
                bg-gradient-to-r
                transition-all
                duration-700

                ${estado.gradient}
                ${estado.glow}
              `}
              style={{
                width: `${progresoVisible}%`,
              }}
            />
          </div>

          <div
            className="
              mt-2.5
              flex
              items-center
              justify-between
              text-[9px]
              font-semibold
              text-slate-600
            "
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          {progresoNumerico > 100 && (
            <div
              className="
                mt-3
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-red-500/20
                bg-red-500/[0.07]
                px-3
                py-2.5
                text-[10px]
                leading-4
                text-red-200
              "
            >
              <Icon
                name="alert"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />

              <p>
                Los gastos excedieron los
                ingresos en{" "}
                {(
                  progresoNumerico - 100
                ).toFixed(0)}
                %.
              </p>
            </div>
          )}
        </div>


        {/* INFORMACIÓN ADICIONAL */}

        {tieneInformacionAdicional && (
          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            {ingresos !== null && (
              <MiniDato
                icon="trendUp"
                label="Ingresos"
                value={formatearMoneda(
                  ingresos,
                  moneda
                )}
                valueClass="text-emerald-300"
              />
            )}

            {gastos !== null && (
              <MiniDato
                icon="trendDown"
                label="Gastos"
                value={formatearMoneda(
                  gastos,
                  moneda
                )}
                valueClass="text-red-300"
              />
            )}

            {movimientos !== null && (
              <MiniDato
                icon="activity"
                label="Movimientos"
                value={movimientos}
              />
            )}

            {categoriaPrincipal && (
              <MiniDato
                icon="tag"
                label="Mayor gasto"
                value={categoriaPrincipal}
              />
            )}
          </div>
        )}


        {/* RECOMENDACIÓN */}

        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            px-4
            py-3.5
          "
        >
          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              border

              ${estado.icon}
            `}
          >
            <Icon
              name={estado.icono}
              className="h-3.5 w-3.5"
            />
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.12em]
                text-slate-500
              "
            >
              Lectura financiera
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-400
              "
            >
              {estado.descripcion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


export default BudgetCard;