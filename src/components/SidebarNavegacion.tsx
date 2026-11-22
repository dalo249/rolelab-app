import React from 'react';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export interface SidebarNavegacionItem {
  id: string | number;
  titulo: string;
  activa: boolean;
  deshabilitada?: boolean;
  completada?: boolean;
  onClick: () => void;
}

interface SidebarNavegacionProps {
  titulo: string;
  subtitulo: string;
  ariaLabel: string;
  items: SidebarNavegacionItem[];
  onVolver: () => void;
  volverLabel?: string;
  footer?: React.ReactNode;
}

export const SidebarNavegacion: React.FC<SidebarNavegacionProps> = ({
  titulo,
  subtitulo,
  ariaLabel,
  items,
  onVolver,
  volverLabel = 'Volver a carreras',
  footer,
}) => {
  return (
    <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-5 lg:sticky lg:top-6">
      <div className="space-y-2 pb-4 border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={onVolver}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {volverLabel}
        </button>
        <h2 className="font-serif text-xl font-semibold text-[#0F172A] leading-snug">
          {titulo}
        </h2>
        <p className="text-xs text-slate-500">{subtitulo}</p>
      </div>

      <nav aria-label={ariaLabel} className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.deshabilitada}
            aria-current={item.activa ? 'step' : undefined}
            onClick={() => {
              if (!item.deshabilitada) {
                item.onClick();
              }
            }}
            className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
              item.activa
                ? 'bg-[#16263B] text-white shadow-xs'
                : !item.deshabilitada
                ? 'bg-[#F9F8F6] text-[#0F172A] hover:bg-[#EFECE6] cursor-pointer'
                : 'bg-transparent text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="truncate">{item.titulo}</span>
            {item.completada && !item.activa ? (
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            ) : item.deshabilitada ? (
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : null}
          </button>
        ))}
      </nav>

      {footer && <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5">{footer}</div>}
    </aside>
  );
};
