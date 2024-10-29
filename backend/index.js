const express = require('express');
const cors = require('cors');
const path = require('path');
const { readFileContent } = require('./storage');
require('dotenv').config();

const app = express();
app.use(express.json());



const allowedOrigins = [
    process.env.FRONTEND_URL, 
    "http://localhost:3000",
    "*",
];

console.log(allowedOrigins)

app.use(cors({
    origin: allowedOrigins,  
    credentials: true
}));



let movies = [];
let similarity = [];

const loadDataFromGCS = async () => {
    try {
        movies = await readFileContent('movie.json');
        similarity = await readFileContent('similarity.json');
    } catch (error) {
        console.error("Error loading data from GCS:", error);
        throw new Error("Failed to load data");
    }
};


loadDataFromGCS().then(() => {
    console.log("Data loaded successfully");
}).catch((error) => {
    console.error("Failed to load data:", error);
});


const getRecommendations = (movieTitle) => {
    const movieIndex = movies.findIndex(m => m.title.toLowerCase() === movieTitle.toLowerCase());
    if (movieIndex === -1) return []; // Movie not found

    const similarities = similarity[movieIndex];

    if (!similarities) {
        console.error(`No similarities found for movie: ${movieTitle}`);
        return [];
    }

    return similarities.map((score, index) => ({
            movie: movies[index],
            score
        }))
        .filter(item => item.score > 0.1 && item.movie.title.toLowerCase() !== movieTitle.toLowerCase()) // Exclude the input movie
        .sort((a, b) => b.score - a.score) // Sort by score
        .slice(0, 14) // Get top 14 recommendations
        .map(item => item.movie);
};


app.get('/movies', (req, res) => {
    if (movies.length === 0) {
        return res.status(500).json({ error: 'Movie data is not loaded' });
    }
    res.json(movies); 
});


app.post('/recommend', (req, res) => {
    const { movieTitle } = req.body;
    if (!movieTitle) {
        return res.status(400).json({ error: 'Movie title is required' });
    }

    const recommendations = getRecommendations(movieTitle);
    res.json({ recommendations });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

