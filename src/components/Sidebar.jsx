import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";

import logo from "../assets/logo-blackghost.png";


function Icon({ name, className = "h-5 w-5" }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),

    movimientos: (
      <>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),

    cuentas: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 9h18" />
        <path d="M16 13h5" />
      </>
    ),

    categorias: (
      <>
        <path d="M12 3 21 12 12 21 3 12Z" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),

    configuracion: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.7a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),

    usuario: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    seguridad: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    salir: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),

    arrow: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...props}>{icons[name]}</svg>;
}


function Sidebar() {
  const { usuario } = useContext(AuthContext);

  const links = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "dashboard",
    },
    {
      path: "/movimientos",
      name: "Movimientos",
      icon: "movimientos",
    },
    {
      path: "/cuentas",
      name: "Cuentas",
      icon: "cuentas",
    },
    {
      path: "/categorias",
      name: "Categorías",
      icon: "categorias",
    },
    {
      path: "/configuracion",
      name: "Configuración",
      icon: "configuracion",
    },
  ];


  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      return;
    }

    window.location.href = "/";
  }


  return (
    <aside
      className="
        relative
        z-50
        flex
        h-full
        min-h-full
        w-full
        flex-col
        overflow-x-hidden
        overflow-y-auto
        overscroll-contain
        border-r
        border-white/10
        bg-[#070b13]/95
        px-4
        py-4
        text-white
        shadow-[20px_0_70px_rgba(0,0,0,0.48)]
        backdrop-blur-2xl

        lg:px-5
        lg:py-5
      "
    >
      {/* FONDO AMBIENTAL */}

      <div
        className="
          pointer-events-none
          fixed
          inset-y-0
          left-0
          w-[264px]
          bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.14),transparent_30%)]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          inset-x-0
          top-0
          h-48
          bg-gradient-to-b
          from-black/20
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10
          flex
          min-h-full
          w-full
          flex-col
        "
      >
        {/* LOGO */}

        {/* LOGO */}

<div
  className="
    flex
    min-h-[130px]
    shrink-0
    items-center
    justify-center
    border-b
    border-white/[0.07]
    pb-5

    lg:min-h-[150px]
    lg:pb-6
  "
>
  <img
    src={logo}
    alt="Black Ghost Finanzas"
    className="
      w-[160px]
      object-contain
      drop-shadow-[0_0_35px_rgba(239,68,68,0.35)]

      lg:w-[200px]
    "
  />
</div>


        {/* USUARIO */}

        <section
          className="
            mb-6
            mt-4
            shrink-0
            rounded-[18px]
            border
            border-white/10
            bg-white/[0.05]
            p-3
            shadow-[0_18px_45px_rgba(0,0,0,0.22)]

            lg:mb-7
            lg:mt-5
            lg:rounded-[20px]
            lg:p-3.5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.06]
                text-slate-300

                lg:h-11
                lg:w-11
                lg:rounded-2xl
              "
            >
              <Icon
                name="usuario"
                className="h-5 w-5"
              />

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-[#090d15]
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.9)]
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-slate-500

                  lg:text-[10px]
                "
              >
                Usuario
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-semibold
                  text-slate-200

                  lg:text-[13px]
                  lg:font-medium
                "
                title={usuario?.email || "Usuario"}
              >
                {usuario?.email || "Usuario"}
              </p>
            </div>
          </div>
        </section>


        {/* NAVEGACIÓN */}

        <nav
          className="
            shrink-0
            space-y-1.5

            lg:space-y-2
          "
          aria-label="Navegación principal"
        >
          <p
            className="
              mb-2
              px-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-600

              lg:mb-3
              lg:text-[10px]
            "
          >
            Navegación
          </p>

          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) => `
                group
                relative
                flex
                min-h-[46px]
                items-center
                gap-3
                overflow-hidden
                rounded-[14px]
                border
                px-3
                text-sm
                font-medium
                outline-none
                transition-all
                duration-300

                focus-visible:border-red-500/45
                focus-visible:ring-2
                focus-visible:ring-red-500/15

                lg:min-h-[48px]

                ${
                  isActive
                    ? `
                      border-red-500/38
                      bg-gradient-to-r
                      from-red-500/16
                      via-red-500/[0.08]
                      to-transparent
                      text-red-300
                      shadow-[0_14px_35px_rgba(239,68,68,0.10)]
                    `
                    : `
                      border-transparent
                      text-slate-400
                      hover:border-white/[0.07]
                      hover:bg-white/[0.045]
                      hover:text-white
                    `
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-2
                        left-0
                        top-2
                        w-[3px]
                        rounded-r-full
                        bg-red-400
                        shadow-[0_0_14px_rgba(248,113,113,0.9)]
                      "
                    />
                  )}

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            border-red-500/28
                            bg-red-500/12
                            text-red-300
                          `
                          : `
                            border-white/[0.07]
                            bg-white/[0.025]
                            text-slate-500
                            group-hover:border-white/10
                            group-hover:bg-white/[0.05]
                            group-hover:text-slate-200
                          `
                      }
                    `}
                  >
                    <Icon
                      name={item.icon}
                      className="h-[17px] w-[17px]"
                    />
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {item.name}
                  </span>

                  <Icon
                    name="arrow"
                    className={`
                      h-3.5
                      w-3.5
                      shrink-0
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "translate-x-0 text-red-400"
                          : "-translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-slate-500"
                      }
                    `}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>


        {/* ESPACIO FLEXIBLE */}

        <div className="min-h-5 flex-1" />


        {/* SEGURIDAD */}

        <section
          className="
            mt-6
            shrink-0
            rounded-[18px]
            border
            border-white/[0.08]
            bg-white/[0.04]
            p-3.5
            shadow-[0_18px_45px_rgba(0,0,0,0.20)]

            lg:mt-7
            lg:p-4
          "
        >
          <div className="flex items-start gap-3">
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
                border-red-500/20
                bg-red-500/10
                text-red-300
              "
            >
              <Icon
                name="seguridad"
                className="h-[18px] w-[18px]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200">
                Tus finanzas seguras
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  leading-4
                  text-slate-500

                  lg:text-[10px]
                "
              >
                Control y transparencia en cada movimiento.
              </p>
            </div>
          </div>
        </section>


        {/* CERRAR SESIÓN */}

        <div
          className="
            mt-4
            shrink-0
            border-t
            border-white/[0.07]
            pb-[max(0px,env(safe-area-inset-bottom))]
            pt-4
          "
        >
          <button
            type="button"
            onClick={cerrarSesion}
            className="
              group
              flex
              min-h-[46px]
              w-full
              items-center
              gap-3
              rounded-[14px]
              border
              border-transparent
              px-3
              text-sm
              font-medium
              text-slate-500
              outline-none
              transition-all
              duration-300

              hover:border-red-500/20
              hover:bg-red-500/[0.08]
              hover:text-red-300

              focus-visible:border-red-500/35
              focus-visible:bg-red-500/[0.08]
              focus-visible:text-red-300
              focus-visible:ring-2
              focus-visible:ring-red-500/15
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                transition

                group-hover:border-red-500/20
                group-hover:bg-red-500/10
              "
            >
              <Icon
                name="salir"
                className="h-[17px] w-[17px]"
              />
            </span>

            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}


export default Sidebar;