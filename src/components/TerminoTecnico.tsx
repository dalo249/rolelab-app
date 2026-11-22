import React, { useEffect, useRef, useState } from 'react';
import { TERMINOS_GLOSARIO } from '../data/retosData';

interface TerminoTecnicoProps {
  palabra: string;
  definicion?: string;
  etiqueta?: string;
  variant?: 'light' | 'dark';
  align?: 'center' | 'left' | 'right';
}

export const TerminoTecnico: React.FC<TerminoTecnicoProps> = ({
  palabra,
  definicion,
  etiqueta,
  variant = 'light',
  align = 'center',
}) => {
  const [abierto, setAbierto] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const textoFinal = etiqueta || palabra;
  const definicionFinal =
    definicion ||
    TERMINOS_GLOSARIO[palabra]?.definicion ||
    'Concepto clave utilizado en entornos profesionales de ingeniería y confiabilidad.';

  useEffect(() => {
    if (!abierto) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [abierto]);

  const posicionTooltip =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  const posicionFlecha =
    align === 'left'
      ? 'left-5'
      : align === 'right'
      ? 'right-5'
      : 'left-1/2 -translate-x-1/2';

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setAbierto(true)}
      onMouseLeave={() => setAbierto(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAbierto((prev) => !prev);
        }}
        onFocus={() => setAbierto(true)}
        onBlur={() => setAbierto(false)}
        aria-expanded={abierto}
        className={`inline font-sans font-medium underline decoration-dotted decoration-2 underline-offset-4 transition-colors cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] rounded-sm ${
          variant === 'dark'
            ? 'text-purple-200 decoration-[#A78BFA] hover:text-white'
            : 'text-[#0F172A] decoration-[#5B21B6] hover:text-[#5B21B6]'
        }`}
      >
        {textoFinal}
      </button>

      {abierto && (
        <span
          role="tooltip"
          className={`absolute ${posicionTooltip} bottom-full mb-2.5 z-[80] w-64 sm:w-80 bg-[#0F172A] text-white rounded-2xl p-4 shadow-2xl border border-slate-700/70 text-left pointer-events-auto block`}
        >
          <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
            {palabra}
          </span>
          <span className="block text-xs leading-relaxed text-slate-200 font-sans font-normal">
            {definicionFinal}
          </span>
          <span
            aria-hidden="true"
            className={`absolute ${posicionFlecha} top-full w-3 h-3 bg-[#0F172A] border-r border-b border-slate-700/70 rotate-45 -mt-1.5 block`}
          />
        </span>
      )}
    </span>
  );
};

interface TextoConTerminosProps {
  texto: string;
  variant?: 'light' | 'dark';
}

function esCaracterAlfanumerico(ch: string | undefined): boolean {
  if (!ch) return false;
  return /[\p{L}\p{N}_]/u.test(ch);
}

const CLAVES_ORDENADAS = Object.keys(TERMINOS_GLOSARIO).sort((a, b) => b.length - a.length);

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const TextoConTerminos: React.FC<TextoConTerminosProps> = ({
  texto,
  variant = 'light',
}) => {
  if (!texto || CLAVES_ORDENADAS.length === 0) {
    return <>{texto}</>;
  }

  const patron = new RegExp(`(${CLAVES_ORDENADAS.map(escaparRegex).join('|')})`, 'gi');
  const nodos: React.ReactNode[] = [];
  const yaMostrados = new Set<string>();
  let ultimoIndice = 0;
  let match: RegExpExecArray | null;

  while ((match = patron.exec(texto)) !== null) {
    const inicio = match.index;
    const fin = inicio + match[0].length;
    const anterior = inicio > 0 ? texto[inicio - 1] : undefined;
    const siguiente = fin < texto.length ? texto[fin] : undefined;

    if (esCaracterAlfanumerico(anterior) || esCaracterAlfanumerico(siguiente)) {
      continue;
    }

    const claveCanonica = CLAVES_ORDENADAS.find(
      (k) => k.toLowerCase() === match![0].toLowerCase()
    );
    if (!claveCanonica || yaMostrados.has(claveCanonica)) {
      continue;
    }

    if (inicio > ultimoIndice) {
      nodos.push(texto.slice(ultimoIndice, inicio));
    }

    yaMostrados.add(claveCanonica);
    nodos.push(
      <TerminoTecnico
        key={`${claveCanonica}-${inicio}`}
        palabra={claveCanonica}
        etiqueta={match[0]}
        variant={variant}
      />
    );
    ultimoIndice = fin;
  }

  if (ultimoIndice < texto.length) {
    nodos.push(texto.slice(ultimoIndice));
  }

  return <>{nodos.length > 0 ? nodos : texto}</>;
};
