import React, { useState } from 'react';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Bell, Trash2, CheckCircle2, X } from 'lucide-react';

const MedicineReminders = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ 
    medicineName: '', 
    dosage: '', 
    frequency: 'Daily',
    time: '08:00'
  });

  const reminders = useLiveQuery(() => db.reminders.toArray());

  const handleAddRemidner = async (e) => {
    e.preventDefault();
    if (!newReminder.medicineName) return;

    await db.reminders.add({
      ...newReminder,
      isActive: true,
      nextDose: newReminder.time
    });

    setNewReminder({ medicineName: '', dosage: '', frequency: 'Daily', time: '08:00' });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    await db.reminders.delete(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Bell className="text-amber-500" size={24} />
          Medication Reminders
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders?.map(rem => (
          <div key={rem.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{rem.medicineName}</h4>
                <p className="text-xs text-slate-500">{rem.dosage} • {rem.frequency}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">{rem.time}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Next Dose</p>
              </div>
              <button 
                onClick={() => handleDelete(rem.id)}
                className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {reminders?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 text-sm italic">No medications scheduled.</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            <h3 className="text-xl font-bold text-slate-800 mb-6 font-primary">New Medication</h3>
            <form onSubmit={handleAddRemidner} className="space-y-4">
              <input 
                type="text" 
                placeholder="Medicine Name" 
                className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                value={newReminder.medicineName}
                onChange={e => setNewReminder({...newReminder, medicineName: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Dosage" 
                  className="w-1/2 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={newReminder.dosage}
                  onChange={e => setNewReminder({...newReminder, dosage: e.target.value})}
                />
                <input 
                  type="time" 
                  className="w-1/2 px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  value={newReminder.time}
                  onChange={e => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-200">Set Reminder</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineReminders;
