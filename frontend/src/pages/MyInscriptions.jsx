import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyInscriptions, cancelInscription } from '../services/inscriptions';
import { formatDateShort } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { Ticket, CheckCircle, Clock, XCircle, ArrowRight, X } from 'lucide-react';

export default function MyInscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const loadInscriptions = () => {
    getMyInscriptions()
      .then(setInscriptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInscriptions();
  }, []);

  const handleCancel = async (inscriptionId) => {
    if (!confirm('Estas seguro de que quieres cancelar esta inscripcion?')) return;
    setCancelling(inscriptionId);
    try {
      await cancelInscription(inscriptionId);
      toast.success('Inscripcion cancelada');
      loadInscriptions();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al cancelar');
    } finally {
      setCancelling(null);
    }
  };

  const statusConfig = {
    confirmed: { label: 'Confirmada', icon: <CheckCircle className="w-3.5 h-3.5" />, className: 'badge-confirmed' },
    pending: { label: 'Pendiente', icon: <Clock className="w-3.5 h-3.5" />, className: 'badge-pending' },
    cancelled: { label: 'Cancelada', icon: <XCircle className="w-3.5 h-3.5" />, className: 'badge-cancelled' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-dark-500 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-20" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 opacity-0 animate-fade-up">
          <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
            Mis entradas
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-smoke-100 flex items-center gap-3">
            Inscripciones
          </h1>
        </div>

        {inscriptions.length === 0 ? (
          <div className="text-center py-24 bg-dark-800 border border-dark-500/50 rounded-2xl opacity-0 animate-fade-up stagger-1">
            <Ticket className="w-10 h-10 text-dark-400 mx-auto mb-4" />
            <p className="text-smoke-400 font-display font-bold">No tienes inscripciones aun</p>
            <Link to="/events" className="inline-flex items-center gap-2 text-lime-400 hover:underline text-sm mt-3 font-body">
              Explorar eventos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {inscriptions.map((insc, i) => {
              const status = statusConfig[insc.status] || statusConfig.pending;
              const canCancel = insc.status !== 'cancelled';
              return (
                <div
                  key={insc.id}
                  className="bg-dark-800 border border-dark-500/50 rounded-xl p-5 hover:border-lime-400/20 transition-all duration-500 group opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="flex justify-between items-center">
                    <Link to={`/events/${insc.event_id}`} className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-lime-400/10 transition-colors duration-300">
                        <Ticket className="w-4 h-4 text-smoke-500 group-hover:text-lime-400 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-smoke-100 text-sm group-hover:text-lime-400 transition-colors duration-300">
                          {insc.event_title}
                        </h3>
                        <p className="text-[11px] text-smoke-500 font-body mt-0.5">
                          Inscrito el {formatDateShort(insc.created_at)}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-display font-bold text-smoke-200">
                        {insc.amount_paid === 0 ? 'Gratis' : `${insc.amount_paid.toFixed(2)} EUR`}
                      </span>
                      <span className={`flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleCancel(insc.id)}
                          disabled={cancelling === insc.id}
                          className="p-1.5 rounded-lg text-smoke-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                          title="Cancelar inscripcion"
                          aria-label="Cancelar inscripcion"
                        >
                          {cancelling === insc.id ? (
                            <div className="w-4 h-4 border-2 border-smoke-500/30 border-t-smoke-500 rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
