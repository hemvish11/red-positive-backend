require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGO_DB);

const personSchema = new mongoose.Schema({
    uniqueId: String,
    name: String,
    phoneNumber: Number,
    email: String,
    hobbies: String
})

const Person = mongoose.model("Person", personSchema);

app.get("/", (req, res) => {
    res.send("<h1>API is working...</h1>");
})


app.get(("/api/data"), async (req, res) => {
    try {
        let data = await Person.find({});
        res.json(data);
    } catch (error) {
        throw error;
    }
});

app.post("/api/data", async (req, res) => {
    try {
        const data = req.body;
        const person = new Person({
            uniqueId: data.uniqueId,
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            hobbies: data.hobbies,
        });
        await person.save();
        res.status(200).json({ message: "Person added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put("/api/data", async (req, res) => {
    try {
        const data = req.body;
        const updatedPerson = await Person.findOneAndUpdate(
            { uniqueId: data.uniqueId },
            {
                $set: {
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    hobbies: data.hobbies,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedPerson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete("/api/data", async (req, res) => {
    try {
        const currId = req.body.uniqueId;
        const deletedPerson = await Person.findOneAndDelete({ uniqueId: currId });
        if (!deletedPerson) {
            return res.status(404).json({ message: "Person not found" });
        }
        res.status(200).json({ message: "Person deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(process.env.PORT, () => {
    console.log("Server is started...")
})