import React, { useState } from 'react';
import { X, Upload, FileText, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, CATEGORIES } from '../../db/schema';
import { encryptData, fileToBase64 } from '../../services/encryption';
import { useVault } from '../../context/VaultContext';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { sessionKey } = useVault();
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    category: CATEGORIES.PRESCRIPTION,
    doctor: '',
    hospital: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMetadata(prev => ({ ...prev, name: selectedFile.name.split('.')[0] }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !sessionKey) return;

    setIsEncrypting(true);
    setError('');

    try {
      // 1. Convert to Base64
      const base64Data = await fileToBase64(file);
      
      // 2. Encrypt
      const encrypted = encryptData(base64Data, sessionKey);
      
      // 3. Save to Dexie
      await db.records.add({
        ...metadata,
        type: file.type,
        size: file.size,
        encryptedData: encrypted.content,
        iv: encrypted.iv,
        salt: encrypted.salt,
        createdAt: new Date().toISOString()
      });

      onUploadSuccess();
      onClose();
      setFile(null);
    } catch (err) {
      console.error('Encryption/Upload error:', err);
      setError('Failed to encrypt and store file. Please try again.');
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Secure Upload</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-8 space-y-6">
              {!file ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-medical-400 hover:bg-medical-50 transition-all group cursor-pointer relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors">
                    <Upload className="text-slate-400 group-hover:text-medical-600" size={32} />
                  </div>
                  <p className="text-slate-600 font-medium">Click to select or drag and drop</p>
                  <p className="text-slate-400 text-sm mt-1">PDF, JPG, or PNG (Max 10MB)</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-medical-50 rounded-2xl border border-medical-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-medical-600 shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Document Name</label>
                      <input 
                        type="text" 
                        required
                        value={metadata.name}
                        onChange={e => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                      <select 
                        value={metadata.category}
                        onChange={e => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none appearance-none"
                      >
                        {Object.values(CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
                      <input 
                        type="date" 
                        required
                        value={metadata.date}
                        onChange={e => setMetadata(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Doctor Name</label>
                      <input 
                        type="text" 
                        placeholder="Optional"
                        value={metadata.doctor}
                        onChange={e => setMetadata(prev => ({ ...prev, doctor: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Hospital</label>
                      <input 
                        type="text" 
                        placeholder="Optional"
                        value={metadata.hospital}
                        onChange={e => setMetadata(prev => ({ ...prev, hospital: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-medical-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!file || isEncrypting}
                  className="w-full py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-medical-200 flex items-center justify-center gap-3"
                >
                  {isEncrypting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Encrypting Locally...
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      Secure to Vault
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-[0.2em] font-bold">
                  Zero-Knowledge Proof • End-to-End Encrypted
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
