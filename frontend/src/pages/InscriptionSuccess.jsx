import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMyInscriptions } from '../services/inscriptions';
import { CheckCircle, ArrowRight, Ticket, Loader2, AlertCircle } from 'lucide-react';

export default function InscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [inscription, setInscription] = useState(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [verified, setVerified] = useState(!sessionId);

  useEffect(() => {
    if (!sessionId || sessionId === 'free' || sessionId === 'dev_mode') {
      setVerified(true);
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const checkInscription = async () => {
      try {
        const inscriptions = await getMyInscriptions();
        const match = inscriptions.find(
          (i) => i.stripe_session_id === sessionId
        );
        if (match && match.status === 'confirmed') {
          setInscription(match);
          setVerified(true);
          setLoading(false);
          return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
          setVerified(true);
          setLoading(false);
          return;
        }
        setTimeout(checkInscription, 2000);
      } catch {
        setVerified(true);
        setLoading(false);
      }
    };

    checkInscription();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-mesh" />

      <div className="relative max-w-md w-full opacity-0 animate-fade-up">
        <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          {loading ? (
            <>
              <div className="w-20 h-20 bg-dark-700 border border-dark-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-smoke-100 mb-3">
                Verificando pago
              </h1>
              <p className="text-smoke-500 font-body leading-relaxed">
                Estamos confirmando tu pago con Stripe. Esto puede tardar unos segundos...
              </p>
            </>
          ) : (
            <>
              {/* Success icon */}
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>

              <h1 className="font-display font-extrabold text-2xl text-smoke-100 mb-3">
                Inscripcion confirmada
              </h1>
              <p className="text-smoke-500 font-body mb-6 leading-relaxed">
                Tu pago se ha procesado correctamente. Ya estas inscrito en el evento.
              </p>

              {inscription && (
                <div className="bg-dark-700/50 border border-dark-500/30 rounded-xl p-4 mb-8 text-left">
                  <div className="text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider mb-2">
                    Detalles
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-smoke-500">Evento</span>
                      <span className="text-smoke-200 font-medium">{inscription.event_title}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-smoke-500">Importe</span>
                      <span className="text-lime-400 font-semibold">
                        {inscription.amount_paid === 0 ? 'Gratis' : `${inscription.amount_paid.toFixed(2)} EUR`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-smoke-500">Estado</span>
                      <span className="text-emerald-400 font-medium">Confirmada</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  to="/my-inscriptions"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  <Ticket className="w-4 h-4" />
                  Ver mis inscripciones
                </Link>
                <Link
                  to="/events"
                  className="btn-outline w-full flex items-center justify-center gap-2 py-3.5"
                >
                  Explorar mas eventos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
