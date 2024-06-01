# Movie Library Web Application

This is a movie library web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to sign up, sign in, search for movies using the OMDB API, create lists of movies, and share those lists either publicly or privately.

## Features

1. **User Authentication:** Users can sign up or sign in to access the application.
2. **Movie Search:** Users can search for movies using the OMDB API and view movie details.
3. **Create Lists:** Users can create lists of movies similar to playlists on YouTube.
4. **Public and Private Lists:** Lists can be either public (accessible via a shareable link) or private (only visible to the creator).
5. **Nice Layout:** The search and list pages have a visually appealing layout inspired by other websites/applications.

## Tech Stack

- **Frontend:** React.js, Material-UI, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **API:** OMDB API for movie search

## Explaination

1. I use authentication by configuring the email/password authentication provider in App Service in MongoDB.
2. I use a combination of MUI and Tailwind for styling.
3. Users can login and search for a particular movie. On the homepage, popular movies are listed. Users can also add movies to their playlist and generate a sharable link.
4. For the movie database, I used OMDB.
5. Due to my end semester exam, I created it within 3 hours. Any suggestions to improve my assessment are appreciated.


## Deployment

The application is deployed online using [Vercel](https://vercel.com/) for the frontend and backend.


## Credits

This project was created by me to submit fasal company pre assigment. Special thanks to [OMDB](https://www.omdbapi.com/) for providing the movie database API.
