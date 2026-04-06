import runningImg from '../assets/running.jfif';
import ciclismoImg from '../assets/ciclismo.jfif';
import natacionImg from '../assets/natacion.jfif';
import padelImg from '../assets/padel.jfif';
import futbolImg from '../assets/futbol.jfif';
import trailImg from '../assets/trail.jfif';

export const SPORT_IMAGES = {
  running: runningImg,
  ciclismo: ciclismoImg,
  natacion: natacionImg,
  padel: padelImg,
  futbol: futbolImg,
  trail: trailImg,
};

export const SPORTS_LIST = [
  { value: '', label: 'Todos' },
  { value: 'running', label: 'Running' },
  { value: 'ciclismo', label: 'Ciclismo' },
  { value: 'natacion', label: 'Natacion' },
  { value: 'padel', label: 'Padel' },
  { value: 'futbol', label: 'Futbol' },
  { value: 'trail', label: 'Trail' },
];

export function getSportImage(sport) {
  const key = sport?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SPORT_IMAGES[key] || null;
}
