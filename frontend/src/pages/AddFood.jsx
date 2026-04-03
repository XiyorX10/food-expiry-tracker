import { useState, useEffect } from 'react'

const API = 'http://localhost:3001/api/foods'

const CATEGORIES = [
  { label: 'Dairy',  icon: '🥛' },
  { label: 'Meat',   icon: '🥩' },
  { label: 'Veggie', icon: '🥬' },
  { label: 'Fruit',  icon: '🍎' },
  { label: 'Eggs',   icon: '🥚' },
  { label: 'Bread',  icon: '🍞' },
  { label: 'Drinks', icon: '🧃' },
  { label: 'Other',  icon: '📦' },
]

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function Badge({ days }) {
  if (days <= 0) return <span style={badge('red')}>Expired</span>
  if (days <= 3) return <span style={badge('orange')}>{days} days</span>
  return              <span style={badge('green')}>{days} days</span>
}

function badge(color) {
  const c = {
    red:    { background: '#fcebeb', color: '#a32d2d' },
    orange: { background: '#faeeda', color: '#854f0b' },
    green:  { background: '#eaf3de', color: '#3b6d11' },
  }
  return { ...c[color], fontSize: 14, padding: '4px 12px', borderRadius: 20, fontWeight: 500 }
}

export default function AddFood() {
  const [form, setForm]       = useState({ name: '', quantity: '', expiry: '', category: 'Other' })
  const [foods, setFoods]     = useState([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load existing foods from backend on mount
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(err => console.error('Failed to load foods:', err))
  }, [])

  async function handleAdd() {
    if (!form.name || !form.expiry) {
      alert('Please fill in food name and expiry date!')
      return
    }
    const cat = CATEGORIES.find(c => c.label === form.category)
    setLoading(true)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       form.name,
          quantity:   form.quantity,
          expiryDate: form.expiry,
          category:   form.category,
          icon:       cat?.icon || '📦',
        }),
      })
      const newItem = await res.json()
      setFoods(prev => [...prev, newItem])
      setForm({ name: '', quantity: '', expiry: '', category: 'Other' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      alert('Failed to save food item. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setFoods(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      alert('Failed to delete item.')
    }
  }

  const input = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '0.5px solid #97c459', background: '#f4faf0',
    fontSize: 16, color: '#2c2c2a', outline: 'none',
    height: 48, boxSizing: 'border-box',
  }

  return (
    <div style={{ background: '#f4faf0', minHeight: '100vh', width: '100%' }}>

      {/* Hero */}
      <div style={{ background: '#3b6d11', padding: '32px 40px' }}>
        <h1 style={{ color: '#eaf3de', fontSize: 36, fontWeight: 500, marginBottom: 8 }}>
          Add food
        </h1>
        <p style={{ color: '#97c459', fontSize: 18 }}>Track your food before it expires</p>
      </div>

      <div style={{ padding: '24px 40px', maxWidth: '75%', margin: '0 auto' }}>

        {/* Form card */}
        <div style={{ background: 'white', borderRadius: 12,
          border: '0.5px solid #c0dd97', padding: 20, marginBottom: 20 }}>

          <div style={{ fontSize: 20, fontWeight: 500, color: '#27500a', marginBottom: 16 }}>
            Food details
          </div>

          {/* Name */}
          <label style={{ fontSize: 15, fontWeight: 500, color: '#27500a',
            display: 'block', marginBottom: 8 }}>Food name</label>
          <input
            style={{ ...input, marginBottom: 14 }}
            placeholder="e.g. Milk, Eggs, Spinach"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />

          {/* Quantity + Expiry row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 15, fontWeight: 500, color: '#27500a',
                display: 'block', marginBottom: 8 }}>Quantity</label>
              <input
                style={input}
                placeholder="e.g. 1 carton"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ fontSize: 15, fontWeight: 500, color: '#27500a',
                display: 'block', marginBottom: 8 }}>Expiry date</label>
              <input
                style={input}
                type="date"
                value={form.expiry}
                onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
              />
            </div>
          </div>

          {/* Category */}
          <label style={{ fontSize: 15, fontWeight: 500, color: '#27500a',
            display: 'block', marginBottom: 10 }}>Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10, marginBottom: 18 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.label}
                onClick={() => setForm(f => ({ ...f, category: cat.label }))}
                style={{
                  background: form.category === cat.label ? '#eaf3de' : '#f4faf0',
                  border: form.category === cat.label ? '0.5px solid #3b6d11' : '0.5px solid #c0dd97',
                  borderRadius: 8, padding: '12px 4px', fontSize: 14,
                  color: '#3b6d11', cursor: 'pointer', textAlign: 'center',
                  fontWeight: form.category === cat.label ? 500 : 400,
                }}>
                <span style={{ fontSize: 22, display: 'block', marginBottom: 6 }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Success */}
          {success && (
            <div style={{ background: '#eaf3de', border: '0.5px solid #97c459',
              borderRadius: 10, padding: '12px 16px', fontSize: 15,
              color: '#3b6d11', textAlign: 'center', fontWeight: 500, marginBottom: 14 }}>
              ✅ Food item saved!
            </div>
          )}

          <button onClick={handleAdd} disabled={loading}
            style={{ background: loading ? '#7aab4a' : '#3b6d11', color: 'white', border: 'none',
              borderRadius: 10, padding: 16, width: '100%',
              fontSize: 17, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : '+ Add food item'}
          </button>
        </div>

        {/* Food list */}
        {foods.length > 0 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#27500a', marginBottom: 12 }}>
              Food list
            </div>
            {foods.map((f) => (
              <div key={f.id} style={{ background: 'white', borderRadius: 10,
                border: '0.5px solid #c0dd97', padding: '14px 16px',
                marginBottom: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#2c2c2a' }}>
                    {f.icon} {f.name}
                  </div>
                  <div style={{ fontSize: 14, color: '#888780', marginTop: 3 }}>
                    {f.quantity && `${f.quantity} · `}Expires {new Date(f.expiryDate).toDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge days={daysUntil(f.expiryDate)} />
                  <button onClick={() => handleDelete(f.id)}
                    style={{ background: 'none', border: 'none',
                      color: '#a32d2d', fontSize: 18, cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}