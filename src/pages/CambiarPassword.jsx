import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { supabase } from "../services/supabase";
import logo from "../assets/logo-blackghost.png";


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
    lock: (
      <>
        <rect
          x="4"
          y="10"
          width="16"
          height="11"
          rx="2"
        />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),

    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 6.2A11 11 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-2.1 2.9" />
        <path d="M6.2 6.2C3.4 8 2 12 2 12s3.5 6 10 6a10 10 0 0 0 4.1-.8" />
      </>
    ),

    check: (
      <path d="m5 12 4 4L19 6" />
    ),

    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    key: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 9-9" />
        <path d="m16 7 2 2" />
        <path d="m18 5 2 2" />
      </>
    ),

    arrowLeft: (
      <>
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h10" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 6v5h-5" />
        <path d="M4 18v-5h5" />
        <path d="M6.1 9a7 7 0 0 1 11.4-2.5L20 11" />
        <path d="M17.9 15a7 7 0 0 1-11.4 2.5L4 13" />
      </>
    ),

    loader: (
      <>
        <path d="M12 2v4" />
        <path d="m19.1 4.9-2.8 2.8" />
        <path d="M22 12h-4" />
        <path d="m19.1 19.1-2.8-2.8" />
        <path d="M12 22v-4" />
        <path d="m4.9 19.1 2.8-2.8" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.8 2.8" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
}


function leerAutorizacionRecuperacion() {
  try {
    const valor = window.sessionStorage.getItem(
      "blackghost-password-recovery"
    );

    if (!valor) return false;

    const datos = JSON.parse(valor);

    return datos?.activo === true;
  } catch {
    return false;
  }
}


function limpiarParametrosUrl() {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}


function CambiarPassword() {
  const [password, setPassword] = useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);

  const [estadoEnlace, setEstadoEnlace] =
    useState("VERIFICANDO");

  const [errorEnlace, setErrorEnlace] =
    useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [cargando, setCargando] =
    useState(false);


  useEffect(() => {
    let componenteActivo = true;
    let temporizador = null;


    function aceptarRecuperacion(session) {
      if (!componenteActivo || !session) {
        return;
      }

      window.sessionStorage.setItem(
        "blackghost-password-recovery",
        JSON.stringify({
          activo: true,
          creadoEn: Date.now(),
        })
      );

      setErrorEnlace("");
      setEstadoEnlace("VALIDO");

      limpiarParametrosUrl();
    }


    function rechazarRecuperacion(mensajeError) {
      if (!componenteActivo) return;

      setErrorEnlace(
        mensajeError ||
          "El enlace no es válido o ha expirado."
      );

      setEstadoEnlace("INVALIDO");
    }


    /*
      Escuchamos nuevamente el evento como respaldo.
      El listener principal ya se encuentra en supabase.js.
    */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (evento, session) => {
        if (
          evento === "PASSWORD_RECOVERY" &&
          session
        ) {
          aceptarRecuperacion(session);
        }
      }
    );


    async function verificarRecuperacion() {
      const url = new URL(
        window.location.href
      );

      const hash = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );

      const descripcionError =
        url.searchParams.get(
          "error_description"
        ) ||
        hash.get("error_description");

      const codigoError =
        url.searchParams.get("error_code") ||
        hash.get("error_code");


      /*
        Supabase puede redirigir con un error cuando
        el enlace realmente expiró o ya fue utilizado.
      */

      if (descripcionError || codigoError) {
        const textoError =
          descripcionError
            ?.replaceAll("+", " ")
            .trim() || "";

        const expirado =
          codigoError === "otp_expired" ||
          textoError
            .toLowerCase()
            .includes("expired");

        rechazarRecuperacion(
          expirado
            ? "El enlace de recuperación expiró o ya fue utilizado. Solicita uno nuevo."
            : textoError ||
                "Supabase no pudo validar el enlace de recuperación."
        );

        limpiarParametrosUrl();
        return;
      }


      /*
        Primera comprobación:
        Supabase pudo crear la sesión antes de que
        CambiarPassword.jsx terminara de cargar.
      */

      const {
        data: { session },
        error: errorSesion,
      } = await supabase.auth.getSession();

      if (!componenteActivo) return;

      const recuperacionGuardada =
        leerAutorizacionRecuperacion();

      if (
        !errorSesion &&
        session &&
        recuperacionGuardada
      ) {
        aceptarRecuperacion(session);
        return;
      }


      /*
        Esperamos brevemente porque Supabase puede estar
        procesando todavía los parámetros del enlace.
      */

      temporizador = window.setTimeout(
        async () => {
          if (!componenteActivo) return;

          const {
            data: {
              session: segundaSesion,
            },
          } =
            await supabase.auth.getSession();

          if (!componenteActivo) return;

          const segundaAutorizacion =
            leerAutorizacionRecuperacion();

          if (
            segundaSesion &&
            segundaAutorizacion
          ) {
            aceptarRecuperacion(
              segundaSesion
            );

            return;
          }

          rechazarRecuperacion(
            "Abre esta página desde el enlace más reciente enviado a tu correo."
          );
        },
        1800
      );
    }


    verificarRecuperacion();


    return () => {
      componenteActivo = false;

      if (temporizador) {
        window.clearTimeout(temporizador);
      }

      subscription.unsubscribe();
    };
  }, []);


  const reglasPassword = useMemo(
    () => ({
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
    }),
    [password]
  );


  const passwordValida = useMemo(
    () =>
      Object.values(
        reglasPassword
      ).every(Boolean),
    [reglasPassword]
  );


  const fortaleza = useMemo(() => {
    const cantidad =
      Object.values(
        reglasPassword
      ).filter(Boolean).length;

    if (!password) {
      return {
        porcentaje: 0,
        texto: "Sin contraseña",
        barra: "bg-slate-700",
        textoColor: "text-slate-500",
      };
    }

    if (cantidad <= 1) {
      return {
        porcentaje: 25,
        texto: "Débil",
        barra: "bg-red-500",
        textoColor: "text-red-300",
      };
    }

    if (cantidad <= 3) {
      return {
        porcentaje: 65,
        texto: "Intermedia",
        barra: "bg-amber-400",
        textoColor: "text-amber-300",
      };
    }

    return {
      porcentaje: 100,
      texto: "Segura",
      barra: "bg-emerald-400",
      textoColor: "text-emerald-300",
    };
  }, [password, reglasPassword]);


  async function cambiarPassword(e) {
    e.preventDefault();

    if (
      cargando ||
      estadoEnlace !== "VALIDO"
    ) {
      return;
    }

    setError("");
    setMensaje("");


    const {
      data: { session },
    } = await supabase.auth.getSession();


    if (
      !session ||
      !leerAutorizacionRecuperacion()
    ) {
      setEstadoEnlace("INVALIDO");

      setErrorEnlace(
        "La sesión de recuperación ya no está disponible. Solicita un enlace nuevo."
      );

      return;
    }


    if (!passwordValida) {
      setError(
        "La contraseña no cumple todos los requisitos."
      );

      return;
    }


    if (password !== confirmPassword) {
      setError(
        "Las contraseñas no coinciden."
      );

      return;
    }


    setCargando(true);

    try {
      const {
        error: errorActualizacion,
      } =
        await supabase.auth.updateUser({
          password,
        });


      if (errorActualizacion) {
        console.error(
          "Error actualizando contraseña:",
          errorActualizacion
        );

        setError(
          "No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo nuevamente."
        );

        return;
      }


      setPassword("");
      setConfirmPassword("");

      setMensaje(
        "Contraseña actualizada correctamente. Ahora podrás iniciar sesión con tu nueva contraseña."
      );

      setEstadoEnlace("COMPLETADO");

      window.sessionStorage.removeItem(
        "blackghost-password-recovery"
      );


      /*
        Cerramos la sesión de recuperación para que
        el enlace no pueda volver a utilizarse.
      */

      await supabase.auth.signOut();


      window.setTimeout(() => {
        window.location.replace("/");
      }, 2500);
    } finally {
      setCargando(false);
    }
  }


  const badge = {
    VERIFICANDO: {
      texto: "VERIFICANDO ENLACE",
      icono: "loader",
      clase:
        "border-amber-500/25 bg-amber-500/10 text-amber-300",
    },

    INVALIDO: {
      texto: "RECUPERACIÓN SEGURA",
      icono: "shield",
      clase:
        "border-red-500/25 bg-red-500/10 text-red-300",
    },

    VALIDO: {
      texto: "ENLACE VERIFICADO",
      icono: "shield",
      clase:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    },

    COMPLETADO: {
      texto: "CAMBIO COMPLETADO",
      icono: "check",
      clase:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    },
  }[estadoEnlace];


  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#03050a]
        px-4
        py-8
        text-white
        sm:px-6
      "
    >
      {/* FONDO */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/background-blackghost.png')",
          backgroundPosition: "center 42%",
        }}
      />

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[linear-gradient(115deg,rgba(2,4,9,0.90)_0%,rgba(2,4,9,0.72)_48%,rgba(2,4,9,0.87)_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_18%_18%,rgba(239,68,68,0.20),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(91,33,182,0.11),transparent_35%)]
        "
      />


      <section
        className="
          relative
          z-10
          grid
          w-full
          max-w-[980px]
          overflow-hidden
          rounded-[32px]
          border-2
          border-white/[0.12]
          bg-[#070a11]/82
          shadow-[0_35px_120px_rgba(0,0,0,0.72)]
          backdrop-blur-2xl
          lg:grid-cols-[0.92fr_1.08fr]
        "
      >
        {/* PANEL IZQUIERDO */}

        <aside
          className="
            relative
            hidden
            min-h-[650px]
            overflow-hidden
            border-r
            border-white/[0.08]
            p-10
            lg:flex
            lg:flex-col
            lg:justify-between
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.19),transparent_36%),linear-gradient(180deg,rgba(8,12,20,0.15),rgba(4,6,11,0.90))]
            "
          />

          <div className="relative z-10">
            <img
              src={logo}
              alt="Black Ghost Finanzas"
              className="
                w-40
                object-contain
                drop-shadow-[0_0_35px_rgba(239,68,68,0.34)]
              "
            />

            <div className="mt-12">
              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  ${badge.clase}
                `}
              >
                <Icon
                  name={badge.icono}
                  className={`
                    h-3.5
                    w-3.5
                    ${
                      estadoEnlace ===
                      "VERIFICANDO"
                        ? "animate-spin"
                        : ""
                    }
                  `}
                />

                {badge.texto}
              </span>

              <h2
                className="
                  mt-6
                  max-w-sm
                  text-[34px]
                  font-black
                  leading-[1.12]
                  tracking-[-0.045em]
                  text-white
                "
              >
                Protege el acceso a tus finanzas.
              </h2>

              <p
                className="
                  mt-5
                  max-w-sm
                  text-sm
                  leading-7
                  text-slate-400
                "
              >
                Crea una contraseña única y evita
                utilizar información personal o claves
                que ya uses en otros servicios.
              </p>
            </div>
          </div>

          <div
            className="
              relative
              z-10
              rounded-[22px]
              border
              border-white/[0.09]
              bg-black/25
              p-5
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
                  border-emerald-500/20
                  bg-emerald-500/10
                  text-emerald-300
                "
              >
                <Icon
                  name="key"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Recomendación de seguridad
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Una contraseña más extensa y variada
                  resulta más difícil de vulnerar.
                </p>
              </div>
            </div>
          </div>
        </aside>


        {/* PANEL DERECHO */}

        <div className="p-6 sm:p-9 lg:p-11">
          <div className="flex justify-center lg:hidden">
            <img
              src={logo}
              alt="Black Ghost Finanzas"
              className="
                w-36
                object-contain
                drop-shadow-[0_0_30px_rgba(239,68,68,0.32)]
              "
            />
          </div>


          {/* VERIFICANDO */}

          {estadoEnlace === "VERIFICANDO" && (
            <div
              className="
                flex
                min-h-[500px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-red-500/25
                  bg-red-500/10
                  text-red-300
                "
              >
                <Icon
                  name="loader"
                  className="h-7 w-7 animate-spin"
                />
              </div>

              <h1 className="mt-6 text-2xl font-black text-white">
                Validando enlace
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Estamos comprobando la sesión de
                recuperación creada por Supabase.
              </p>
            </div>
          )}


          {/* INVÁLIDO */}

          {estadoEnlace === "INVALIDO" && (
            <div
              className="
                flex
                min-h-[500px]
                flex-col
                justify-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-red-500/30
                  bg-red-500/12
                  text-red-300
                "
              >
                <Icon
                  name="alert"
                  className="h-6 w-6"
                />
              </div>

              <h1
                className="
                  mt-6
                  text-[30px]
                  font-black
                  tracking-[-0.04em]
                  text-white
                "
              >
                Enlace no válido
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                {errorEnlace}
              </p>

              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/[0.07]
                  px-4
                  py-4
                "
              >
                <p className="text-sm leading-6 text-red-200">
                  Solicita un correo nuevo y utiliza
                  únicamente el enlace más reciente.
                </p>
              </div>

              <Link
                to="/recuperar"
                className="
                  mt-7
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border-2
                  border-red-400/30
                  bg-gradient-to-r
                  from-red-700
                  to-rose-600
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:from-red-600
                  hover:to-rose-500
                "
              >
                <Icon
                  name="refresh"
                  className="h-4 w-4"
                />

                SOLICITAR NUEVO ENLACE
              </Link>

              <Link
                to="/"
                className="
                  mt-5
                  flex
                  w-fit
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-slate-400
                  transition
                  hover:text-red-300
                "
              >
                <Icon
                  name="arrowLeft"
                  className="h-4 w-4"
                />

                Volver al inicio de sesión
              </Link>
            </div>
          )}


          {/* FORMULARIO */}

          {(estadoEnlace === "VALIDO" ||
            estadoEnlace === "COMPLETADO") && (
            <div className="mt-7 lg:mt-0">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-red-500/30
                  bg-red-500/12
                  text-red-300
                  shadow-[0_16px_45px_rgba(239,68,68,0.13)]
                "
              >
                <Icon
                  name={
                    estadoEnlace ===
                    "COMPLETADO"
                      ? "check"
                      : "lock"
                  }
                  className="h-5 w-5"
                />
              </div>

              <h1
                className="
                  mt-6
                  text-[30px]
                  font-black
                  tracking-[-0.04em]
                  text-white
                  sm:text-[34px]
                "
              >
                {estadoEnlace === "COMPLETADO"
                  ? "Contraseña actualizada"
                  : "Nueva contraseña"}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                {estadoEnlace === "COMPLETADO"
                  ? "Tu acceso fue actualizado correctamente."
                  : "Establece una nueva contraseña para proteger tu cuenta."}
              </p>


              {estadoEnlace === "VALIDO" && (
                <form
                  onSubmit={cambiarPassword}
                  className="mt-8 space-y-5"
                >
                  {/* NUEVA CONTRASEÑA */}

                  <div>
                    <label
                      htmlFor="nueva-password"
                      className="
                        mb-2.5
                        block
                        text-sm
                        font-bold
                        text-slate-300
                      "
                    >
                      Nueva contraseña
                    </label>

                    <div className="relative">
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
                        <Icon
                          name="lock"
                          className="h-4 w-4"
                        />
                      </div>

                      <input
                        id="nueva-password"
                        type={
                          mostrarPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        placeholder="Crea una contraseña segura"
                        className="
                          h-[52px]
                          w-full
                          rounded-xl
                          border-2
                          border-white/[0.12]
                          bg-black/35
                          pl-12
                          pr-12
                          text-sm
                          font-medium
                          text-white
                          outline-none
                          transition
                          placeholder:text-slate-600
                          focus:border-red-500/55
                          focus:ring-2
                          focus:ring-red-500/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setMostrarPassword(
                            (estado) => !estado
                          )
                        }
                        className="
                          absolute
                          right-2
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-white/[0.06]
                          hover:text-white
                        "
                      >
                        <Icon
                          name={
                            mostrarPassword
                              ? "eyeOff"
                              : "eye"
                          }
                          className="h-4 w-4"
                        />
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            ${fortaleza.barra}
                          `}
                          style={{
                            width: `${fortaleza.porcentaje}%`,
                          }}
                        />
                      </div>

                      <p
                        className={`
                          mt-2
                          text-xs
                          font-semibold
                          ${fortaleza.textoColor}
                        `}
                      >
                        Seguridad: {fortaleza.texto}
                      </p>
                    </div>
                  </div>


                  {/* REQUISITOS */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-2.5
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-black/20
                      p-4
                      sm:grid-cols-2
                    "
                  >
                    {[
                      {
                        texto: "Mínimo 8 caracteres",
                        valido:
                          reglasPassword.longitud,
                      },
                      {
                        texto: "Una letra mayúscula",
                        valido:
                          reglasPassword.mayuscula,
                      },
                      {
                        texto: "Una letra minúscula",
                        valido:
                          reglasPassword.minuscula,
                      },
                      {
                        texto: "Un número",
                        valido:
                          reglasPassword.numero,
                      },
                    ].map((regla) => (
                      <div
                        key={regla.texto}
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                        "
                      >
                        <span
                          className={`
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border

                            ${
                              regla.valido
                                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                                : "border-white/[0.10] bg-white/[0.03] text-slate-600"
                            }
                          `}
                        >
                          <Icon
                            name="check"
                            className="h-3 w-3"
                          />
                        </span>

                        <span
                          className={
                            regla.valido
                              ? "text-emerald-200"
                              : "text-slate-500"
                          }
                        >
                          {regla.texto}
                        </span>
                      </div>
                    ))}
                  </div>


                  {/* CONFIRMAR */}

                  <div>
                    <label
                      htmlFor="confirmar-password"
                      className="
                        mb-2.5
                        block
                        text-sm
                        font-bold
                        text-slate-300
                      "
                    >
                      Confirmar contraseña
                    </label>

                    <div className="relative">
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
                        <Icon
                          name="shield"
                          className="h-4 w-4"
                        />
                      </div>

                      <input
                        id="confirmar-password"
                        type={
                          mostrarConfirmacion
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Repite la contraseña"
                        className="
                          h-[52px]
                          w-full
                          rounded-xl
                          border-2
                          border-white/[0.12]
                          bg-black/35
                          pl-12
                          pr-12
                          text-sm
                          font-medium
                          text-white
                          outline-none
                          transition
                          placeholder:text-slate-600
                          focus:border-red-500/55
                          focus:ring-2
                          focus:ring-red-500/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setMostrarConfirmacion(
                            (estado) => !estado
                          )
                        }
                        className="
                          absolute
                          right-2
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-white/[0.06]
                          hover:text-white
                        "
                      >
                        <Icon
                          name={
                            mostrarConfirmacion
                              ? "eyeOff"
                              : "eye"
                          }
                          className="h-4 w-4"
                        />
                      </button>
                    </div>

                    {confirmPassword &&
                      password !==
                        confirmPassword && (
                        <p className="mt-2 text-xs font-semibold text-red-300">
                          Las contraseñas no coinciden.
                        </p>
                      )}

                    {confirmPassword &&
                      password ===
                        confirmPassword && (
                        <p className="mt-2 text-xs font-semibold text-emerald-300">
                          Las contraseñas coinciden.
                        </p>
                      )}
                  </div>


                  {error && (
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-500/30
                        bg-red-500/[0.08]
                        px-4
                        py-4
                        text-sm
                        font-semibold
                        text-red-200
                      "
                    >
                      <Icon
                        name="alert"
                        className="mt-0.5 h-5 w-5 shrink-0"
                      />

                      <p className="leading-5">
                        {error}
                      </p>
                    </div>
                  )}


                  <button
                    type="submit"
                    disabled={
                      cargando ||
                      !passwordValida ||
                      password !== confirmPassword
                    }
                    className="
                      flex
                      h-[52px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border-2
                      border-red-400/30
                      bg-gradient-to-r
                      from-red-700
                      via-red-600
                      to-rose-600
                      px-5
                      text-sm
                      font-black
                      tracking-wide
                      text-white
                      shadow-[0_18px_48px_rgba(239,68,68,0.22)]
                      transition
                      hover:-translate-y-0.5
                      hover:from-red-600
                      hover:to-rose-500
                      disabled:cursor-not-allowed
                      disabled:opacity-45
                    "
                  >
                    <Icon
                      name={
                        cargando
                          ? "loader"
                          : "key"
                      }
                      className={`
                        h-4
                        w-4
                        ${
                          cargando
                            ? "animate-spin"
                            : ""
                        }
                      `}
                    />

                    {cargando
                      ? "ACTUALIZANDO..."
                      : "GUARDAR NUEVA CONTRASEÑA"}
                  </button>
                </form>
              )}


              {/* ÉXITO */}

              {estadoEnlace === "COMPLETADO" && (
                <div
                  className="
                    mt-8
                    rounded-2xl
                    border
                    border-emerald-500/30
                    bg-emerald-500/[0.08]
                    px-5
                    py-5
                    text-emerald-200
                  "
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      name="check"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />

                    <div>
                      <p className="text-sm font-black">
                        Cambio completado
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-200/80">
                        {mensaje}
                      </p>
                    </div>
                  </div>
                </div>
              )}


              <div
                className="
                  mt-8
                  border-t
                  border-white/[0.08]
                  pt-6
                "
              >
                <Link
                  to="/"
                  className="
                    flex
                    w-fit
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-slate-400
                    transition
                    hover:text-red-300
                  "
                >
                  <Icon
                    name="arrowLeft"
                    className="h-4 w-4"
                  />

                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


export default CambiarPassword;