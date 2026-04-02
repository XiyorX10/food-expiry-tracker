import { useState, useEffect } from 'react'

const expiringFoods = [
  { name: 'Milk', days: 0 },
  { name: 'Spinach', days: 2 },
  { name: 'Eggs', days: 3 },
]

function chipStyle(days) {
  if (days === 0) return { background: '#fcebeb', color: '#a32d2d', border: '0.5px solid #f09595' }
  return { background: '#faeeda', color: '#854f0b', border: '0.5px solid #ef9f27' }
}

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  async function fetchRecipes() {
    setLoading(true)
    const foodList = expiringFoods.map(f => f.name).join(', ')
    try {
      const res = await fetch('http://localhost:3001/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foods: foodList })
      })
      const data = await res.json()
      setRecipes(data)
    } catch (e) {
      setRecipes([])
    }
    setLoading(false)
  }

  function toggleSave(recipe) {
    setSaved(prev =>
      prev.find(r => r.name === recipe.name)
        ? prev.filter(r => r.name !== recipe.name)
        : [...prev, recipe]
    )
  }

  function isSaved(recipe) {
    return saved.find(r => r.name === recipe.name)
  }

  return (
    <div style={{ background: '#f4faf0', minHeight: '100vh', width: '100%' }}>

      {/* Hero */}
      <div style={{ background: '#3b6d11', padding: '32px 40px' }}>
        <h1 style={{ color: '#eaf3de', fontSize: 36, fontWeight: 500, marginBottom: 8 }}>
          Recipe suggestions
        </h1>
        <p style={{ color: '#97c459', fontSize: 18 }}>AI recipes using your expiring food</p>
      </div>

      <div style={{ padding: '24px 40px', maxWidth: '75%', margin: '0 auto' }}>

        {/* Expiring chips */}
        <div style={{ fontSize: 15, color: '#639922', marginBottom: 10 }}>Using these expiring items:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {expiringFoods.map(f => (
            <span key={f.name} style={{
              ...chipStyle(f.days), borderRadius: 20,
              padding: '6px 14px', fontSize: 14, fontWeight: 500
            }}>
              {f.name} — {f.days === 0 ? 'today' : `${f.days} days`}
            </span>
          ))}
        </div>

        {/* AI Suggestions */}
        <div style={{ fontSize: 18, fontWeight: 500, color: '#27500a', marginBottom: 12 }}>
          AI suggestions
        </div>

        {loading && (
          <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #c0dd97',
            padding: 32, textAlign: 'center', marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, border: '2px solid #eaf3de',
              borderTopColor: '#3b6d11', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, color: '#639922' }}>Finding recipes for your expiring food...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {recipes.map((r, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12,
            border: '0.5px solid #c0dd97', padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#27500a' }}>{r.name}</div>
              <button onClick={() => toggleSave(r)} style={{ background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 24, lineHeight: 1 }}>
                {isSaved(r) ? '♥' : '♡'}
              </button>
            </div>
            <div style={{ fontSize: 15, color: '#5f5e5a', lineHeight: 1.6, marginBottom: 12 }}>
              {r.description}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ background: '#eaf3de', color: '#3b6d11', borderRadius: 20,
                padding: '4px 12px', fontSize: 13 }}>
                Uses: {r.uses.join(', ')}
              </span>
              <span style={{ background: '#eaf3de', color: '#3b6d11', borderRadius: 20,
                padding: '4px 12px', fontSize: 13 }}>
                {r.time}
              </span>
            </div>
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ width: '100%', background: '#f4faf0', border: '0.5px solid #97c459',
                borderRadius: 8, padding: 12, fontSize: 15, color: '#3b6d11',
                fontWeight: 500, cursor: 'pointer' }}>
              {expanded === i ? 'Hide recipe' : 'See full recipe'}
            </button>
            {expanded === i && (
              <ol style={{ marginTop: 14, paddingLeft: 20 }}>
                {r.steps.map((step, j) => (
                  <li key={j} style={{ fontSize: 15, color: '#444441', marginBottom: 8, lineHeight: 1.6 }}>
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}

        {/* Saved recipes */}
        {saved.length > 0 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#27500a', margin: '24px 0 12px' }}>
              Saved recipes
            </div>
            {saved.map((r, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12,
                border: '0.5px solid #c0dd97', padding: 18, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: '#27500a' }}>{r.name}</div>
                  <button onClick={() => toggleSave(r)} style={{ background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 24 }}>♥</button>
                </div>
                <div style={{ fontSize: 15, color: '#5f5e5a' }}>{r.description}</div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  )
}