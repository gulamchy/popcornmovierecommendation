const express = require('express');
const cors = require('cors');
const path = require('path');
const { uploadFiles, readFileContent } = require('./storage');

const app = express();
// const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
// }));

app.use(express.static(path.join(__dirname, 'dist')));

// Load movie data and similarity data
let movies = [];
let similarity = [];

// Function to load data from GCS
const loadDataFromGCS = async () => {
    try {
        movies = await readFileContent('movie.json');
        similarity = await readFileContent('similarity.json');
    } catch (error) {
        console.error("Error loading data from GCS:", error);
        throw new Error("Failed to load data");
    }
};

// Call loadDataFromGCS once when the server starts
loadDataFromGCS().then(() => {
    console.log("Data loaded successfully");
}).catch((error) => {
    console.error("Failed to load data:", error);
});

// Recommendations function
const getRecommendations = (movieTitle) => {
    const movieIndex = movies.findIndex(m => m.title.toLowerCase() === movieTitle.toLowerCase());
    if (movieIndex === -1) return []; // Movie not found

    const similarities = similarity[movieIndex];

    return similarities.map((score, index) => ({
            movie: movies[index],
            score
        }))
        .filter(item => item.score > 0.1 && item.movie.title.toLowerCase() !== movieTitle.toLowerCase()) // Exclude the input movie
        .sort((a, b) => b.score - a.score) // Sort by score
        .slice(0, 14) // Get top 14 recommendations
        .map(item => item.movie);
};

// Endpoint to get movie data
app.get('/movies', (req, res) => {
    if (movies.length === 0) {
        return res.status(500).json({ error: 'Movie data is not loaded' });
    }
    res.json(movies); // Send the JSON data as the response
});

// Endpoint to upload files
app.post('/upload', async (req, res) => {
    const files = req.body.files; // Expecting an array of file objects
    if (!files || !Array.isArray(files)) {
        return res.status(400).json({ error: 'Files array is required' });
    }
    try {
        await uploadFiles(files);
        await loadDataFromGCS(); // Reload the data after upload
        res.json({ message: 'Files uploaded successfully and data reloaded' });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

// Endpoint to get movie recommendations
app.post('/recommend', (req, res) => {
    const { movieTitle } = req.body;
    if (!movieTitle) {
        return res.status(400).json({ error: 'Movie title is required' });
    }

    const recommendations = getRecommendations(movieTitle);
    res.json({ recommendations });
});

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on 3000`);
});


