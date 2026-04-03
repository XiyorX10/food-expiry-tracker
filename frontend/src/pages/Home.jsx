import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/api/foods'

function Badge({ days }) {
  if (days <= 0) return <span style={badge('red')}>TODAY</span>
  if (days <= 3) return <span style={badge('orange')}>{days} DAYS</span>
  return               <span style={badge('green')}>{days} DAYS</span>
}

function badge(color) {
  const colors = {
    red:    { background: '#fcebeb', color: '#a32d2d' },
    orange: { background: '#faeeda', color: '#854f0b' },
    green:  { background: '#eaf3de', color: '#3b6d11' },
  }
  return {
    ...colors[color],
    fontSize: 11,
    padding: '4px 12px',
    borderRadius: 20,
    fontWeight: 700,
    letterSpacing: '0.06em',
  }
}

function ProgressBar({ days, maxDays }) {
  const ratio = Math.max(0, (maxDays - days) / maxDays)
  const color = days <= 0 ? '#e24b4a' : days <= 3 ? '#ba7517' : '#3b6d11'
  return (
    <div style={{ marginTop: 10, height: 4, background: '#e8f0e0', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${ratio * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
    </div>
  )
}

function BoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b6d11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ba7517" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a32d2d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
}

function daysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24))
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery]       = useState('')
  const [foodList, setFoodList] = useState([])

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setFoodList(data))
      .catch(err => console.error('Failed to load foods:', err))
  }, [])

  // Compute days live from expiryDate
  const withDays = foodList.map(f => ({
    ...f,
    days:    daysUntil(f.expiryDate),
    maxDays: 7,
  }))

  const filteredFoods = withDays.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase())
  )

  const addButtonLabel = foodList.length === 0
    ? '🌱 Add your first item!'
    : '+ Add food item'

  return (
    <div style={{ background: '#f4faf0', minHeight: '100vh', width: '100%' }}>

      {/* Hero */}
      <div style={{ background: '#3b6d11', padding: '32px 0' }}>
        <style>{`#food-search::placeholder { color: rgba(255,255,255,0.75); opacity: 1; }`}</style>
        <div style={{ maxWidth: '75%', margin: '0 auto', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              color: '#eaf3de',
              fontSize: 52,
              fontWeight: 400,
              marginBottom: 10,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}>
              FreshTracker
            </h1>
            <p style={{ color: '#97c459', fontSize: 18, fontWeight: 400, margin: 0 }}>
              Waste Less, Eat Smart
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: 260 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              opacity: 0.7, pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="food-search"
              placeholder="Search foods..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                caretColor: 'white',
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 40px 48px', maxWidth: '75%', margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 36 }}>
          {[
            { num: withDays.length,                                                   label: 'Total items',   color: '#3b6d11', Icon: BoxIcon   },
            { num: withDays.filter(f => f.days > 0 && f.days <= 3).length,            label: 'Expiring soon', color: '#ba7517', Icon: WarnIcon  },
            { num: withDays.filter(f => f.days <= 0).length,                          label: 'Expired today', color: '#a32d2d', Icon: ErrorIcon },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white',
              borderRadius: 14,
              border: '0.5px solid #c0dd97',
              padding: '24px 20px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <s.Icon />
              </div>
              <div style={{
                fontSize: 48,
                fontWeight: 700,
                color: s.color,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginBottom: 8,
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: 12,
                color: '#6b7c5a',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Expiring soon list */}
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#1e3612',
          marginBottom: 14,
          letterSpacing: '-0.01em',
        }}>
          Expiring soon
        </div>

        {filteredFoods.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #c0dd97',
            padding: '24px 20px', textAlign: 'center', color: '#888780', fontSize: 15 }}>
            {query ? `No foods found matching "${query}"` : 'No items yet — add your first food item below!'}
          </div>
        ) : (
          filteredFoods.map(f => (
            <div key={f.id} style={{
              background: 'white',
              borderRadius: 12,
              border: '0.5px solid #c0dd97',
              padding: '16px 20px',
              marginBottom: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#1e3612' }}>
                    {f.icon} {f.name}
                  </div>
                  <div style={{ fontSize: 14, color: '#888780', marginTop: 2 }}>
                    {f.quantity && `${f.quantity} · `}Expires {new Date(f.expiryDate).toDateString()}
                  </div>
                </div>
                <Badge days={f.days} />
              </div>
              <ProgressBar days={f.days} maxDays={f.maxDays} />
            </div>
          ))
        )}

        {/* Add food button */}
        <button
          onClick={() => navigate('/add-food')}
          style={{
            background: '#3b6d11',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '18px 16px',
            width: '100%',
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            margin: '20px 0 36px',
            letterSpacing: '0.01em',
            transition: 'background 0.2s',
          }}
        >
          {addButtonLabel}
        </button>

        {/* AI suggestions */}
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#1e3612',
          marginBottom: 14,
          letterSpacing: '-0.01em',
        }}>
          AI recipe suggestions
        </div>
        <div
          onClick={() => navigate('/recipes')}
          style={{
            background: 'white',
            borderRadius: 14,
            border: '1px solid #c0dd97',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            background: '#eaf3de',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22,
          }}>
            💡
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#1e3612' }}>
              What can I cook today?
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#639922', marginTop: 4 }}>
              Uses items expiring soon
            </div>
          </div>
          <div style={{ fontSize: 22, color: '#a8c98a', marginLeft: 'auto' }}>›</div>
        </div>

      </div>
    </div>
  )
}