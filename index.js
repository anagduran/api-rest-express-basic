
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000


const car = require('./routes/car')
const user = require('./routes/user')
const company = require('./routes/company')
const sale = require('./routes/sale')
const auth = require('./routes/auth')

app.use(express.json())

app.use('/api/cars', car)
app.use('/api/users', user)
app.use('/api/company', company)
app.use('/api/sale', sale)
app.use('/api/auth', auth)


mongoose.connect('mongodb://localhost/carsdb',{useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true}).then(()=>{
  console.log('Conectado a mongoDB')
}).catch((error)=>{
  console.log("No se ha conectado a mongoDB")
})

/*const date = require('./date')
const morgan = require('morgan')*/

/*app.use(date)

app.use(morgan('tiny'))*/


//PRIMER MIDDLEWARE
/*app.use(function(req,res,next){
    console.log('Time: ', Date.now())
    next()
})*/

//MIDDLEWARE ANIDADAS
/*app.use(function(req,res,next){
  console.log('Request type: ', req.method)
  next()
})*/


/*Este middleware solo se va a ejecutar cuando el path sea el que se especifica 
app.use('/api/cars/list',function(req,res,next){
  console.log('Request type: ', req.method)
  next()
})
*/



app.listen(port, ()=> console.log('escuchando puerto 3000'))
