import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw, Video, Volume2 } from 'lucide-react';
import { MiembroEquipo, TurnoReunion } from '../types/rolelab';
import { TextoConTerminos } from './TerminoTecnico';

interface VideoReunionPlayerProps {
  videoUrl: string;
  turnos: TurnoReunion[];
  equipo: MiembroEquipo[];
}

function convertirYouTubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1]?.split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
      }
      const v = parsed.searchParams.get('v');
      if (v) {
        return `https://www.youtube.com/embed/${v}?rel=0`;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export const VideoReunionPlayer: React.FC<VideoReunionPlayerProps> = ({
  videoUrl,
  turnos,
  equipo,
}) => {
  const embedUrl = convertirYouTubeEmbedUrl(videoUrl);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [turnoIndex, setTurnoIndex] = useState(0);
  const [progresoEnTurno, setProgresoEnTurno] = useState(0);
  const [transcripcionAbierta, setTranscripcionAbierta] = useState(true);

  const turnoActual = turnos[turnoIndex] || turnos[0];
  const miembroActual = equipo.find((m) => m.id === turnoActual?.hablanteId) || equipo[0];

  useEffect(() => {
    if (embedUrl || !reproduciendo) return;

    const tickMs = 150;
    const duracionMs = (turnoActual?.duracionSegundos || 6) * 1000;

    const timer = window.setInterval(() => {
      setProgresoEnTurno((prev) => {
        const next = prev + (tickMs / duracionMs) * 100;
        if (next >= 100) {
          if (turnoIndex < turnos.length - 1) {
            setTurnoIndex((idx) => idx + 1);
            return 0;
          } else {
            setReproduciendo(false);
            return 100;
          }
        }
        return next;
      });
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [embedUrl, reproduciendo, turnoIndex, turnoActual?.duracionSegundos, turnos.length]);

  const progresoTotalPct =
    turnos.length > 0 ? ((turnoIndex + progresoEnTurno / 100) / turnos.length) * 100 : 0;

  const seleccionarTurno = (idx: number) => {
    setTurnoIndex(idx);
    setProgresoEnTurno(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
      {embedUrl ? (
        <div className="aspect-video w-full bg-[#0F172A]">
          <iframe
            src={embedUrl}
            title="Reunión inicial del equipo EduCloud Live"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="bg-[#0F172A] text-white p-5 sm:p-6">
          {/* Header barra videollamada */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-sky-300" />
              <span className="text-sm font-semibold text-white">
                Llamada urgente del equipo · 08:05 a.m.
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300 tabular-nums">
              {turnoActual?.minuto} · Escenario simulado
            </span>
          </div>

          {/* Grilla de participantes + hablante destacado */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 items-stretch">
            {/* Escenario principal hablante activo */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={miembroActual?.avatarUrl}
                  alt={miembroActual?.nombre}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-600 shrink-0"
                />
                <div>
                  <p className="text-xs font-medium text-sky-300 mb-0.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    Hablando ahora ({turnoActual?.minuto})
                  </p>
                  <h3 className="text-lg font-semibold text-white">{turnoActual?.hablanteNombre}</h3>
                  <p className="text-xs text-slate-400">{turnoActual?.hablanteCargo}</p>
                </div>
              </div>

              <blockquote className="mt-5 text-base sm:text-lg leading-relaxed text-slate-100 font-normal">
                “<TextoConTerminos texto={turnoActual?.mensaje || ''} variant="dark" />”
              </blockquote>

              <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span>
                  Pista clave: <TextoConTerminos texto={turnoActual?.datoClave || ''} variant="dark" />
                </span>
              </div>
            </div>

            {/* Mosaico lateral de participantes */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {turnos.map((turno, idx) => {
                const persona = equipo.find((m) => m.id === turno.hablanteId);
                const activo = idx === turnoIndex;
                return (
                  <button
                    key={turno.id}
                    type="button"
                    onClick={() => seleccionarTurno(idx)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      activo
                        ? 'bg-[#2D6CDF]/25 border-sky-400/70 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <img
                      src={persona?.avatarUrl}
                      alt={turno.hablanteNombre}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{turno.hablanteNombre}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {turno.minuto} · {turno.hablanteCargo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controles de reproducción */}
          <div className="pt-2 space-y-2.5">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-150"
                style={{ width: `${Math.min(100, progresoTotalPct)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (turnoIndex === turnos.length - 1 && progresoEnTurno >= 99) {
                      setTurnoIndex(0);
                      setProgresoEnTurno(0);
                    }
                    setReproduciendo((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#0F172A] hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  {reproduciendo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {reproduciendo ? 'Pausar llamada' : 'Reproducir llamada'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReproduciendo(false);
                    setTurnoIndex(0);
                    setProgresoEnTurno(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar
                </button>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                Turno {turnoIndex + 1} de {turnos.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Transcripción interactiva desplegable */}
      <div className="bg-white border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => setTranscripcionAbierta((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#F8FAFC] transition-colors"
        >
          <span className="text-sm font-semibold text-[#0F172A]">
            Lo que dijo cada compañero ({turnos.length} turnos)
          </span>
          {transcripcionAbierta ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {transcripcionAbierta && (
          <div className="px-5 pb-5 pt-1 space-y-2.5 border-t border-[#E2E8F0]">
            {turnos.map((turno, idx) => {
              const esActivo = !embedUrl && idx === turnoIndex;
              return (
                <button
                  key={turno.id}
                  type="button"
                  onClick={() => seleccionarTurno(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
                    esActivo
                      ? 'bg-[#EFF6FF] border-[#2D6CDF]/40'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#EFF6FF]/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#2D6CDF]">
                      {turno.hablanteNombre} · {turno.hablanteCargo}
                    </span>
                    <span className="text-xs font-mono text-[#64748B] tabular-nums">{turno.minuto}</span>
                  </div>
                  <p className="text-sm text-[#1E293B] leading-relaxed">
                    <TextoConTerminos texto={turno.mensaje} />
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
