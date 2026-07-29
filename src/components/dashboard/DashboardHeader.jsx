import logo from "../../assets/logo-blackghost.png";


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
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
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

    activity: (
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    ),

    refresh: (
      <>
        <path d="M20 6v5h-5" />
        <path d="M4 18v-5h5" />
        <path d="M6.1 9a7 7 0 0 1 11.4-2.5L20 11" />
        <path d="M17.9 15a7 7 0 0 1-11.4 2.5L4 13" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

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


function obtenerSaludo() {
  const hora = new Date().getHours();

  if (hora < 12) {
    return "Buenos días";
  }

  if (hora < 19) {
    return "Buenas tardes";
  }

  return "Buenas noches";
}


function formatearFechaActual() {
  const fecha = new Date();

  const texto = fecha.toLocaleDateString(
    "es-PE",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return texto.charAt(0).toUpperCase() +
    texto.slice(1);
}


function obtenerNombreUsuario(
  email,
  nombre
) {
  if (nombre?.trim()) {
    return nombre.trim();
  }

  if (email) {
    const nombreCorreo =
      email.split("@")[0];

    return nombreCorreo
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letra) =>
        letra.toUpperCase()
      );
  }

  return "Usuario";
}


function obtenerIniciales(
  email,
  nombre
) {
  const texto = obtenerNombreUsuario(
    email,
    nombre
  );

  const palabras = texto
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (palabras.length === 0) {
    return "BG";
  }

  if (palabras.length === 1) {
    return palabras[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    palabras[0][0] +
    palabras[palabras.length - 1][0]
  ).toUpperCase();
}


function DashboardHeader({
  email = "",
  nombre = "",
  periodo = "",
  onRefresh = null,
  sincronizando = false,
}) {
  const nombreUsuario =
    obtenerNombreUsuario(
      email,
      nombre
    );

  const iniciales =
    obtenerIniciales(
      email,
      nombre
    );

  const saludo =
    obtenerSaludo();

  const fechaActual =
    formatearFechaActual();


  return (
    <header
      className="
        group
        relative
        mb-7
        min-w-0
        overflow-hidden
        rounded-[30px]
        border-2
        border-red-500/20
        bg-[#070a11]/72
        shadow-[0_28px_90px_rgba(0,0,0,0.34)]
        backdrop-blur-2xl
      "
    >
      {/* ILUMINACIÓN */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_8%_8%,rgba(239,68,68,0.20),transparent_31%),radial-gradient(circle_at_82%_5%,rgba(139,92,246,0.10),transparent_30%),linear-gradient(125deg,rgba(255,255,255,0.035),transparent_38%,rgba(0,0,0,0.18))]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-[2px]
          w-2/3
          bg-gradient-to-r
          from-red-500
          via-red-400/40
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-48
          w-48
          rounded-full
          border
          border-red-500/10
          bg-red-500/[0.025]
          blur-sm
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-6
          px-5
          py-5

          sm:px-7
          sm:py-6

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        {/* MARCA Y BIENVENIDA */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-4

            sm:gap-5
          "
        >
          <div
            className="
              relative
              flex
              h-[72px]
              w-[72px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-[22px]
              border
              border-red-500/25
              bg-black/30
              shadow-[0_18px_50px_rgba(239,68,68,0.17)]

              sm:h-[82px]
              sm:w-[82px]
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_15%,rgba(239,68,68,0.20),transparent_55%)]
              "
            />

            <img
              src={logo}
              alt="Black Ghost Finanzas"
              className="
                relative
                h-full
                w-full
                object-contain
                p-1
                drop-shadow-[0_0_18px_rgba(239,68,68,0.38)]
              "
            />
          </div>


          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-red-500/20
                  bg-red-500/[0.08]
                  px-2.5
                  py-1
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-red-300
                "
              >
                <Icon
                  name="spark"
                  className="h-3 w-3"
                />

                Panel financiero
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/[0.07]
                  px-2.5
                  py-1
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                  text-emerald-300
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.9)]
                  "
                />

                En línea
              </span>
            </div>


            <h1
              className="
                mt-3
                truncate
                text-[23px]
                font-black
                leading-tight
                tracking-[-0.04em]
                text-white

                sm:text-[30px]
              "
            >
              {saludo},{" "}

              <span className="text-red-300">
                {nombreUsuario}
              </span>
            </h1>

            <p
              className="
                mt-1.5
                flex
                items-center
                gap-2
                text-xs
                font-medium
                text-slate-500

                sm:text-sm
              "
            >
              <Icon
                name="wallet"
                className="h-4 w-4 shrink-0 text-red-400"
              />

              Controla y analiza tus finanzas personales
            </p>
          </div>
        </div>


        {/* INFORMACIÓN DERECHA */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-3

            sm:grid-cols-2

            xl:min-w-[440px]
          "
        >
          {/* FECHA */}

          <article
            className="
              flex
              min-w-0
              items-center
              gap-3
              rounded-[20px]
              border
              border-white/[0.085]
              bg-black/20
              px-4
              py-3.5
              transition
              hover:border-red-500/20
              hover:bg-red-500/[0.025]
            "
          >
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
                name="calendar"
                className="h-[18px] w-[18px]"
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                Fecha actual
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-bold
                  text-slate-300
                "
                title={fechaActual}
              >
                {fechaActual}
              </p>
            </div>
          </article>


          {/* USUARIO */}

          <article
            className="
              flex
              min-w-0
              items-center
              gap-3
              rounded-[20px]
              border
              border-white/[0.085]
              bg-black/20
              px-4
              py-3.5
              transition
              hover:border-violet-500/20
              hover:bg-violet-500/[0.025]
            "
          >
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
                border-violet-500/25
                bg-violet-500/[0.09]
                text-xs
                font-black
                text-violet-200
              "
            >
              {iniciales}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                Cuenta activa
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-bold
                  text-slate-300
                "
                title={email}
              >
                {email || "Usuario conectado"}
              </p>
            </div>
          </article>


          {/* PERIODO OPCIONAL */}

          {periodo && (
            <article
              className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-[20px]
                border
                border-blue-500/15
                bg-blue-500/[0.035]
                px-4
                py-3.5

                sm:col-span-2
              "
            >
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
                  border-blue-500/20
                  bg-blue-500/[0.08]
                  text-blue-300
                "
              >
                <Icon
                  name="activity"
                  className="h-[18px] w-[18px]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-slate-600
                  "
                >
                  Periodo analizado
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    font-bold
                    capitalize
                    text-blue-200
                  "
                  title={periodo}
                >
                  {periodo}
                </p>
              </div>

              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={sincronizando}
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.09]
                    bg-white/[0.04]
                    text-slate-400
                    transition
                    hover:border-blue-500/25
                    hover:bg-blue-500/10
                    hover:text-blue-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  title="Actualizar datos"
                >
                  <Icon
                    name="refresh"
                    className={`
                      h-4
                      w-4

                      ${
                        sincronizando
                          ? "animate-spin"
                          : ""
                      }
                    `}
                  />
                </button>
              )}
            </article>
          )}
        </div>
      </div>


      {/* PIE INFORMATIVO */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-2
          border-t
          border-white/[0.06]
          bg-black/10
          px-5
          py-3

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-7
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-[10px]
            font-semibold
            text-slate-500
          "
        >
          <Icon
            name="shield"
            className="h-3.5 w-3.5 text-emerald-400"
          />

          Información protegida y sincronizada
        </div>

        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.12em]
            text-slate-700
          "
        >
          Black Ghost Finanzas
        </p>
      </div>
    </header>
  );
}


export default DashboardHeader;