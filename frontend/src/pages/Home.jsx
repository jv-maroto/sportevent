import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, CreditCard, Medal, ArrowRight, ChevronRight, Timer, MapPin, Users } from 'lucide-react';
import heroImg from '../assets/hero.jfif';
import runningImg from '../assets/running.jfif';
import ciclismoImg from '../assets/ciclismo.jfif';
import natacionImg from '../assets/natacion.jfif';
import padelImg from '../assets/padel.jfif';
import trailImg from '../assets/trail.jfif';
import futbolImg from '../assets/futbol.jfif';
import ctaImg from '../assets/cta.jfif';

// Animated counter component
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Floating orb component
function FloatingOrb({ className, delay = 0 }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
    />
  );
}

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  const sports = [
    { name: 'Running', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="17" cy="4" r="2"/><path d="M13 7l-3 5h4l-2 8"/><path d="M7 12l-2 5"/><path d="M16 12l3 5"/>
      </svg>
    )},
    { name: 'Ciclismo', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l4-8h4l2 4h2"/><circle cx="12" cy="5" r="1.5"/>
      </svg>
    )},
    { name: 'Natacion', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M2 18c1.5-1 3-1.5 4.5 0s3 1 4.5 0 3-1.5 4.5 0 3 1 4.5 0"/><path d="M2 22c1.5-1 3-1.5 4.5 0s3 1 4.5 0 3-1.5 4.5 0 3 1 4.5 0"/><path d="M10 14l-2.5-3 3-2.5 4 3"/><circle cx="13" cy="5" r="2"/>
      </svg>
    )},
    { name: 'Padel', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <ellipse cx="12" cy="8" rx="5" ry="7"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="9" y1="5" x2="9" y2="11" opacity="0.4"/><line x1="15" y1="5" x2="15" y2="11" opacity="0.4"/><line x1="8" y1="8" x2="16" y2="8" opacity="0.4"/>
      </svg>
    )},
    { name: 'Trail', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 20l5-12 4 6 3-8 4 14"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
      </svg>
    )},
    { name: 'Futbol', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="9"/><polygon points="12,7 15,10 14,14 10,14 9,10" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
    )},
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Crea en minutos',
      description: 'Publica eventos deportivos de cualquier disciplina con todos los detalles: fecha, ubicacion, aforo, precio.',
      number: '01',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Cobra al instante',
      description: 'Integración con Stripe para pagos seguros. Las inscripciones se confirman automáticamente tras el pago.',
      number: '02',
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: 'Clasifica y comparte',
      description: 'Introduce resultados por tiempo, puntuacion o posicion. Rankings publicos generados automaticamente.',
      number: '03',
    },
  ];

  return (
    <div className="bg-dark-900 min-h-screen overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* === HERO SECTION === */}
      <section
        className="relative min-h-screen flex items-center"
        onMouseMove={handleMouseMove}
      >
        {/* Hero background image with ken-burns */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImg}
            alt=""
            className="absolute w-full h-full object-cover object-right animate-ken-burns opacity-0"
            style={{
              animation: 'ken-burns 20s ease-in-out infinite, fadeIn 1.5s ease-out 0.3s forwards',
              transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px) scale(1.05)`,
              transition: 'transform 0.8s ease-out',
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/85 to-dark-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/60" />
        </div>

        {/* Background layers */}
        <div className="absolute inset-0 bg-grid" />

        {/* Floating orbs - parallax */}
        <FloatingOrb className="w-96 h-96 bg-lime-400 top-20 -left-48" delay={0} />
        <FloatingOrb className="w-40 h-40 bg-emerald-400 top-1/2 left-1/3" delay={3} />

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-lime-400/10 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-dark-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />

        {/* Large background text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(calc(-50% + ${mousePos.x * 0.5}px), calc(-50% + ${mousePos.y * 0.5}px))` }}
        >
          <span className="font-display font-extrabold text-[18vw] leading-none text-dark-800/40 tracking-tighter whitespace-nowrap">
            SPORT
          </span>
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-dark-700/80 backdrop-blur-sm border border-dark-500/50 rounded-full px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
              <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
              <span className="text-xs font-body text-smoke-300 tracking-wide">
                Plataforma de eventos deportivos
              </span>
              <ChevronRight className="w-3 h-3 text-smoke-500" />
            </div>

            {/* Heading with stagger reveal */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl text-smoke-100 leading-[0.9] mb-8">
              <span className="block opacity-0 animate-fade-up stagger-1">Organiza.</span>
              <span className="block opacity-0 animate-fade-up stagger-2">
                <span className="relative inline-block">
                  <span className="text-lime-400 text-glow">Compite.</span>
                  {/* Underline effect */}
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-lime-400/30 rounded-full opacity-0 animate-fade-up stagger-3" />
                </span>
              </span>
              <span className="block opacity-0 animate-fade-up stagger-3">Clasifica.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-smoke-400 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed font-body opacity-0 animate-fade-up stagger-4">
              La plataforma donde organizadores crean eventos deportivos y participantes
              se inscriben, compiten y consultan clasificaciones. Todo en un solo lugar.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-up stagger-5">
              <Link to="/events" className="group relative inline-flex items-center gap-2 bg-lime-400 text-dark-900 font-display font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,255,0,0.3)]">
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Explorar eventos</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn-outline inline-flex items-center gap-2 px-8 py-4 rounded-xl">
                Crear cuenta
              </Link>
            </div>
          </div>

          {/* Right side floating card (desktop) */}
          <div
            className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
            style={{ transform: `translateY(calc(-50% + ${mousePos.y * -0.3}px))` }}
          >
            <div className="bg-dark-800/60 backdrop-blur-xl border border-dark-500/30 rounded-2xl p-6 w-72 glow-lime animate-glow-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lime-400/10 rounded-xl flex items-center justify-center">
                  <Timer className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <div className="text-[10px] font-display font-bold text-smoke-500 uppercase tracking-wider">Proximo evento</div>
                  <div className="text-sm font-display font-bold text-smoke-100">Carrera San Silvestre</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-smoke-400">
                  <MapPin className="w-3 h-3" /> Santa Cruz de Tenerife
                </div>
                <div className="flex items-center gap-2 text-xs text-smoke-400">
                  <Users className="w-3 h-3" /> 198 plazas disponibles
                </div>
              </div>
              <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                <div className="h-full w-[10%] bg-lime-400/60 rounded-full" />
              </div>
              <div className="text-[10px] text-smoke-500 mt-2">1% ocupado</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in stagger-6">
          <div className="w-5 h-8 border border-dark-400 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-lime-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* === SPORTS SHOWCASE === */}
      <section className="relative py-20 border-y border-dark-500/20 bg-dark-800/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
              Disciplinas
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-smoke-100">
              Encuentra tu <span className="text-lime-400 text-glow">deporte</span>
            </h2>
          </div>

          {/* All sports grid 3x2 */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { name: 'Running', img: runningImg, link: '/events?sport=running' },
              { name: 'Ciclismo', img: ciclismoImg, link: '/events?sport=ciclismo' },
              { name: 'Natacion', img: natacionImg, link: '/events?sport=natacion' },
              { name: 'Padel', img: padelImg, link: '/events?sport=padel' },
              { name: 'Trail', img: trailImg, link: '/events?sport=trail' },
              { name: 'Futbol', img: futbolImg, link: '/events?sport=futbol' },
            ].map((sport, i) => (
              <Link
                to={sport.link}
                key={i}
                className="group relative h-52 rounded-2xl overflow-hidden border border-dark-500/30 hover:border-lime-400/30 transition-all duration-500"
              >
                {/* Image with zoom on hover */}
                <img
                  src={sport.img}
                  alt={sport.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent group-hover:via-dark-900/20 transition-all duration-500" />
                {/* Lime glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-lime-400/10 to-transparent" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-smoke-100 group-hover:text-lime-400 transition-colors duration-300">
                      {sport.name}
                    </span>
                    <ArrowRight className="w-5 h-5 text-smoke-400 group-hover:text-lime-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mb-20">
            <span className="text-lime-400 font-display font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
              Como funciona
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-smoke-100 leading-tight">
              Tres pasos.
              <br />
              <span className="text-smoke-400">Sin complicaciones.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-dark-800/50 backdrop-blur-sm border border-dark-500/30 rounded-2xl p-8 hover:border-lime-400/20 transition-all duration-500"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-lime-400/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span className="absolute top-6 right-6 font-display font-extrabold text-6xl text-dark-600/50 group-hover:text-lime-400/10 transition-colors duration-500">
                  {feature.number}
                </span>

                <div className="relative">
                  <div className="w-14 h-14 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 mb-6 group-hover:bg-lime-400/20 group-hover:shadow-[0_0_30px_rgba(200,255,0,0.1)] transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-smoke-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-smoke-400 text-sm leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS SECTION === */}
      <section className="relative py-20 border-y border-dark-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            {[
              { value: 100, suffix: '%', label: 'Open Source' },
              { value: 6, suffix: '+', label: 'Deportes' },
              { value: 0, suffix: ' EUR', label: 'Coste licencias' },
              { value: 4, suffix: '', label: 'Modulos' },
            ].map((stat, i) => (
              <div key={i} className="py-4">
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-smoke-100 mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-display font-bold text-smoke-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="relative py-32 overflow-hidden">
        {/* CTA background image */}
        <div className="absolute inset-0">
          <img
            src={ctaImg}
            alt=""
            className="absolute w-full h-full object-cover opacity-30 animate-scale-subtle"
          />
          <div className="absolute inset-0 bg-dark-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-dark-900" />
        </div>
        <div className="absolute inset-0 bg-mesh" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-block mb-8">
            <img
              src="/logo.svg"
              alt="SportEvent"
              className="w-20 h-20 mx-auto glow-lime animate-glow-pulse"
            />
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-smoke-100 mb-6 leading-tight">
            Empieza a organizar
            <br />
            <span className="text-lime-400 text-glow">hoy mismo</span>
          </h2>
          <p className="text-smoke-400 text-lg mb-12 font-body max-w-md mx-auto">
            Registrate como organizador y crea tu primer evento deportivo en minutos. Totalmente gratuito.
          </p>
          <Link to="/register" className="group relative inline-flex items-center gap-2 bg-lime-400 text-dark-900 font-display font-bold px-10 py-4 rounded-xl text-base uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(200,255,0,0.35)]">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">Crear cuenta gratis</span>
            <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-dark-500/20 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="SportEvent" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-smoke-400">
              Sport<span className="text-lime-400">Event</span>
            </span>
          </div>
          <span className="text-xs text-smoke-500 font-body">
            Javier Jose Maroto Dominguez — CFGS DAW — C.I.F.P. Cesar Manrique
          </span>
        </div>
      </footer>
    </div>
  );
}
