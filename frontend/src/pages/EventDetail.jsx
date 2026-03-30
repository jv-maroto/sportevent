import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../services/events';
import { getEventRanking } from '../services/results';
import { createCheckout } from '../services/inscriptions';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Tag, Trophy, ArrowLeft, Zap, Clock, Target } from 'lucide-react';

const SPORT_IMAGES = {
  running: '/events/running.svg',
  ciclismo: '/events/ciclismo.svg',
  natacion: '/events/natacion.svg',
  padel: '/events/padel.svg',
  futbol: '/events/futbol.svg',
  trail: '/events/trail.svg',
};

function getSportImage(sport) {
  const key = sport?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SPORT_IMAGES[key] || null;
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [eventData, rankingData] = await Promise.all([
        getEvent(id),
        getEventRanking(id).catch(() => []),
      ]);
      setEvent(eventData);
      setRanking(rankingData);
    } catch {
      toast.error('Error cargando el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = async () => {
    if (!user) {
      toast.error('Debes iniciar sesion para inscribirte');
      return;
    }
    setEnrolling(true);
    try {
      const data = await createCheckout(event.id);
      if (data.checkout_url === 'free') {
        toast.success('Inscripcion confirmada');
        loadData();
      } else {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al inscribirse');
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-dark-900 flex justify-center items-center">
        <p className="text-smoke-400">Evento no encontrado</p>
      </div>
    );
  }

  const capacityPercent = ((event.max_capacity - event.available_spots) / event.max_capacity) * 100;

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-16">
      <div className="grain-overlay" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-smoke-500 hover:text-lime-400 transition-colors duration-300 mb-8 text-sm font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a eventos
        </Link>

        {/* Hero image */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10 opacity-0 animate-fade-up">
          {event.image_url ? (
            <img src={`${API_URL}${event.image_url}`} alt={event.title} className="w-full h-full object-cover" />
          ) : getSportImage(event.sport) ? (
            <img src={getSportImage(event.sport)} alt={event.sport} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 flex items-center justify-center">
              <Zap className="w-20 h-20 text-dark-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />

          {/* Sport badge on image */}
          <div className="absolute top-4 left-4">
            <span className="bg-dark-900/80 backdrop-blur-sm text-lime-400 text-[10px] font-display font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full border border-lime-400/20">
              {event.sport}
            </span>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <span className={`text-[10px] font-display font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full backdrop-blur-sm ${
              event.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
              event.status === 'finished' ? 'bg-dark-700/80 text-smoke-400 border border-dark-500' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/20'
            }`}>
              {event.status === 'published' ? 'Abierto' : event.status === 'finished' ? 'Finalizado' : event.status}
            </span>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 opacity-0 animate-fade-up stagger-1">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-smoke-100 mb-4 leading-tight">
              {event.title}
            </h1>

            <p className="text-smoke-400 leading-relaxed font-body mb-8">
              {event.description || 'Sin descripcion disponible.'}
            </p>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: <Calendar className="w-5 h-5" />, label: 'Fecha', value: formatDate(event.date) },
                { icon: <MapPin className="w-5 h-5" />, label: 'Ubicacion', value: event.location },
                { icon: <Users className="w-5 h-5" />, label: 'Plazas', value: `${event.available_spots} de ${event.max_capacity} disponibles` },
                { icon: <Tag className="w-5 h-5" />, label: 'Precio', value: event.price === 0 ? 'Gratuito' : `${event.price.toFixed(2)} EUR` },
              ].map((item, i) => (
                <div key={i} className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-lime-400/10 rounded-lg flex items-center justify-center text-lime-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm text-smoke-200 mt-0.5 font-body">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Capacity bar */}
            <div className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-display font-bold text-smoke-400 uppercase tracking-wider">Ocupacion</span>
                <span className="text-sm font-display font-bold text-lime-400">{Math.round(capacityPercent)}%</span>
              </div>
              <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-1000"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>

            {event.organizer_name && (
              <p className="text-xs text-smoke-500 font-body">
                Organizado por <span className="text-smoke-300">{event.organizer_name}</span>
              </p>
            )}
          </div>

          {/* Sidebar - Inscription */}
          <div className="opacity-0 animate-fade-up stagger-2">
            <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6 sticky top-24">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />

              <h3 className="font-display font-bold text-smoke-300 text-xs uppercase tracking-wider mb-4">
                Inscripcion
              </h3>

              <div className="text-4xl font-display font-extrabold text-smoke-100 mb-1">
                {event.price === 0 ? 'Gratis' : `${event.price.toFixed(2)}`}
              </div>
              {event.price > 0 && <span className="text-smoke-500 text-sm font-body">EUR</span>}

              <div className="w-full h-px bg-dark-500/50 my-5" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-smoke-500">Plazas restantes</span>
                  <span className="text-smoke-200 font-semibold">{event.available_spots}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-smoke-500">Criterio ranking</span>
                  <span className="text-smoke-200 font-semibold capitalize">{event.ranking_criteria === 'time' ? 'Tiempo' : event.ranking_criteria === 'score' ? 'Puntuacion' : 'Posicion'}</span>
                </div>
              </div>

              {event.status === 'published' && event.available_spots > 0 ? (
                <button
                  onClick={handleInscription}
                  disabled={enrolling}
                  className="btn-primary w-full py-4 text-base disabled:opacity-50"
                >
                  {enrolling ? (
                    <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin mx-auto" />
                  ) : (
                    'Inscribirme ahora'
                  )}
                </button>
              ) : (
                <div className="text-center py-3 px-4 bg-dark-700 rounded-lg text-smoke-500 text-sm font-body">
                  {event.available_spots <= 0 ? 'Evento completo' : 'Inscripciones cerradas'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ranking */}
        {ranking.length > 0 && (
          <div className="mt-16 opacity-0 animate-fade-up stagger-3">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-smoke-100">
                Clasificacion
              </h2>
            </div>

            <div className="bg-dark-800 border border-dark-500/50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-500/50">
                    <th className="px-6 py-4 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Pos</th>
                    <th className="px-6 py-4 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Participante</th>
                    <th className="px-6 py-4 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">
                      {event.ranking_criteria === 'time' ? 'Tiempo' : event.ranking_criteria === 'score' ? 'Puntuacion' : 'Posicion'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((result, i) => (
                    <tr
                      key={result.id}
                      className={`border-b border-dark-500/30 transition-colors ${
                        i < 3 ? 'bg-amber-500/[0.03]' : 'hover:bg-dark-700/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-display font-bold ${
                          i === 0 ? 'bg-amber-500/20 text-amber-400' :
                          i === 1 ? 'bg-slate-400/20 text-slate-300' :
                          i === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'text-smoke-500'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-smoke-200 font-body font-medium">{result.user_name}</td>
                      <td className="px-6 py-4 text-sm font-body">
                        <span className="text-lime-400 font-semibold">
                          {event.ranking_criteria === 'time' ? formatTime(result.time_seconds) :
                           event.ranking_criteria === 'score' ? (result.score ?? '-') :
                           (result.position ?? '-')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
