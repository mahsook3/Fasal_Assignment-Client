import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const popularMovies = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "The Lord of the Rings: The Return of the King",
  "Forrest Gump",
  "Inception",
  "Fight Club",
  "The Matrix",
  "Goodfellas",
];

const MovieList = () => {
  const { user } = useContext(UserContext);
  console.log(user.profile.email);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [playlistMovies, setPlaylistMovies] = useState([]);
  const { logOutUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylistMovies = async () => {
      try {
        const response = await axios.get(
          `https://fasal-assignment-server-mu.vercel.app/api/movieLists/${user.profile.email}`
        );
        const playlists = response.data;
        const playlistMoviesData = playlists.flatMap(
          (playlist) => playlist.movies
        );
        setPlaylistMovies(playlistMoviesData);
      } catch (err) {
        setError("Failed to fetch playlist movies from the API");
      }
    };

    const fetchPopularMovies = async () => {
      try {
        const moviePromises = popularMovies.map((title) =>
          axios.get(
            `https://www.omdbapi.com/?apikey=43c21e83&t=${encodeURIComponent(
              title
            )}`
          )
        );
        const movieResponses = await Promise.all(moviePromises);
        const popularMoviesData = movieResponses
          .map((response) => response.data)
          .filter((movie) => movie.Response === "True");
        setMovies(popularMoviesData);
      } catch (err) {
        setError("Failed to fetch popular movies from the API");
      }
    };

    fetchPlaylistMovies();
    fetchPopularMovies();
  }, [user.profile.email]);

  const logOut = async () => {
    try {
      const loggedOut = await logOutUser();
      if (loggedOut) {
        window.location.reload(true);
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=43c21e83&s=${searchTerm}`
      );
      if (response.data.Response === "True") {
        setSearchResults(response.data.Search);
        setError("");
      } else {
        setSearchResults([]);
        setError(response.data.Error);
      }
    } catch (err) {
      setError("Failed to fetch data from the API");
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToPlaylist = async (movie) => {
    try {
      const playlistData = {
        userId: user.profile.email,
        name: "My Playlist",
        movies: [movie], // Ensure that the movie object is in the required format by the server
      };
      await axios.post(
        "https://fasal-assignment-server-mu.vercel.app/api/movieLists",
        playlistData
      );
      toast.success("Movie added to playlist successfully!");
    } catch (err) {
      console.error("Error adding movie to playlist:", err.message);
      toast.error("Failed to add movie to playlist");
    }
  };

  const handleAddToPlaylist1 = async (movie1) => {
    try {
      const playlistData = {
        userId: user.profile.email,
        name: "My Playlist",
        movies: [
          {
            imdbID: movie1.imdbID,
            Poster: movie1.Poster,
            Title: movie1.Title,
            Year: movie1.Year,
            Genre: movie1.Genre || "N/A", // Fallback in case Genre is undefined
            Director: movie1.Director || "N/A", // Fallback in case Director is undefined
            Plot: movie1.Plot || "N/A", // Fallback in case Plot is undefined
          },
        ],
      };
      await axios.post(
        "https://fasal-assignment-server-mu.vercel.app/api/movieLists",
        playlistData
      );
      toast.success("Movie added to playlist successfully!");
    } catch (err) {
      console.error("Error adding movie to playlist:", err.message);
      toast.error("Failed to add movie to playlist");
    }
  };

  const handleViewDetails = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div className="movie-list p-6 bg-gray-50 min-h-screen">
              <ToastContainer />
      <div className="flex justify-end mb-6">
        <Button
          variant="contained"
          onClick={logOut}
          className="mb-4 bg-blue-600 hover:bg-blue-700"
        >
          Logout
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Movie Search
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for a movie..."
          className="p-3 border rounded-l-lg mr-0 w-2/3 sm:w-1/2 md:w-1/3"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          className="rounded-r-lg bg-blue-600 hover:bg-blue-700"
        >
          Search
        </Button>
      </div>

      {error && <p className="text-red-600 mb-6 text-center">{error}</p>}

      {searchResults.length > 0 ? (
        <div className="movies grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {searchResults.map((movie1) => (
  <div
    key={movie1.imdbID}
    className="relative flex flex-col justify-between rounded-xl bg-white shadow-md transform transition-transform duration-500 hover:scale-105 w-64"
  >
    <div>
      <div className="relative mx-2 mt-2 h-64 overflow-hidden rounded-xl">
        <img
          src={movie1.Poster}
          alt={movie1.Title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold text-gray-900">{movie1.Title}</p>
          <p className="font-medium text-gray-700">{movie1.Year}</p>
        </div>
        <p className="text-sm text-gray-600">{movie1.Plot}</p>
      </div>
    </div>
    <div className="p-3 pt-0 flex justify-between">
      <button
        className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-xs font-bold uppercase text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-1"
        type="button"
        onClick={() => handleViewDetails(movie1.imdbID)}
      >
        View Details
      </button>
      <button
  className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-xs font-bold uppercase text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-1"
  type="button"
  onClick={() => handleAddToPlaylist1(movie1)}
>
  Add to Playlist
</button>

    </div>
  </div>
))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Playlist</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://fasal-sece.vercel.app/publicplaylist/${user.profile.email}`
                );
                toast.success("Link copied to clipboard!");
              }}
            >
              Make a Shareable Link
            </button>
          </div>
          <div className="movies grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  {playlistMovies.length > 0 ? (
    playlistMovies.map((movie) => (
      <div
        key={movie.imdbID}
        className="relative flex flex-col justify-between rounded-xl bg-white shadow-md transform transition-transform duration-500 hover:scale-105 w-64"
      >
        <div>
          <div className="relative mx-2 mt-2 h-64 overflow-hidden rounded-xl">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-gray-900">{movie.Title}</p>
              <p className="font-medium text-gray-700">{movie.Year}</p>
            </div>
            <p className="text-sm text-gray-600">{movie.Plot}</p>
          </div>
        </div>
        <div className="p-3 pt-0 flex justify-end">
          <button
            className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-xs font-bold uppercase text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-1"
            type="button"
            onClick={() => handleViewDetails(movie.imdbID)}
          >
            View Details
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>Please make a playlist to see your playlist</p>
  )}
</div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Popular Movies
          </h2>
          <div className="movies grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
  <div
    key={movie.imdbID}
    className="relative flex flex-col justify-between rounded-xl bg-white shadow-md transform transition-transform duration-500 hover:scale-105 w-64"
  >
    <div>
      <div className="relative mx-2 mt-2 h-64 overflow-hidden rounded-xl">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold text-gray-900">{movie.Title}</p>
          <p className="font-medium text-gray-700">{movie.Year}</p>
        </div>
        <p className="text-sm text-gray-600">{movie.Plot}</p>
      </div>
    </div>
    <div className="p-3 pt-0 flex justify-between">
      <button
        className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-xs font-bold uppercase text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-1"
        type="button"
        onClick={() => handleViewDetails(movie.imdbID)}
      >
        View Details
      </button>
      <button
        className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-xs font-bold uppercase text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-1"
        type="button"
        onClick={() => handleAddToPlaylist(movie)}
      >
        Add to Playlist
      </button>
    </div>
  </div>
))}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieList;
