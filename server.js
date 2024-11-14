const express = require("express")
const app = express()
const { db } = require("./db/connection")
const musicianRoutes = require("./routes/musicians")
const port = 3000;

app.use(express.json());  // Handles JSON data in request body
app.use(express.urlencoded({ extended: true }));  // Handles form-encoded data

app.use("/musicians", musicianRoutes);

app.listen(port, () => {
    db.sync();
    console.log(`Listening at http://localhost:${port}/musicians`)
})