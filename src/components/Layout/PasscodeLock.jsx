import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { Lock, Unlock, ShieldAlert, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasscodeLock = ({ onUnlock }) => {
  const { hasSetup, setupVault, unlockVault, finishSetup, loading: vaultLoading } = useVault();
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(hasSetup ? 'unlock' : 'setup');
  const [recoveryKey, setRecoveryKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 'setup') {
      if (passcode.length < 4) {
        setError('Passcode must be at least 4 digits.');
        return;
      }
      setStep('confirm');
    } else if (step === 'confirm') {
      if (passcode !== confirmPasscode) {
        setError('Passcodes do not match.');
        setPasscode('');
        setConfirmPasscode('');
        setStep('setup');
        return;
      }
      
      setLoading(true);
      try {
        const key = await setupVault(passcode);
        setRecoveryKey(key);
        setStep('recovery');
      } catch (err) {
        setError('Setup failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else if (step === 'unlock') {
      setLoading(true);
      try {
        const success = await unlockVault(passcode);
        if (success) {
          onUnlock && onUnlock();
        } else {
          setError('Incorrect passcode.');
          setPasscode('');
        }
      } catch (err) {
        setError('Unlock error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-95 backdrop-blur-sm px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-medical-50 rounded-2xl">
              {step === 'unlock' ? (
                <Lock className="w-10 h-10 text-medical-600" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-medical-600" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
            {step === 'unlock' ? 'Vault Locked' : step === 'recovery' ? 'Save Recovery Key' : 'Secure Your Vault'}
          </h2>
          <p className="text-slate-500 text-center mb-8">
            {step === 'unlock' 
              ? 'Enter your passcode to access your medical records.' 
              : step === 'recovery' 
              ? 'This key is the ONLY way to recover your data if you forget your passcode. Save it somewhere safe!'
              : 'Create a passcode to encrypt your health data locally.'}
          </p>

          <form onSubmit={handleAction}>
            <AnimatePresence mode="wait">
              {step === 'recovery' ? (
                <motion.div
                  key="recovery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl break-all font-mono text-medical-700 text-center text-lg">
                    {recoveryKey}
                  </div>
                  <button
                    type="button"
                    onClick={() => finishSetup(passcode)}
                    className="w-full py-4 bg-medical-600 text-white rounded-2xl font-semibold hover:bg-medical-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-5 h-5" />
                    I've Saved the Key
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <input
                    type="password"
                    placeholder={step === 'confirm' ? 'Confirm Passcode' : 'Enter Passcode'}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-medical-500 transition-all outline-none mb-4"
                    value={step === 'confirm' ? confirmPasscode : passcode}
                    onChange={(e) => step === 'confirm' ? setConfirmPasscode(e.target.value) : setPasscode(e.target.value)}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-4 bg-medical-600 text-white rounded-2xl font-semibold hover:bg-medical-700 transition-colors"
                  >
                    {step === 'unlock' ? 'Unlock Vault' : 'Continue'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
        
        <div className="bg-slate-50 p-6 text-center">
          <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
            Client-Side Encrypted • AES-256
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasscodeLock;
