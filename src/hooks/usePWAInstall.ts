import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const iOS = /ipad|iphone|ipod/.test(userAgent);
    const android = /android/.test(userAgent);

    setIsIOS(iOS);
    setIsAndroid(android);

    // Check if already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const isInWebAppiOS = (window.navigator as Navigator & { standalone?: boolean }).standalone;
    const isInWebAppChrome = window.matchMedia(
      "(display-mode: fullscreen)",
    ).matches;

    setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA: beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA: App installed successfully");
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);

      // Show success notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("FluxoAzul instalado!", {
          body: "O app está pronto para uso offline.",
          icon: "/icon-192x192.png",
        });
      }
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check for updates
    checkForUpdates();

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const checkForUpdates = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.addEventListener("updatefound", () => {
          console.log("PWA: Update available");
        });
      }
    }
  };

  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`PWA: User choice: ${outcome}`);

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("PWA: Installation error:", error);
      return false;
    }
  }, [deferredPrompt]);

  const getIOSInstallInstructions = () => {
    return {
      step1: "1. Toque no ícone de compartilhar (📤) na barra inferior",
      step2: "2. Role para baixo e toque em 'Adicionar à Tela de Início'",
      step3: "3. Toque em 'Adicionar' para instalar o FluxoAzul",
    };
  };

  const getAndroidInstallInstructions = () => {
    return {
      step1: "1. Toque no menu (⋮) no canto superior direito",
      step2: "2. Selecione 'Adicionar à tela inicial'",
      step3: "3. Confirme para instalar o FluxoAzul",
    };
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    installPWA,
    getIOSInstallInstructions,
    getAndroidInstallInstructions,
    requestNotificationPermission,
    canShowInstallPrompt: (isInstallable || isIOS) && !isInstalled,
  };
};
