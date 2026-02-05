import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptData } from '../../services/encryption';
import { useVault } from '../../context/VaultContext';

const DocumentViewer = ({ record, onClose }) => {
  const { sessionKey } = useVault();
  const [decryptedUrl, setDecryptedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const decryptFile = useCallback(async () => {
    if (!record || !sessionKey) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Small delay to show the nice skeleton/loading state
      await new Promise(resolve => setTimeout(resolve, 600));

      const decryptedBase64 = decryptData(
        record.encryptedData, 
        sessionKey, 
        record.iv, 
        record.salt
      );

      // Convert back to Blob
      const response = await fetch(decryptedBase64);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setDecryptedUrl(url);
    } catch (err) {
      console.error('Decryption failed:', err);
      setError('Decryption failed. Please check your passcode or session.');
    } finally {
      setLoading(false);
    }
  }, [record, sessionKey]);

  useEffect(() => {
    if (record && sessionKey) {
      decryptFile();
    }
    
    // Cleanup URL on close
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [record, sessionKey, decryptFile]); // Fixed: removed decryptedUrl from dependencies to avoid loop

  return (
    <AnimatePresence>
      {record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white px-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 truncate max-w-md">{record.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mt-0.5">Decrypted Session Active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {decryptedUrl && (
                  <a 
                    href={decryptedUrl} 
                    download={record.name}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center relative">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="animate-spin text-medical-600 mx-auto mb-4" size={40} />
                  <p className="text-slate-500 font-medium">Decrypting document...</p>
                </div>
              ) : error ? (
                <div className="text-center p-8">
                  <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                  <p className="text-slate-800 font-bold mb-2">{error}</p>
                  <button 
                    onClick={decryptFile}
                    className="px-6 py-2 bg-medical-600 text-white rounded-xl text-sm font-bold shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="w-full h-full p-8 flex items-center justify-center">
                  {record.type.startsWith('image/') ? (
                    <img 
                      src={decryptedUrl} 
                      alt={record.name} 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                    />
                  ) : (
                    <iframe 
                      src={decryptedUrl} 
                      className="w-full h-full rounded-lg bg-white shadow-xl"
                      title={record.name}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="bg-medical-600 p-3 text-center">
              <p className="text-[9px] text-white/80 uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-2">
                <ShieldCheck size={12} />
                Temporary Decryption Only • No Unencrypted Cache
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewer;
