import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  Settings, 
  LogOut, 
  ShieldPlus,
  Plus
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';

const Sidebar = ({ activeTab, onNavigate }) => {
  const { lockVault } = useVault();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <FileText size={20} />, label: 'Records', id: 'records' },
    { icon: <Activity size={20} />, label: 'Vitals', id: 'vitals' },
    { icon: <ShieldPlus size={20} />, label: 'ICE Details', id: 'ice' },
    { icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-medical-200">
            <ShieldPlus size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            MediVault
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              activeTab === item.id 
                ? 'bg-medical-50 text-medical-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={lockVault}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Lock Vault</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
