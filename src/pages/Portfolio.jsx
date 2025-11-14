import { useEffect, useState } from 'react'
import { BRAND } from '../lib/brand'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full" style={{ backgroundColor: BRAND.primary }} />
          <span className="font-semibold tracking-tight text-gray-900">{BRAND.name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <a href="/" className="hover:text-gray-900">Inicio</a>
          <a href="#" className="inline-flex items-center rounded-full text-white px-4 py-2 transition" style={{ backgroundColor: BRAND.primary }}>Contacto</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-black/10">
          <span className="sr-only">Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {open && (
          <div className="absolute top-full inset-x-0 bg-white md:hidden border-b border-black/5">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="/" onClick={() => setOpen(false)}>Inicio</a>
              <a href="#contacto" onClick={() => setOpen(false)} className="inline-flex items-center rounded-full text-white px-4 py-2" style={{ backgroundColor: BRAND.primary }}>Contacto</a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function Filters({ onChange }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [district, setDistrict] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => onChange({ q, type, district }), 300)
    return () => clearTimeout(handler)
  }, [q, type, district])

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por título o ubicación" className="w-full md:w-96 rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
        </div>
        <div className="flex items-center gap-3">
          <select value={type} onChange={e=>setType(e.target.value)} className="rounded-xl border border-black/10 px-3 py-2">
            <option value="">Tipo</option>
            <option>Departamento</option>
            <option>Casa</option>
            <option>Penthouse</option>
            <option>Terreno</option>
          </select>
          <select value={district} onChange={e=>setDistrict(e.target.value)} className="rounded-xl border border-black/10 px-3 py-2">
            <option value="">Distrito</option>
            <option>Miraflores</option>
            <option>San Isidro</option>
            <option>Barranco</option>
            <option>La Molina</option>
            <option>Santiago de Surco</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ p }) {
  return (
    <a href="#" className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-lg transition block">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505692794403-34d4982dc1f3?q=80&w=1600&auto=format&fit=crop'} alt={p.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition"/>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{p.title}</h3>
          <span className="rounded-full text-xs px-2 py-1" style={{ backgroundColor: '#E6F4F7', color: BRAND.primary }}>{p.type || 'Propiedad'}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{p.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-gray-900 font-semibold">${new Intl.NumberFormat('en-US').format(p.price_usd)}</div>
          <div className="text-sm text-gray-600">{p.beds || 0} hab • {p.baths || 0} baños • {p.area_m2 || 0} m²</div>
        </div>
      </div>
    </a>
  )
}

export default function Portfolio() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', type: '', district: '' })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/properties`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = items.filter(p => {
    const matchQ = filters.q ? (p.title?.toLowerCase().includes(filters.q.toLowerCase()) || p.location?.toLowerCase().includes(filters.q.toLowerCase())) : true
    const matchType = filters.type ? (p.type === filters.type) : true
    const matchDistrict = filters.district ? (p.location?.toLowerCase().includes(filters.district.toLowerCase())) : true
    return matchQ && matchType && matchDistrict
  })

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Filters onChange={setFilters} />

      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Portafolio de Propiedades</h1>
              <p className="text-gray-600 mt-2">Explora todas las propiedades disponibles</p>
            </div>
            <a href="/" className="text-sm" style={{ color: BRAND.primary }}>Volver al inicio</a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"/>
              ))
            ) : filtered.length ? (
              filtered.map(p => <PropertyCard key={p.id} p={p} />)
            ) : (
              <div className="col-span-full rounded-xl border border-black/5 bg-white p-8 text-center text-gray-600">No se encontraron propiedades con los filtros seleccionados.</div>
            )}
          </div>
        </div>
      </section>

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
