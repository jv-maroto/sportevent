import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, uploadEventImage } from '../services/events';
import toast from 'react-hot-toast';
import { CalendarPlus, ArrowRight, ImagePlus } from 'lucide-react';

export default function EventCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    title: '',
    sport: '',
    description: '',
    date: '',
    location: '',
    max_capacity: 50,
    price: 0,
    ranking_criteria: 'time',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = {
        ...form,
        date: new Date(form.date).toISOString(),
        max_capacity: parseInt(form.max_capacity),
        price: parseFloat(form.price),
      };
      const created = await createEvent(eventData);

      if (imageFile) {
        await uploadEventImage(created.id, imageFile);
      }

      toast.success('Evento creado');
      navigate(`/events/${created.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-grid opacity-20" />

      <div className="relative max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 opacity-0 animate-fade-up">
          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center">
            <CalendarPlus className="w-6 h-6 text-lime-400" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-smoke-100">Crear evento</h1>
            <p className="text-smoke-500 text-sm font-body">Completa los datos de tu evento deportivo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="opacity-0 animate-fade-up stagger-1">
          <div className="bg-dark-800 border border-dark-500/50 rounded-2xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />

            {/* Image upload */}
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-3">
                Imagen del evento
              </label>
              <label className="block cursor-pointer">
                <div className={`h-48 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                  imagePreview ? 'border-lime-400/30' : 'border-dark-500 hover:border-dark-400'
                }`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3">
                      <ImagePlus className="w-8 h-8 text-smoke-500" />
                      <span className="text-smoke-500 text-sm font-body">Click para subir imagen</span>
                      <span className="text-smoke-500 text-[10px]">JPEG, PNG o WebP</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Nombre del evento
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-dark"
                placeholder="Ej: Carrera Popular San Silvestre"
              />
            </div>

            {/* Sport + Criteria */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Deporte
                </label>
                <input
                  type="text"
                  required
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                  className="input-dark"
                  placeholder="Ej: Running"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Criterio ranking
                </label>
                <select
                  value={form.ranking_criteria}
                  onChange={(e) => setForm({ ...form, ranking_criteria: e.target.value })}
                  className="input-dark cursor-pointer"
                >
                  <option value="time">Tiempo (menor mejor)</option>
                  <option value="score">Puntuacion (mayor mejor)</option>
                  <option value="position">Posicion manual</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                Descripcion
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-dark resize-none"
                placeholder="Describe tu evento deportivo..."
              />
            </div>

            {/* Date + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Fecha y hora
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Ubicacion
                </label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-dark"
                  placeholder="Ej: Tenerife"
                />
              </div>
            </div>

            {/* Capacity + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Aforo maximo
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.max_capacity}
                  onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold text-smoke-400 uppercase tracking-wider mb-2">
                  Precio (EUR)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-dark"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  Crear evento
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
