import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PublicPlaylist = () => {
  const { mailid } = useParams(); // Extract the mailid from the route parameter
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://fasal-assignment-server-mu.vercel.app/api/movieLists/${mailid}`);
        setPublicPlaylists(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [mailid]); // Re-run the effect if mailid changes

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Here is the Playlist of your Friend</h1>
      <h2 className="text-xl font-semibold mb-2">{mailid}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicPlaylists.map(publicPlaylist => (
          <div key={publicPlaylist._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{publicPlaylist.name}</h2>
              <div className="space-y-4">
                {publicPlaylist.movies.map(movie => (
                  <div key={movie.imdbID} className="flex">
                    <img src={movie.Poster} alt={movie.Title} className="w-24 h-36 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="text-lg font-bold">{movie.Title} ({movie.Year})</h3>
                      <p className="text-gray-600">{movie.Genre}</p>
                      <p className="text-gray-800 mt-2">{movie.Plot}</p>
                      <p className="text-gray-600 mt-2"><strong>Director:</strong> {movie.Director}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicPlaylist;
