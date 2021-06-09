const express = require('express');
const router = express.Router();
const Car = require('../models/car')
const {Company} = require('../models/company')
const { check, validationResult } = require('express-validator');
const authJWT = require('../middleware/authJWT')
const authorize = require("../middleware/role")
const Role = require('../helpers/role')

//API CON MONGOOSE

  router.get('/',[authJWT, authorize([Role.Admin])], async(req,res)=>{
    const cars = await Car.find().populate('company')
    res.send(cars)
  })



  router.get('/:id', async(req,res)=>{
    const car = await Car.findById(req.params.id)
    if(!car) return res.status(404).send('No hemos encontado un coche con ese ID')

    res.send(car)
  })



//POST MODELO DE DATOS EMBEBIDO
router.post('/', [
    check('year').isLength({min: 3}),
    check('model').isLength({min: 3})
],async(req, res)=>{
   
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
  }

  const company = await Company.findById(req.body.companyId)

  if(!company) return res.status(400).send('No tenemos ese fabricante')


    
  const car = new Car({
        company: company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
  })
  const result = await car.save()
  res.status(201).send(result)
}) 



  /*
  //POST MODELO DE DATOS NORMALIZADO
router.post('/', [
    check('model').isLength({min: 3})
],async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })
    const result = await car.save()
    res.status(201).send(result)
}) 

*/


router.put('/:id',[
  
  check('company').isLength({ min: 3 }),
  check('model').isLength({ min: 3 }),
  
  ] , async(req,res )=>{

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const car = await Car.findByIdAndUpdate(req.params.id,{
      company: req.body.company,
      model: req.body.model,
      year: req.body.year,
      sold: req.body.sold,
      price: req.body.price,
      extras: req.body.extras

    },{
      new: true
    }
    
    )



    if(!car){
     return res.status(404).send('el coche con ese ID no esta')
    }
   
    res.status(204).send()
})


 
router.delete('/:id', async(req,res)=>{
  
  const coche = await Car.findByIdAndDelete(req.params.id)

  if(!coche){
   return res.status(404).send('el coche con ese ID no esta, no se puede borrar')
  }


  res.status(204).send()

})
  


//API VIEJA
/*

var coches = [
    {id: 0 , company: 'BMW', modelo: 'X3', year: '2020'},
    {id: 1 , company: 'AUDI', modelo: 'A1', year: '2021'},
    {id: 2 , company: 'MERCEDES', modelo: 'CLASE A', year: '2022'},
    {id: 3 , company: 'HONDA', modelo: 'FIT', year: '2020'},
    {id: 4 , company: 'HYUNDAI  ', modelo: 'GETZ', year: '2020'}
  
  ]


router.get('/list', async (req,res)=>{
    //res.send(['BMW S3','AUDI A3','MERCEDES CLASE A'])

    const cars = await Car.find()
    res.send(cars)
  })
  
  
  //OBTENER PARAMETROS DESDE LA URL CON GET
  router.get('/id/:id', (req,res)=>{
    res.send(req.params.id)
  })
  
  
    //OBTENER PARAMETROS DESDE LA URL CON GET SEGUNDA PARTE
  router.get('/:company/:model', (req,res)=>{
    //OBTIENE TODOS LOS PARAMETROS EN FORMATO OBJETO
    res.send(req.params)
  })
  
  

  
  /*
  router.get('/:company', (req,res)=>{
  
    const coche = coches.find((coche)=> coche.company === req.params.company)
  
    if(!coche){
      res.status(404).send('No tenemos ningun coche de esa marca')
    } else {
      res.send(coche)
    }
    
  })
  
  
  //METODO POST
  
  router.post('/', (req,res)=>{
  
    if(!req.body.company || req.body.company.length < 3){
        res.status(400).send("Introduce la empresa correcta")
        return
    }
      var carId = coches.length;
      var coche = {
        id: carId,
        company: req.body.company,
        model: req.body.model,
        year: req.body.year
      }
  
      coches.push(coche)
  
      res.status(201).send(coche)
  })
  
  
  //PROBANDO LA LIBRERIA EXPRESS-VALIDATOR
  
  router.post('/3',[
  
    body('company').isLength({ min: 3 }),
    body('model').isLength({ min: 3 }),
  
    ] ,(req,res, )=>{
  
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
  
  
      var carId = coches.length;
      var coche = {
        id: carId,
        company: req.body.company,
        model: req.body.model,
        year: req.body.year
      }
  
      coches.push(coche)
  
      res.status(201).send(coche)
  })
  
  
  //METODO PUT
  
  //PROBANDO LA LIBRERIA EXPRESS-VALIDATOR
  
  router.put('/:id',[
  
    body('company').isLength({ min: 3 }),
    body('model').isLength({ min: 3 }),
    
    ] ,(req,res, )=>{
  
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
  
      const coche = coches.find(coche=> coche.id === parseInt(req.params.id))
  
      if(!coche){
       return res.status(404).send('el coche con ese ID no esta')
      }
     
     
      coche.company  = req.body.company;
      coche.model = req.body.model;
      coche.year = req.body.year;
  
  
      res.status(204).send()
  })
  
  
  //METODO DELETE
  
  router.delete('/:id', (req,res)=>{
  
    const coche = coches.find(coche=> coche.id === parseInt(req.params.id))
  
    if(!coche){
     return res.status(404).send('el coche con ese ID no esta, no se puede borrar')
    }
   
  
    const index = coches.indexOf(coche)
  
    coches.splice(index, 1)
  
    res.status(204).send()
  
  })
  */

  module.exports = router
