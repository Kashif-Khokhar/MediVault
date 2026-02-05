import React, { useState } from 'react';
import { db } from '../../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import { ShieldAlert, Phone, User, Droplets, AlertTriangle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EmergencyCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const settings = useLiveQuery(() => db.settings.toArray());
  
  // Initialize iceData from settings on load
  const savedIce = settings?.find(s => s.key === 'iceData')?.value;
  
  const [localIceData, setLocalIceData] = useState(null);

  const displayData = localIceData || savedIce || {
    name: 'User Name',
    bloodGroup: 'O+',
    allergies: 'None',
    conditions: 'None',
    contactName: 'Emergency Contact',
    contactNumber: '000-000-0000'
  };

  const handleUpdate = (field, value) => {
    setLocalIceData({ ...displayData, [field]: value });
  };

  const handleSave = async () => {
    await db.settings.put({ key: 'iceData', value: displayData });
    setIsEditing(false);
    setLocalIceData(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Emergency Case (ICE)</h2>
          <p className="text-slate-500 text-sm mt-1">Information for first responders in case of emergency.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            isEditing 
              ? 'bg-green-600 text-white shadow-green-100' 
              : 'bg-medical-600 text-white shadow-medical-100'
          }`}
        >
          {isEditing ? <Save size={20} /> : <ShieldAlert size={20} />}
          <span>{isEditing ? 'Save Changes' : 'Edit ICE Card'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vital Info Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl border-2 border-red-50 shadow-xl overflow-hidden"
        >
          <div className="bg-red-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black uppercase tracking-tighter">Emergency medical ID</h3>
            </div>
            <Droplets className="animate-pulse" size={24} />
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <User size={40} />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 p-2 rounded-lg font-bold text-xl outline-none border-b-2 border-medical-500" 
                    value={displayData.name}
                    onChange={e => handleUpdate('name', e.target.value)}
                  />
                ) : (
                  <h4 className="text-2xl font-black text-slate-800">{displayData.name}</h4>
                )}
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Patient Name</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-widest mb-1">Blood Group</p>
                {isEditing ? (
                  <input 
                    className="w-full bg-transparent font-black text-xl text-red-600 outline-none" 
                    value={displayData.bloodGroup}
                    onChange={e => handleUpdate('bloodGroup', e.target.value)}
                  />
                ) : (
                  <p className="text-2xl font-black text-red-600">{displayData.bloodGroup}</p>
                )}
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Organ Donor</p>
                <p className="text-2xl font-black text-slate-800">YES</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={18} />
              Allergies & Conditions
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Critical Allergies</p>
                {isEditing ? (
                  <textarea 
                    className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" 
                    value={displayData.allergies}
                    onChange={e => handleUpdate('allergies', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{displayData.allergies}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Medical Conditions</p>
                {isEditing ? (
                  <textarea 
                    className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" 
                    value={displayData.conditions}
                    onChange={e => handleUpdate('conditions', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{displayData.conditions}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Phone className="text-green-500" size={18} />
              Emergency Contacts
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                <div>
                  {isEditing ? (
                    <input 
                      className="bg-transparent font-bold text-slate-800 outline-none" 
                      value={displayData.contactName}
                      onChange={e => handleUpdate('contactName', e.target.value)}
                    />
                  ) : (
                    <p className="font-bold text-slate-800">{displayData.contactName}</p>
                  )}
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Primary Contact</p>
                </div>
                {isEditing ? (
                  <input 
                    className="bg-transparent font-black text-slate-800 outline-none text-right" 
                    value={displayData.contactNumber}
                    onChange={e => handleUpdate('contactNumber', e.target.value)}
                  />
                ) : (
                  <p className="font-black text-slate-800">{displayData.contactNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
        <ShieldAlert className="text-amber-600 mt-1" size={24} />
        <div>
          <p className="text-sm font-bold text-amber-800">Public Emergency Access</p>
          <p className="text-xs text-amber-700 mt-1">
            This information is stored unencrypted in your local settings to allow potential quick access for first responders if you are unable to unlock your vault. Do not store sensitive clinical details here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
