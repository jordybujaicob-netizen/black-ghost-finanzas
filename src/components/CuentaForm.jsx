import { useState } from "react";
import { supabase } from "../services/supabase";

const MONEDAS = [
  {
    value: "PEN",
    label: "Soles peruanos (PEN)",
  },
  {
    value: "USD",
    label: "Dólares estadounidenses (USD)",
  },
];

function CuentaForm({ actualizar }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Billetera");
  const [moneda, setMoneda] = useState("PEN");
  const [saldo, setSaldo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [creando, setCreando] = useState(false);

  function mostrarMensaje(texto, tipo = "success") {
    setMensaje(texto);
    setTipoMensaje(tipo);

    window.setTimeout(() => {
      setMensaje("");
    }, 3500);
  }

  async function crearCuenta(e) {
    e.preventDefault();

    if (creando) return;

    if (!nombre.trim()) {
      mostrarMensaje("Ingresa un nombre para la cuenta", "error");
      return;
    }

    if (saldo === "") {
      mostrarMensaje("Ingresa un saldo inicial", "error");
      return;
    }

    const saldoInicial = Number(saldo);

    if (!Number.isFinite(saldoInicial)) {
      mostrarMensaje("Ingresa un saldo inicial válido", "error");
      return;
    }

    if (!MONEDAS.some((opcion) => opcion.value === moneda)) {
      mostrarMensaje("Selecciona una moneda válida", "error");
      return;
    }

    setCreando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        mostrarMensaje("No hay una sesión activa", "error");
        return;
      }

      const { error } = await supabase.from("cuentas").insert({
        usuario_id: user.id,
        nombre: nombre.trim(),
        tipo,
        moneda,
        saldo_inicial: saldoInicial,
        saldo_actual: saldoInicial,
        color: "#E60000",
      });

      if (error) {
        console.log(error);
        mostrarMensaje("No se pudo crear la cuenta", "error");
        return;
      }

      setNombre("");
      setTipo("Billetera");
      setMoneda("PEN");
      setSaldo("");

      mostrarMensaje("Cuenta creada correctamente");

      if (typeof actualizar === "function") {
        await actualizar();
      }
    } finally {
      setCreando(false);
    }
  }

  return (
    <form
      onSubmit={crearCuenta}
      className="mt-8 max-w-md rounded-xl border border-red-900 bg-zinc-900 p-5"
    >
      <h2 className="mb-4 text-2xl font-bold text-red-600">
        Nueva cuenta
      </h2>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Nombre de cuenta
        </label>

        <input
          className="mb-3 w-full rounded border border-red-900 bg-black p-3 text-white"
          placeholder="Ej. BCP, Yape o Binance"
          value={nombre}
          disabled={creando}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Tipo
        </label>

        <select
          className="mb-3 w-full rounded border border-red-900 bg-black p-3 text-white"
          value={tipo}
          disabled={creando}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="Billetera">Billetera</option>
          <option value="Banco">Banco</option>
          <option value="Efectivo">Efectivo</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Moneda
        </label>

        <select
          className="mb-3 w-full rounded border border-red-900 bg-black p-3 text-white"
          value={moneda}
          disabled={creando}
          onChange={(e) => setMoneda(e.target.value)}
        >
          {MONEDAS.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Saldo inicial
        </label>

        <input
          className="mb-3 w-full rounded border border-red-900 bg-black p-3 text-white"
          placeholder={moneda === "USD" ? "US$ 0.00" : "S/ 0.00"}
          type="number"
          step="0.01"
          value={saldo}
          disabled={creando}
          onChange={(e) => setSaldo(e.target.value)}
        />

        <p className="mb-4 text-xs leading-5 text-slate-500">
          Este monto representa el dinero disponible en la moneda seleccionada
          antes de registrar movimientos.
        </p>
      </div>

      <button
        type="submit"
        disabled={creando}
        className="w-full rounded bg-red-700 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {mensaje && (
        <p
          className={`mt-4 text-sm font-semibold ${
            tipoMensaje === "error" ? "text-red-400" : "text-green-500"
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}

export default CuentaForm;
