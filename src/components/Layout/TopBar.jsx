import React, { useState } from 'react';
import { Search, Bell, UserCircle, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const TopBar = ({ onNavigate }) => {
  const { user, sync, logout } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await sync();
    setTimeout(() => setIsSyncing(false), 1000); // Visual feedback
  };

  const handleLogout = () => {
    logout();
    onNavigate && onNavigate('dashboard');
  };
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search records, doctors, or labs..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-0 rounded-1.5xl focus:ring-2 focus:ring-medical-500/10 focus:bg-white transition-all outline-none text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-100 disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw className="animate-spin text-medical-600" size={18} /> : <Cloud className="text-medical-600" size={18} />}
            <span className="hidden md:inline">Sync Vault</span>
          </button>
        )}

        <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-medical-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-1.5 pr-3 hover:bg-red-50 group rounded-2xl transition-all"
          title="Sign Out"
        >
          <div className="w-9 h-9 bg-medical-100 group-hover:bg-red-100 rounded-xl flex items-center justify-center text-medical-600 group-hover:text-red-600 transition-colors">
            <UserCircle size={24} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none group-hover:text-red-700">{user ? user.email.split('@')[0] : 'Guest'}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider group-hover:text-red-400">Logout</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
