// BLACK GHOST — GRÁFICO MULTIMONEDA PEN / USD
import { useId, useMemo } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function normalizarMoneda(moneda) {
  return String(moneda || "PEN").toUpperCase() === "USD"
    ? "USD"
    : "PEN";
}

function simboloMoneda(moneda) {
  return normalizarMoneda(moneda) === "USD" ? "$" : "S/";
}

function formatearMonto(valor, moneda = "PEN") {
  const numero = Number(valor || 0);
  const monto = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numero) ? numero : 0);

  return `${simboloMoneda(moneda)} ${monto}`;
}

function formatearMontoCorto(valor, moneda = "PEN") {
  const numero = Number(valor || 0);
  const absoluto = Math.abs(numero);
  const simbolo = simboloMoneda(moneda);

  if (absoluto >= 1_000_000) {
    return `${simbolo} ${(numero / 1_000_000).toFixed(1)}M`;
  }

  if (absoluto >= 1_000) {
    return `${simbolo} ${(numero / 1_000).toFixed(1)}K`;
  }

  return `${simbolo} ${numero.toFixed(0)}`;
}

function TooltipPremium({
  active,
  payload,
  label,
  color,
  moneda,
  nombre,
}) {
  if (!active || !payload?.length) return null;

  const valor = Number(payload[0]?.value || 0);

  return (
    <div className="min-w-[170px] rounded-2xl border border-white/[0.12] bg-[#070a11]/95 px-4 py-3 shadow-[0_22px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]"
          style={{ backgroundColor: color, color }}
        />

        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-400">
        {nombre}
      </p>

      <p className="mt-1 text-lg font-black tracking-tight text-white">
        {formatearMonto(valor, moneda)}
      </p>
    </div>
  );
}

function ExpenseChart({
  data = [],
  color = "#ef4444",
  nombre = "Monto",
  moneda = "PEN",
}) {
  const idReact = useId();
  const idLimpio = idReact.replaceAll(":", "");
  const idGradiente = `ghost-area-${idLimpio}`;
  const idBrillo = `ghost-glow-${idLimpio}`;

  const datosNormalizados = useMemo(
    () =>
      (data || []).map((elemento, indice) => ({
        ...elemento,
        fecha:
          elemento.fecha || elemento.nombre || `Punto ${indice + 1}`,
        valor: Number(elemento.valor ?? elemento.saldo ?? 0),
      })),
    [data]
  );

  const informacion = useMemo(() => {
    if (datosNormalizados.length === 0) {
      return {
        dominio: [0, 1],
        todosCero: true,
      };
    }

    const valores = datosNormalizados.map((item) =>
      Number(item.valor || 0)
    );
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    const todosCero = valores.every((valor) => valor === 0);

    let dominio;

    if (minimo === maximo) {
      if (minimo === 0) {
        dominio = [0, 1];
      } else {
        const margen = Math.max(Math.abs(minimo) * 0.12, 1);
        dominio = [
          minimo > 0 ? Math.max(0, minimo - margen) : minimo - margen,
          maximo + margen,
        ];
      }
    } else {
      const margen = Math.max((maximo - minimo) * 0.12, 1);
      dominio = [minimo >= 0 ? 0 : minimo - margen, maximo + margen];
    }

    return { dominio, todosCero };
  }, [datosNormalizados]);

  const mostrarPuntos = datosNormalizados.length <= 14;

  if (datosNormalizados.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.04] text-xl text-slate-500">
            〰
          </div>
          <p className="mt-4 text-sm font-bold text-slate-300">
            Sin información disponible
          </p>
          <p className="mt-1 text-xs text-slate-500">
            No existen datos para este periodo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[220px] w-full min-w-0">
      {informacion.todosCero && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="whitespace-nowrap rounded-full border border-white/[0.10] bg-[#070a11]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 shadow-[0_16px_45px_rgba(0,0,0,0.40)] backdrop-blur-xl">
            Sin movimientos en el periodo
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <AreaChart
          data={datosNormalizados}
          margin={{ top: 20, right: 18, left: 5, bottom: 4 }}
        >
          <defs>
            <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.36} />
              <stop offset="48%" stopColor={color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>

            <filter id={idBrillo} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="4 7"
            stroke="rgba(148,163,184,0.09)"
            vertical={false}
          />

          <XAxis
            dataKey="fecha"
            axisLine={{ stroke: "rgba(148,163,184,0.28)" }}
            tickLine={false}
            minTickGap={20}
            interval="preserveStartEnd"
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
            tickMargin={10}
          />

          <YAxis
            domain={informacion.dominio}
            axisLine={false}
            tickLine={false}
            width={68}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
            tickFormatter={(valor) => formatearMontoCorto(valor, moneda)}
          />

          <ReferenceLine
            y={0}
            stroke="rgba(148,163,184,0.22)"
            strokeDasharray="3 5"
          />

          <Tooltip
            cursor={{
              stroke: color,
              strokeWidth: 1,
              strokeDasharray: "4 5",
              strokeOpacity: 0.55,
            }}
            content={(props) => (
              <TooltipPremium
                {...props}
                color={color}
                moneda={moneda}
                nombre={nombre}
              />
            )}
          />

          <Area
            type="monotone"
            dataKey="valor"
            name={nombre}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${idGradiente})`}
            fillOpacity={1}
            connectNulls
            baseValue="dataMin"
            isAnimationActive={!informacion.todosCero}
            animationDuration={750}
            animationEasing="ease-out"
            filter={`url(#${idBrillo})`}
            dot={
              mostrarPuntos
                ? { r: 3, fill: "#070a11", stroke: color, strokeWidth: 2 }
                : false
            }
            activeDot={{
              r: 6,
              fill: color,
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;
