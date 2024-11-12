const express = require("express");
const app = express();
const { Musician } = require("../models/index")
const { db } = require("../db/connection")
const {Band} = require('../models/index')

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians 
app.get('/musicians', async (req, res) => {
    try {
        const allMusicians = await Musician.findAll();
        res.json(allMusicians);
    } catch (error) {
        console.error("Error fetching musicians:", error);
        res.status(500).json({ error: "Failed to retrieve musicians" });
    }
});

app.get('/musicians/1', async (req,res) => {
    try{
        const allMusicians = await Musician.findAll()
        const musician = allMusicians[0]

        res.json(musician)
    }catch(error){
        console.error("Error fetching musician", error);
        res.status(500).json({ error: "Failed to retrieve musician" });

    }
})

app.get('/musicians/2', async (req,res) => {
    try{
        const allMusicians = await Musician.findAll()
        const musician = allMusicians[1]

        res.json(musician)
    }catch(error){
        console.error("Error fetching musician", error);
        res.status(500).json({ error: "Failed to retrieve musician" });

    }
})

app.get('/musicians/3', async (req,res) => {
    try{
        const allMusicians = await Musician.findAll()
        const musician = allMusicians[2]

        res.json(musician)
    }catch(error){
        console.error("Error fetching musician", error);
        res.status(500).json({ error: "Failed to retrieve musician" });

    }
})

app.get('/bands', async (req,res) => {
    try{
        const allBands = await Band.findAll()
        res.json(allBands)
    }catch(error){
        console.error('error fetching bands', error)
        res.status(500).json({ error: "Failed to retrieve bands" });
    }
})

app.get("/musicians/:id", async (req,res) => {
    const id = req.params.id

    const musician = await Musician.findByPk(id)

    res.json(musician)
})






module.exports = app;