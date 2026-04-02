import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import AddFood from './pages/AddFood'

export default function App() {
  return (
    <BrowserRouter>

      {/* Navbar */}
      <nav style={{ background: '#27500a', padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 56 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#97c459',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 15 }}>
            🌿
          </div>
          <span style={{ color: '#eaf3de', fontSize: 16, fontWeight: 500 }}>
            Fresh Tracker
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { to: '/',         label: 'Home' },
            { to: '/recipes',  label: 'Recipes' },
            { to: '/add-food', label: 'Add Food' },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                color: isActive ? '#eaf3de' : '#97c459',
                background: isActive ? '#3b6d11' : 'transparent',
                fontSize: 13, fontWeight: 500,
                padding: '6px 14px', borderRadius: 8,
                textDecoration: 'none'
              })}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Pages */}
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/recipes"  element={<Recipes />} />
        <Route path="/add-food" element={<AddFood />} />
      </Routes>

    </BrowserRouter>
  )
}