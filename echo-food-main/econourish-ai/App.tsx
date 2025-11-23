import React, { useState } from 'react';
import { LayoutDashboard, Package, CalendarDays, Heart } from 'lucide-react';
import InventoryManager from './components/InventoryManager';
import SustainabilityDashboard from './components/SustainabilityDashboard';
import MealPlanner from './components/MealPlanner';
import CommunityHub from './components/CommunityHub';
import NourishBot from './components/NourishBot';
import { InventoryItem, ConsumptionCategory, ConsumptionLog } from './types';

// Mock Data for Demo
const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Spinach', quantity: '200g', expiryDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0], category: ConsumptionCategory.Produce, addedDate: '2023-10-25' },
  { id: '2', name: 'Greek Yogurt', quantity: '1 tub', expiryDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0], category: ConsumptionCategory.Dairy, addedDate: '2023-10-26' },
  { id: '3', name: 'Chicken Breast', quantity: '500g', expiryDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], category: ConsumptionCategory.Protein, addedDate: '2023-10-27' },
  { id: '4', name: 'Oats', quantity: '1kg', expiryDate: '2024-05-01', category: ConsumptionCategory.Grains, addedDate: '2023-10-01' },
];

const MOCK_LOGS: ConsumptionLog[] = [
  { date: '2023-10-20', category: 'Produce', wasted: true, amount: 100 },
  { date: '2023-10-21', category: 'Dairy', wasted: false, amount: 200 },
  { date: '2023-10-22', category: 'Protein', wasted: false, amount: 300 },
  { date: '2023-10-23', category: 'Grains', wasted: false, amount: 150 },
  { date: '2023-10-24', category: 'Produce', wasted: false, amount: 250 },
  { date: '2023-10-25', category: 'Snacks', wasted: true, amount: 50 },
  { date: '2023-10-26', category: 'Protein', wasted: false, amount: 300 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'plan' | 'community'>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  
  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'FoodScan', icon: Package },
    { id: 'plan', label: 'Meal Plan', icon: CalendarDays },
    { id: 'community', label: 'Community', icon: Heart },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 w-64 h-full bg-emerald-900 text-white flex-col shadow-xl z-20">
        <div className="p-6 border-b border-emerald-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl"></span> EchoFood
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-emerald-700 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 bg-emerald-950/30">
          <p className="text-xs text-emerald-300 opacity-60 text-center">
            Hackathon Build v2.0 <br/> SDG 2 & 12
          </p>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${
              activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
        {/* Mobile Header */}
        <div className="md:hidden mb-6 flex items-center justify-between">
           <h1 className="text-xl font-bold text-emerald-900">EchoFood AI</h1>
           <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">U</div>
        </div>

        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <SustainabilityDashboard inventory={inventory} logs={MOCK_LOGS} />
          )}
          {activeTab === 'inventory' && (
            <InventoryManager inventory={inventory} setInventory={setInventory} />
          )}
          {activeTab === 'plan' && (
            <MealPlanner inventory={inventory} />
          )}
          {activeTab === 'community' && (
            <CommunityHub />
          )}
        </div>
      </main>

      {/* Global Chatbot */}
      <NourishBot />
    </div>
  );
};

export default App;
