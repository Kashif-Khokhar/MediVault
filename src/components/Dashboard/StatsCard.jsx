import React from 'react';
import { 
  FileCheck, 
  Calendar, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const StatsCard = ({ title, value, subtext, icon: IconComponent, color, trend }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} transition-colors`}>
          <IconComponent size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-800">{value}</span>
        <span className="text-slate-400 text-xs font-medium">{subtext}</span>
      </div>
    </div>
  );
};

export const DashboardStats = ({ recordsCount, vitalsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Total Records" 
        value={recordsCount || 0} 
        subtext="files"
        icon={FileCheck}
        color="bg-medical-50 text-medical-600"
      />
      <StatsCard 
        title="Vitals Logged" 
        value={vitalsCount || 0} 
        subtext="entries"
        icon={TrendingUp}
        color="bg-purple-50 text-purple-600"
        trend={12}
      />
      <StatsCard 
        title="Next Medicine" 
        value="08:00" 
        subtext="am"
        icon={Clock}
        color="bg-amber-50 text-amber-600"
      />
      <StatsCard 
        title="Last Checkup" 
        value="14" 
        subtext="days ago"
        icon={Calendar}
        color="bg-rose-50 text-rose-600"
      />
    </div>
  );
};

export default StatsCard;
