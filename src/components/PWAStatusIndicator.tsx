import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PWAStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      // Tipagem segura para standalone em iOS
      const nav = window.navigator as Navigator & { standalone?: boolean };
      const isInWebAppiOS = nav.standalone;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkInstalled();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Only show if installed or offline
  if (!isInstalled && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-40">
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className={`
          flex items-center gap-1 px-2 py-1 text-xs font-medium
          ${
            isOnline
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
          transition-all duration-300 shadow-sm
        `}
      >
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};

export default PWAStatusIndicator;
