"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-zinc-200 p-3 rounded-xl shadow-lg">
        <p className="text-xs font-semibold text-zinc-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-zinc-900">
          Stock Level: <span className="text-indigo-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function DemandChart({ productId }: { productId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/history/${productId}`)
      .then((r) => r.json())
      .then((history) => {
        if (!mounted) return;
        let currentStock = 0;
        const chartData = history.map((item: any) => {
          currentStock += item.quantityDelta;
          return {
            date: new Date(item.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            stock: currentStock,
            delta: item.quantityDelta,
          };
        });
        setData(chartData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { mounted = false; };
  }, [productId]);

  if (loading) return <div className="h-64 flex items-center justify-center text-zinc-400">Loading chart data...</div>;
  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-zinc-400">No movement history for this item.</div>;

  const isHighDemand = data.length > 1 && data[data.length - 1].stock < data[0].stock;
  const color = isHighDemand ? "#ef4444" : "#10b981";

  return (
    <div className="w-full h-64 bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-base font-bold text-zinc-900">Stock Trend</h4>
          <p className="text-xs text-zinc-500 mt-1">Real-time ledger movements</p>
        </div>
        {isHighDemand ? (
          <span className="px-3 py-1.5 bg-red-100/80 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center gap-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            High Demand
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-emerald-100/80 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-sm">
            Stable
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorStock-${productId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a1a1aa', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="monotone" 
            dataKey="stock" 
            stroke={color} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill={`url(#colorStock-${productId})`}
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
