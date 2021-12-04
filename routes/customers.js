const {Customer, validate} = require('../models/customers');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('Joi');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');

    res.send(customers);
});

router.get('/:id', async (req, res) =>{
    try {
        const id = req.params.id;

        const customer = await Customer.findById(id);
    
        if(!customer) return res.status(404).send('Customer not found');
    
        res.send(customer);
    }
    catch (err){
        console.error('error');
        res.status(400).send();
    }   
});

router.post('/', async(req, res) => {
   const {error} = validate(req.body);

   if(error) return res.status(400).send(error.details[0].message);

   let customer = new Customer({
       name: req.body.name,
       isGold: req.body.isGold,
       phone: req.body.phone
   });

   customer = await customer.save();

   res.status(401).send(customer);
});

router.put('/:id', async(req, res) =>{
    try { 
        const {error} = validate(req.body);

        if(!error) return res.status(400).send(error.details[0].message);
    
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, {new: true});

        res.send(customer);
    }
    catch(err){
        console.error('error');
        res.status(400).send();
    }    
});

router.delete('/:id', async(req, res) => {
    try { 
        const customer = await Customer.findByIdAndDelete(req.params.id);

        req.send(customer);
    }
    catch(err){
        console.error('error');
        res.status(400).send();
    }    
});

module.exports = router;