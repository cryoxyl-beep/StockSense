"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DemandChart({ productId }: { productId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/history/${productId}`)
      .then((r) => r.json())
      .then((history) => {
        if (!mounted) return;
        // Transform ledger data into cumulative stock chart or daily demand chart
        // Let's create a simple time series of stock levels
        let currentStock = 0;
        const chartData = history.map((item: any) => {
          currentStock += item.quantityDelta;
          return {
            date: new Date(item.at).toLocaleDateString(),
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

  if (loading) return <div className="h-48 flex items-center justify-center text-zinc-500">Loading chart...</div>;
  if (data.length === 0) return <div className="h-48 flex items-center justify-center text-zinc-500">No movement history for this item.</div>;

  // Determine trend: if overall stock went down significantly, it's high demand. 
  // Wait, stock level chart: positive is green area, but if they want demand, maybe plot deliveries?
  // Let's just plot the stock level.
  const isHighDemand = data.length > 1 && data[data.length - 1].stock < data[0].stock;
  const color = isHighDemand ? "#ef4444" : "#10b981"; // Red if stock is dropping (high demand), green if stable/rising

  return (
    <div className="w-full h-48 bg-white/50 p-4 rounded-lg border border-zinc-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-zinc-700">Stock Trend</h4>
        {isHighDemand ? (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">High Demand</span>
        ) : (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Stable</span>
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#71717a', fontSize: '12px' }}
          />
          <Area type="monotone" dataKey="stock" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorStock)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
