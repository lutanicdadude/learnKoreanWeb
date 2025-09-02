const { PrismaClient } = require('@prisma/client');
const { exec } = require("child_process");
const fs = require("fs");
const prisma = new PrismaClient();

exports.createStoredWord = async (req, res) => {
    if (!req.body.kor_word || !req.body.eng_word || !req.body.category) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        newWord = await prisma.stored_words.create({
            data: {
                kor_word: req.body.kor_word,
                eng_word: req.body.eng_word,
                category: req.body.category
            }
        });
        return res.status(200).json({
            success: true,
            message: `Word created.`
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json({
            success: false,
            message: `Error creating word.`
        });
    }
}

exports.getAllStoredWords = async (req, res) => {
    try {
        const words = await prisma.stored_words.findMany({
            orderBy: {
                id: 'asc'
            },
        });

        return res.status(200).json(words);  // use .json() instead of .send()
    } catch (error) {
        console.error("Error fetching words:", error);
        return res.status(400).json({
            success: false,
            message: `Unable to retrieve words.`
        });
    }
};

exports.getQuizWord = async (req, res) => {
    try {
        const category = req.query.category; // get category from query string

        const words = await prisma.stored_words.findMany({
            where: category && category !== 'all' ? { category } : {},
        });

        // shuffle and take 5
        const randomFive = words
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        return res.status(200).json(randomFive);
    } catch (error) {
        console.error("Error fetching words:", error);
        return res.status(400).json({
            success: false,
            message: "Unable to retrieve random words."
        });
    }
};


exports.getCategories = async (req, res) => {
    try {
        const categories = await prisma.stored_words.findMany({
            distinct: ['category'],  // get only unique categories
            select: { category: true } // only return category field
        });

        // Map to an array of strings
        const categoryList = categories.map(c => c.category);

        res.status(200).json(categoryList);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Unable to retrieve categories." });
    }
};

// CREATE
exports.createTTS = async (req, res) => {
    try {
        const { text, voice } = req.body;
        if (!voice) return res.status(400).send("No voice provided");

        // Create DB row first (reserve ID)
        const newEntry = await prisma.Audio.create({
            data: {
                voice,
                wordId: 1
            },
        });

        const command = `espeak -v ${voice} "${text}" --stdout`;
        const child = exec(command, { encoding: "buffer", maxBuffer: 1024 * 1024 * 5 });

        let audioBuffer = Buffer.alloc(0);

        child.stdout.on("data", chunk => {
            audioBuffer = Buffer.concat([audioBuffer, chunk]);
        });

        child.on("close", async () => {
            // Save audio as base64
            await prisma.Audio.update({
                where: { id: newEntry.id },
                data: { audioData: audioBuffer }
            });

            res.setHeader("Content-Type", "audio/wav");
            res.end(audioBuffer); // stream audio back to client
        });

        child.stderr.on("data", err => {
            console.error(err.toString());
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// READ
exports.getTTS = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const entry = await prisma.Audio.findUnique({ where: { id } });

        if (!entry) return res.status(404).send("Audio entry not found");
        if (!entry.audioData) return res.status(404).send("No audio stored for this entry");

        const audioBuffer = Buffer.from(entry.audioData, "base64");

        res.setHeader("Content-Type", "audio/wav");
        res.end(audioBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// UPDATE
exports.updateTTS = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { text, voice } = req.body;

        let entry = await prisma.Audio.findUnique({ where: { id } });
        if (!entry) return res.status(404).send("Audio entry not found");

        const command = `espeak -v ${voice} "${text}" --stdout`;
        const child = exec(command, { encoding: "buffer", maxBuffer: 1024 * 1024 * 5 });

        let audioBuffer = Buffer.alloc(0);

        child.stdout.on("data", chunk => {
            audioBuffer = Buffer.concat([audioBuffer, chunk]);
        });

        child.on("close", async () => {
            const updated = await prisma.Audio.update({
                where: { id },
                data: { text, voice, audioData: audioBuffer.toString("base64") }
            });

            res.json(updated);
        });

        child.stderr.on("data", err => {
            console.error(err.toString());
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// DELETE
exports.deleteTTS = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const entry = await prisma.Audio.findUnique({ where: { id } });
        if (!entry) return res.status(404).send("Audio entry not found");

        await prisma.Audio.delete({ where: { id } });

        res.json({ message: "Audio entry deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};