import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis } from
'recharts';
import { currency } from '../../utils/format';

const axis = { stroke: '#9caccb', fontSize: 11 };
const grid = '#e7ebf3';

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #e7ebf3',
  boxShadow: '0 12px 32px -8px rgb(15 27 51 / 0.18)',
  fontSize: 12,
  padding: '8px 10px'
};

export function CaseMixChart({
  data


}: {data: Array<{name: string;value: number;color: string;}>;}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-6 px-5 py-5 sm:flex-row sm:gap-8">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              animationDuration={700}>
              
              {data.map((d) =>
              <Cell key={d.name} fill={d.color} />
              )}
            </Pie>
            <ReTooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-[-0.02em] text-navy-900 tabular">{total}</span>
          <span className="text-[11px] text-navy-400">Total cases</span>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {data.map((d) =>
        <li key={d.name} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} aria-hidden />
            <span className="flex-1 text-[13px] font-medium text-navy-700">{d.name}</span>
            <span className="text-[13px] font-semibold text-navy-900 tabular">{d.value}</span>
            <span className="w-12 text-right text-[12px] text-navy-400 tabular">
              {total ? Math.round(d.value / total * 100) : 0}%
            </span>
          </li>
        )}
      </ul>
    </div>);

}

export function CaseflowChart({ data }: {data: Array<{month: string;opened: number;closed: number;}>;}) {
  return (
    <div className="h-[240px] w-full px-3 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
          <YAxis tickLine={false} axisLine={false} tick={axis} width={28} />
          <ReTooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(15,27,51,0.04)' }} />
          <Bar dataKey="opened" name="Opened" fill="#0f1b33" radius={[3, 3, 0, 0]} maxBarSize={16} />
          <Bar dataKey="closed" name="Closed" fill="#93bbfd" radius={[3, 3, 0, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}

export function RevenueChart({
  data


}: {data: Array<{month: string;billed: number;collected: number;}>;}) {
  return (
    <div className="h-[240px] w-full px-3 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="billedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2559eb" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#2559eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={axis}
            width={44}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
          
          <ReTooltip contentStyle={tooltipStyle} formatter={(v: number) => currency(v)} />
          <Area
            type="monotone"
            dataKey="billed"
            name="Billed"
            stroke="#2559eb"
            strokeWidth={2}
            fill="url(#billedFill)"
            animationDuration={700} />
          
          <Area
            type="monotone"
            dataKey="collected"
            name="Collected"
            stroke="#0f1b33"
            strokeWidth={2}
            fill="none"
            animationDuration={700} />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}