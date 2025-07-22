import React from 'react';

const DebugInfo = () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    referrer: document.referrer,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    language: navigator.language,
    platform: navigator.platform,
    serviceWorkerSupported: 'serviceWorker' in navigator,
    localStorageSupported: typeof Storage !== 'undefined',
    sessionStorageSupported: typeof sessionStorage !== 'undefined',
    env: {
      NODE_ENV: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto text-xs z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={() => {
          navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
          alert('Debug info copiado para clipboard');
        }}
        className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs"
      >
        Copiar
      </button>
    </div>
  );
};

export default DebugInfo;