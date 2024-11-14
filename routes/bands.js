const express = require("express")
const router = express.Router()
const Bands = require("../models/Band")
const Musician = require("../models/Musician")

router.get("/", async (req,res) => {
    const response = await Bands.findAll({
        include: {
          model: Musician
        }
      })
      res.json(response)
})

router.get("/:id", async (req,res) => {

    try{
        const response = await Bands.findByPk(req.params.id, {
            include: {
              model: Musician
            }
          });
          console.log(response)
        res.json(response)   
    }catch(e){

        console.log('ERROR WITH ID')
    }
       
})

module.exports = router
