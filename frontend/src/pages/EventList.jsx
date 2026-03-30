import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEvents } from '../services/events';
import EventCard from '../components/EventCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState(searchParams.get('sport') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sincronizar URL con el estado
    if (sport) {
      setSearchParams({ sport });
    } else {
      setSearchParams({});
    }
    loadEvents();
  }, [sport]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (sport) params.sport = sport;
      if (search) params.search = search;
      const data = await getEvents(params);
      setEvents(data);
    } catch (err) {
      console.error('Error cargando eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadEvents();
  };

  const sports = [
    { value: '', label: 'Todos' },
    { value: 'running', label: 'Running' },
    { value: 'ciclismo', label: 'Ciclismo' },
    { value: 'natacion', label: 'Natacion' },
    { value: 'padel', label: 'Padel' },
    { value: 'futbol', label: 'Futbol' },
    { value: 'trail', label: 'Trail' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
            Descubre
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-smoke-100">
            Eventos deportivos
          </h1>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="mb-10 opacity-0 animate-fade-up stagger-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke-500" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark pl-11"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke-500" />
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="input-dark pl-11 pr-10 appearance-none cursor-pointer min-w-[160px]"
              >
                {sports.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Buscar
            </button>
          </div>
        </form>

        {/* Sport pills */}
        <div className="flex flex-wrap gap-2 mb-10 opacity-0 animate-fade-up stagger-2">
          {sports.map((s) => (
            <button
              key={s.value}
              onClick={() => setSport(s.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-300 cursor-pointer ${
                sport === s.value
                  ? 'bg-lime-400 text-dark-900'
                  : 'bg-dark-700 text-smoke-400 border border-dark-500 hover:border-lime-400/30 hover:text-smoke-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 opacity-0 animate-fade-up">
            <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-7 h-7 text-smoke-500" />
            </div>
            <p className="text-smoke-300 font-display font-bold text-lg">No se encontraron eventos</p>
            <p className="text-smoke-500 text-sm mt-2 font-body">Prueba con otros filtros de busqueda</p>
          </div>
        ) : (
          <>
            <p className="text-smoke-500 text-sm font-body mb-6">
              {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
