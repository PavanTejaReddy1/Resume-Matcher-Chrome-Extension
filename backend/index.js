require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PDFParse } = require("pdf-parse");
const Groq = require("groq-sdk");

const app = express();
const PORT = 4000;

app.use(express.json({ limit: "10MB" }));
app.use(cors());

const groq = new Groq({
    apiKey: process.env.APIKEY
});

app.listen(PORT, () => console.log("Server running at", PORT));

app.post("/send", async (req, res) => {
    let { jd, base64 } = req.body;
    
    base64 = base64.split(",")[1];

    const buffer = Buffer.from(base64, "base64");

    const parser = new PDFParse({ data: buffer });

    const textFromPdf = await parser.getText();

    console.log(textFromPdf);

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are an ATS (Applicant Tracking System) resume analyzer."
            },
            {
                role: "user",
                content: `Compare the following Resume and Job Description.
                Resume: ${textFromPdf.text}
                Job Description: ${jd}
                Return ONLY a JSON response in this format:
                {
                "score": number (0-100),
                "missing_keywords": [],
                "matched_keywords": []
                }`
            }
        ],
        temperature: 0.2
    });

    const aiResponse = completion.choices[0].message.content;

    const cleaned = aiResponse
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    
    const parsed = JSON.parse(cleaned);

    res.status(200).json({ message: "Working Good", response: parsed });
})


