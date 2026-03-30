import { useState } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    if (!name || !date) return;
    
    // Calculate if it's expired for a quick "Hackathon Feature"
    const isExpired = new Date(date) < new Date();
    
    const newItem = { name, date, isExpired, id: Date.now() };
    setItems([newItem, ...items]);
    setName('');
    setDate('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🍎 Food Expiry Tracker</h1>
      
      <form onSubmit={addItem} style={{ marginBottom: '20px' }}>
        <input 
          type="text" placeholder="Item Name" 
          value={name} onChange={(e) => setName(e.target.value)} 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input 
          type="date" 
          value={date} onChange={(e) => setDate(e.target.value)} 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Add</button>
      </form>

      <div>
        {items.map(item => (
          <div key={item.id} style={{ 
            border: '1px solid #ccc', 
            margin: '5px 0', 
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: item.isExpired ? '#ffebee' : '#e8f5e9'
          }}>
            <strong>{item.name}</strong> — Expires: {item.date} 
            {item.isExpired && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ EXPIRED</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App