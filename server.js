////////////////////////////
// DEPENDENCIES
////////////////////////////
// get env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000 (object destructuring)
// pull DATABASE_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan")



////////////////////////////
// DATABASE CONNECTION
////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// connection events
mongoose.connection
    .on("open", () => console.log("you are connected to mongoose"))
    .on("close", () => console.log("you are disconnected from mongoose"))
    .on("error", (error) => console.log(error));



////////////////////////////
// MODELS
////////////////////////////
// schema
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true});
// model
const People = mongoose.model("People", PeopleSchema)



////////////////////////////
// MIDDLEWARE
////////////////////////////
app.use(cors()); // prevents cors errors, opens access for frontend
app.use(morgan("dev")); // for logging
app.use(express.json()); // to parse json bodies



////////////////////////////
// ROUTES
////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world!");
});

// People Index Route
app.get("/people", async (req, res) => {
    try {
        // send all People data
        res.json(await People.find({}))
    } catch(error){
        // send error
        res.status(400).json({error})
    }
});

// People Create Route
app.post("/people", async (req, res) => {
    try {
        // create People
        res.json(await People.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})

// People Update Route
app.put("/people/:id", async (req,res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json({error})
    }
})

// People Destroy Route
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})



////////////////////////////
// LISTENER
////////////////////////////
app.listen(PORT, () => console.log(`listening on port ${PORT}`));