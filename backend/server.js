const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())

mongoose.connect('mongodb://localhost:27018/empDB', { useNewUrlParser: true })
    .then(() => { console.log('Connected to DB...') })
    .catch(err => { console.error(`Error: ${err}`) })

const Employees = mongoose.model('Employees', new mongoose.Schema({
    empNumber: {
        type: Number,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    }
}))

// @get route: all employees
app.get('/api/employee', async (req, res) => {
    const empList = await Employees.find().sort({'empName': 1})
    res.send(empList)
})

// @get route: requested employee
app.get('/api/employee', async(req, res) => {
    const emp = await Employees.find({"empNumber": req.params.empNumber})
    res.send(emp)
})

// @post route: add new employee
app.post('/api/employee/:empNumber', async (req, res) => {
    const employee = new Employees({
        empNumber: req.body.empNumber,
        empName: req.body.empName,
        dept: req.body.dept
    })
    await employee.save()
    res.send('Successfully added employee in DB!')
})

// @delete route: delete specified employee
app.delete('/api/employee/:empNumber', async (req, res) => {
    await Employees.deleteOne({'empNumber': req.params.empNumber})
    res.send('Successfully removed employee from DB!')
})

const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })