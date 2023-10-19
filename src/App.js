import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import CryptoJS from "crypto-js";
import backgroundImage from './background.png'; // Убедитесь, что путь правильный

function App() {
  const [password, setPassword] = useState("");
  const [iv, setIv] = useState("");
  const [encText, setEncText] = useState("");
  const [decText, setDecText] = useState("");
  const [plainText, setPlainText] = useState("");
  const [encryptedFromPlain, setEncryptedFromPlain] = useState("");  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  
  useEffect(() => 
  {
    generateIV();
  }, []);

  const displayError = (message) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 2000);
  };

  const generateIV = () => 
  {
    let randomChars = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        randomChars += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setIv(randomChars);
  };

  const encryptText = () => {
    try 
    {
      displayError("");
      if (password.length === 32 && plainText !== "") 
      {
        generateIV();
        const key = CryptoJS.enc.Utf8.parse(password);
        const ivBytes = CryptoJS.enc.Utf8.parse(iv);
        
        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
  
        const encryptedTextWithIv = iv + encrypted.toString();
        setEncryptedFromPlain(encryptedTextWithIv);
      } 
      else 
      {
        displayError("Нет пароля или текста для шифрования");
      }
    }
    catch (error) 
    {
      displayError("Ошибка шифрования");
    }
  };
  
  const decryptText = () => {
    try 
    {
      displayError("");
      if (password.length === 32 && encText) 
      {
        const ivFromEncryptedText = encText.substr(0, 16);
        const actualEncryptedText = encText.substr(16);
        const key = CryptoJS.enc.Utf8.parse(password);
        const ivBytes = CryptoJS.enc.Utf8.parse(ivFromEncryptedText);
  
        const decrypted = CryptoJS.AES.decrypt(actualEncryptedText, key, {
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
  
        setDecText(decrypted);
      } 
      else 
      {
        displayError("Нет пароля или зашифрованного текста");
      }
    } 
    catch (error) 
    {
      displayError("Ошибка дешифрования");
    }
  };

  return (
    <div 
    style={{ 
      backgroundImage: `url(${backgroundImage})`, 
      backgroundPosition: 'center', 
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat'
    }}
    className="min-h-screen flex flex-col justify-center sm:py-12"
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
             
            {
              showError && (
                <div className="fixed top-0 middle-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute z-50 m-4" role="alert">
                  <strong className="font-bold">Ошибка: </strong>
                  <span className="block sm:inline"> {error} </span>
                </div>
              )
            }

            {/* Поле ввода пароля */}
            <div className="flex justify-between items-center mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-600 p-2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Карточка для шифрования */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Encryption</h2>
              <textarea
                className="resize-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring true"
                rows="4"
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
              ></textarea>
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={encryptText}
              >
                Encrypt
              </button>
              <textarea
                className="resize-none border rounded-md w-full py-2 px-3 text-gray-700 mt-3 leading-tight focus:outline-none focus:ring true"
                rows="4"
                value={encryptedFromPlain}
                readOnly
              ></textarea>
            </div>

            {/* Карточка для дешифровки */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Decryption</h2>
              <textarea
                className="resize-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring true"
                rows="4"
                value={encText}
                onChange={(e) => setEncText(e.target.value)}
              ></textarea>
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={decryptText}
              >
                Decrypt
              </button>
              <textarea
                className="resize-none border rounded-md w-full py-2 px-3 text-gray-700 mt-3 leading-tight focus:outline-none focus:ring true"
                rows="4"
                value={decText}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;