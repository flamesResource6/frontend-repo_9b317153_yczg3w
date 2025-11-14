import { useEffect, useState, useCallback } from 'react'
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

function Gallery({ images = [] }) {
  const list = images.length ? images : [
    'https://images.unsplash.com/photo-1505692794403-34d4982dc1f3?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
  ]

  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)

  const prev = useCallback(() => setCurrent(c => (c - 1 + list.length) % list.length), [list.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % list.length), [list.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  return (
    <div className="w-full">
      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-[16/10] bg-gray-100 relative group">
          <img
            src={list[current]}
            alt={`Imagen ${current + 1}`}
            className="h-full w-full object-cover"
            onClick={() => setOpen(true)}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 pointer-events-none">
            <button aria-label="Anterior" onClick={(e)=>{e.stopPropagation(); prev()}} className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center">‹</button>
            <button aria-label="Siguiente" onClick={(e)=>{e.stopPropagation(); next()}} className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center">›</button>
          </div>
          <div className="absolute bottom-3 right-3">
            <button onClick={() => setOpen(true)} className="rounded-full bg-white/90 hover:bg-white px-3 py-1 text-sm shadow">Ver a pantalla completa</button>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {list.slice(0, 3).map((src, i) => {
            const idx = i < current ? i : (i === 0 && current > 2 ? current - 1 : i)
            // Para simplificar, mostramos las 3 primeras o menos si hay pocas
            return (
              <button
                key={`${src}-${i}`}
                className={`rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border ${current===i? 'border-black/30' : 'border-transparent'} focus:outline-none`}
                onClick={() => setCurrent(i)}
                aria-label={`Miniatura ${i+1}`}
              >
                <img src={list[i+1] || list[i]} alt={`thumb-${i}`} className="h-full w-full object-cover" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Tiras de miniaturas adicionales */}
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={`thumb-${i}`}
              className={`relative h-16 w-24 rounded-lg overflow-hidden border ${current===i ? 'border-[3px]' : 'border-black/10'}`}
              style={current===i ? { borderColor: BRAND.primary } : {}}
              onClick={() => setCurrent(i)}
              aria-label={`Seleccionar imagen ${i+1}`}
            >
              <img src={src} alt={`mini-${i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Modal fullscreen */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button onClick={(e)=>{e.stopPropagation(); setOpen(false)}} className="rounded-full bg-white/90 hover:bg-white h-10 w-10 flex items-center justify-center shadow" aria-label="Cerrar">✕</button>
          </div>
          <button aria-label="Anterior" onClick={(e)=>{e.stopPropagation(); prev()}} className="absolute left-4 md:left-8 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center">‹</button>
          <img src={list[current]} alt={`Fullscreen ${current+1}`} className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" onClick={(e)=>e.stopPropagation()} />
          <button aria-label="Siguiente" onClick={(e)=>{e.stopPropagation(); next()}} className="absolute right-4 md:right-8 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center">›</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {list.map((_, i) => (
              <button
                key={`dot-${i}`}
                className={`h-2.5 w-2.5 rounded-full ${i===current ? '' : 'opacity-50'}`}
                style={{ backgroundColor: BRAND.primary }}
                onClick={(e)=>{e.stopPropagation(); setCurrent(i)}}
                aria-label={`Ir a imagen ${i+1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
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

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/portafolio" className="text-sm hover:underline" style={{ color: BRAND.primary }}>← Volver al portafolio</Link>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 h-80 bg-gray-100 rounded-2xl animate-pulse" />
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
                <Gallery images={p.images} />
                <div className="mt-8">
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
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sticky top-24">
                  <h3 className="font-semibold text-gray-900">Solicitar información</h3>
                  <p className="text-sm text-gray-600 mt-1">Déjame tus datos y me pondré en contacto sobre esta propiedad.</p>
                  <form onSubmit={submit} className="mt-4 space-y-4" id="contacto">
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
