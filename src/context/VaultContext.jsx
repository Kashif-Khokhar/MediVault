import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../db/schema';
import CryptoJS from 'crypto-js';

const VaultContext = createContext();

export const VaultProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [sessionKey, setSessionKey] = useState(null);
  const [hasSetup, setHasSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSetupStatus = useCallback(async () => {
    try {
      const passcode = await db.settings.get('passcode');
      setHasSetup(!!passcode);
    } catch (err) {
      console.error('Check setup failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSetupStatus();
  }, [checkSetupStatus]);

  const setupVault = async (passcode) => {
    const hashedPasscode = CryptoJS.SHA256(passcode).toString();
    await db.settings.put({ key: 'passcode', value: hashedPasscode });
    
    // Generate a recovery key (simplified for now)
    const recoveryKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
    await db.settings.put({ key: 'recoveryKey', value: recoveryKey });
    
    setHasSetup(true);
    return recoveryKey;
  };

  const unlockVault = async (passcode) => {
    try {
      const storedHash = await db.settings.get('passcode');
      const inputHash = CryptoJS.SHA256(passcode).toString();

      if (storedHash && storedHash.value === inputHash) {
        setSessionKey(passcode);
        setIsLocked(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Unlock failed:', err);
      return false;
    }
  };

  const finishSetup = (passcode) => {
    setSessionKey(passcode);
    setIsLocked(false);
  };

  const lockVault = () => {
    setSessionKey(null);
    setIsLocked(true);
  };

  return (
    <VaultContext.Provider value={{ 
      isLocked, 
      sessionKey, 
      hasSetup, 
      loading, 
      setupVault, 
      unlockVault, 
      lockVault,
      finishSetup
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
