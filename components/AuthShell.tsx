"use client";

import { Package2 } from "lucide-react";
import { useState, useRef } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9F6F0]">
      {/* Left Pane - Visual */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative hidden w-0 flex-1 lg:block bg-zinc-950 overflow-hidden group cursor-default"
      >
        {/* Base dim pattern */}
        <div 
          className="absolute inset-0 h-full w-full opacity-20 transition-opacity duration-700 group-hover:opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
        
        {/* Interactive glowing pattern revealed by mouse mask */}
        <div 
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          }}
        />

        {/* Soft radial glow blob behind the pattern */}
        <div
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 50%)`
          }}
        />

        {/* Bottom gradient fade so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
        
        {/* Text Content */}
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white transition-transform duration-500 ease-out group-hover:-translate-y-2 pointer-events-none">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-colors duration-500 group-hover:bg-white/10 group-hover:border-white/20">
            <Package2 className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h2 className="text-3xl font-medium tracking-tight">Supply chain, simplified.</h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-md leading-relaxed transition-colors duration-500 group-hover:text-zinc-300">
            StockSense brings clarity to your warehouse operations with real-time stock ledgers and modular inventory control.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-[360px] lg:w-[360px]">
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950">
              <Package2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-zinc-950">StockSense</span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-[14px] text-zinc-500">{subtitle}</p>
            )}
          </div>

          <div className="mt-8">
            <div className="mt-6">
              {children}
            </div>
            
            {footer && (
              <div className="mt-8 text-center text-[14px] text-zinc-500">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "block w-full appearance-none rounded-lg border border-zinc-200 bg-white/50 px-3 py-2 text-[14px] text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:bg-white focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 hover:border-zinc-300 hover:bg-white/80 sm:text-[14px]";

export const authButtonClass =
  "flex w-full justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-[14px] font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 hover:-translate-y-[1px] hover:scale-[1.01] hover:shadow-md active:translate-y-0 active:scale-[0.98] active:shadow-sm";

export const authLabelClass = "block text-[13px] font-medium text-zinc-700 mb-1.5";
