import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Movimientos from "./pages/Movimientos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cuentas from "./pages/Cuentas";
import Configuracion from "./pages/Configuracion";
import Categorias from "./pages/Categorias";
import Recuperar from "./pages/Recuperar";
import CambiarPassword from "./pages/CambiarPassword";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";


function MenuIcon({ abierto }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {abierto ? (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}


function Layout({ children }) {
  const location = useLocation();

  const [sidebarAbierto, setSidebarAbierto] = useState(false);


  useEffect(() => {
    setSidebarAbierto(false);
  }, [location.pathname]);


  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        setSidebarAbierto(false);
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, []);


  useEffect(() => {
    if (!sidebarAbierto) return;

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [sidebarAbierto]);


  return (
    <div
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-[#04060b]
        text-white
      "
    >
      {/* FONDO PRINCIPAL */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/background-blackghost.png')",
          backgroundPosition: "center 42%",
        }}
      />


      {/* CAPA OSCURA SUAVE */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-[1]
          bg-[linear-gradient(180deg,rgba(2,4,9,0.08)_0%,rgba(2,4,9,0.14)_48%,rgba(2,4,9,0.34)_100%)]
        "
      />


      {/* ILUMINACIÓN AMBIENTAL */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-[2]
          bg-[radial-gradient(circle_at_18%_5%,rgba(220,38,38,0.10),transparent_27%),radial-gradient(circle_at_82%_4%,rgba(91,33,182,0.06),transparent_30%)]
        "
      />


      {/* CAPA OSCURA DEL MENÚ MÓVIL */}

      {sidebarAbierto && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={() => setSidebarAbierto(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}


      {/* ESTRUCTURA GENERAL */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          min-w-0
        "
      >
        {/* SIDEBAR RESPONSIVE */}

        <div
          className={`
            fixed
            inset-y-0
            left-0
            z-50
            h-screen
            w-[264px]
            shrink-0
            transform
            transition-transform
            duration-300
            ease-out

            lg:static
            lg:z-auto
            lg:translate-x-0

            ${
              sidebarAbierto
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* BOTÓN CERRAR EN CELULAR */}

          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setSidebarAbierto(false)}
            className="
              absolute
              right-4
              top-4
              z-[70]
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-black/45
              text-slate-300
              shadow-[0_12px_35px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
              transition
              hover:border-red-500/30
              hover:bg-red-500/10
              hover:text-red-300
              lg:hidden
            "
          >
            <MenuIcon abierto />
          </button>

          <Sidebar />
        </div>


        {/* CONTENIDO PRINCIPAL */}

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            overscroll-contain
          "
        >
          {/* BARRA MÓVIL */}

          <div
            className="
              sticky
              top-0
              z-30
              flex
              h-[68px]
              items-center
              justify-between
              border-b
              border-white/[0.08]
              bg-[#050810]/82
              px-4
              shadow-[0_12px_40px_rgba(0,0,0,0.20)]
              backdrop-blur-2xl
              lg:hidden
            "
          >
            <button
              type="button"
              aria-label="Abrir menú lateral"
              aria-expanded={sidebarAbierto}
              onClick={() => setSidebarAbierto(true)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-red-500/25
                bg-red-500/10
                text-red-300
                shadow-[0_10px_30px_rgba(239,68,68,0.10)]
                transition
                hover:border-red-400/40
                hover:bg-red-500/16
              "
            >
              <MenuIcon abierto={false} />
            </button>

            <div className="text-right">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                Black Ghost
              </p>

              <p className="mt-0.5 text-sm font-black text-white">
                Finanzas
              </p>
            </div>
          </div>


          {/* CONTENIDO CENTRADO */}

          <div
            className="
              mx-auto
              min-h-full
              w-full
              max-w-[1180px]
              px-4
              pb-20
              pt-6

              sm:px-6
              sm:pb-24
              sm:pt-8

              lg:px-8
              lg:pb-24
              lg:pt-10

              xl:px-0
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/recuperar"
          element={<Recuperar />}
        />

        <Route
          path="/cambiar-password"
          element={<CambiarPassword />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* MOVIMIENTOS */}

        <Route
          path="/movimientos"
          element={
            <ProtectedRoute>
              <Layout>
                <Movimientos />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* CUENTAS */}

        <Route
          path="/cuentas"
          element={
            <ProtectedRoute>
              <Layout>
                <Cuentas />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* CATEGORÍAS */}

        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <Layout>
                <Categorias />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* CONFIGURACIÓN */}

        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Layout>
                <Configuracion />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;