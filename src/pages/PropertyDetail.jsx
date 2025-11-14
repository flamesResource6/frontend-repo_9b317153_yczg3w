import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BRAND } from '../lib/brand'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full" style={{ backgroundColor: BRAND.primary }} />
          <span className="font-semibold tracking-tight text-gray-900">{BRAND.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <Link to="/" className="hover:text-gray-900">Inicio</Link>
          <Link to="/portafolio" className="hover:text-gray-900">Portafolio</Link>
          <a href="#contacto" className="inline-flex items-center rounded-full text-white px-4 py-2 transition" style={{ backgroundColor: BRAND.primary }}>Contacto</a>
        </nav>
      </div>
    </header>
  )
}

function FullWidthCarousel({ images = [] }) {
  const list = images.length ? images : [
    'https://images.unsplash.com/photo-1505692794403-34d4982dc1f3?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop'
  ]

  const [index, setIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const timerRef = useRef(null)

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length)
  const next = () => setIndex((i) => (i + 1) % list.length)

  useEffect(() => {
    if (isHovering || list.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % list.length)
    }, 4000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isHovering, list.length])

  // full-bleed container
  return (
    <section
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {/* Main image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/6] bg-black">
          <img
            src={list[index]}
            alt={`Imagen ${index + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Controls */}
          <button
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
          >
            ›
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 text-xs md:text-sm px-2.5 py-1.5 rounded-full bg-black/60 text-white">
            {index + 1} / {list.length}
          </div>
        </div>
      </div>

      {/* Thumbnails row */}
      {list.length > 1 && (
        <div className="mx-auto max-w-7xl px-6">
          <div className="-mt-4 md:-mt-6" />
          <div className="relative flex gap-2 overflow-x-auto pb-2">
            {list.map((src, i) => (
              <button
                key={`thumb-${i}`}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-24 md:h-20 md:w-32 rounded-lg overflow-hidden border transition-all ${i===index ? 'border-[3px] scale-[0.98]' : 'border-black/10 hover:opacity-90'}`}
                style={i===index ? { borderColor: BRAND.primary } : {}}
                aria-label={`Ir a imagen ${i+1}`}
              >
                <img src={src} alt={`Miniatura ${i+1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/properties/${id}`)
        if (!res.ok) throw new Error('No encontrado')
        const data = await res.json()
        setP(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const payload = { ...form, property_id: id }
      const res = await fetch(`${BACKEND_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      await res.json()
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">
        {/* Full width carousel on top */}
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
              <div className="aspect-[16/9] bg-gray-100 animate-pulse" />
            </div>
          ) : p ? (
            <FullWidthCarousel images={p.images} />
          ) : null}
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between gap-4 mt-6">
            <Link to="/portafolio" className="text-sm hover:underline" style={{ color: BRAND.primary }}>← Volver al portafolio</Link>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-40 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 bg-gray-100 rounded animate-pulse" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ) : p ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="mt-2">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">{p.title}</h1>
                  <p className="mt-1 text-gray-600">{p.location}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full text-white px-4 py-2 text-sm font-medium" style={{ backgroundColor: BRAND.primary }}>
                      ${new Intl.NumberFormat('en-US').format(p.price_usd)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-black/5">{p.type || 'Propiedad'}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-black/5">{p.beds || 0} hab</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-black/5">{p.baths || 0} baños</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 border border-black/5">{p.area_m2 || 0} m²</span>
                  </div>

                  <div className="mt-6 prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{p.description || 'Descripción no disponible.'}</p>
                  </div>
                </div>
              </div>

              <aside className="md:col-span-1">
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sticky top-24" id="contacto">
                  <h3 className="font-semibold text-gray-900">Solicitar información</h3>
                  <p className="text-sm text-gray-600 mt-1">Déjame tus datos y me pondré en contacto sobre esta propiedad.</p>
                  <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700">Nombre</label>
                      <input required value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Email</label>
                      <input type="email" required value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Teléfono</label>
                      <input value={form.phone} onChange={e=>setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Mensaje</label>
                      <textarea rows="4" required value={form.message} onChange={e=>setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
                    </div>
                    <button disabled={status==='loading'} className="w-full inline-flex items-center justify-center rounded-full text-white px-5 py-3 font-medium disabled:opacity-60 hover:opacity-90" style={{ backgroundColor: BRAND.primary }}>
                      {status==='loading' ? 'Enviando...' : 'Solicitar información'}
                    </button>
                    {status==='success' && <p className="text-sm" style={{ color: BRAND.primary }}>¡Gracias! Me pondré en contacto muy pronto.</p>}
                    {status==='error' && <p className="text-rose-600 text-sm">Hubo un problema. Inténtalo nuevamente.</p>}
                  </form>
                  <div className="mt-6 text-xs text-gray-500">ID de propiedad: {p.id}</div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-10 text-gray-600">No se encontró la propiedad.</div>
          )}
        </div>
      </main>

      <footer className="py-10 border-t border-black/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <a href="#" className="hover:text-gray-900">Instagram</a>
            <a href="#" className="hover:text-gray-900">LinkedIn</a>
            <a href="mailto:contacto@example.com" className="hover:text-gray-900">contacto@example.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
