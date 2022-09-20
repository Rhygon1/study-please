const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
console.log(process.env.PORT)
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    User: String,
    ID: String,
    p1: String,
    p2: String,
    on: Boolean,
    CreatedBy: String
})
const model = mongoose.model('user', schema)
let data = []
mongoose.connect('mongodb+srv://Dhruv:gilbert130@cluster0.rcpc7.mongodb.net/Disc?retryWrites=true&w=majority')
    .then(() => model.find({}).exec())
    .then(r => data = r)
    .then(() => app.listen(PORT))

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/api/:name', (req, res) => {
    res.json(
        data.filter(x => x.CreatedBy === req.params.name)
    )
})

app.post('/api', (req, res) => {
    let index = 0
    for(let i = 0; i<data.length; i++){
        if(data[i].ID == req.body.ID){
            index = i
            break
        }
    }
    data[index].User = req.body.User
    data[index].p1 = req.body.p1
    data[index].p2 = req.body.p2
    data[index].on = JSON.parse(req.body.on)
    model.findOneAndUpdate({ID: req.body.ID}, {...data[index]})
        .then(console.log)
})

app.delete('/api', (req, res) => {
    let index = 0
    for(let i = 0; i<data.length; i++){
        if(data[i].ID == req.body.ID){
            index = i
            break
        }
    }
    let name = data[index].CreatedBy
    data.splice(index, 1)
    res.json(
        data.filter(x => x.CreatedBy === name)
    )

    model.deleteOne({ID: req.body.ID})
        .then(console.log)
})

app.put('/api', (req, res) => {
    let n = Object.assign({}, req.body)
    n.on = JSON.parse(n.on)
    data.push(n)

    model.create(n)
        .then(console.log)
})