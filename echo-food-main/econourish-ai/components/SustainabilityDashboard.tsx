import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip 
} from 'recharts';
import { Activity, TrendingUp, DollarSign, Recycle } from 'lucide-react';
import { InventoryItem, ConsumptionLog, SustainabilityMetrics } from '../types';
import { getSustainabilityInsights } from '../services/geminiService';

interface Props {
  inventory: InventoryItem[];
  logs: ConsumptionLog[];
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

const SustainabilityDashboard: React.FC<Props> = ({ inventory, logs }) => {
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const data = await getSustainabilityInsights(inventory, logs);
      setMetrics(data);
      setLoading(false);
    };
    
    // Debounce or limit calls in real app. Here we call on mount or major change
    if (inventory.length > 0) {
      fetchMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory.length]); // Only re-analyze if inventory count changes significantly

  if (loading && !metrics) {
    return <div className="p-8 text-center animate-pulse text-emerald-700">Analyzing consumption patterns...</div>;
  }

  if (!metrics) return <div className="p-8 text-center text-slate-500">Add items to generate insights.</div>;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-1">Personal SDG Score</h2>
          <p className="text-emerald-100 text-sm opacity-90">Based on SDG 12.3 (Food Waste) & SDG 2 (Nutrition)</p>
        </div>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-900 opacity-30" />
            <circle 
              cx="64" cy="64" r="56" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={351} 
              strokeDashoffset={351 - (351 * metrics.sdgScore) / 100} 
              className="text-emerald-300 transition-all duration-1000" 
            />
          </svg>
          <span className="absolute text-3xl font-bold">{metrics.sdgScore}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-rose-100 rounded-full text-rose-600">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Projected Waste</p>
            <p className="text-xl font-bold text-slate-800">{metrics.wasteProjectionKg} kg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Money Saved</p>
            <p className="text-xl font-bold text-slate-800">${metrics.moneySaved}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Top Trend</p>
            <p className="text-sm font-bold text-slate-800">Reduced Meat Intake</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Consumption vs Waste
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.weeklyTrends}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <ReTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="consumption" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="waste" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Inventory Composition</h3>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
        <h3 className="font-bold text-emerald-900 mb-3">AI Action Plan</h3>
        <ul className="space-y-2">
          {metrics.suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm">
              <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              {sug}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
