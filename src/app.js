const express = require("express");
const app = express();
const { Musician } = require("../models/index")
const { db } = require("../db/connection")
const {Band} = require('../models/index')

const port = 3000;

app.use(express.json())
app.use(express.urlencoded())

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

app.post("/musician", async (req,res) => {

    //add new musician
    await Musician.create(req.body)

    //get musicians with new musician added
    const musiciansWithNewMusician = await Musician.findAll()

    //send updated musicians 
    res.json(musiciansWithNewMusician)
})

app.put("/musician/:id", async (req,res) =>{ 

    //update musician using id
    await Musician.update(req.body, {where:{id:req.params.id}})
    //get musicians after update
    const musicians = await Musician.findAll()
    res.json(musicians)
})
app.delete("/musicians/:id", async (req,res)=>{
    //delete musician using id
    await Musician.destroy({where:{id:req.params.id}})

    //get musicians after deletion 
    const musicians = Musician.findAll()
    //send musicians
    res.json(musicians)
})






module.exports = app;