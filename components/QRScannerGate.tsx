"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, Lock, ShieldCheck } from "lucide-react";

export function QRScannerGate({ children, requiredRole = "ADMIN" }: { children: React.ReactNode, requiredRole?: string }) {
  const [authorized, setAuthorized] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Check if they are already authorized in this session state (could use cookies for persistence, but memory is fine for a demo)
  }, []);

  const startScanner = () => {
    setScanning(true);
    setError("");
    
    // Slight delay to allow DOM to render the scanner div
    setTimeout(() => {
      if (!document.getElementById("qr-reader")) return;
      
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          // On success, verify with backend
          scanner.pause();
          try {
            const res = await fetch("/api/auth/verify-qr", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ qrSeed: decodedText }),
            });
            const data = await res.json();
            if (data.ok && data.role === requiredRole) {
              scanner.clear();
              setAuthorized(true);
            } else {
              setError("Unauthorized: Invalid QR or insufficient role.");
              scanner.resume();
            }
          } catch (err) {
            setError("Server error during verification.");
            scanner.resume();
          }
        },
        (err) => {
          // parse errors are normal (no qr in frame)
        }
      );
    }, 100);
  };

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <div className="bg-zinc-100 p-4 rounded-full mb-6">
        <Lock className="w-8 h-8 text-zinc-600" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">Restricted Access</h2>
      <p className="text-zinc-500 mb-8">
        This area requires a valid <b>{requiredRole}</b> QR Pass. Please scan your pass to continue.
      </p>

      {!scanning ? (
        <button
          onClick={startScanner}
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition w-full"
        >
          <QrCode className="w-5 h-5" />
          Scan QR Pass
        </button>
      ) : (
        <div className="w-full bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <div id="qr-reader" className="w-full overflow-hidden rounded-lg"></div>
          {error && (
            <p className="text-red-500 text-sm font-medium mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}
          <button
            onClick={() => {
              if (scannerRef.current) scannerRef.current.clear();
              setScanning(false);
            }}
            className="mt-4 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition"
          >
            Cancel Scanning
          </button>
        </div>
      )}
    </div>
  );
}
