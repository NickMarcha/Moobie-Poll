import React from "react";
import Movie from "../types/Movie";
import LastWatchedEntry from "../types/LastWatchedEntry";
import LastWatchedButton from "./last-watched-button";
type moviePaneProps = {
  movie: Movie;
  lastWatchedData: LastWatchedEntry[];
};

const MoviePane = ({ movie, lastWatchedData }: moviePaneProps) => {
  return (
    <div className="flex">
      <img
        className="max-h-96"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="flex-auto">
        <div className="flex-inline">
          <h1 className="text-2xl">{movie.title}</h1>
          <h1 className="text-xl">{movie.release_date}</h1>
        </div>
        <p>{movie.overview}</p>
        <br></br>
        <p>{JSON.stringify(movie)}</p>
        <LastWatchedButton movie={movie} lastWatchedData={lastWatchedData} />
      </div>
    </div>
  );
};

export default MoviePane;
