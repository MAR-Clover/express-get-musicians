const express = require("express")
const router = express.Router()
const Musician = require("../models/Musician")
const {check, validationResult} = require("express-validator")

//route to get

router.get("/", async (req,res) => {
    const response = await Musician.findAll()
    res.json(response)
})

//route to get by ID
router.get("/:id", async (req,res)=>{
    const uid = req.params.id
    const response = await Musician.findByPk(uid)
    res.json(response)
})

//route to create

router.post("/",
    [
        check("name").trim().not().isEmpty().withMessage("Name cannot be empty"),
        check("instrument").trim().not().isEmpty().withMessage("Instrument cannot be empty")
    ],

    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }else{
            console.log("Request body:", req.body); 
            const content = req.body;
            await Musician.create(content);
            const musicians = await Musician.findAll();
            res.status(201).json(musicians);
        }

  });
  
  
//route to update

router.put("/:id", async (req, res) => {
    const uid = req.params.id; // Get the musician id from the request params
    const content = req.body;  // Get the updated data from the request body

    try {
        await Musician.update(content, { where: { id: uid } });

        const musicians = await Musician.findAll();

        res.status(200).json(musicians);
    } catch (e) {
        res.status(500).json({ message: "Error updating Musician", error: e.message });
    }
});

//route to delete

router.delete("/:id", async (req,res)=>{
    const uid = req.params.id
    //delete musician
    await Musician.destroy({where:{id:uid}})
    const response = await Musician.findAll()
    res.status(200).json(response)
})

module.exports = router