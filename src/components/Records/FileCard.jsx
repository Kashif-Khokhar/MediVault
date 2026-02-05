import React from 'react';
import { FileText, Calendar, MoreVertical, ExternalLink, Trash2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const FileCard = ({ record, onView, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-medical-50 rounded-xl text-medical-600 transition-colors group-hover:bg-medical-100">
          <FileText size={24} />
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onView(record)}
            className="p-2 text-slate-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
          >
            <ExternalLink size={18} />
          </button>
          <button 
            onClick={() => onDelete(record.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-slate-800 truncate mb-1" title={record.name}>
          {record.name}
        </h4>
        <div className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
          {record.category}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          <span>{formatDate(record.date)}</span>
        </div>
        {record.doctor && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User size={14} className="text-slate-400" />
            <span className="truncate">Dr. {record.doctor}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-300 font-medium">
        <span>{(record.size / 1024 / 1024).toFixed(2)} MB</span>
        <span className="uppercase tracking-tighter">AES-256 SECURED</span>
      </div>
    </motion.div>
  );
};

export default FileCard;
