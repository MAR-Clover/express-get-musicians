const express = require("express");
const app = express();
const { Musician } = require("../models/index")
const { db } = require("../db/connection")
const {Band} = require('../models/index')
const musicianRoutes = require("../routes/musicians")

const port = 3000;
app.use(express.json());  // Handles JSON data in request body
app.use(express.urlencoded({ extended: true }));  // Handles form-encoded data

app.use("/musicians", musicianRoutes);


app.get('/bands', async (req,res) => {
    try{
        const allBands = await Band.findAll()
        res.json(allBands)
    }catch(error){
        console.error('error fetching bands', error)
        res.status(500).json({ error: "Failed to retrieve bands" });
    }
})






module.exports = app;