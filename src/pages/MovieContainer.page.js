import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { UserContext } from '../contexts/user.context';

function StarRating({ rating }) {
  if (typeof rating !== 'number' || rating < 0 || rating > 10) {
    console.error('Invalid rating value:', rating);
    return null;
  }

  // Adjust the rating to a 5-star scale
  const adjustedRating = rating / 2;

  const fullStars = Math.floor(adjustedRating);
  const halfStar = adjustedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars).fill().map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      )}
      {Array(emptyStars).fill().map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{rating}</p>
      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">10</p>
    </div>
  );
}

const MovieContainer = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  }

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=43c21e83&i=${imdbID}`);
        if (response.data.Response === "True") {
          setMovie(response.data);
        } else {
          setError(response.data.Error);
        }
      } catch (err) {
        setError('Failed to fetch movie details from the API');
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  const handleAddToPlaylist = async () => {
    try {
      await axios.post('https://fasal-assignment-server-mu.vercel.app/api/movieLists', {
        userId: user.profile.email,
        name: 'My Playlist',
        movies: [movie]
      });
      alert('Movie added to your playlist!');
    } catch (err) {
      console.error('Error adding movie to playlist:', err.message);
      alert('Failed to add movie to your playlist. Please try again.');
    }
  };

  if (error) {
    return <div className="movie-container"><p className="text-red-600">{error}</p></div>;
  }

  if (!movie) {
    return <div className="movie-container"><p>Loading...</p></div>;
  }

  return (
    <>
    <Button variant="contained" className="m-4 bg-blue-600 hover:bg-blue-700" onClick={goBack}>Go Back</Button> 
    <div className="movie-container flex flex-col md:flex-row bg-white rounded-lg overflow-hidden p-6 space-y-6 md:space-y-0 md:space-x-6">
             <div className="movie-poster flex-shrink-0">
        <img src={movie.Poster} alt={movie.Title} className="w-full h-auto md:w-96 object-cover rounded-lg"/>
      </div>
      <div className="movie-details flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">{movie.Title}</h1>
          <p className="mb-2"><strong>Year:</strong> {movie.Year}</p>
          <p className="mb-2"><strong>Genre:</strong> {movie.Genre}</p>
          <p className="mb-2"><strong>Director:</strong> {movie.Director}</p>
          <p className="mb-2"><strong>Plot:</strong> {movie.Plot}</p>
          <StarRating rating={Number(movie.imdbRating)} />
                  </div>
        <div className="movie-options mt-6">
          <Button variant="contained" onClick={handleAddToPlaylist} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to My Playlist
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MovieContainer;
