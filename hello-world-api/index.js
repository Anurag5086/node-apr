const express = require('express')
const app = express()

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, World!' })
})

// Example of a dynamic route that greets the user by name - Route Params
app.get('/greet/:name', (req, res) => {
    const name = req.params.name;
    res.json({ message: `Hello, ${name}!` })
})

app.get('/greet', (req, res) => {
    const name = req.query.name || 'World';
    res.json({ message: `Hello, ${name}!` })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})