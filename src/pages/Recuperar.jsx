import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../services/supabase";
import logo from "../assets/logo-blackghost.png";


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
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    arrowLeft: (
      <>
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h10" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),

    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}


function Recuperar() {
  const [correo, setCorreo] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [segundos, setSegundos] = useState(0);


  useEffect(() => {
    if (segundos <= 0) return;

    const intervalo = window.setInterval(() => {
      setSegundos((valorActual) => {
        if (valorActual <= 1) {
          window.clearInterval(intervalo);
          return 0;
        }

        return valorActual - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [segundos]);


  function correoEsValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }


  async function enviarCorreo(e) {
    e.preventDefault();

    if (cargando || segundos > 0) return;

    setMensaje("");
    setError("");

    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!correoEsValido(correoLimpio)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setCargando(true);

    try {
      const baseUrl = (
        import.meta.env.VITE_SITE_URL ||
        window.location.origin
      ).replace(/\/$/, "");

      const { error: errorRecuperacion } =
        await supabase.auth.resetPasswordForEmail(
          correoLimpio,
          {
            redirectTo: `${baseUrl}/cambiar-password`,
          }
        );

      if (errorRecuperacion) {
        console.error(
          "Error enviando correo de recuperación:",
          errorRecuperacion
        );

        const limiteExcedido =
          errorRecuperacion.status === 429 ||
          errorRecuperacion.message
            ?.toLowerCase()
            .includes("rate");

        setError(
          limiteExcedido
            ? "Se realizaron demasiados intentos. Espera unos minutos antes de volver a intentarlo."
            : "No se pudo enviar el enlace. Verifica el correo e inténtalo nuevamente."
        );

        return;
      }

      setCorreo(correoLimpio);
      setEnviado(true);
      setSegundos(60);

      /*
        Mensaje genérico para no revelar si una dirección
        está registrada o no.
      */

      setMensaje(
        "Si existe una cuenta asociada a este correo, recibirás un enlace para cambiar tu contraseña."
      );
    } finally {
      setCargando(false);
    }
  }


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
          bg-[linear-gradient(115deg,rgba(2,4,9,0.90)_0%,rgba(2,4,9,0.70)_48%,rgba(2,4,9,0.83)_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_18%_18%,rgba(239,68,68,0.20),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(91,33,182,0.10),transparent_35%)]
        "
      />


      {/* CONTENEDOR */}

      <section
        className="
          relative
          z-10
          grid
          w-full
          max-w-[960px]
          overflow-hidden
          rounded-[32px]
          border-2
          border-white/[0.12]
          bg-[#070a11]/78
          shadow-[0_35px_120px_rgba(0,0,0,0.70)]
          backdrop-blur-2xl
          lg:grid-cols-[0.92fr_1.08fr]
        "
      >
        {/* INFORMACIÓN LATERAL */}

        <aside
          className="
            relative
            hidden
            min-h-[600px]
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
              bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.18),transparent_36%),linear-gradient(180deg,rgba(8,12,20,0.15),rgba(4,6,11,0.88))]
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
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-red-500/20
                  bg-red-500/[0.08]
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-red-300
                "
              >
                <Icon
                  name="shield"
                  className="h-3.5 w-3.5"
                />

                Recuperación segura
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
                Recupera el acceso a tus finanzas.
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
                Enviaremos un enlace seguro a tu correo.
                Desde ese enlace podrás establecer una nueva
                contraseña.
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
                  name="lock"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Tus datos están protegidos
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Nunca te pediremos tu contraseña actual por
                  correo electrónico.
                </p>
              </div>
            </div>
          </div>
        </aside>


        {/* FORMULARIO */}

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
              <Icon name="mail" className="h-5 w-5" />
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
              Recuperar acceso
            </h1>

            <p
              className="
                mt-3
                max-w-md
                text-sm
                leading-6
                text-slate-400
              "
            >
              Introduce el correo vinculado a tu cuenta de
              BLACK GHOST.
            </p>
          </div>


          <form
            onSubmit={enviarCorreo}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="correo-recuperacion"
                className="
                  mb-2.5
                  block
                  text-sm
                  font-bold
                  text-slate-300
                "
              >
                Correo electrónico
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
                    name="mail"
                    className="h-4 w-4"
                  />
                </div>

                <input
                  id="correo-recuperacion"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) =>
                    setCorreo(e.target.value)
                  }
                  className="
                    h-13
                    w-full
                    rounded-xl
                    border-2
                    border-white/[0.12]
                    bg-black/35
                    pl-12
                    pr-4
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
              </div>
            </div>


            {/* ERROR */}

            {error && (
              <div
                role="alert"
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
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-500/15
                    text-red-300
                  "
                >
                  <Icon
                    name="alert"
                    className="h-4 w-4"
                  />
                </div>

                <p className="pt-1.5 leading-5">
                  {error}
                </p>
              </div>
            )}


            {/* MENSAJE DE ÉXITO */}

            {mensaje && (
              <div
                role="status"
                className="
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-500/30
                  bg-emerald-500/[0.08]
                  px-4
                  py-4
                  text-sm
                  font-semibold
                  text-emerald-200
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-500/15
                    text-emerald-300
                  "
                >
                  <Icon
                    name="check"
                    className="h-4 w-4"
                  />
                </div>

                <p className="pt-1.5 leading-5">
                  {mensaje}
                </p>
              </div>
            )}


            <button
              type="submit"
              disabled={cargando || segundos > 0}
              className="
                flex
                h-13
                w-full
                items-center
                justify-center
                gap-2.5
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
                disabled:opacity-55
              "
            >
              <Icon
                name="send"
                className="h-4 w-4"
              />

              {cargando
                ? "ENVIANDO..."
                : segundos > 0
                  ? `REENVIAR EN ${segundos}s`
                  : enviado
                    ? "REENVIAR ENLACE"
                    : "ENVIAR ENLACE"}
            </button>
          </form>


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
      </section>
    </main>
  );
}


export default Recuperar;