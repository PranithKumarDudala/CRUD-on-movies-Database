const express = require("express");
const app = express();

app.use(express.json());

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;

const dbPath = path.join(__dirname, "moviesData.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000");
    });
  } catch (e) {
    console.log("Error initializing the server");
  }
};

initializeDbAndServer();

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
        SELECT *
        FROM movie;
    `;

  let movies = await db.all(getMoviesQuery);

  response.send(movies);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;

  const { directorId, movieName, leadActor } = movieDetails;

  const postQuery = `
    INSERT INTO movie (director_id,movie_name,lead_actor)
    VALUES (${directorId},'${movieName}','${leadActor}');
  `;

  await db.run(postQuery);

  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const getMovieQuery = `
          SELECT *
          FROM movie
          WHERE
              movie_id = ${movieId};
      `;

  let movie = await db.get(getMovieQuery);

  response.send(movie);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const movieDetails = request.body;

  const { directorId, movieName, leadActor } = movieDetails;

  const updateQuery = `
        UPDATE movie
        SET
            director_id = ${directorId},
            movie_name = '${movieName}',
            lead_actor = '${leadActor}'
        WHERE 
            movie_id = ${movieId};
    `;

  await db.run(updateQuery);

  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const deleteQuery = `
        DELETE FROM
        movie
        WHERE
            movie_id = ${movieId};
    `;

  await db.run(deleteQuery);

  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
        SELECT *
        FROM director;
    `;

  let directors = await db.all(getDirectorsQuery);

  response.send(directors);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;

  const directorMoviesQuery = `
        SELECT *
        FROM movie
        WHERE
            director_id = ${directorId};
    `;

  let directorMovies = await db.all(directorMoviesQuery);

  response.send(directorMovies);
});

module.exports = app;
