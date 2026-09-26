"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, X } from "lucide-react";

export function QRPassModal({ qrSeed, role }: { qrSeed: string; role: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const downloadQR = () => {
    const svg = document.getElementById("qr-pass");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "My-StockSense-Pass.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
      >
        <QrCode className="h-4 w-4" />
        My QR Pass
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-1 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Your Access Pass</h3>
              <p className="text-sm text-zinc-500 mb-6">Role: {role}</p>
              
              <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm inline-block mb-6">
                <QRCodeSVG
                  id="qr-pass"
                  value={qrSeed}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition"
              >
                <Download className="w-4 h-4" />
                Download Pass
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
