import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventInscriptions } from '../services/inscriptions';
import { createResult } from '../services/results';
import { getMyEvents, updateEvent } from '../services/events';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, CalendarPlus, Users, Euro, Eye, Trophy,
  CheckCircle, Send, ChevronDown, ChevronUp, Zap, TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [inscriptions, setInscriptions] = useState({});
  const [resultForm, setResultForm] = useState({ user_id: '', time_seconds: '', score: '', position: '' });

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      const data = await getMyEvents();
      setEvents(data || []);
    } catch (err) {
      toast.error('Error cargando tus eventos');
    } finally {
      setLoading(false);
    }
  };

  const toggleEventDetails = async (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
      return;
    }
    setExpandedEvent(eventId);
    if (!inscriptions[eventId]) {
      try {
        const data = await getEventInscriptions(eventId);
        setInscriptions((prev) => ({ ...prev, [eventId]: data }));
      } catch {
        toast.error('Error cargando inscritos');
      }
    }
  };

  const handlePublish = async (eventId) => {
    try {
      await updateEvent(eventId, { status: 'published' });
      toast.success('Evento publicado');
      loadMyEvents();
    } catch {
      toast.error('Error al publicar');
    }
  };

  const handleFinish = async (eventId) => {
    try {
      await updateEvent(eventId, { status: 'finished' });
      toast.success('Evento finalizado');
      loadMyEvents();
    } catch {
      toast.error('Error al finalizar');
    }
  };

  const handleAddResult = async (eventId, rankingCriteria) => {
    try {
      const data = {
        user_id: parseInt(resultForm.user_id),
        event_id: eventId,
      };
      if (rankingCriteria === 'time') data.time_seconds = parseFloat(resultForm.time_seconds);
      if (rankingCriteria === 'score') data.score = parseFloat(resultForm.score);
      if (rankingCriteria === 'position') data.position = parseInt(resultForm.position);

      await createResult(data);
      toast.success('Resultado añadido');
      setResultForm({ user_id: '', time_seconds: '', score: '', position: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al añadir resultado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  const totalEvents = events.length;
  const totalInscriptions = events.reduce((sum, e) => sum + (e.max_capacity - e.available_spots), 0);
  const totalRevenue = events.reduce((sum, e) => sum + e.price * (e.max_capacity - e.available_spots), 0);

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 opacity-0 animate-fade-up">
          <div>
            <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
              Panel
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-smoke-100">
              Hola, {user?.full_name?.split(' ')[0]}
            </h1>
          </div>
          <Link to="/events/create" className="btn-primary inline-flex items-center gap-2">
            <CalendarPlus className="w-4 h-4" />
            Nuevo evento
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12 opacity-0 animate-fade-up stagger-1">
          {[
            { icon: <Zap className="w-5 h-5" />, label: 'Eventos', value: totalEvents, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { icon: <Users className="w-5 h-5" />, label: 'Inscritos', value: totalInscriptions, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Ingresos', value: `${totalRevenue.toFixed(2)} €`, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-dark-800 border border-dark-500/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-display font-bold text-smoke-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-3xl font-display font-extrabold text-smoke-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Events list */}
        <div className="mb-6 opacity-0 animate-fade-up stagger-2">
          <h2 className="font-display font-bold text-xl text-smoke-100">Mis eventos</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-dark-800 border border-dark-500/50 rounded-2xl opacity-0 animate-fade-up stagger-2">
            <Zap className="w-10 h-10 text-dark-400 mx-auto mb-4" />
            <p className="text-smoke-400 font-body">No has creado ningun evento aun</p>
            <Link to="/events/create" className="text-lime-400 hover:underline text-sm mt-2 inline-block font-body">
              Crear mi primer evento
            </Link>
          </div>
        ) : (
          <div className="space-y-3 opacity-0 animate-fade-up stagger-2">
            {events.map((event) => (
              <div key={event.id} className="bg-dark-800 border border-dark-500/50 rounded-xl overflow-hidden">
                {/* Event header */}
                <div
                  onClick={() => toggleEventDetails(event.id)}
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-dark-700/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-lime-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-smoke-100 text-sm">{event.title}</h3>
                      <p className="text-xs text-smoke-500 font-body mt-0.5">
                        {event.sport} · {new Date(event.date).toLocaleDateString('es-ES')} · {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      event.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      event.status === 'finished' ? 'bg-dark-600 text-smoke-400 border border-dark-500' :
                      event.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {event.status}
                    </span>
                    {expandedEvent === event.id
                      ? <ChevronUp className="w-4 h-4 text-smoke-500" />
                      : <ChevronDown className="w-4 h-4 text-smoke-500" />}
                  </div>
                </div>

                {/* Expanded panel */}
                {expandedEvent === event.id && (
                  <div className="border-t border-dark-500/50 p-5 space-y-6 animate-fade-in">
                    {/* Actions */}
                    <div className="flex gap-3 flex-wrap">
                      {event.status === 'draft' && (
                        <button onClick={() => handlePublish(event.id)} className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all cursor-pointer">
                          <Send className="w-3.5 h-3.5" /> Publicar
                        </button>
                      )}
                      {event.status === 'published' && (
                        <button onClick={() => handleFinish(event.id)} className="flex items-center gap-1.5 bg-dark-600 text-smoke-300 border border-dark-500 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider hover:bg-dark-500 transition-all cursor-pointer">
                          <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                        </button>
                      )}
                      <Link to={`/events/${event.id}`} className="flex items-center gap-1.5 bg-dark-600 text-smoke-300 border border-dark-500 px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider hover:border-lime-400/30 hover:text-lime-400 transition-all">
                        <Eye className="w-3.5 h-3.5" /> Ver
                      </Link>
                    </div>

                    {/* Inscriptions table */}
                    <div>
                      <h4 className="text-xs font-display font-bold text-smoke-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        Inscritos ({inscriptions[event.id]?.length || 0})
                      </h4>
                      {inscriptions[event.id]?.length > 0 ? (
                        <div className="bg-dark-700 rounded-xl overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-dark-500/50">
                                <th className="px-4 py-3 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-4 py-3 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3 text-left text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Pagado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inscriptions[event.id].map((insc) => (
                                <tr key={insc.id} className="border-b border-dark-500/30">
                                  <td className="px-4 py-3 text-smoke-500 font-body">{insc.user_id}</td>
                                  <td className="px-4 py-3 text-smoke-200 font-body font-medium">{insc.user_name}</td>
                                  <td className="px-4 py-3">
                                    <span className={`text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded-full ${
                                      insc.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'
                                    }`}>
                                      {insc.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-smoke-300 font-body">{insc.amount_paid.toFixed(2)} €</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-smoke-500 font-body">No hay inscritos aun</p>
                      )}
                    </div>

                    {/* Add result */}
                    {(event.status === 'published' || event.status === 'finished') && (
                      <div>
                        <h4 className="text-xs font-display font-bold text-smoke-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5" />
                          Añadir resultado
                        </h4>
                        <div className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="block text-[10px] text-smoke-500 mb-1 font-display uppercase tracking-wider">ID Usuario</label>
                            <input
                              type="number"
                              value={resultForm.user_id}
                              onChange={(e) => setResultForm({ ...resultForm, user_id: e.target.value })}
                              className="input-dark w-24 py-2 text-sm"
                            />
                          </div>
                          {event.ranking_criteria === 'time' && (
                            <div>
                              <label className="block text-[10px] text-smoke-500 mb-1 font-display uppercase tracking-wider">Tiempo (seg)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={resultForm.time_seconds}
                                onChange={(e) => setResultForm({ ...resultForm, time_seconds: e.target.value })}
                                className="input-dark w-32 py-2 text-sm"
                              />
                            </div>
                          )}
                          {event.ranking_criteria === 'score' && (
                            <div>
                              <label className="block text-[10px] text-smoke-500 mb-1 font-display uppercase tracking-wider">Puntuacion</label>
                              <input
                                type="number"
                                step="0.01"
                                value={resultForm.score}
                                onChange={(e) => setResultForm({ ...resultForm, score: e.target.value })}
                                className="input-dark w-32 py-2 text-sm"
                              />
                            </div>
                          )}
                          {event.ranking_criteria === 'position' && (
                            <div>
                              <label className="block text-[10px] text-smoke-500 mb-1 font-display uppercase tracking-wider">Posicion</label>
                              <input
                                type="number"
                                value={resultForm.position}
                                onChange={(e) => setResultForm({ ...resultForm, position: e.target.value })}
                                className="input-dark w-24 py-2 text-sm"
                              />
                            </div>
                          )}
                          <button
                            onClick={() => handleAddResult(event.id, event.ranking_criteria)}
                            className="btn-primary py-2 px-5 text-xs"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
