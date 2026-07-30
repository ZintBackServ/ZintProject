import { useState, useEffect } from "react";

/**
 * usePWAInstall — captures the browser's beforeinstallprompt event
 * and exposes a `promptInstall` function to trigger the native install dialog.
 *
 * Returns:
 *  - installable: boolean — true when browser has provided an install prompt
 *  - promptInstall: fn — call this to show the native install dialog
 *  - isInstalled: boolean — true when already installed as PWA
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable]       = useState(false);
  const [isInstalled, setIsInstalled]       = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();          // prevent default mini-infobar
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If user installed while app is open
    window.addEventListener("appinstalled", () => {
      setInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return { installable, promptInstall, isInstalled };
}
