import CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES-256 with a provided password.
 * @param {string} data - The string or base64 data to encrypt.
 * @param {string} password - The user's secret password.
 * @returns {Object} - Encrypted data along with IV and Salt for storage.
 */
export const encryptData = (data, password) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 1000
    });

    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });

    return {
        content: encrypted.toString(),
        iv: iv.toString(),
        salt: salt.toString()
    };
};

/**
 * Decrypts data using AES-256.
 * @param {string} encryptedData - The encrypted content.
 * @param {string} password - The user's secret password.
 * @param {string} iv - The initialization vector used for encryption.
 * @param {string} salt - The salt used for key derivation.
 * @returns {string} - The decrypted content.
 */
export const decryptData = (encryptedData, password, iv, salt) => {
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32,
        iterations: 1000
    });

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: CryptoJS.enc.Hex.parse(iv)
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * Helper to convert File object to Base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
