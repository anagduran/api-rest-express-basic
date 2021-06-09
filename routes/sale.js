const express = require('express');
const router = express.Router();
const Sale = require('../models/sale')
const Car = require('../models/car')
const User = require('../models/user')
const mongoose = require('mongoose')
const authJWT = require('../middleware/authJWT')
const admin = require("../middleware/admin")

router.get('/', [authJWT, admin],async(req,res)=>{
    const sales = await Sale.find()
    res.send(sales)
})


router.post('/', authJWT, async(req,res)=>{
    const user = await User.findById(req.body.userId)
    if(!user) return res.status(400).send("Usuario no existe")

    const car = await Car.findById(req.body.carId)
    if(!car) return res.status(400).send("Coche no existe")

    if(car.sold === true) return  res.status(400).send("Ese coche ya ha sido vendido")

    const sale = new Sale({
        user: {
            _id: user.id,
            name: user.name,
            email: user.email
        },
        car: {
            _id: car.id,
            model: car.model
        },
        price: req.body.price
    })
    
    const session = await mongoose.startSession()
    session.startTransaction()
  
    try{

        const result = await sale.save()
        user.isCustomer = true;
        user.save()
        car.sold = true
        car.save()

        await session.commitTransaction()
        session.endSession()
        
        res.status(201).send(result)

    } catch(error){
        console.log(error)
        await session.abortTransaction()
        session.endSession()
        res.status(500).send(e.message)

    }

})


module.exports = router