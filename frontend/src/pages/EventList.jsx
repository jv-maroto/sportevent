import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEvents } from '../services/events';
import EventCard from '../components/EventCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { SPORTS_LIST } from '../utils/sportImages';

function EventCardSkeleton() {
  return (
    <div className="bg-dark-800 border border-dark-500/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-dark-700" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-dark-600 rounded w-1/4" />
        <div className="h-5 bg-dark-600 rounded w-3/4" />
        <div className="h-3 bg-dark-600 rounded w-1/2" />
        <div className="h-2 bg-dark-600 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState(searchParams.get('sport') || '');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const debounceRef = useRef(null);

  useEffect(() => {
    const params = {};
    if (sport) params.sport = sport;
    setSearchParams(params);
    setPage(1);
  }, [sport]);

  useEffect(() => {
    loadEvents();
  }, [sport, page]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = { page, page_size: 12 };
      if (sport) params.sport = sport;
      if (search) params.search = search;
      const data = await getEvents(params);
      setEvents(data.items);
      setPagination({ total: data.total, pages: data.pages });
    } catch (err) {
      console.error('Error cargando eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      loadEvents();
    }, 400);
  }, [sport]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPage(1);
    loadEvents();
  };

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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input-dark pl-11"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke-500" />
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="input-dark pl-11 pr-10 appearance-none cursor-pointer min-w-[160px]"
                aria-label="Filtrar por deporte"
              >
                {SPORTS_LIST.map((s) => (
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
          {SPORTS_LIST.map((s) => (
            <button
              type="button"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-32 opacity-0 animate-fade-up">
            <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-7 h-7 text-smoke-500" />
            </div>
            <p className="text-smoke-300 font-display font-bold text-lg">No se encontraron eventos</p>
            <p className="text-smoke-500 text-sm mt-2 font-body">
              {search || sport
                ? 'Prueba con otros filtros de busqueda'
                : 'Aun no hay eventos publicados. Vuelve pronto.'}
            </p>
            {(search || sport) && (
              <button
                type="button"
                onClick={() => { setSearch(''); setSport(''); }}
                className="mt-4 text-lime-400 text-sm font-body hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-smoke-500 text-sm font-body mb-6">
              {pagination.total} evento{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>

            {/* Paginacion */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg bg-dark-800 border border-dark-500/50 text-smoke-400 hover:text-lime-400 hover:border-lime-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Pagina anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-smoke-500 text-sm">...</span>
                    ) : (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-display font-bold transition-all cursor-pointer ${
                          page === item
                            ? 'bg-lime-400 text-dark-900'
                            : 'bg-dark-800 border border-dark-500/50 text-smoke-400 hover:text-lime-400 hover:border-lime-400/30'
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-2 rounded-lg bg-dark-800 border border-dark-500/50 text-smoke-400 hover:text-lime-400 hover:border-lime-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Pagina siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
