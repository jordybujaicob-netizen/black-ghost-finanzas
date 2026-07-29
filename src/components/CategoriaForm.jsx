import { useState } from "react";
import { supabase } from "../services/supabase";


const COLORES = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#22C55E",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
];


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
    expense: (
      <>
        <path d="M12 5v14" />
        <path d="m18 13-6 6-6-6" />
      </>
    ),

    income: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),

    food: (
      <>
        <path d="M7 3v8" />
        <path d="M4 3v5a3 3 0 0 0 6 0V3" />
        <path d="M7 11v10" />
        <path d="M17 3v18" />
        <path d="M17 3c-3 2-4 6-4 9h4" />
      </>
    ),

    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),

    game: (
      <>
        <path d="M8 8h8a5 5 0 0 1 4.7 6.7l-1.1 3.2a2 2 0 0 1-3.4.7L14 16h-4l-2.2 2.6a2 2 0 0 1-3.4-.7l-1.1-3.2A5 5 0 0 1 8 8Z" />
        <path d="M8 12v4" />
        <path d="M6 14h4" />
        <path d="M16 13h.01" />
        <path d="M18 15h.01" />
      </>
    ),

    health: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    ),

    transport: (
      <>
        <path d="M5 17h14" />
        <path d="M6 17 4 12l2-5h12l2 5-2 5" />
        <path d="M8 12h8" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
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

    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
  };

  return <svg {...props}>{icons[name] || icons.tag}</svg>;
}


function obtenerIcono(nombre, tipo) {
  const texto = nombre.trim().toLowerCase();

  if (texto.includes("comida") || texto.includes("aliment")) {
    return "food";
  }

  if (
    texto.includes("casa") ||
    texto.includes("hogar") ||
    texto.includes("alquiler")
  ) {
    return "home";
  }

  if (
    texto.includes("entreten") ||
    texto.includes("juego") ||
    texto.includes("ocio")
  ) {
    return "game";
  }

  if (
    texto.includes("salud") ||
    texto.includes("médic") ||
    texto.includes("medic")
  ) {
    return "health";
  }

  if (
    texto.includes("transport") ||
    texto.includes("movilidad") ||
    texto.includes("taxi")
  ) {
    return "transport";
  }

  if (tipo === "INGRESO") {
    return "income";
  }

  return "tag";
}


function colorConTransparencia(color, transparencia = "33") {
  const colorValido = /^#[0-9A-F]{6}$/i.test(color)
    ? color
    : "#EF4444";

  return `${colorValido}${transparencia}`;
}


function CategoriaForm({ actualizar }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("GASTO");
  const [color, setColor] = useState("#EF4444");

  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);


  function mostrarMensaje(texto, tipoMensaje = "success") {
    setMensaje({
      texto,
      tipo: tipoMensaje,
    });

    window.setTimeout(() => {
      setMensaje(null);
    }, 3500);
  }


  function seleccionarTipo(nuevoTipo) {
    setTipo(nuevoTipo);

    setColor(
      nuevoTipo === "INGRESO"
        ? "#10B981"
        : "#EF4444"
    );
  }


  function activarConTeclado(evento, accion) {
    if (
      evento.key === "Enter" ||
      evento.key === " "
    ) {
      evento.preventDefault();
      accion();
    }
  }


  async function crearCategoria(e) {
    e.preventDefault();

    if (guardando) return;

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      mostrarMensaje(
        "Ingresa un nombre para la categoría",
        "error"
      );

      return;
    }

    if (nombreLimpio.length < 2) {
      mostrarMensaje(
        "El nombre debe tener al menos 2 caracteres",
        "error"
      );

      return;
    }

    setGuardando(true);

    try {
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario || !user) {
        mostrarMensaje(
          "No existe una sesión activa",
          "error"
        );

        return;
      }


      /* EVITAR CATEGORÍAS DUPLICADAS */

      const {
        data: categoriasExistentes,
        error: errorBusqueda,
      } = await supabase
        .from("categorias")
        .select("id")
        .eq("tipo", tipo)
        .ilike("nombre", nombreLimpio)
        .or(`usuario_id.is.null,usuario_id.eq.${user.id}`)
        .limit(1);


      if (errorBusqueda) {
        console.log(errorBusqueda);

        mostrarMensaje(
          "No se pudo validar la categoría",
          "error"
        );

        return;
      }


      if (categoriasExistentes?.length > 0) {
        mostrarMensaje(
          `Ya existe una categoría de ${tipo === "INGRESO" ? "ingreso" : "gasto"} con ese nombre`,
          "error"
        );

        return;
      }


      const { error } = await supabase
        .from("categorias")
        .insert({
          usuario_id: user.id,
          nombre: nombreLimpio,
          tipo,
          color,
          activo: true,
        });


      if (error) {
        console.log(error);

        mostrarMensaje(
          "Error al crear la categoría",
          "error"
        );

        return;
      }


      setNombre("");
      setTipo("GASTO");
      setColor("#EF4444");

      mostrarMensaje(
        "Categoría creada correctamente",
        "success"
      );

      await actualizar?.();
    } finally {
      setGuardando(false);
    }
  }


  const nombreVista =
    nombre.trim() || "Nombre de categoría";

  const iconoVista = obtenerIcono(
    nombre,
    tipo
  );


  return (
    <form
      onSubmit={crearCategoria}
      className="w-full space-y-8"
    >
      <div
        className="
          grid
          grid-cols-1
          items-start
          gap-8
          lg:grid-cols-[minmax(0,1fr)_280px]
        "
      >
        {/* CAMPOS */}

        <div className="space-y-7">
          {/* NOMBRE */}

          <div>
            <div className="mb-2.5 flex items-center justify-between gap-4">
              <label
                htmlFor="nombre-categoria"
                className="
                  text-sm
                  font-bold
                  text-slate-300
                "
              >
                Nombre de la categoría
              </label>

              <span className="text-xs text-slate-500">
                {nombre.length}/40
              </span>
            </div>

            <input
              id="nombre-categoria"
              type="text"
              maxLength={40}
              autoComplete="off"
              placeholder="Ej: Alimentación, sueldo o estudios"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <p className="mt-2.5 text-xs leading-5 text-slate-500">
              El icono se asignará automáticamente según el nombre y el tipo.
            </p>
          </div>


          {/* TIPO VISUAL */}

          <div>
            <p className="mb-3 text-sm font-bold text-slate-300">
              Tipo de categoría
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                role="button"
                tabIndex={0}
                onClick={() => seleccionarTipo("GASTO")}
                onKeyDown={(e) =>
                  activarConTeclado(
                    e,
                    () => seleccionarTipo("GASTO")
                  )
                }
                className={`
                  cursor-pointer
                  rounded-2xl
                  border-2
                  p-4
                  outline-none
                  transition
                  duration-200

                  ${
                    tipo === "GASTO"
                      ? `
                        border-red-500/55
                        bg-red-500/[0.10]
                        shadow-[0_14px_35px_rgba(239,68,68,0.10)]
                      `
                      : `
                        border-white/[0.10]
                        bg-white/[0.025]
                        hover:border-red-500/25
                        hover:bg-red-500/[0.05]
                      `
                  }
                `}
              >
                <div className="flex items-center gap-3">
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

                      ${
                        tipo === "GASTO"
                          ? "border-red-500/35 bg-red-500/15 text-red-300"
                          : "border-white/10 bg-white/[0.04] text-slate-500"
                      }
                    `}
                  >
                    <Icon
                      name="expense"
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        font-black
                        ${
                          tipo === "GASTO"
                            ? "text-red-200"
                            : "text-slate-300"
                        }
                      `}
                    >
                      Gasto
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Dinero que sale
                    </p>
                  </div>
                </div>
              </div>


              <div
                role="button"
                tabIndex={0}
                onClick={() => seleccionarTipo("INGRESO")}
                onKeyDown={(e) =>
                  activarConTeclado(
                    e,
                    () => seleccionarTipo("INGRESO")
                  )
                }
                className={`
                  cursor-pointer
                  rounded-2xl
                  border-2
                  p-4
                  outline-none
                  transition
                  duration-200

                  ${
                    tipo === "INGRESO"
                      ? `
                        border-emerald-500/55
                        bg-emerald-500/[0.10]
                        shadow-[0_14px_35px_rgba(16,185,129,0.10)]
                      `
                      : `
                        border-white/[0.10]
                        bg-white/[0.025]
                        hover:border-emerald-500/25
                        hover:bg-emerald-500/[0.05]
                      `
                  }
                `}
              >
                <div className="flex items-center gap-3">
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

                      ${
                        tipo === "INGRESO"
                          ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-300"
                          : "border-white/10 bg-white/[0.04] text-slate-500"
                      }
                    `}
                  >
                    <Icon
                      name="income"
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`
                        font-black
                        ${
                          tipo === "INGRESO"
                            ? "text-emerald-200"
                            : "text-slate-300"
                        }
                      `}
                    >
                      Ingreso
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Dinero que entra
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* PALETA */}

          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-slate-300">
                Color identificador
              </p>

              <span className="text-xs font-semibold text-slate-500">
                {color.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-3 sm:grid-cols-12">
              {COLORES.map((opcion) => (
                <div
                  key={opcion}
                  role="button"
                  tabIndex={0}
                  title={opcion}
                  onClick={() => setColor(opcion)}
                  onKeyDown={(e) =>
                    activarConTeclado(
                      e,
                      () => setColor(opcion)
                    )
                  }
                  className={`
                    relative
                    aspect-square
                    cursor-pointer
                    rounded-xl
                    border-2
                    outline-none
                    transition
                    duration-200

                    ${
                      color.toUpperCase() === opcion
                        ? `
                          scale-110
                          border-white
                          shadow-[0_0_20px_rgba(255,255,255,0.24)]
                        `
                        : `
                          border-white/[0.08]
                          hover:scale-105
                          hover:border-white/35
                        `
                    }
                  `}
                  style={{
                    backgroundColor: opcion,
                  }}
                >
                  {color.toUpperCase() === opcion && (
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        text-white
                        drop-shadow-lg
                      "
                    >
                      <Icon
                        name="check"
                        className="h-4 w-4"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-white/[0.09]
                bg-black/20
                p-3
              "
            >
              <p className="mb-2 text-xs font-semibold text-slate-500">
                Elegir un color personalizado
              </p>

              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value.toUpperCase())
                }
                title="Seleccionar color personalizado"
              />
            </div>
          </div>
        </div>


        {/* VISTA PREVIA */}

        <aside
          className="
            rounded-[24px]
            border-2
            bg-[#070a11]/88
            p-5
            shadow-[0_24px_70px_rgba(0,0,0,0.28)]
            backdrop-blur-xl
            lg:sticky
            lg:top-6
          "
          style={{
            borderColor: colorConTransparencia(
              color,
              "66"
            ),
            boxShadow: `0 24px 70px ${colorConTransparencia(
              color,
              "16"
            )}`,
          }}
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Vista previa
          </p>

          <div className="mt-5 flex items-start gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border-2
              "
              style={{
                color,
                borderColor:
                  colorConTransparencia(color, "66"),
                backgroundColor:
                  colorConTransparencia(color, "1F"),
              }}
            >
              <Icon
                name={iconoVista}
                className="h-5 w-5"
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  break-words
                  text-lg
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {nombreVista}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className="
                    rounded-lg
                    border
                    px-2.5
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.08em]
                  "
                  style={{
                    color,
                    borderColor:
                      colorConTransparencia(color, "55"),
                    backgroundColor:
                      colorConTransparencia(color, "16"),
                  }}
                >
                  {tipo}
                </span>

                <span
                  className="
                    rounded-lg
                    border
                    border-white/[0.10]
                    bg-white/[0.04]
                    px-2.5
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                  "
                >
                  Personalizada
                </span>
              </div>
            </div>
          </div>

          <div
            className="
              mt-7
              rounded-2xl
              border
              border-white/[0.08]
              bg-black/25
              px-4
              py-4
            "
          >
            <p className="text-xs font-semibold text-slate-500">
              Uso registrado
            </p>

            <p className="mt-1 text-sm font-black text-slate-200">
              0 movimientos
            </p>
          </div>

          <div
            className="
              mt-4
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-4
              py-3
            "
          >
            <p className="text-xs leading-5 text-slate-500">
              Así aparecerá aproximadamente en tu listado de categorías.
            </p>
          </div>
        </aside>
      </div>


      {/* MENSAJE */}

      {mensaje && (
        <div
          className={`
            flex
            items-start
            gap-3
            rounded-2xl
            border
            px-4
            py-4
            text-sm
            font-semibold

            ${
              mensaje.tipo === "error"
                ? `
                  border-red-500/30
                  bg-red-500/[0.08]
                  text-red-200
                `
                : `
                  border-emerald-500/30
                  bg-emerald-500/[0.08]
                  text-emerald-200
                `
            }
          `}
        >
          <div
            className={`
              mt-0.5
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg

              ${
                mensaje.tipo === "error"
                  ? "bg-red-500/15 text-red-300"
                  : "bg-emerald-500/15 text-emerald-300"
              }
            `}
          >
            <Icon
              name={
                mensaje.tipo === "error"
                  ? "alert"
                  : "check"
              }
              className="h-4 w-4"
            />
          </div>

          <p className="leading-6">
            {mensaje.texto}
          </p>
        </div>
      )}


      {/* BOTÓN */}

      <button
        type="submit"
        disabled={guardando}
      >
        {guardando
          ? "CREANDO CATEGORÍA..."
          : "CREAR CATEGORÍA"}
      </button>
    </form>
  );
}


export default CategoriaForm;