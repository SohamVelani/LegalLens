const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// --- [SECTION 1] DATABASE & CONFIG ---
// Keep your existing DB connection here.
// If you have a db.js file, import it:
const db = require('./db'); 

const app = express();
const PORT = 5000;

// --- [SECTION 2] MIDDLEWARE ---
app.use(cors());                 // Allow Frontend to communicate
app.use(express.json());         // Allow JSON data
app.use(express.urlencoded({ extended: true })); // Allow Form data

// Configure Multer for temporary file storage
// Files will be saved to a folder named 'uploads'
const upload = multer({ dest: 'uploads/' });

// Create 'uploads' folder if it doesn't exist (Prevents crashes)
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// --- [SECTION 3] YOUR EXISTING ROUTES (DO NOT DELETE YOUR OLD CODE) ---
// If you had login/signup routes, paste them here.
// Example: app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('LegalLens Server is Running...');
});


// --- [SECTION 4] THE NEW AI BRIDGE (ADD THIS) ---
app.post('/analyze', upload.single('document'), async (req, res) => {
    try {
        // 1. Validation
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`🚀 Processing: ${req.file.originalname}`);

        // 2. Prepare Form Data for Python
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        // 3. Send to Python Engine (Port 8000)
        // Note: 'maxBodyLength' and 'maxContentLength' prevent errors on large PDFs
        const pythonResponse = await axios.post('http://127.0.0.1:8000/analyze', formData, {
            headers: {
                ...formData.getHeaders()
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        // 4. Cleanup (Delete temp file)
        fs.unlinkSync(req.file.path);

        console.log("✅ AI Analysis Success!");

        // 5. Return Result to React
        res.json({
            success: true,
            data: pythonResponse.data
        });

    } catch (error) {
        console.error("❌ AI Bridge Error:", error.message);

        // Cleanup temp file even if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Send useful error to frontend
        const errorDetails = error.response ? error.response.data : error.message;
        res.status(500).json({ 
            error: "Failed to analyze document", 
            details: errorDetails 
        });
    }
});


// --- [SECTION 5] START SERVER ---
app.listen(PORT, () => {
    console.log(`Node Server running on http://localhost:${PORT}`);
});