import { useState, useEffect, useRef } from "react";
import axios from "axios";
import 'remixicon/fonts/remixicon.css'
import gsap from "gsap";
import EmojiText from "./emojiText";
import Card from "./card";
import { BeatLoader } from 'react-spinners'; 

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; 
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  let xPercent = 0; 
  let direction = -1;
  const [movieTitle, setMovieTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [posters, setPosters] = useState({}); // State to hold posters
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(false);
  const emojiRef = useRef([])

  const emojis = [ "🎬", "🍿", "🥤", "🎟️", "🍔", "🥨", "🍟"];

  // TMDB API key
  

  // Fetch default movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); 
        const response = await fetch("https://popcorn-guru-movie-recommendation.onrender.com/movies"); // Fetch from backend "https://popcorn-guru-movie-recommendation.onrender.com/movies"
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        // Shuffle movies and select top 5
        const shuffledMovies = data.sort(() => Math.random() - 0.5).slice(0, 4);
        setMovies(shuffledMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchPostersAndProviders = async () => {
      const newPosters = {};
      const newProviders = {};
      setLoading(true);
      for (const movie of movies) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${API_KEY}&language=en-US`
          );
          newPosters[movie.movie_id] = `https://image.tmdb.org/t/p/w500/${response.data.poster_path}`;

          const providersResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.movie_id}/watch/providers?api_key=${API_KEY}`
          );
          newProviders[movie.movie_id] = providersResponse.data.results?.US?.flatrate?.[0]?.provider_name || "N/A";
        } catch (error) {
          console.error("Error fetching poster or provider:", error);
        }
      }
      setPosters(newPosters);
      setProviders(newProviders);
      setLoading(false);
    };

    if (movies.length > 0) {
      fetchPostersAndProviders();
    }
  }, [movies]);

  const handleRecommendation = async () => {
    setError("");
    setRecommendations([]);

    if (!movieTitle) {
      setError("Please enter a movie title.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("https://popcorn-guru-movie-recommendation.onrender.com/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieTitle }),
      });

      const data = await response.json();
      if (data.recommendations.length > 0) {
        // Fetch posters for recommended movies
        const recommendationsWithPosters = await Promise.all(
          data.recommendations.map(async (movie) => {
            const poster = await fetchPoster(movie.movie_id); // Fetch each poster
            const provider = await fetchProvider(movie.movie_id);
            return { ...movie, poster, provider }; // Return movie with poster
          })
        );
        setRecommendations(recommendationsWithPosters);
      } else {
        setError("No recommendations found. Try another movie or check the movie name");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Error fetching recommendations. Please try again.");
    }
    finally {
      setLoading(false); // Set loading to false
    }
  };

  const fetchPoster = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      return `https://image.tmdb.org/t/p/w500/${response.data.poster_path}`;
    } catch (error) {
      console.error("Error fetching poster:", error);
      return "";
    }
  };

  const fetchProvider = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
      );
      return response.data.results?.US?.flatrate?.[0]?.provider_name || "N/A";
    } catch (error) {
      console.error("Error fetching provider:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    const animation = () => {
      gsap.set(emojiRef.current, { xPercent: xPercent });
      xPercent += 0.1 * direction; 
      if (xPercent <= -50) {
        xPercent = 0; 
      }
      requestAnimationFrame(animation); 
    };

    animation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 h-full px-6 sm:px-11 py-11">
      {/* Top nav */}
      <div className="flex items-center justify-between w-full">
        <a href="#"><img src="/logo.svg" alt="Popcorn Guru" /></a>
        <div className="flex items-center gap-2">
          <i className="ri-global-line text-slate-400"></i>
          <p className="text-slate-800 font-inter">English</p>
        </div>
      </div>

      {/* Icon Scrolling */}
      <div  className="w-[30vw] sm:w-[10vw] overflow-hidden border rounded-full mt-16">
        <div ref={emojiRef} className="inline-block whitespace-nowrap">
          <div  className="inline-block whitespace-nowrap">
            {emojis.map((emoji, index)=>(
              <EmojiText key={index}>
                {emoji}
              </EmojiText>
            ))}
          </div>
          <div className="inline-block whitespace-nowrap">
            {emojis.map((emoji, index)=>(
              <EmojiText key={index}>
                {emoji}
              </EmojiText>
            ))}
          </div>
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col items-center justify-center text-center mt-4 gap-2">
        <h1 className="text-4xl sm:text-7xl font-inter font-semibold text-slate-800">Unlock Endless Movie <br/> <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Recommendations</span> for Every Mood</h1>
        <p className="text-base sm:text-lg font-normal font-inter text-slate-400">Get Tailored Movie Suggestions from the Classics to Hidden Gems</p>
      </div>

      <div className="flex flex-col sm:flex-row mb-4 items-center sm:items-start gap-4 mt-16">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Enter movie title"
          className="px-8 py-6 border border-gray-200 w-[90vw] sm:w-[30vw] rounded-full font-inter font-normal focus:outline-none focus:ring-1 focus:ring-gray-300 text-slate-600"
        />
        <button
          onClick={handleRecommendation}
          className="px-8 py-6 bg-slate-800 text-white rounded-full hover:bg-blue-600 font-inter font-bold text-base "
        >
          Get Recommendations
        </button>
      </div>

      {error && <p className="text-red-500 font-inter font-bold text-base">{error}</p>}

      { loading ? (
        <div className="mt-16 flex flex-col items-center">
          <BeatLoader size={15} color="#334155" loading={loading} />
          <p className="mt-2 font-inter ">Loading movies...</p>
        </div>
      ) : (
        <>
          {recommendations.length === 0 && (
        <div>
          <div
            id="default-movies"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-16"
          >
            {movies.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start px-4 py-8 bg-white hover:bg-gray-100 rounded-3xl border border-gray-200 h-full"
              >
                <Card title={movie.title} vote_average={movie.vote_average} poster={posters[movie.movie_id]} provider={providers[movie.movie_id]} release_date={movie.release_date} />
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <div id="recommendations" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-16">
            {recommendations.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start px-4 py-8 bg-white hover:bg-gray-100 rounded-3xl border border-gray-200 h-full"
              >
                <Card title={movie.title} vote_average={movie.vote_average} poster={movie.poster} provider={movie.provider} release_date={movie.release_date} />

              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
      
    </div>
  );
};

export default App;

