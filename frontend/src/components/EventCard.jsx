import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';
import runningImg from '../assets/running.jfif';
import ciclismoImg from '../assets/ciclismo.jfif';
import natacionImg from '../assets/natacion.jfif';
import padelImg from '../assets/padel.jfif';
import futbolImg from '../assets/futbol.jfif';
import trailImg from '../assets/trail.jfif';

const SPORT_IMAGES = {
  running: runningImg,
  ciclismo: ciclismoImg,
  natacion: natacionImg,
  padel: padelImg,
  futbol: futbolImg,
  trail: trailImg,
};

function getSportImage(sport) {
  const key = sport?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SPORT_IMAGES[key] || null;
}

export default function EventCard({ event, index = 0 }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const fallbackImage = getSportImage(event.sport);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="card-dark group block opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image / Gradient header */}
      <div className="h-44 relative overflow-hidden">
        {event.image_url ? (
          <img
            src={`${API_URL}${event.image_url}`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : fallbackImage ? (
          <img
            src={fallbackImage}
            alt={event.sport}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-600 via-dark-700 to-dark-800 flex items-center justify-center">
            <Zap className="w-12 h-12 text-dark-400 group-hover:text-lime-400/30 transition-colors duration-500" />
          </div>
        )}
        {/* Sport tag */}
        <div className="absolute top-3 left-3">
          <span className="bg-dark-900/80 backdrop-blur-sm text-lime-400 text-[10px] font-display font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-lime-400/20">
            {event.sport}
          </span>
        </div>
        {/* Price tag */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs font-display font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
            event.price === 0
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              : 'bg-dark-900/80 text-smoke-100 border border-dark-500/50'
          }`}>
            {event.price === 0 ? 'GRATIS' : `${event.price.toFixed(2)} \u20ac`}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-smoke-100 text-base mb-3 group-hover:text-lime-400 transition-colors duration-300 line-clamp-1">
          {event.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-smoke-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-smoke-500 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-smoke-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-smoke-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-smoke-400 text-xs">
            <Users className="w-3.5 h-3.5 text-smoke-500 flex-shrink-0" />
            <span>{event.available_spots} plazas</span>
            {/* Capacity bar */}
            <div className="flex-1 h-1 bg-dark-500 rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-lime-400/60 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, ((event.max_capacity - event.available_spots) / event.max_capacity) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
