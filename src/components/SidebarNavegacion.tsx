import React, { useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, Lock, X } from 'lucide-react';

export interface SidebarNavegacionItem {
  id: string | number;
  titulo: string;
  tituloCorto?: string;
  activa: boolean;
  deshabilitada?: boolean;
  completada?: boolean;
  onClick: () => void;
}

interface SidebarNavegacionProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  subtitulo: string;
  ariaLabel: string;
  items: SidebarNavegacionItem[];
  onVolver: () => void;
  volverLabel?: string;
  footer?: React.ReactNode;
}

export const SidebarNavegacion: React.FC<SidebarNavegacionProps> = ({
  abierto,
  onCerrar,
  titulo,
  subtitulo,
  ariaLabel,
  items,
  onVolver,
  volverLabel = 'Volver a carreras',
  footer,
}) => {
  const botonCerrarRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!abierto) return;

    const focusTimer = window.setTimeout(() => {
      botonCerrarRef.current?.focus({ preventScroll: true });
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCerrar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  const handleSeleccionarItem = (item: SidebarNavegacionItem) => {
    if (item.deshabilitada) return;
    onCerrar();
    item.onClick();
  };

  return (
    <div
      id="navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex"
    >
      {/* Fondo oscuro semitranslúcido */}
      <div
        className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-[2px] animate-backdrop-in"
        onClick={onCerrar}
        aria-hidden="true"
      />

      {/* Panel lateral deslizante (PC y móvil) */}
      <aside
        className="relative z-10 w-[min(86vw,340px)] max-w-full h-full bg-white border-r border-[#E2E8F0] shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain animate-drawer-in"
        style={{
          paddingTop: 'max(1.25rem, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 0px))',
          paddingRight: '1.25rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
            <div className="space-y-1.5 min-w-0">
              <button
                type="button"
                onClick={() => {
                  onCerrar();
                  onVolver();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#2D6CDF] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {volverLabel}
              </button>
              <h2 className="font-sans text-xl font-bold text-[#0F172A] leading-snug">
                {titulo}
              </h2>
              <p className="text-xs text-[#64748B]">{subtitulo}</p>
            </div>

            <button
              ref={botonCerrarRef}
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar menú lateral"
              className="p-2 -mr-1 -mt-1 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label={ariaLabel} className="space-y-1.5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.deshabilitada}
                aria-current={item.activa ? 'step' : undefined}
                onClick={() => handleSeleccionarItem(item)}
                className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                  item.activa
                    ? 'bg-[#2D6CDF] text-white shadow-xs'
                    : !item.deshabilitada
                    ? 'bg-[#F8FAFC] text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2D6CDF] cursor-pointer'
                    : 'bg-transparent text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {item.activa && (
                    <span
                      className="w-2 h-2 rounded-full bg-white shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{item.titulo}</span>
                </span>
                {item.activa ? (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-100 shrink-0">
                    Actual
                  </span>
                ) : item.completada ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />
                ) : item.deshabilitada ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        {footer && (
          <div
            className="pt-4 mt-6 border-t border-[#E2E8F0] space-y-2.5"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button, a')) {
                onCerrar();
              }
            }}
          >
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
};
