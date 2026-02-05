import React, { useState } from 'react';
import { Plus, Filter, Search, Grid, List as ListIcon } from 'lucide-react';
import { db, CATEGORIES } from '../../db/schema';
import FileCard from './FileCard';
import UploadModal from './UploadModal';
import DocumentViewer from './DocumentViewer';
import { useLiveQuery } from 'dexie-react-hooks';

const RecordsList = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Live query for records
  const records = useLiveQuery(
    async () => {
      let collection = db.records.orderBy('date').reverse();
      
      if (filterCategory !== 'All') {
        collection = collection.filter(r => r.category === filterCategory);
      }
      
      return await collection.toArray();
    },
    [filterCategory]
  );

  const filteredRecords = records?.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hospital?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record? This cannot be undone.')) {
      await db.records.delete(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medical Records</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and access your encrypted documents.</p>
        </div>
        
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-medical-200"
        >
          <Plus size={20} />
          <span>Upload Record</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, doctor, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <button 
            onClick={() => setFilterCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterCategory === 'All' ? 'bg-medical-600 text-white shadow-md shadow-medical-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            All Records
          </button>
          {Object.values(CATEGORIES).map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterCategory === cat ? 'bg-medical-600 text-white shadow-md shadow-medical-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {!filteredRecords ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <FileText size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No records found</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            {searchQuery || filterCategory !== 'All' 
              ? "We couldn't find anything matching your filters." 
              : "Your vault is empty. Start by uploading your first medical document."}
          </p>
          {!searchQuery && filterCategory === 'All' && (
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-6 text-medical-600 font-bold hover:underline"
            >
              Upload a record now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecords.map(record => (
            <FileCard 
              key={record.id} 
              record={record} 
              onView={setSelectedRecord} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={() => {}} // LiveQuery handles the update
      />
      
      <DocumentViewer 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
      />
    </div>
  );
};

export default RecordsList;
