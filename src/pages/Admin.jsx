import { useEffect, useMemo, useState } from 'react'
import { BRAND } from '../lib/brand'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full" style={{ backgroundColor: BRAND.primary }} />
          <span className="font-semibold tracking-tight text-gray-900">{BRAND.name}</span>
        </a>
        <div className="text-sm text-gray-600">Panel de Administración</div>
      </div>
    </header>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/stats`)
        const data = await res.json()
        setStats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-gray-600">Cargando estadísticas…</div>
  }

  if (!stats) {
    return <div className="text-rose-600">No se pudieron cargar las estadísticas.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Propiedades" value={stats.total_properties} />
        <Stat label="Consultas" value={stats.total_inquiries} />
        <Stat label="Más visitas (top)" value={stats.top_properties?.[0]?.views ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Propiedades más vistas</h3>
          <ul className="mt-4 divide-y divide-black/5">
            {stats.top_properties?.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.location}</div>
                </div>
                <div className="text-sm text-gray-700">{p.views || 0} vistas</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Consultas recientes</h3>
          <ul className="mt-4 divide-y divide-black/5">
            {stats.recent_inquiries?.map((q) => (
              <li key={q.id} className="py-3">
                <div className="font-medium text-gray-900">{q.name} · {q.email}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{q.message}</div>
                {q.property_id && <div className="text-xs text-gray-500 mt-1">Propiedad: {q.property_id}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Inquiries() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/inquiries`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Consultas</h3>
        <button onClick={load} className="text-sm px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>Actualizar</button>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="text-gray-600">Cargando…</div>
        ) : items.length ? (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-black/5">
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Teléfono</th>
                  <th className="py-2 px-4">Mensaje</th>
                  <th className="py-2 px-4">Propiedad</th>
                  <th className="py-2 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="border-b border-black/5">
                    <td className="py-2 px-4 font-medium text-gray-900">{i.name}</td>
                    <td className="py-2 px-4">{i.email}</td>
                    <td className="py-2 px-4">{i.phone || '-'}</td>
                    <td className="py-2 px-4 max-w-[360px] truncate" title={i.message}>{i.message}</td>
                    <td className="py-2 px-4 text-xs">{i.property_id || '-'}</td>
                    <td className="py-2 px-4 text-xs">{i.created_at ? new Date(i.created_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-600">Aún no hay consultas.</div>
        )}
      </div>
    </div>
  )
}

function ImageListEditor({ images, onChange }) {
  const [input, setInput] = useState('')

  const add = () => {
    if (!input.trim()) return
    onChange([...(images || []), input.trim()])
    setInput('')
  }

  const remove = (idx) => {
    const next = [...images]
    next.splice(idx, 1)
    onChange(next)
  }

  return (
    <div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="URL de imagen" className="flex-1 rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
        <button type="button" onClick={add} className="rounded-xl px-3 py-2 text-white" style={{ backgroundColor: BRAND.primary }}>Agregar</button>
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        {(images || []).map((src, idx) => (
          <div key={idx} className="relative group">
            <img src={src} alt="img" className="h-24 w-full object-cover rounded-lg border border-black/5" />
            <button type="button" onClick={() => remove(idx)} className="absolute top-1 right-1 text-xs rounded-full bg-black/70 text-white px-2 py-1 opacity-0 group-hover:opacity-100">Quitar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PropertiesManager() {
  const empty = useMemo(() => ({
    title: '', location: '', price_usd: '', beds: '', baths: '', area_m2: '', type: '', featured: false, description: '', images: []
  }), [])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

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

  useEffect(() => { load() }, [])

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      title: p.title || '',
      location: p.location || '',
      price_usd: p.price_usd || '',
      beds: p.beds ?? '',
      baths: p.baths ?? '',
      area_m2: p.area_m2 ?? '',
      type: p.type || '',
      featured: !!p.featured,
      description: p.description || '',
      images: Array.isArray(p.images) ? p.images : []
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(empty)
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    try {
      const res = await fetch(`${BACKEND_URL}/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await load()
        if (editingId === id) resetForm()
      }
    } catch (e) { console.error(e) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price_usd: form.price_usd ? Number(form.price_usd) : 0,
        beds: form.beds !== '' ? Number(form.beds) : undefined,
        baths: form.baths !== '' ? Number(form.baths) : undefined,
        area_m2: form.area_m2 !== '' ? Number(form.area_m2) : undefined,
      }
      let res
      if (editingId) {
        res = await fetch(`${BACKEND_URL}/properties/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
      } else {
        res = await fetch(`${BACKEND_URL}/properties`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
      }
      if (res.ok) {
        await load()
        resetForm()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">{editingId ? 'Editar Propiedad' : 'Nueva Propiedad'}</h3>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Título</label>
              <input required value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Ubicación</label>
              <input required value={form.location} onChange={e=>setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Precio (USD)</label>
                <input type="number" min="0" value={form.price_usd} onChange={e=>setForm({ ...form, price_usd: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Tipo</label>
                <input value={form.type} onChange={e=>setForm({ ...form, type: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Hab</label>
                <input type="number" min="0" value={form.beds} onChange={e=>setForm({ ...form, beds: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Baños</label>
                <input type="number" min="0" step="0.5" value={form.baths} onChange={e=>setForm({ ...form, baths: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Área (m²)</label>
                <input type="number" min="0" step="0.1" value={form.area_m2} onChange={e=>setForm({ ...form, area_m2: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="featured" type="checkbox" checked={!!form.featured} onChange={e=>setForm({ ...form, featured: e.target.checked })} className="rounded" />
              <label htmlFor="featured" className="text-sm text-gray-700">Destacada</label>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Descripción</label>
              <textarea rows="4" value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Imágenes</label>
              <ImageListEditor images={form.images} onChange={(imgs)=>setForm({ ...form, images: imgs })} />
            </div>
            <div className="flex items-center gap-3">
              <button disabled={saving} className="rounded-full px-5 py-2.5 text-white disabled:opacity-60" style={{ backgroundColor: BRAND.primary }}>{editingId ? 'Guardar cambios' : 'Crear propiedad'}</button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-full px-5 py-2.5 border border-black/10">Cancelar</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Propiedades</h3>
            <button onClick={load} className="text-sm px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: BRAND.primary }}>Actualizar</button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>)
            ) : items.length ? (
              items.map(p => (
                <div key={p.id} className="flex gap-4 rounded-xl border border-black/5 p-3">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505692794403-34d4982dc1f3?q=80&w=800&auto=format&fit=crop'} alt={p.title} className="h-20 w-28 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 truncate">{p.title}</div>
                    <div className="text-sm text-gray-600">{p.location}</div>
                    <div className="text-xs text-gray-500">${new Intl.NumberFormat('en-US').format(p.price_usd)} · {p.type || 'Propiedad'} · {p.views || 0} vistas</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="text-sm px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: BRAND.primary }} onClick={() => startEdit(p)}>Editar</button>
                      <button className="text-sm px-3 py-1.5 rounded-full border" onClick={() => remove(p.id)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No hay propiedades aún.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [auth, setAuth] = useState(false)
  const tabs = [
    { key: 'dashboard', label: 'Resumen' },
    { key: 'properties', label: 'Propiedades' },
    { key: 'inquiries', label: 'Consultas' },
  ]

  if (!auth) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(1200px 600px at 50% -10%, rgba(15,76,92,0.08), transparent 60%)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-black/5 bg-white p-8 shadow-sm text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full text-white mb-3" style={{ backgroundColor: BRAND.primary }}>
              🔒
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Acceso al Panel</h1>
            <p className="text-sm text-gray-600 mt-1">Acceso simulado para administración del sitio.</p>
            <button onClick={() => setAuth(true)} className="mt-6 w-full rounded-full px-5 py-3 text-white font-medium" style={{ backgroundColor: BRAND.primary }}>Entrar</button>
            <a href="/" className="mt-3 inline-block text-sm" style={{ color: BRAND.primary }}>Volver al sitio</a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center gap-2 text-sm">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-full border ${tab===t.key ? 'text-white' : ''}`} style={tab===t.key ? { backgroundColor: BRAND.primary, borderColor: 'transparent' } : {}}>
              {t.label}
            </button>
          ))}
          <div className="ml-auto">
            <button onClick={() => setAuth(false)} className="px-4 py-2 rounded-full border">Salir</button>
          </div>
        </div>

        <div className="mt-6">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'properties' && <PropertiesManager />}
          {tab === 'inquiries' && <Inquiries />}
        </div>
      </main>
    </div>
  )
}
