import React, { useState, useRef } from 'react';
import { Plus, Camera, Trash2, AlertTriangle, Leaf } from 'lucide-react';
import { ConsumptionCategory } from '../../types/ai';
import { analyzeInventoryImage } from '../../services/ai/geminiService';

const InventoryManager = ({ inventory, setInventory }) => {
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            const detectedItems = await analyzeInventoryImage(base64String);

            const newItems = detectedItems.map((item, idx) => ({
                id: Date.now().toString() + idx,
                name: item.name || 'Unknown Item',
                quantity: item.quantity || '1',
                expiryDate: item.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                category: item.category || ConsumptionCategory.Other,
                addedDate: new Date().toISOString().split('T')[0]
            }));

            setInventory(prev => [...prev, ...newItems]);
            setIsScanning(false);
        };
        reader.readAsDataURL(file);
    };

    const removeFree = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id));
    };

    const getExpiryRisk = (dateStr) => {
        const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        if (days < 2) return 'bg-red-100 text-red-700 border-red-200';
        if (days < 5) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-white border-slate-200 text-slate-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                    Smart Inventory
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        disabled={isScanning}
                    >
                        {isScanning ? (
                            <span className="animate-pulse">Scanning...</span>
                        ) : (
                            <>
                                <Camera className="w-4 h-4" />
                                <span>AI Scan</span>
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                        <p>No food items yet. Try the AI Scan!</p>
                    </div>
                )}

                {inventory.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border shadow-sm flex justify-between items-start ${getExpiryRisk(item.expiryDate)}`}
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                {(new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) < 3 && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                            <p className="text-sm opacity-80">{item.quantity} • {item.category}</p>
                            <p className="text-xs mt-2 font-medium opacity-70">Expires: {item.expiryDate}</p>
                        </div>
                        <button
                            onClick={() => removeFree(item.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryManager;
