import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 shadow-inner" />
          <span className="font-semibold tracking-tight text-gray-900">Agente Inmobiliario Lima</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          <a href="#propiedades" className="hover:text-gray-900">Propiedades</a>
          <a href="#servicios" className="hover:text-gray-900">Servicios</a>
          <a href="#nosotros" className="hover:text-gray-900">Nosotros</a>
          <a href="#contacto" className="inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2 hover:bg-black transition">Contacto</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-black/10">
          <span className="sr-only">Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {open && (
          <div className="absolute top-full inset-x-0 bg-white md:hidden border-b border-black/5">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#propiedades" onClick={() => setOpen(false)}>Propiedades</a>
              <a href="#servicios" onClick={() => setOpen(false)}>Servicios</a>
              <a href="#nosotros" onClick={() => setOpen(false)}>Nosotros</a>
              <a href="#contacto" onClick={() => setOpen(false)} className="inline-flex items-center rounded-full bg-gray-900 text-white px-4 py-2">Contacto</a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-28 md:pt-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1730063527034-f900a33a409c?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxMaW1hJTIwU2t5bGluZXxlbnwwfDB8fHwxNzYzMTUxMTM0fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Lima Skyline" className="h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-white"/>
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl py-24 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500"/>
            Premium Real Estate en Lima, Perú
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white">
            Propiedades únicas, una experiencia de primer nivel
          </h1>
          <p className="mt-6 text-white/90 md:text-lg max-w-xl">
            Asesoría inmobiliaria personalizada para comprar, vender o alquilar en los distritos más exclusivos de Lima: Miraflores, San Isidro, Barranco y más.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#propiedades" className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-5 py-3 font-medium hover:bg-white/90">Ver propiedades</a>
            <a href="#contacto" className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-5 py-3 font-medium hover:bg-black">Agendar una llamada</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ p }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-black/5 hover:shadow-lg transition">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505692794403-34d4982dc1f3?q=80&w=1600&auto=format&fit=crop'} alt={p.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition"/>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{p.title}</h3>
          <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-2 py-1">{p.type || 'Propiedad'}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{p.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-gray-900 font-semibold">${new Intl.NumberFormat('en-US').format(p.price_usd)}</div>
          <div className="text-sm text-gray-600">{p.beds || 0} hab • {p.baths || 0} baños • {p.area_m2 || 0} m²</div>
        </div>
      </div>
    </div>
  )
}

function Featured() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/properties?featured=true`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id="propiedades" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Propiedades destacadas</h2>
            <p className="text-gray-600 mt-2">Selección curada de inmuebles premium</p>
          </div>
          <a href="#" className="text-sm text-gray-700 hover:text-gray-900">Ver todas</a>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"/>
            ))
          ) : (
            items.map(p => <PropertyCard key={p.id} p={p} />)
          )}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const services = [
    {
      title: 'Representación de Vendedores',
      desc: 'Estrategia integral para maximizar el valor de tu propiedad: staging, marketing, negociación y cierre.',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5 10.343 8 12 8zm0 0v13m8-6a8 8 0 10-16 0 8 8 0 0016 0z"/></svg>
      )
    },
    {
      title: 'Búsqueda para Compradores',
      desc: 'Acceso a oportunidades off-market y negociación experta para conseguir el mejor precio.',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
      )
    },
    {
      title: 'Alquileres Premium',
      desc: 'Selección exclusiva de propiedades para alquiler anual o temporal en zonas prime.',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V9m-6 13V9"/></svg>
      )
    }
  ]

  return (
    <section id="servicios" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Servicios</h2>
          <p className="text-gray-600 mt-2">Acompañamiento 360° con total transparencia y confidencialidad.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img className="rounded-2xl shadow-lg" src="https://images.unsplash.com/photo-1558222217-1024f51956f7?q=80&w=1600&auto=format&fit=crop" alt="Agente" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Tu aliado en el mercado premium de Lima</h2>
          <p className="mt-4 text-gray-600">Más de 8 años asesorando a clientes locales e internacionales en la compra, venta y alquiler de propiedades en los distritos más exclusivos de Lima.</p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Atención personalizada 1 a 1</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Enfoque boutique con red de contactos</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Marketing de alto impacto y home staging</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${BACKEND_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="py-20">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Conversemos</h2>
          <p className="mt-2 text-gray-600">Cuéntame qué estás buscando y te contactaré en menos de 24 horas.</p>
          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Nombre</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Teléfono</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Mensaje</label>
                <textarea required rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"/>
              </div>
              <button disabled={status==='loading'} className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-5 py-3 font-medium hover:bg-black disabled:opacity-60">
                {status==='loading' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
              {status==='success' && <p className="text-emerald-600 text-sm">¡Gracias! Me pondré en contacto muy pronto.</p>}
              {status==='error' && <p className="text-rose-600 text-sm">Hubo un problema. Inténtalo nuevamente.</p>}
            </form>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600&auto=format&fit=crop" alt="Lima"/>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Featured />
      <Services />
      <About />
      <Contact />
      <footer className="py-10 border-t border-black/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Agente Inmobiliario Lima. Todos los derechos reservados.</p>
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
