const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001
const DATA_FILE = path.join(__dirname, 'data.json')

app.use(cors())
app.use(express.json())

// Helper to read/write data
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

// GET all foods
app.get('/api/foods', (req, res) => {
  const { foods } = readData()
  res.json(foods)
})

// POST add a new food
app.post('/api/foods', (req, res) => {
  const { name, quantity, expiryDate, category } = req.body
  const data = readData()
  const newItem = {
    id: Date.now().toString(),
    name,
    quantity,
    expiryDate,   // ISO string e.g. "2025-04-06"
    category,
  }
  data.foods.push(newItem)
  writeData(data)
  res.status(201).json(newItem)
})

// DELETE a food by id
app.delete('/api/foods/:id', (req, res) => {
  const data = readData()
  data.foods = data.foods.filter(f => f.id !== req.params.id)
  writeData(data)
  res.json({ success: true })
})

app.listen(PORT, () => console.log(`✅ FreshTracker backend running on http://localhost:${PORT}`))