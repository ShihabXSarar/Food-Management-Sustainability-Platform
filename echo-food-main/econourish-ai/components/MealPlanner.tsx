import React, { useState } from 'react';
import { Calendar, ShoppingBag, RefreshCw, ChevronRight } from 'lucide-react';
import { InventoryItem, MealPlanDay } from '../types';
import { generateMealPlan } from '../services/geminiService';

interface Props {
  inventory: InventoryItem[];
}

const MealPlanner: React.FC<Props> = ({ inventory }) => {
  const [plan, setPlan] = useState<MealPlanDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(150);

  const handleGenerate = async () => {
    setLoading(true);
    const newPlan = await generateMealPlan(inventory, budget);
    setPlan(newPlan);
    setLoading(false);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Smart Meal Plan
          </h2>
          <p className="text-sm text-slate-500">Optimized for inventory waste reduction & budget.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
          <label className="text-sm font-medium text-slate-700 ml-2">Weekly Budget:</label>
          <div className="flex items-center relative">
            <span className="absolute left-3 text-slate-400">$</span>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-24 pl-6 pr-2 py-1 border rounded focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Optimizing...' : 'Generate Plan'}
          </button>
        </div>
      </div>

      {plan.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">No active plan.</p>
          <button onClick={handleGenerate} className="text-emerald-600 font-medium hover:underline">
            Generate one based on your {inventory.length} items?
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plan.map((day, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{day.day}</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                ~${day.meals.reduce((acc, m) => acc + m.costEstimate, 0).toFixed(2)}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {day.meals.map((meal, mIdx) => (
                <div key={mIdx} className="p-4 group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{meal.type}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{meal.nutritionFocus}</span>
                  </div>
                  <h4 className="font-medium text-slate-800 mb-2">{meal.name}</h4>
                  <div className="text-xs text-slate-500">
                    <p className="mb-1 font-medium">Uses:</p>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.map((ing, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">{ing}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
              <button className="text-sm text-emerald-600 font-medium flex items-center justify-center gap-1 w-full">
                View Recipe <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
