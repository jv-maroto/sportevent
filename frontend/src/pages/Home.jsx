import { Link } from 'react-router-dom';
import { Trophy, Zap, CreditCard, Medal, ArrowRight, ChevronRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Crea eventos',
      description: 'Publica carreras, torneos y competiciones de cualquier deporte en minutos.',
      number: '01',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Vende entradas',
      description: 'Gestiona inscripciones y cobra con Stripe de forma segura y automatica.',
      number: '02',
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: 'Clasifica',
      description: 'Introduce resultados y genera clasificaciones publicas al instante.',
      number: '03',
    },
  ];

  return (
    <div className="bg-dark-900 min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-mesh" />

        {/* Decorative diagonal line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-lime-400/20 to-transparent transform translate-x-[-30vw]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />

        {/* Large background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          <span className="font-display font-extrabold text-[20vw] leading-none text-dark-800/50 tracking-tighter">
            SPORT
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-dark-700 border border-dark-500 rounded-full px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
              <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
              <span className="text-xs font-body text-smoke-300 tracking-wide">
                Plataforma de eventos deportivos
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-smoke-100 leading-[0.95] mb-6 opacity-0 animate-fade-up stagger-1">
              Organiza.
              <br />
              <span className="text-lime-400 text-glow">Compite.</span>
              <br />
              Clasifica.
            </h1>

            {/* Subtitle */}
            <p className="text-smoke-400 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-body opacity-0 animate-fade-up stagger-2">
              La plataforma para crear, gestionar y participar en eventos deportivos.
              Inscripciones, pagos y clasificaciones en un solo lugar.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-up stagger-3">
              <Link to="/events" className="btn-primary inline-flex items-center gap-2 group">
                Explorar eventos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn-outline inline-flex items-center gap-2">
                Crear cuenta
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16 opacity-0 animate-fade-up stagger-4">
              {[
                { value: '100%', label: 'Gratuito' },
                { value: 'Stripe', label: 'Pagos seguros' },
                { value: 'Docker', label: 'Desplegable' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-display font-bold text-2xl text-smoke-100">{stat.value}</div>
                  <div className="text-xs text-smoke-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 border-t border-dark-500/30">
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mb-16">
            <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
              Funcionalidades
            </span>
            <h2 className="font-display font-extrabold text-4xl text-smoke-100 leading-tight">
              Todo para tus
              <br />
              eventos deportivos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-dark-800 border border-dark-500/50 rounded-xl p-8 hover:border-lime-400/30 transition-all duration-500 opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.2 + i * 0.15}s` }}
              >
                {/* Number */}
                <span className="absolute top-6 right-6 font-display font-extrabold text-5xl text-dark-600 group-hover:text-lime-400/10 transition-colors duration-500">
                  {feature.number}
                </span>

                <div className="w-12 h-12 bg-lime-400/10 rounded-lg flex items-center justify-center text-lime-400 mb-6 group-hover:bg-lime-400/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-smoke-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-smoke-400 text-sm leading-relaxed font-body">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-block mb-8">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto glow-lime animate-glow-pulse">
              <Trophy className="w-8 h-8 text-dark-900" />
            </div>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-smoke-100 mb-6">
            Empieza a organizar
            <span className="text-lime-400"> hoy</span>
          </h2>
          <p className="text-smoke-400 text-lg mb-10 font-body max-w-md mx-auto">
            Registrate como organizador y crea tu primer evento deportivo en minutos. Sin coste.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 group">
            Crear cuenta gratis
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-500/30 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-lime-400 rounded flex items-center justify-center">
              <Trophy className="w-3 h-3 text-dark-900" />
            </div>
            <span className="font-display font-bold text-sm text-smoke-400">SportEvent</span>
          </div>
          <span className="text-xs text-smoke-500 font-body">
            Javier Jose Maroto Dominguez — CFGS DAW — C.I.F.P. Cesar Manrique
          </span>
        </div>
      </footer>
    </div>
  );
}
