// BLACK GHOST — GRÁFICO CIRCULAR MULTIMONEDA PEN / USD
import { useId, useMemo } from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORES_PREDETERMINADOS = [
  "#ef4444",
  "#dc2626",
  "#f97316",
  "#eab308",
  "#a855f7",
  "#3b82f6",
  "#14b8a6",
  "#ec4899",
];

function normalizarMoneda(moneda) {
  return String(moneda || "PEN").toUpperCase() === "USD"
    ? "USD"
    : "PEN";
}

function simboloMoneda(moneda) {
  return normalizarMoneda(moneda) === "USD" ? "$" : "S/";
}

function formatearMoneda(valor, moneda = "PEN") {
  const numero = Number(valor || 0);
  const monto = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numero) ? numero : 0);

  return `${simboloMoneda(moneda)} ${monto}`;
}

function formatearMonedaCorta(valor, moneda = "PEN") {
  const numero = Number(valor || 0);
  const absoluto = Math.abs(numero);
  const simbolo = simboloMoneda(moneda);

  if (absoluto >= 1_000_000) {
    return `${simbolo} ${(numero / 1_000_000).toFixed(1)}M`;
  }

  if (absoluto >= 1_000) {
    return `${simbolo} ${(numero / 1_000).toFixed(1)}K`;
  }

  return `${simbolo} ${numero.toFixed(numero % 1 === 0 ? 0 : 2)}`;
}

function TooltipCategoria({ active, payload, moneda }) {
  if (!active || !payload?.length) return null;

  const categoria = payload[0]?.payload;
  if (!categoria) return null;

  return (
    <div className="min-w-[190px] rounded-2xl border border-white/[0.12] bg-[#070a11]/95 px-4 py-3.5 shadow-[0_24px_75px_rgba(0,0,0,0.70)] backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: categoria.color,
            boxShadow: `0 0 12px ${categoria.color}`,
          }}
        />
        <p className="max-w-[160px] truncate text-sm font-black text-white">
          {categoria.nombre}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
            Gasto
          </p>
          <p className="mt-1 whitespace-nowrap text-sm font-black text-white">
            {formatearMoneda(categoria.total, moneda)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
            Participación
          </p>
          <p className="mt-1 text-sm font-black text-red-300">
            {Number(categoria.porcentaje || 0).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

function ExpensePieChart({ data = [], moneda = "PEN" }) {
  const id = useId().replaceAll(":", "");
  const idSombra = `blackghost-pie-shadow-${id}`;

  const datosNormalizados = useMemo(() => {
    const datosValidos = (Array.isArray(data) ? data : [])
      .map((categoria, indice) => ({
        nombre: categoria?.nombre || `Categoría ${indice + 1}`,
        total: Number(categoria?.total || 0),
        color:
          categoria?.color ||
          COLORES_PREDETERMINADOS[
            indice % COLORES_PREDETERMINADOS.length
          ],
      }))
      .filter(
        (categoria) =>
          Number.isFinite(categoria.total) && categoria.total > 0
      )
      .sort((a, b) => b.total - a.total);

    const totalGeneral = datosValidos.reduce(
      (total, categoria) => total + categoria.total,
      0
    );

    return datosValidos.map((categoria) => ({
      ...categoria,
      porcentaje:
        totalGeneral > 0 ? (categoria.total / totalGeneral) * 100 : 0,
    }));
  }, [data]);

  const totalGeneral = useMemo(
    () =>
      datosNormalizados.reduce(
        (total, categoria) => total + categoria.total,
        0
      ),
    [datosNormalizados]
  );

  if (datosNormalizados.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center px-6">
        <div className="text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-white/[0.055]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-lg text-slate-600">
              ◎
            </div>
          </div>
          <p className="mt-5 text-sm font-black text-slate-300">
            Sin gastos registrados
          </p>
          <p className="mx-auto mt-2 max-w-[250px] text-xs leading-5 text-slate-500">
            No existen gastos reales en el periodo seleccionado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[220px] w-full min-w-0 flex-col">
      <div className="relative min-h-[185px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter
                id={idSombra}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="6"
                  floodColor="#000000"
                  floodOpacity="0.45"
                />
              </filter>
            </defs>

            <Pie
              data={datosNormalizados}
              dataKey="total"
              nameKey="nombre"
              cx="50%"
              cy="48%"
              innerRadius="50%"
              outerRadius="75%"
              paddingAngle={datosNormalizados.length > 1 ? 2.5 : 0}
              cornerRadius={4}
              startAngle={90}
              endAngle={-270}
              stroke="#070a11"
              strokeWidth={3}
              minAngle={3}
              isAnimationActive
              animationBegin={100}
              animationDuration={750}
              animationEasing="ease-out"
              filter={`url(#${idSombra})`}
            >
              {datosNormalizados.map((categoria, indice) => (
                <Cell
                  key={`${categoria.nombre}-${indice}`}
                  fill={categoria.color}
                  stroke="#070a11"
                  strokeWidth={3}
                />
              ))}
            </Pie>

            <Tooltip
              wrapperStyle={{ outline: "none", zIndex: 50 }}
              cursor={false}
              content={(props) => (
                <TooltipCategoria {...props} moneda={moneda} />
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute left-1/2 top-[48%] z-10 w-[145px] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-600">
            Total gastado
          </p>
          <p
            className="mt-1.5 truncate text-base font-black tracking-tight text-white"
            title={formatearMoneda(totalGeneral, moneda)}
          >
            {formatearMonedaCorta(totalGeneral, moneda)}
          </p>
          <p className="mt-1 text-[9px] font-semibold text-slate-600">
            {datosNormalizados.length === 1
              ? "1 categoría"
              : `${datosNormalizados.length} categorías`}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.06] px-3 pb-2 pt-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
          {datosNormalizados.map((categoria, indice) => (
            <div
              key={`${categoria.nombre}-leyenda-${indice}`}
              className="group flex min-w-0 items-center gap-2"
              title={`${categoria.nombre}: ${formatearMoneda(
                categoria.total,
                moneda
              )}`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{
                  backgroundColor: categoria.color,
                  boxShadow: `0 0 8px ${categoria.color}`,
                }}
              />
              <p className="min-w-0 flex-1 truncate text-[10px] font-bold text-slate-400 transition group-hover:text-white">
                {categoria.nombre}
              </p>
              <span className="shrink-0 text-[9px] font-black text-slate-600">
                {categoria.porcentaje.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpensePieChart;
