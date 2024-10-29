// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const { uploadFile, downloadFile, readFileContent } = require('./storage');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// }));

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// // Load movie data
// let movies = [];
// let similarity = [];

// // Read movie.json
// fs.readFile('movie.json', (err, data) => {
//     if (err) throw err;
//     movies = JSON.parse(data);
// });

// // Read similarity.json
// fs.readFile('similarity.json', (err, data) => {
//     if (err) throw err;
//     similarity = JSON.parse(data);
// });

// const getRecommendations = (movieTitle) => {
//     // Find the movie by title
//     const movieIndex = movies.findIndex(m => m.title.toLowerCase() === movieTitle.toLowerCase());
//     if (movieIndex === -1) return []; // Movie not found

//     const similarities = similarity[movieIndex];
    
//     return similarities.map((score, index) => ({
//             movie: movies[index],
//             score
//         }))
//         .filter(item => item.score > 0.1 && item.movie.title.toLowerCase() !== movieTitle.toLowerCase()) // Exclude the input movie
//         .sort((a, b) => b.score - a.score) // Sort by score
//         .slice(0, 14) // Get top 5 recommendations
//         .map(item => item.movie);
// };


// app.get('/movies', (req, res) => {
//     res.sendFile(path.join(__dirname, 'movie.json'), (err) => {
//         if (err) {
//             console.error(err);
//             res.status(err.status).end();
//         }
//     });
// });

// app.post('/recommend', (req, res) => {
//     const { movieTitle } = req.body;
//     if (!movieTitle) {
//         return res.status(400).json({ error: 'Movie title is required' });
//     }

//     const recommendations = getRecommendations(movieTitle);
//     res.json({ recommendations });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });


// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { uploadFiles, readFileContent } = require('./storage');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// }));

// // Route to upload multiple files
// app.post('/upload', async (req, res) => {
//     const files = req.body.files; // Expecting an array of file objects
//     if (!files || !Array.isArray(files)) {
//         return res.status(400).json({ error: 'Files array is required' });
//     }
//     try {
//         await uploadFiles(files);
//         res.json({ message: 'Files uploaded successfully' });
//     } catch (error) {
//         console.error("Error uploading files:", error);
//         res.status(500).json({ error: 'File upload failed' });
//     }
// });

// // Route to read multiple files from GCS
// app.get('/read', async (req, res) => {
//     const { fileNames } = req.query; // Expecting a comma-separated list of filenames
//     if (!fileNames) {
//         return res.status(400).json({ error: 'File names are required' });
//     }

//     const namesArray = fileNames.split(','); // Split the comma-separated string into an array
//     try {
//         const fileContents = await Promise.all(namesArray.map(fileName => readFileContent(fileName)));
//         res.json(fileContents); // Return an array of file contents
//     } catch (error) {
//         console.error("Error reading files:", error);
//         res.status(500).json({ error: 'Failed to read files' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });



// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { uploadFiles, readFileContent } = require('./storage');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// }));

// // Load movie data and similarity data
// let movies = [];
// let similarity = [];

// // Function to load data from GCS
// const loadDataFromGCS = async () => {
//     try {
//         movies = await readFileContent('movie.json');
//         similarity = await readFileContent('similarity.json');
//     } catch (error) {
//         console.error("Error loading data from GCS:", error);
//         throw new Error("Failed to load data");
//     }
// };

// // Call loadDataFromGCS once when the server starts
// loadDataFromGCS().then(() => {
//     console.log("Data loaded successfully");
// }).catch((error) => {
//     console.error("Failed to load data:", error);
// });

// // Recommendations function
// const getRecommendations = (movieTitle) => {
//     const movieIndex = movies.findIndex(m => m.title.toLowerCase() === movieTitle.toLowerCase());
//     if (movieIndex === -1) return []; // Movie not found

//     const similarities = similarity[movieIndex];
    
//     return similarities.map((score, index) => ({
//             movie: movies[index],
//             score
//         }))
//         .filter(item => item.score > 0.1 && item.movie.title.toLowerCase() !== movieTitle.toLowerCase()) // Exclude the input movie
//         .sort((a, b) => b.score - a.score) // Sort by score
//         .slice(0, 14) // Get top 14 recommendations
//         .map(item => item.movie);
// };

// // Endpoint to upload files
// app.post('/upload', async (req, res) => {
//     const files = req.body.files; // Expecting an array of file objects
//     if (!files || !Array.isArray(files)) {
//         return res.status(400).json({ error: 'Files array is required' });
//     }
//     try {
//         await uploadFiles(files);
//         await loadDataFromGCS(); // Reload the data after upload
//         res.json({ message: 'Files uploaded successfully and data reloaded' });
//     } catch (error) {
//         console.error("Error uploading files:", error);
//         res.status(500).json({ error: 'File upload failed' });
//     }
// });

// app.get('/movies', async (req, res) => {
//     try {
//         // Read movie.json from Google Cloud Storage
//         const movieData = await readFileContent('movie.json');
//         res.json(movieData); // Send the JSON data as the response
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to load movie data' });
//     }
// });

// // Endpoint to get movie recommendations
// app.post('/recommend', (req, res) => {
//     const { movieTitle } = req.body;
//     if (!movieTitle) {
//         return res.status(400).json({ error: 'Movie title is required' });
//     }

//     const recommendations = getRecommendations(movieTitle);
//     res.json({ recommendations });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { uploadFiles, readFileContent } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

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
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});


