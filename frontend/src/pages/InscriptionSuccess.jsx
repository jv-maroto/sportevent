import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Ticket } from 'lucide-react';

export default function InscriptionSuccess() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 pt-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-mesh" />

      <div className="relative max-w-md w-full opacity-0 animate-fade-up">
        <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          {/* Success icon */}
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="font-display font-extrabold text-2xl text-smoke-100 mb-3">
            Inscripcion confirmada
          </h1>
          <p className="text-smoke-500 font-body mb-10 leading-relaxed">
            Tu pago se ha procesado correctamente. Ya estas inscrito en el evento.
          </p>

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
        </div>
      </div>
    </div>
  );
}
