import { useEffect, useMemo, useState } from "react";

import { supabase } from "../services/supabase";
import CategoriaForm from "../components/CategoriaForm";


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
    categories: (
      <>
        <path d="m12 3 9 9-9 9-9-9Z" />
        <circle cx="12" cy="12" r="2.25" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
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
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    filter: <path d="M4 5h16l-6.5 7.2V18l-3 1.5v-7.3Z" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6 18 21H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
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
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </>
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
  };

  return <svg {...props}>{icons[name] || icons.tag}</svg>;
}


const COLOR_OPTIONS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#22C55E",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#D946EF",
  "#EC4899",
];


function normalizarColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color || "") ? color : "#EF4444";
}


function colorConAlpha(color, alpha = "33") {
  return `${normalizarColor(color)}${alpha}`;
}


function obtenerIconoCategoria(nombre, tipo) {
  const texto = String(nombre || "").toLowerCase();

  if (texto.includes("comida") || texto.includes("aliment")) return "food";
  if (texto.includes("casa") || texto.includes("hogar")) return "home";
  if (texto.includes("entreten") || texto.includes("ocio")) return "game";
  if (texto.includes("salud") || texto.includes("médic")) return "health";
  if (texto.includes("transport") || texto.includes("movilidad")) return "transport";
  if (tipo === "INGRESO") return "income";

  return "tag";
}


function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[26px] border-2 border-white/[0.08] bg-[#080c14]/58 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/[0.08]" />
        <div className="flex-1">
          <div className="h-4 w-2/5 rounded bg-white/[0.08]" />
          <div className="mt-3 h-3 w-1/4 rounded bg-white/[0.05]" />
        </div>
      </div>

      <div className="mt-8 h-3 w-1/3 rounded bg-white/[0.05]" />
      <div className="mt-6 h-11 rounded-xl bg-white/[0.06]" />
    </div>
  );
}


function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [usoPorCategoria, setUsoPorCategoria] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("GASTO");
  const [color, setColor] = useState("#EF4444");

  const [categoriaConfirmar, setCategoriaConfirmar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [mensaje, setMensaje] = useState(null);


  useEffect(() => {
    cargarCategorias();
  }, []);


  const categoriasFiltradas = useMemo(() => {
    let lista = [...categorias];

    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();
      lista = lista.filter((cat) =>
        String(cat.nombre || "").toLowerCase().includes(texto)
      );
    }

    if (filtroTipo === "GASTO" || filtroTipo === "INGRESO") {
      lista = lista.filter((cat) => cat.tipo === filtroTipo);
    }

    if (filtroTipo === "GENERAL") {
      lista = lista.filter((cat) => !cat.tipo || cat.tipo === "GENERAL");
    }

    return lista;
  }, [categorias, busqueda, filtroTipo]);


  const resumen = useMemo(() => {
    return {
      total: categorias.length,
      gastos: categorias.filter((cat) => cat.tipo === "GASTO").length,
      ingresos: categorias.filter((cat) => cat.tipo === "INGRESO").length,
      personalizadas: categorias.filter((cat) => Boolean(cat.usuario_id)).length,
      sistema: categorias.filter((cat) => !cat.usuario_id).length,
    };
  }, [categorias]);


  function mostrarMensaje(texto, tipoMensaje = "success") {
    setMensaje({ texto, tipo: tipoMensaje });

    window.setTimeout(() => {
      setMensaje(null);
    }, 3200);
  }


  function actualizar() {
    cargarCategorias();
  }


  async function cargarCategorias() {
    setCargando(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCargando(false);
      return;
    }

    const [resultadoCategorias, resultadoMovimientos] = await Promise.all([
      supabase
        .from("categorias")
        .select("*")
        .or(`usuario_id.is.null,usuario_id.eq.${user.id}`)
        .order("nombre"),

      supabase
        .from("movimientos")
        .select("categoria_id")
        .eq("usuario_id", user.id),
    ]);

    if (resultadoCategorias.error) {
      console.log(resultadoCategorias.error);
      mostrarMensaje("No se pudieron cargar las categorías", "error");
      setCargando(false);
      return;
    }

    if (resultadoMovimientos.error) {
      console.log(resultadoMovimientos.error);
    }

    const conteo = {};

    (resultadoMovimientos.data || []).forEach((mov) => {
      if (!mov.categoria_id) return;
      conteo[mov.categoria_id] = (conteo[mov.categoria_id] || 0) + 1;
    });

    setUsoPorCategoria(conteo);
    setCategorias(resultadoCategorias.data || []);
    setCargando(false);
  }


  function editarCategoria(cat) {
    if (!cat.usuario_id) {
      mostrarMensaje("Las categorías del sistema son de solo lectura", "warning");
      return;
    }

    setEditando(cat);
    setNombre(cat.nombre || "");
    setTipo(cat.tipo || "GASTO");
    setColor(normalizarColor(cat.color));
  }


  async function guardarEdicion(e) {
    e.preventDefault();

    if (!editando || guardandoEdicion) return;

    if (!nombre.trim()) {
      mostrarMensaje("Escribe un nombre para la categoría", "error");
      return;
    }

    setGuardandoEdicion(true);

    const { error } = await supabase
      .from("categorias")
      .update({
        nombre: nombre.trim(),
        tipo,
        color: normalizarColor(color),
      })
      .eq("id", editando.id);

    setGuardandoEdicion(false);

    if (error) {
      console.log(error);
      mostrarMensaje("Error al actualizar la categoría", "error");
      return;
    }

    cerrarEdicion();
    mostrarMensaje("Categoría actualizada correctamente");
    cargarCategorias();
  }


  function solicitarEliminar(cat) {
    if (!cat.usuario_id) {
      mostrarMensaje("Las categorías del sistema no se pueden eliminar", "warning");
      return;
    }

    setCategoriaConfirmar(cat);
  }


  async function confirmarEliminacion() {
    if (!categoriaConfirmar || eliminando) return;

    setEliminando(true);

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", categoriaConfirmar.id);

    setEliminando(false);

    if (error) {
      console.log(error);
      mostrarMensaje(
        "No se pudo eliminar. Verifica si tiene movimientos asociados.",
        "error"
      );
      return;
    }

    setCategoriaConfirmar(null);
    mostrarMensaje("Categoría eliminada correctamente");
    cargarCategorias();
  }


  function cerrarEdicion() {
    setEditando(null);
    setNombre("");
    setTipo("GASTO");
    setColor("#EF4444");
  }


  function irANuevaCategoria() {
    document
      .getElementById("nueva-categoria")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }


  const inputClass = `
    h-12
    w-full
    rounded-xl
    border-2
    border-white/[0.12]
    bg-black/35
    px-4
    text-sm
    font-medium
    text-white
    outline-none
    transition
    placeholder:text-slate-500
    focus:border-red-500/55
    focus:ring-2
    focus:ring-red-500/10
  `;


  return (
    <div className="w-full min-w-0">
      {/* CABECERA */}

      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-red-500/35 bg-red-500/12 text-red-300 shadow-[0_18px_48px_rgba(239,68,68,0.12)]">
            <Icon name="categories" className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-[38px] font-black tracking-[-0.045em] text-white">
              Categorías
            </h1>

            <p className="mt-2 text-base font-medium text-slate-300">
              Organiza tus movimientos con una estructura clara y personalizada.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={irANuevaCategoria}
          className="flex h-12 w-fit items-center gap-2 rounded-xl border-2 border-red-400/35 bg-gradient-to-r from-red-700 via-red-600 to-rose-600 px-5 text-sm font-black text-white shadow-[0_16px_44px_rgba(239,68,68,0.20)] transition hover:-translate-y-0.5 hover:from-red-600 hover:to-rose-500"
        >
          <Icon name="plus" className="h-4 w-4" />
          Nueva categoría
        </button>
      </header>


      {/* RESUMEN */}

      <section className="mb-12 rounded-[28px] border-2 border-white/[0.13] bg-[#080c14]/68 px-7 py-7 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-8">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-500/30 bg-blue-500/12 text-blue-300">
              <Icon name="layers" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Total categorías
              </p>
              <p className="mt-2 text-[22px] font-black text-white">{resumen.total}</p>
              <p className="mt-1 text-xs text-slate-500">{resumen.sistema} del sistema</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-red-500/30 bg-red-500/12 text-red-300">
              <Icon name="expense" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Categorías de gasto
              </p>
              <p className="mt-2 text-[22px] font-black text-red-300">{resumen.gastos}</p>
              <p className="mt-1 text-xs text-red-300/65">Control de egresos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/12 text-emerald-300">
              <Icon name="income" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Categorías de ingreso
              </p>
              <p className="mt-2 text-[22px] font-black text-emerald-300">{resumen.ingresos}</p>
              <p className="mt-1 text-xs text-emerald-300/65">Entradas de dinero</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-violet-500/30 bg-violet-500/12 text-violet-300">
              <Icon name="user" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Personalizadas
              </p>
              <p className="mt-2 text-[22px] font-black text-violet-300">
                {resumen.personalizadas}
              </p>
              <p className="mt-1 text-xs text-violet-300/65">Creadas por ti</p>
            </div>
          </div>
        </div>
      </section>


      {/* BÚSQUEDA Y FILTROS */}

      <section className="mb-9 rounded-[24px] border-2 border-white/[0.11] bg-[#080c14]/62 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="mb-2.5 block pl-1 text-sm font-semibold text-slate-300">
              Buscar categoría
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Icon name="search" className="h-4 w-4" />
              </div>

              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre..."
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          <div className="lg:w-[250px]">
            <label className="mb-2.5 block pl-1 text-sm font-semibold text-slate-300">
              Tipo de categoría
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Icon name="filter" className="h-4 w-4" />
              </div>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={`${inputClass} pl-11`}
              >
                <option value="TODOS">Todas las categorías</option>
                <option value="GASTO">Gastos</option>
                <option value="INGRESO">Ingresos</option>
                <option value="GENERAL">Generales</option>
              </select>
            </div>
          </div>
        </div>
      </section>


      {/* LISTADO */}

      <section className="mb-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Mis categorías
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {categoriasFiltradas.length} resultados encontrados
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400">
            <Icon name="shield" className="h-4 w-4 text-emerald-300" />
            Las categorías del sistema están protegidas
          </div>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="rounded-[28px] border-2 border-dashed border-white/[0.12] bg-[#080c14]/55 px-8 py-16 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.05] text-slate-500">
              <Icon name="search" />
            </div>

            <p className="mt-5 text-base font-bold text-slate-200">
              No encontramos categorías
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Cambia los filtros o crea una nueva categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {categoriasFiltradas.map((cat) => {
              const colorCategoria = normalizarColor(cat.color);
              const esPersonalizada = Boolean(cat.usuario_id);
              const tipoCategoria = cat.tipo || "GENERAL";
              const cantidadMovimientos = usoPorCategoria[cat.id] || 0;

              return (
                <article
                  key={cat.id}
                  className="group relative overflow-hidden rounded-[26px] border-2 bg-[#080c14]/70 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[#0b1018]/82"
                  style={{
                    borderColor: colorConAlpha(colorCategoria, "66"),
                    boxShadow: `0 22px 60px ${colorConAlpha(colorCategoria, "12")}`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl"
                    style={{ backgroundColor: colorConAlpha(colorCategoria, "14") }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2"
                          style={{
                            color: colorCategoria,
                            borderColor: colorConAlpha(colorCategoria, "66"),
                            backgroundColor: colorConAlpha(colorCategoria, "1F"),
                          }}
                        >
                          <Icon
                            name={obtenerIconoCategoria(cat.nombre, cat.tipo)}
                            className="h-5 w-5"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-black tracking-tight text-white">
                            {cat.nombre}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className="rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]"
                              style={{
                                color: colorCategoria,
                                borderColor: colorConAlpha(colorCategoria, "55"),
                                backgroundColor: colorConAlpha(colorCategoria, "16"),
                              }}
                            >
                              {tipoCategoria}
                            </span>

                            <span className="rounded-lg border border-white/[0.10] bg-white/[0.045] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                              {esPersonalizada ? "Personalizada" : "Sistema"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Uso registrado
                        </p>
                        <p className="mt-1 text-sm font-black text-slate-200">
                          {cantidadMovimientos} {cantidadMovimientos === 1 ? "movimiento" : "movimientos"}
                        </p>
                      </div>

                      <Icon name="activity" className="h-5 w-5 text-slate-600" />
                    </div>

                    {esPersonalizada ? (
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => editarCategoria(cat)}
                          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/[0.08] px-4 text-sm font-bold text-blue-300 transition hover:border-blue-400/45 hover:bg-blue-500/15"
                        >
                          <Icon name="edit" className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => solicitarEliminar(cat)}
                          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 text-sm font-bold text-red-300 transition hover:border-red-400/45 hover:bg-red-500/15"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-slate-500">
                        <Icon name="shield" className="h-4 w-4" />
                        Categoría protegida
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>


      {/* NUEVA CATEGORÍA */}

      <section
        id="nueva-categoria"
        className="scroll-mt-10 rounded-[28px] border-2 border-red-500/30 bg-[#080c14]/72 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-8"
      >
        <div className="mb-7 flex items-center gap-3 border-b border-white/[0.09] pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-300">
            <Icon name="plus" className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">Nueva categoría</h2>
            <p className="mt-1 text-sm text-slate-400">
              Crea una categoría personalizada para organizar mejor tus finanzas.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[760px] [&_form]:!m-0 [&_form]:!w-full [&_form]:!max-w-none [&_form]:!border-0 [&_form]:!bg-transparent [&_form]:!p-0 [&_form]:!shadow-none [&_form_h1]:!hidden [&_form_h2]:!hidden [&_form_input]:!h-12 [&_form_input]:!w-full [&_form_input]:!rounded-xl [&_form_input]:!border-2 [&_form_input]:!border-white/[0.12] [&_form_input]:!bg-black/35 [&_form_input]:!px-4 [&_form_input]:!text-sm [&_form_input]:!font-medium [&_form_input]:!text-white [&_form_input]:placeholder:!text-slate-500 [&_form_input]:focus:!border-red-500/55 [&_form_select]:!h-12 [&_form_select]:!w-full [&_form_select]:!rounded-xl [&_form_select]:!border-2 [&_form_select]:!border-white/[0.12] [&_form_select]:!bg-[#06090f] [&_form_select]:!px-4 [&_form_select]:!text-sm [&_form_select]:!font-medium [&_form_select]:!text-white [&_form_select]:focus:!border-red-500/55 [&_form_button]:!h-12 [&_form_button]:!w-full [&_form_button]:!rounded-xl [&_form_button]:!border-2 [&_form_button]:!border-red-400/30 [&_form_button]:!bg-gradient-to-r [&_form_button]:!from-red-700 [&_form_button]:!to-rose-600 [&_form_button]:!px-5 [&_form_button]:!text-sm [&_form_button]:!font-black [&_form_button]:!text-white">
          <CategoriaForm actualizar={actualizar} />
        </div>
      </section>


      {/* MODAL EDITAR */}

      {editando && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-5 backdrop-blur-md">
          <section className="w-full max-w-lg overflow-hidden rounded-[28px] border-2 border-blue-500/25 bg-[#080c14]/96 shadow-[0_32px_110px_rgba(0,0,0,0.72)]">
            <header className="flex items-center justify-between border-b border-white/[0.09] px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-white">Editar categoría</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Actualiza el nombre, tipo y color.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarEdicion}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.09] hover:text-white"
              >
                <Icon name="close" />
              </button>
            </header>

            <form onSubmit={guardarEdicion} className="space-y-5 p-6">
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Nombre
                </label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={inputClass}
                >
                  <option value="GASTO">Gasto</option>
                  <option value="INGRESO">Ingreso</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-300">
                  Color
                </label>

                <div className="grid grid-cols-5 gap-3">
                  {COLOR_OPTIONS.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => setColor(opcion)}
                      className={`h-10 rounded-xl border-2 transition ${
                        normalizarColor(color) === opcion
                          ? "scale-[1.04] border-white shadow-[0_0_20px_rgba(255,255,255,0.18)]"
                          : "border-white/[0.08] hover:scale-[1.03] hover:border-white/25"
                      }`}
                      style={{ backgroundColor: opcion }}
                      title={opcion}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.10] bg-black/25 p-3">
                  <input
                    type="color"
                    value={normalizarColor(color)}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="text-sm font-semibold text-slate-300">
                    {normalizarColor(color).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={cerrarEdicion}
                  className="h-12 flex-1 rounded-xl border border-white/[0.10] bg-white/[0.05] px-5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.09]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardandoEdicion}
                  className="h-12 flex-1 rounded-xl border-2 border-blue-400/30 bg-blue-600 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}


      {/* MODAL ELIMINAR */}

      {categoriaConfirmar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-5 backdrop-blur-md">
          <section className="w-full max-w-md overflow-hidden rounded-[28px] border-2 border-red-500/30 bg-[#080c14]/97 shadow-[0_32px_110px_rgba(0,0,0,0.75)]">
            <div className="p-7 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-red-500/30 bg-red-500/12 text-red-300">
                <Icon name="trash" className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-black text-white">
                Eliminar categoría
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Estás a punto de eliminar
                <span className="font-bold text-white"> {categoriaConfirmar.nombre}</span>.
                Esta acción no se puede deshacer.
              </p>

              <div className="mt-5 rounded-2xl border border-white/[0.09] bg-black/25 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Movimientos asociados
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {usoPorCategoria[categoriaConfirmar.id] || 0}
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategoriaConfirmar(null)}
                  className="h-12 rounded-xl border border-white/[0.10] bg-white/[0.05] px-5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.09]"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmarEliminacion}
                  disabled={eliminando}
                  className="h-12 rounded-xl border-2 border-red-400/30 bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {eliminando ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}


      {/* MENSAJE */}

      {mensaje && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-[calc(100vw-48px)] rounded-2xl border-2 bg-[#080c14]/95 px-5 py-4 text-sm font-semibold text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
          style={{
            borderColor:
              mensaje.tipo === "error"
                ? "rgba(239,68,68,0.42)"
                : mensaje.tipo === "warning"
                  ? "rgba(245,158,11,0.42)"
                  : "rgba(16,185,129,0.42)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  mensaje.tipo === "error"
                    ? "#F87171"
                    : mensaje.tipo === "warning"
                      ? "#FBBF24"
                      : "#34D399",
              }}
            />
            {mensaje.texto}
          </div>
        </div>
      )}
    </div>
  );
}


export default Categorias;
