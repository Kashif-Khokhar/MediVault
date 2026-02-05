import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, Plus, TrendingUp, History } from 'lucide-react';

const VitalsChart = () => {
  const [selectedType, setSelectedType] = useState('Blood Pressure (Systolic)');
  const [isAdding, setIsAdding] = useState(false);
  const [newVital, setNewVital] = useState({ value: '', type: 'Blood Pressure (Systolic)', unit: 'mmHg' });

  const vitals = useLiveQuery(() => 
    db.vitals.orderBy('timestamp').toArray()
  );

  const chartData = vitals
    ?.filter(v => v.type === selectedType)
    .map(v => ({
      name: new Date(v.timestamp).toLocaleDateString(),
      value: parseFloat(v.value),
      original: v
    }));

  const handleAddVital = async (e) => {
    e.preventDefault();
    if (!newVital.value) return;

    await db.vitals.add({
      ...newVital,
      timestamp: new Date().toISOString()
    });
    
    setNewVital({ ...newVital, value: '' });
    setIsAdding(false);
  };

  const vitalTypes = [
    { name: 'Blood Pressure (Systolic)', unit: 'mmHg' },
    { name: 'Blood Pressure (Diastolic)', unit: 'mmHg' },
    { name: 'Heart Rate', unit: 'bpm' },
    { name: 'Glucose', unit: 'mg/dL' },
    { name: 'Oxygen Saturation', unit: '%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Health Vitals</h3>
          <p className="text-slate-500 text-sm">Track your metabolic trends over time.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-medical-50 text-medical-600 rounded-xl font-bold text-sm hover:bg-medical-100 transition-all border border-medical-100"
        >
          <Plus size={18} />
          Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2">
              {vitalTypes.map(type => (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(type.name)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedType === type.name 
                      ? 'bg-medical-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                    label={{ value: vitals?.find(v => v.type === selectedType)?.unit || '', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <TrendingUp size={48} className="opacity-20" />
                <p className="text-sm">No data available for this metric.</p>
              </div>
            )}
          </div>
        </div>

        {/* History / Stats sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History size={18} className="text-medical-600" />
              Recent Entries
            </h4>
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 no-scrollbar">
              {vitals?.slice().reverse().slice(0, 5).map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{v.type}</p>
                    <p className="text-xs text-slate-500">{new Date(v.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{v.value}<span className="text-[10px] ml-1 text-slate-400">{v.unit}</span></p>
                  </div>
                </div>
              ))}
              {(!vitals || vitals.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-8">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-6">Log New Vital</h3>
            
            <form onSubmit={handleAddVital} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Vital Type</label>
                <select 
                   value={newVital.type}
                   onChange={e => {
                     const type = vitalTypes.find(t => t.name === e.target.value);
                     setNewVital({ ...newVital, type: type.name, unit: type.unit });
                   }}
                   className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none appearance-none"
                >
                  {vitalTypes.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Value ({newVital.unit})</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  autoFocus
                  value={newVital.value}
                  onChange={e => setNewVital({ ...newVital, value: e.target.value })}
                  placeholder="e.g. 120"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-lg shadow-medical-200"
              >
                Save to Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsChart;
