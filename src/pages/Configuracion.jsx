import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { supabase } from "../services/supabase";


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
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.7a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.7h4.4l.4-2.7a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    wallet: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
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

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),

    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),

    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),

    excel: (
      <>
        <path d="M6 2h9l4 4v16H6Z" />
        <path d="M15 2v5h5" />
        <path d="m9 12 5 6" />
        <path d="m14 12-5 6" />
      </>
    ),

    pdf: (
      <>
        <path d="M6 2h9l4 4v16H6Z" />
        <path d="M15 2v5h5" />
        <path d="M9 13h2a2 2 0 0 1 0 4H9Z" />
        <path d="M14 13v4" />
        <path d="M14 13h2" />
      </>
    ),

    file: (
      <>
        <path d="M6 2h9l4 4v16H6Z" />
        <path d="M15 2v5h5" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    ),

    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l2 2v16H5Z" />
        <path d="M8 3v6h8V3" />
        <path d="M8 21v-7h8v7" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),

    activity: (
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    ),

    palette: (
      <>
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12Z" />
        <circle cx="8" cy="9" r=".8" />
        <circle cx="10" cy="6" r=".8" />
        <circle cx="15" cy="7" r=".8" />
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

  return <svg {...props}>{icons[name]}</svg>;
}


function SectionHeader({
  icon,
  title,
  description,
  theme = "red",
}) {
  const themes = {
    red: "border-red-500/25 bg-red-500/10 text-red-300",
    blue: "border-blue-500/25 bg-blue-500/10 text-blue-300",
    emerald:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    violet:
      "border-violet-500/25 bg-violet-500/10 text-violet-300",
  };

  return (
    <div className="flex items-start gap-3 border-b border-white/[0.08] pb-6">
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          ${themes[theme]}
        `}
      >
        <Icon name={icon} className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <h2 className="text-lg font-black tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}


function SummaryCard({
  icon,
  label,
  value,
  detail,
  theme = "red",
}) {
  const themes = {
    red: {
      border: "border-red-500/25",
      icon: "border-red-500/25 bg-red-500/10 text-red-300",
      value: "text-red-300",
    },

    blue: {
      border: "border-blue-500/25",
      icon: "border-blue-500/25 bg-blue-500/10 text-blue-300",
      value: "text-blue-300",
    },

    emerald: {
      border: "border-emerald-500/25",
      icon: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
      value: "text-emerald-300",
    },

    violet: {
      border: "border-violet-500/25",
      icon: "border-violet-500/25 bg-violet-500/10 text-violet-300",
      value: "text-violet-300",
    },
  };

  const styles = themes[theme];

  return (
    <article
      className={`
        rounded-[24px]
        border-2
        bg-[#080c14]/68
        p-5
        shadow-[0_20px_60px_rgba(0,0,0,0.20)]
        backdrop-blur-xl
        ${styles.border}
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            ${styles.icon}
          `}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>

          <p
            className={`
              mt-2
              truncate
              text-xl
              font-black
              tracking-tight
              ${styles.value}
            `}
          >
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {detail}
          </p>
        </div>
      </div>
    </article>
  );
}


function Configuracion() {
  const [nombre, setNombre] = useState("");
  const [moneda, setMoneda] = useState("PEN");

  const [email, setEmail] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [ultimoAcceso, setUltimoAcceso] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [
    enviandoRecuperacion,
    setEnviandoRecuperacion,
  ] = useState(false);

  const [segundos, setSegundos] = useState(0);
  const [exportando, setExportando] = useState("");

  const [mensaje, setMensaje] = useState(null);

  const [
    reducirAnimaciones,
    setReducirAnimaciones,
  ] = useState(() => {
    if (typeof window === "undefined") return false;

    return (
      window.localStorage.getItem(
        "blackghost-reducir-animaciones"
      ) === "true"
    );
  });


  useEffect(() => {
    cargarPerfil();
  }, []);


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


  useEffect(() => {
    const clase = "blackghost-reduce-motion";

    if (reducirAnimaciones) {
      document.documentElement.classList.add(clase);
    } else {
      document.documentElement.classList.remove(clase);
    }

    window.localStorage.setItem(
      "blackghost-reducir-animaciones",
      String(reducirAnimaciones)
    );
  }, [reducirAnimaciones]);


  function mostrarMensaje(texto, tipo = "success") {
    setMensaje({
      texto,
      tipo,
    });

    window.setTimeout(() => {
      setMensaje(null);
    }, 4000);
  }


  async function obtenerUsuario() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error(
        "No existe una sesión activa."
      );
    }

    return user;
  }


  async function cargarPerfil() {
    setCargando(true);

    try {
      const user = await obtenerUsuario();

      setEmail(user.email || "");
      setUsuarioId(user.id || "");
      setUltimoAcceso(user.last_sign_in_at || null);

      const { data, error } = await supabase
        .from("perfiles")
        .select("nombre, moneda_principal")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setNombre(data?.nombre || "");
      setMoneda(data?.moneda_principal || "PEN");
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo cargar la configuración.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }


  async function guardarPerfil(e) {
    e.preventDefault();

    if (guardandoPerfil) return;

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      mostrarMensaje(
        "Ingresa un nombre para tu perfil.",
        "error"
      );

      return;
    }

    setGuardandoPerfil(true);

    try {
      const user = await obtenerUsuario();

      const { error } = await supabase
        .from("perfiles")
        .update({
          nombre: nombreLimpio,
          moneda_principal: moneda,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setNombre(nombreLimpio);

      mostrarMensaje(
        "Perfil actualizado correctamente."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo guardar el perfil.",
        "error"
      );
    } finally {
      setGuardandoPerfil(false);
    }
  }


  async function enviarEnlacePassword() {
    if (
      enviandoRecuperacion ||
      segundos > 0
    ) {
      return;
    }

    if (!email) {
      mostrarMensaje(
        "No se encontró el correo de la cuenta.",
        "error"
      );

      return;
    }

    setEnviandoRecuperacion(true);

    try {
      const baseUrl = (
        import.meta.env.VITE_SITE_URL ||
        window.location.origin
      ).replace(/\/$/, "");

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${baseUrl}/cambiar-password`,
          }
        );

      if (error) {
        throw error;
      }

      setSegundos(60);

      mostrarMensaje(
        "Enlace enviado. Revisa la bandeja de entrada de tu correo."
      );
    } catch (error) {
      console.error(error);

      const limite =
        error?.status === 429 ||
        error?.message
          ?.toLowerCase()
          .includes("rate");

      mostrarMensaje(
        limite
          ? "Espera unos minutos antes de solicitar otro enlace."
          : "No se pudo enviar el enlace de recuperación.",
        "error"
      );
    } finally {
      setEnviandoRecuperacion(false);
    }
  }


  async function obtenerDatosFinancieros() {
    const user = await obtenerUsuario();

    const [
      resultadoCuentas,
      resultadoMovimientos,
      resultadoCategorias,
      resultadoPerfil,
    ] = await Promise.all([
      supabase
        .from("cuentas")
        .select("*")
        .eq("usuario_id", user.id)
        .order("nombre", {
          ascending: true,
        }),

      supabase
        .from("movimientos")
        .select(`
          *,
          categorias(nombre),
          cuentas(nombre)
        `)
        .eq("usuario_id", user.id)
        .order("fecha", {
          ascending: false,
        }),

      supabase
        .from("categorias")
        .select("*")
        .eq("usuario_id", user.id)
        .order("nombre", {
          ascending: true,
        }),

      supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    const error =
      resultadoCuentas.error ||
      resultadoMovimientos.error ||
      resultadoCategorias.error ||
      resultadoPerfil.error;

    if (error) {
      throw error;
    }

    const cuentas = resultadoCuentas.data || [];
    const movimientos =
      resultadoMovimientos.data || [];
    const categorias =
      resultadoCategorias.data || [];

    const movimientosSinTransferencias =
      movimientos.filter(
        (movimiento) =>
          !movimiento.transferencia_id
      );

    const ingresos =
      movimientosSinTransferencias
        .filter(
          (movimiento) =>
            movimiento.tipo === "INGRESO"
        )
        .reduce(
          (total, movimiento) =>
            total + Number(movimiento.monto || 0),
          0
        );

    const gastos =
      movimientosSinTransferencias
        .filter(
          (movimiento) =>
            movimiento.tipo === "GASTO"
        )
        .reduce(
          (total, movimiento) =>
            total + Number(movimiento.monto || 0),
          0
        );

    const saldoCuentas = cuentas
      .filter(
        (cuenta) =>
          !cuenta.archivado_en &&
          cuenta.activo !== false
      )
      .reduce(
        (total, cuenta) =>
          total +
          Number(
            cuenta.saldo_actual ??
              cuenta.saldo_inicial ??
              0
          ),
        0
      );

    return {
      user,
      perfil: resultadoPerfil.data || null,
      cuentas,
      movimientos,
      categorias,
      resumen: {
        ingresos,
        gastos,
        balance: ingresos - gastos,
        saldoCuentas,
      },
    };
  }


  function fechaArchivo() {
    return new Date()
      .toISOString()
      .slice(0, 10);
  }


  function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
    }).format(Number(valor || 0));
  }


  function formatearFecha(fecha) {
    if (!fecha) return "";

    const fechaNormalizada =
      typeof fecha === "string" &&
      fecha.length === 10
        ? `${fecha}T12:00:00`
        : fecha;

    const fechaObjeto =
      new Date(fechaNormalizada);

    if (
      Number.isNaN(fechaObjeto.getTime())
    ) {
      return String(fecha);
    }

    return fechaObjeto.toLocaleDateString(
      "es-PE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }


  function formatearFechaCompleta(fecha) {
    if (!fecha) return "No disponible";

    return new Date(fecha).toLocaleString(
      "es-PE",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  function textoSeguroExcel(valor) {
    const texto = String(valor ?? "");

    return /^[=+\-@]/.test(texto)
      ? `'${texto}`
      : texto;
  }


  function configurarHoja(
    hoja,
    anchos,
    filtro = true
  ) {
    hoja["!cols"] = anchos.map(
      (ancho) => ({
        wch: ancho,
      })
    );

    if (filtro && hoja["!ref"]) {
      hoja["!autofilter"] = {
        ref: hoja["!ref"],
      };
    }
  }


  function aplicarFormatoNumerico(
    hoja,
    columnas,
    filaInicial,
    filaFinal
  ) {
    columnas.forEach((columna) => {
      for (
        let fila = filaInicial;
        fila <= filaFinal;
        fila += 1
      ) {
        const celda =
          hoja[`${columna}${fila}`];

        if (celda) {
          celda.z = "#,##0.00";
        }
      }
    });
  }


  async function exportarExcel() {
    if (exportando) return;

    setExportando("excel");

    try {
      const datos =
        await obtenerDatosFinancieros();

      const libro =
        XLSX.utils.book_new();

      libro.Props = {
        Title:
          "Reporte financiero BLACK GHOST",
        Subject:
          "Cuentas, categorías y movimientos",
        Author: "BLACK GHOST Finanzas",
        CreatedDate: new Date(),
      };


      /* HOJA: RESUMEN */

      const filasResumen = [
        [
          "BLACK GHOST FINANZAS",
          "REPORTE FINANCIERO",
        ],
        [
          "Fecha de generación",
          formatearFechaCompleta(
            new Date()
          ),
        ],
        ["Usuario", nombre || email],
        ["Correo", email],
        ["Moneda principal", moneda],
        [],
        [
          "Saldo actual en cuentas",
          datos.resumen.saldoCuentas,
        ],
        [
          "Ingresos registrados",
          datos.resumen.ingresos,
        ],
        [
          "Gastos registrados",
          datos.resumen.gastos,
        ],
        [
          "Resultado de movimientos",
          datos.resumen.balance,
        ],
        [],
        [
          "Cantidad de cuentas",
          datos.cuentas.length,
        ],
        [
          "Cantidad de movimientos",
          datos.movimientos.length,
        ],
        [
          "Cantidad de categorías",
          datos.categorias.length,
        ],
      ];

      const hojaResumen =
        XLSX.utils.aoa_to_sheet(
          filasResumen
        );

      configurarHoja(
        hojaResumen,
        [30, 28],
        false
      );

      aplicarFormatoNumerico(
        hojaResumen,
        ["B"],
        7,
        10
      );

      XLSX.utils.book_append_sheet(
        libro,
        hojaResumen,
        "Resumen"
      );


      /* HOJA: MOVIMIENTOS */

      const filasMovimientos = [
        [
          "Fecha",
          "Hora",
          "Tipo",
          "Monto",
          "Descripción",
          "Categoría",
          "Cuenta",
          "Transferencia",
        ],

        ...datos.movimientos.map(
          (movimiento) => [
            formatearFecha(
              movimiento.fecha
            ),

            movimiento.hora || "",

            textoSeguroExcel(
              movimiento.tipo
            ),

            Number(
              movimiento.monto || 0
            ),

            textoSeguroExcel(
              movimiento.descripcion ||
                "Sin descripción"
            ),

            textoSeguroExcel(
              movimiento.categorias
                ?.nombre ||
                "Sin categoría"
            ),

            textoSeguroExcel(
              movimiento.cuentas?.nombre ||
                "Sin cuenta"
            ),

            movimiento.transferencia_id
              ? "Sí"
              : "No",
          ]
        ),
      ];

      const hojaMovimientos =
        XLSX.utils.aoa_to_sheet(
          filasMovimientos
        );

      configurarHoja(
        hojaMovimientos,
        [13, 10, 12, 14, 35, 22, 22, 15]
      );

      aplicarFormatoNumerico(
        hojaMovimientos,
        ["D"],
        2,
        filasMovimientos.length
      );

      XLSX.utils.book_append_sheet(
        libro,
        hojaMovimientos,
        "Movimientos"
      );


      /* HOJA: CUENTAS */

      const filasCuentas = [
        [
          "Nombre",
          "Tipo",
          "Saldo inicial",
          "Saldo actual",
          "Estado",
        ],

        ...datos.cuentas.map(
          (cuenta) => [
            textoSeguroExcel(
              cuenta.nombre
            ),

            textoSeguroExcel(
              cuenta.tipo || ""
            ),

            Number(
              cuenta.saldo_inicial || 0
            ),

            Number(
              cuenta.saldo_actual ??
                cuenta.saldo_inicial ??
                0
            ),

            cuenta.archivado_en
              ? "Archivada"
              : cuenta.activo === false
                ? "Inactiva"
                : "Activa",
          ]
        ),
      ];

      const hojaCuentas =
        XLSX.utils.aoa_to_sheet(
          filasCuentas
        );

      configurarHoja(
        hojaCuentas,
        [24, 18, 16, 16, 14]
      );

      aplicarFormatoNumerico(
        hojaCuentas,
        ["C", "D"],
        2,
        filasCuentas.length
      );

      XLSX.utils.book_append_sheet(
        libro,
        hojaCuentas,
        "Cuentas"
      );


      /* HOJA: CATEGORÍAS */

      const filasCategorias = [
        [
          "Nombre",
          "Tipo",
          "Color",
          "Estado",
        ],

        ...datos.categorias.map(
          (categoria) => [
            textoSeguroExcel(
              categoria.nombre
            ),

            textoSeguroExcel(
              categoria.tipo
            ),

            categoria.color || "",

            categoria.activo === false
              ? "Inactiva"
              : "Activa",
          ]
        ),
      ];

      const hojaCategorias =
        XLSX.utils.aoa_to_sheet(
          filasCategorias
        );

      configurarHoja(
        hojaCategorias,
        [28, 16, 14, 14]
      );

      XLSX.utils.book_append_sheet(
        libro,
        hojaCategorias,
        "Categorías"
      );


      XLSX.writeFile(
        libro,
        `black-ghost-finanzas-${fechaArchivo()}.xlsx`,
        {
          compression: true,
        }
      );

      mostrarMensaje(
        "Archivo Excel descargado correctamente."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo generar el archivo Excel.",
        "error"
      );
    } finally {
      setExportando("");
    }
  }


  function dibujarCabeceraPDF(
    documento,
    titulo
  ) {
    const anchoPagina =
      documento.internal.pageSize.getWidth();

    documento.setFillColor(7, 11, 19);
    documento.rect(
      0,
      0,
      anchoPagina,
      28,
      "F"
    );

    documento.setFillColor(185, 28, 28);
    documento.rect(
      0,
      0,
      5,
      28,
      "F"
    );

    documento.setTextColor(
      255,
      255,
      255
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(16);

    documento.text(
      "BLACK GHOST FINANZAS",
      12,
      12
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(10);

    documento.setTextColor(
      203,
      213,
      225
    );

    documento.text(
      titulo,
      12,
      20
    );
  }


  async function exportarPDF() {
    if (exportando) return;

    setExportando("pdf");

    try {
      const datos =
        await obtenerDatosFinancieros();

      const documento = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const anchoPagina =
        documento.internal.pageSize.getWidth();


      /* PÁGINA 1: RESUMEN */

      dibujarCabeceraPDF(
        documento,
        "Resumen financiero"
      );

      documento.setTextColor(
        30,
        41,
        59
      );

      documento.setFontSize(9);

      documento.text(
        `Generado: ${formatearFechaCompleta(
          new Date()
        )}`,
        12,
        36
      );

      documento.text(
        `Usuario: ${nombre || email}`,
        12,
        42
      );

      documento.text(
        `Moneda: ${moneda}`,
        12,
        48
      );


      const tarjetas = [
        {
          titulo: "Saldo en cuentas",
          valor: formatearMoneda(
            datos.resumen.saldoCuentas
          ),
        },

        {
          titulo: "Ingresos",
          valor: formatearMoneda(
            datos.resumen.ingresos
          ),
        },

        {
          titulo: "Gastos",
          valor: formatearMoneda(
            datos.resumen.gastos
          ),
        },

        {
          titulo: "Resultado",
          valor: formatearMoneda(
            datos.resumen.balance
          ),
        },
      ];

      tarjetas.forEach(
        (tarjeta, indice) => {
          const columna = indice % 2;
          const fila = Math.floor(
            indice / 2
          );

          const x =
            12 + columna * 94;

          const y =
            56 + fila * 24;

          documento.setFillColor(
            248,
            250,
            252
          );

          documento.setDrawColor(
            226,
            232,
            240
          );

          documento.roundedRect(
            x,
            y,
            88,
            19,
            2,
            2,
            "FD"
          );

          documento.setTextColor(
            100,
            116,
            139
          );

          documento.setFontSize(8);

          documento.text(
            tarjeta.titulo,
            x + 4,
            y + 6
          );

          documento.setTextColor(
            15,
            23,
            42
          );

          documento.setFont(
            "helvetica",
            "bold"
          );

          documento.setFontSize(11);

          documento.text(
            tarjeta.valor,
            x + 4,
            y + 14
          );

          documento.setFont(
            "helvetica",
            "normal"
          );
        }
      );


      documento.setTextColor(
        15,
        23,
        42
      );

      documento.setFont(
        "helvetica",
        "bold"
      );

      documento.setFontSize(12);

      documento.text(
        "Cuentas",
        12,
        111
      );

      autoTable(documento, {
        startY: 116,

        head: [
          [
            "Cuenta",
            "Tipo",
            "Saldo inicial",
            "Saldo actual",
            "Estado",
          ],
        ],

        body:
          datos.cuentas.length > 0
            ? datos.cuentas.map(
                (cuenta) => [
                  cuenta.nombre || "",
                  cuenta.tipo || "",
                  formatearMoneda(
                    cuenta.saldo_inicial
                  ),
                  formatearMoneda(
                    cuenta.saldo_actual ??
                      cuenta.saldo_inicial
                  ),
                  cuenta.archivado_en
                    ? "Archivada"
                    : cuenta.activo ===
                        false
                      ? "Inactiva"
                      : "Activa",
                ]
              )
            : [
                [
                  "Sin cuentas",
                  "",
                  "",
                  "",
                  "",
                ],
              ],

        theme: "grid",

        margin: {
          left: 12,
          right: 12,
        },

        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2.4,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },

        headStyles: {
          fillColor: [127, 29, 29],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },

        columnStyles: {
          2: {
            halign: "right",
          },

          3: {
            halign: "right",
          },
        },
      });


      /* PÁGINA 2: MOVIMIENTOS */

      documento.addPage();

      dibujarCabeceraPDF(
        documento,
        "Detalle de movimientos"
      );

      documento.setTextColor(
        71,
        85,
        105
      );

      documento.setFontSize(9);

      documento.text(
        "Las transferencias internas aparecen identificadas y no se suman como ingresos o gastos reales.",
        12,
        36,
        {
          maxWidth:
            anchoPagina - 24,
        }
      );

      autoTable(documento, {
        startY: 44,

        head: [
          [
            "Fecha",
            "Hora",
            "Tipo",
            "Monto",
            "Descripción",
            "Categoría",
            "Cuenta",
          ],
        ],

        body:
          datos.movimientos.length > 0
            ? datos.movimientos.map(
                (movimiento) => [
                  formatearFecha(
                    movimiento.fecha
                  ),

                  movimiento.hora || "",

                  movimiento
                    .transferencia_id
                    ? "Transferencia"
                    : movimiento.tipo,

                  formatearMoneda(
                    movimiento.monto
                  ),

                  movimiento.descripcion ||
                    "Sin descripción",

                  movimiento.categorias
                    ?.nombre ||
                    "Sin categoría",

                  movimiento.cuentas
                    ?.nombre ||
                    "Sin cuenta",
                ]
              )
            : [
                [
                  "Sin movimientos",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ],
              ],

        theme: "grid",

        margin: {
          left: 10,
          right: 10,
          bottom: 15,
        },

        styles: {
          font: "helvetica",
          fontSize: 7.2,
          cellPadding: 1.8,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.15,
          overflow: "linebreak",
          valign: "middle",
        },

        headStyles: {
          fillColor: [127, 29, 29],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },

        columnStyles: {
          0: {
            cellWidth: 20,
          },

          1: {
            cellWidth: 14,
          },

          2: {
            cellWidth: 20,
          },

          3: {
            cellWidth: 22,
            halign: "right",
          },

          4: {
            cellWidth: 45,
          },

          5: {
            cellWidth: 29,
          },

          6: {
            cellWidth: 29,
          },
        },
      });


      /* NUMERACIÓN DE PÁGINAS */

      const totalPaginas =
        documento.getNumberOfPages();

      for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina += 1
      ) {
        documento.setPage(pagina);

        const altoPagina =
          documento.internal.pageSize.getHeight();

        documento.setTextColor(
          100,
          116,
          139
        );

        documento.setFontSize(8);

        documento.text(
          `Página ${pagina} de ${totalPaginas}`,
          anchoPagina - 12,
          altoPagina - 7,
          {
            align: "right",
          }
        );
      }

      documento.save(
        `black-ghost-reporte-${fechaArchivo()}.pdf`
      );

      mostrarMensaje(
        "Reporte PDF descargado correctamente."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo generar el reporte PDF.",
        "error"
      );
    } finally {
      setExportando("");
    }
  }


  function descargarArchivo(
    contenido,
    nombreArchivo,
    tipoMime
  ) {
    const archivo = new Blob(
      [contenido],
      {
        type: tipoMime,
      }
    );

    const url =
      URL.createObjectURL(archivo);

    const enlace =
      document.createElement("a");

    enlace.href = url;
    enlace.download = nombreArchivo;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  }


  async function exportarJSON() {
    if (exportando) return;

    setExportando("json");

    try {
      const datos =
        await obtenerDatosFinancieros();

      const respaldo = {
        aplicacion:
          "BLACK GHOST Finanzas",

        version: 1,

        generado_en:
          new Date().toISOString(),

        usuario: {
          id: datos.user.id,
          email: datos.user.email,
        },

        perfil: datos.perfil,
        cuentas: datos.cuentas,
        categorias: datos.categorias,
        movimientos: datos.movimientos,
      };

      descargarArchivo(
        JSON.stringify(
          respaldo,
          null,
          2
        ),

        `black-ghost-respaldo-${fechaArchivo()}.json`,

        "application/json;charset=utf-8"
      );

      mostrarMensaje(
        "Respaldo técnico descargado correctamente."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo generar el respaldo.",
        "error"
      );
    } finally {
      setExportando("");
    }
  }


  async function copiarUsuarioId() {
    try {
      await navigator.clipboard.writeText(
        usuarioId
      );

      mostrarMensaje(
        "Identificador copiado."
      );
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        "No se pudo copiar el identificador.",
        "error"
      );
    }
  }


  async function cerrarSesion() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      mostrarMensaje(
        "No se pudo cerrar la sesión.",
        "error"
      );

      return;
    }

    window.location.href = "/";
  }


  const inputClass = `
    h-[52px]
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


  if (cargando) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-10 w-64 rounded-xl bg-white/[0.07]" />
          <div className="h-5 w-96 max-w-full rounded-lg bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 rounded-[24px] border border-white/[0.08] bg-white/[0.04]"
              />
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="h-[420px] rounded-[28px] border border-white/[0.08] bg-white/[0.04]" />
          <div className="h-[420px] rounded-[28px] border border-white/[0.08] bg-white/[0.04]" />
        </div>
      </div>
    );
  }


  return (
    <div className="w-full min-w-0">
      <style>
        {`
          html.blackghost-reduce-motion *,
          html.blackghost-reduce-motion *::before,
          html.blackghost-reduce-motion *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        `}
      </style>


      {/* CABECERA */}

      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              mt-1
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border-2
              border-red-500/35
              bg-red-500/12
              text-red-300
              shadow-[0_18px_48px_rgba(239,68,68,0.12)]
            "
          >
            <Icon
              name="settings"
              className="h-6 w-6"
            />
          </div>

          <div>
            <h1 className="text-[34px] font-black tracking-[-0.045em] text-white sm:text-[38px]">
              Configuración
            </h1>

            <p className="mt-2 max-w-2xl text-base font-medium leading-6 text-slate-300">
              Administra tu perfil, seguridad,
              preferencias y reportes financieros.
            </p>
          </div>
        </div>

        <div
          className="
            flex
            w-fit
            items-center
            gap-2.5
            rounded-full
            border
            border-emerald-500/20
            bg-emerald-500/[0.08]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-emerald-200
            backdrop-blur-xl
          "
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />

          Cuenta sincronizada
        </div>
      </header>


      {/* RESUMEN */}

      <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon="user"
          label="Perfil"
          value={
            nombre.trim()
              ? "Completo"
              : "Pendiente"
          }
          detail={
            nombre ||
            "Agrega tu nombre visible"
          }
          theme={
            nombre.trim()
              ? "emerald"
              : "red"
          }
        />

        <SummaryCard
          icon="wallet"
          label="Moneda"
          value={moneda}
          detail={
            moneda === "PEN"
              ? "Soles peruanos"
              : moneda === "USD"
                ? "Dólares"
                : "Euros"
          }
          theme="blue"
        />

        <SummaryCard
          icon="shield"
          label="Seguridad"
          value="Protegida"
          detail="Cambio mediante correo"
          theme="violet"
        />

        <SummaryCard
          icon="database"
          label="Reportes"
          value="3 formatos"
          detail="Excel, PDF y respaldo"
          theme="red"
        />
      </section>


      {/* PERFIL Y SEGURIDAD */}

      <section className="mb-10 grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
        {/* PERFIL */}

        <form
          onSubmit={guardarPerfil}
          className="
            rounded-[28px]
            border-2
            border-red-500/25
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <SectionHeader
            icon="user"
            title="Perfil y preferencias"
            description="Personaliza la información principal de tu cuenta."
            theme="red"
          />

          <div className="mt-7 space-y-6">
            <div>
              <label className="mb-2.5 block text-sm font-bold text-slate-300">
                Correo electrónico
              </label>

              <div
                className="
                  flex
                  min-h-[52px]
                  items-center
                  rounded-xl
                  border
                  border-white/[0.09]
                  bg-white/[0.03]
                  px-4
                  text-sm
                  text-slate-400
                "
              >
                <span className="truncate">
                  {email}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="nombre-perfil"
                className="mb-2.5 block text-sm font-bold text-slate-300"
              >
                Nombre visible
              </label>

              <input
                id="nombre-perfil"
                value={nombre}
                maxLength={60}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                placeholder="Ej: Jhoel"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="moneda-principal"
                className="mb-2.5 block text-sm font-bold text-slate-300"
              >
                Moneda principal
              </label>

              <select
                id="moneda-principal"
                value={moneda}
                onChange={(e) =>
                  setMoneda(e.target.value)
                }
                className={inputClass}
              >
                <option value="PEN">
                  PEN — Soles peruanos
                </option>

                <option value="USD">
                  USD — Dólares
                </option>

                <option value="EUR">
                  EUR — Euros
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={guardandoPerfil}
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
                text-sm
                font-black
                text-white
                shadow-[0_16px_44px_rgba(239,68,68,0.18)]
                transition
                hover:-translate-y-0.5
                hover:from-red-600
                hover:to-rose-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon
                name="save"
                className="h-4 w-4"
              />

              {guardandoPerfil
                ? "GUARDANDO..."
                : "GUARDAR PERFIL"}
            </button>
          </div>
        </form>


        {/* SEGURIDAD */}

        <article
          className="
            rounded-[28px]
            border-2
            border-blue-500/25
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <SectionHeader
            icon="shield"
            title="Seguridad"
            description="El cambio de contraseña se autoriza mediante tu correo."
            theme="blue"
          />

          <div className="mt-7 space-y-5">
            <div
              className="
                rounded-[22px]
                border
                border-blue-500/20
                bg-blue-500/[0.06]
                p-5
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-blue-500/25
                    bg-blue-500/10
                    text-blue-300
                  "
                >
                  <Icon
                    name="mail"
                    className="h-5 w-5"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-white">
                    Recuperación por correo
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enviaremos un enlace temporal a:
                  </p>

                  <p className="mt-1 break-all text-sm font-bold text-blue-200">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/[0.09]
                bg-black/20
                p-5
              "
            >
              <p className="text-sm font-black text-white">
                ¿Por qué usamos un enlace?
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                La contraseña no se puede cambiar
                directamente desde esta pantalla. Primero
                debes confirmar que tienes acceso al correo
                vinculado a la cuenta.
              </p>
            </div>

            <button
              type="button"
              onClick={enviarEnlacePassword}
              disabled={
                enviandoRecuperacion ||
                segundos > 0
              }
              className="
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-xl
                border-2
                border-blue-400/30
                bg-gradient-to-r
                from-blue-700
                to-indigo-600
                text-sm
                font-black
                text-white
                shadow-[0_16px_44px_rgba(37,99,235,0.18)]
                transition
                hover:-translate-y-0.5
                hover:from-blue-600
                hover:to-indigo-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon
                name={
                  segundos > 0
                    ? "clock"
                    : "send"
                }
                className="h-4 w-4"
              />

              {enviandoRecuperacion
                ? "ENVIANDO..."
                : segundos > 0
                  ? `REENVIAR EN ${segundos}s`
                  : "ENVIAR ENLACE DE CAMBIO"}
            </button>
          </div>
        </article>
      </section>


      {/* APARIENCIA Y SESIÓN */}

      <section className="mb-10 grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
        {/* APARIENCIA */}

        <article
          className="
            rounded-[28px]
            border-2
            border-violet-500/25
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <SectionHeader
            icon="palette"
            title="Apariencia"
            description="Configura la experiencia visual de BLACK GHOST."
            theme="violet"
          />

          <div className="mt-7 space-y-5">
            <div
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-white/[0.09]
                bg-black/20
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
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
                    border-violet-500/20
                    bg-violet-500/10
                    text-violet-300
                  "
                >
                  <Icon
                    name="activity"
                    className="h-5 w-5"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-white">
                    Reducir animaciones
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Disminuye transiciones y movimientos
                    visuales.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={
                  reducirAnimaciones
                }
                onClick={() =>
                  setReducirAnimaciones(
                    (valor) => !valor
                  )
                }
                className={`
                  relative
                  h-7
                  w-12
                  shrink-0
                  rounded-full
                  border
                  transition

                  ${
                    reducirAnimaciones
                      ? "border-violet-400/40 bg-violet-500"
                      : "border-white/10 bg-white/[0.08]"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-lg
                    transition

                    ${
                      reducirAnimaciones
                        ? "left-[25px]"
                        : "left-[3px]"
                    }
                  `}
                />
              </button>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.09]
                bg-black/25
                p-5
              "
            >
              <p className="text-sm font-black text-white">
                Tema Black Ghost
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Oscuro · Rojo · Cristal
              </p>

              <div
                className="
                  mt-5
                  h-28
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.28),transparent_35%),linear-gradient(135deg,#080b13,#12070c)]
                  shadow-[inset_0_0_40px_rgba(0,0,0,0.38)]
                "
              />
            </div>
          </div>
        </article>


        {/* SESIÓN */}

        <article
          className="
            rounded-[28px]
            border-2
            border-emerald-500/25
            bg-[#080c14]/72
            p-7
            shadow-[0_28px_80px_rgba(0,0,0,0.24)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <SectionHeader
            icon="shield"
            title="Sesión y cuenta"
            description="Consulta el estado de tu acceso actual."
            theme="emerald"
          />

          <div className="mt-7 space-y-5">
            <div
              className="
                rounded-2xl
                border
                border-white/[0.09]
                bg-black/20
                p-5
              "
            >
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                Último acceso
              </p>

              <p className="mt-2 text-sm font-bold text-white">
                {formatearFechaCompleta(
                  ultimoAcceso
                )}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/[0.09]
                bg-black/20
                p-5
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Identificador
                  </p>

                  <p
                    className="
                      mt-2
                      truncate
                      font-mono
                      text-xs
                      text-slate-300
                    "
                    title={usuarioId}
                  >
                    {usuarioId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copiarUsuarioId}
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.09]
                    bg-white/[0.04]
                    text-slate-400
                    transition
                    hover:border-emerald-500/25
                    hover:bg-emerald-500/10
                    hover:text-emerald-300
                  "
                  title="Copiar identificador"
                >
                  <Icon
                    name="copy"
                    className="h-4 w-4"
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={cerrarSesion}
              className="
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/25
                bg-red-500/[0.08]
                text-sm
                font-black
                text-red-300
                transition
                hover:-translate-y-0.5
                hover:border-red-500/40
                hover:bg-red-500/15
              "
            >
              <Icon
                name="logout"
                className="h-4 w-4"
              />

              CERRAR SESIÓN
            </button>
          </div>
        </article>
      </section>


      {/* REPORTES */}

      <section
        className="
          rounded-[28px]
          border-2
          border-white/[0.13]
          bg-[#080c14]/72
          p-7
          shadow-[0_28px_80px_rgba(0,0,0,0.24)]
          backdrop-blur-xl
          sm:p-8
        "
      >
        <SectionHeader
          icon="database"
          title="Reportes y respaldo"
          description="Descarga tu información en formatos fáciles de leer."
          theme="red"
        />

        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* EXCEL */}

          <article
            className="
              flex
              flex-col
              rounded-[22px]
              border
              border-emerald-500/20
              bg-emerald-500/[0.045]
              p-5
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-500/25
                  bg-emerald-500/10
                  text-emerald-300
                "
              >
                <Icon
                  name="excel"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  Excel completo
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  Resumen, cuentas, categorías y
                  movimientos en hojas separadas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={exportarExcel}
              disabled={Boolean(exportando)}
              className="
                mt-6
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-emerald-500/25
                bg-emerald-500/[0.10]
                text-sm
                font-bold
                text-emerald-300
                transition
                hover:border-emerald-500/40
                hover:bg-emerald-500/15
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon
                name="download"
                className="h-4 w-4"
              />

              {exportando === "excel"
                ? "GENERANDO..."
                : "DESCARGAR EXCEL"}
            </button>
          </article>


          {/* PDF */}

          <article
            className="
              flex
              flex-col
              rounded-[22px]
              border
              border-red-500/20
              bg-red-500/[0.045]
              p-5
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-500/25
                  bg-red-500/10
                  text-red-300
                "
              >
                <Icon
                  name="pdf"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  Reporte PDF
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  Resumen legible, cuentas y listado
                  detallado de movimientos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={exportarPDF}
              disabled={Boolean(exportando)}
              className="
                mt-6
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-500/25
                bg-red-500/[0.10]
                text-sm
                font-bold
                text-red-300
                transition
                hover:border-red-500/40
                hover:bg-red-500/15
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon
                name="download"
                className="h-4 w-4"
              />

              {exportando === "pdf"
                ? "GENERANDO..."
                : "DESCARGAR PDF"}
            </button>
          </article>


          {/* JSON */}

          <article
            className="
              flex
              flex-col
              rounded-[22px]
              border
              border-blue-500/20
              bg-blue-500/[0.045]
              p-5
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-500/25
                  bg-blue-500/10
                  text-blue-300
                "
              >
                <Icon
                  name="file"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="text-base font-black text-white">
                  Respaldo técnico
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-400">
                  Copia completa en JSON para una
                  futura restauración del sistema.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={exportarJSON}
              disabled={Boolean(exportando)}
              className="
                mt-6
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-blue-500/25
                bg-blue-500/[0.10]
                text-sm
                font-bold
                text-blue-300
                transition
                hover:border-blue-500/40
                hover:bg-blue-500/15
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Icon
                name="download"
                className="h-4 w-4"
              />

              {exportando === "json"
                ? "GENERANDO..."
                : "DESCARGAR RESPALDO"}
            </button>
          </article>
        </div>

        <div
          className="
            mt-6
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-amber-500/15
            bg-amber-500/[0.05]
            px-4
            py-4
          "
        >
          <Icon
            name="alert"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
          />

          <p className="text-xs leading-5 text-slate-400">
            Los archivos pueden contener información
            financiera personal. Guárdalos en un lugar
            seguro y evita compartirlos.
          </p>
        </div>
      </section>


      {/* MENSAJE FLOTANTE */}

      {mensaje && (
        <div
          className={`
            fixed
            bottom-5
            left-4
            right-4
            z-[150]
            mx-auto
            max-w-md
            rounded-2xl
            border-2
            px-5
            py-4
            text-sm
            font-semibold
            shadow-[0_24px_80px_rgba(0,0,0,0.70)]
            backdrop-blur-2xl
            sm:left-auto
            sm:right-6

            ${
              mensaje.tipo === "error"
                ? "border-red-500/30 bg-[#14090d]/95 text-red-200"
                : "border-emerald-500/30 bg-[#07120f]/95 text-emerald-200"
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl

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

            <p className="pt-1.5 leading-5">
              {mensaje.texto}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


export default Configuracion;