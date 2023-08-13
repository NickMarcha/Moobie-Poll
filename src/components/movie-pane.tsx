import Movie from "../types/Movie";
import LastWatchedEntry from "../types/LastWatchedEntry";
import LastWatchedButton from "./last-watched-button";
import AdultIcon from "./adult-icon";
import TMDBAPI from "../scripts/TMDB";
import { useEffect, useState } from "react";
import PlaceHolder from "../images/PlaceHolder.png";

type moviePaneProps = {
  movie: Movie;
  lastWatchedData: LastWatchedEntry[];
};

const MoviePane = ({ movie, lastWatchedData }: moviePaneProps) => {
  const [movieGenreList, setMovieGenreList] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    async function getGenreList() {
      setMovieGenreList(await TMDBAPI.movieGenresList());
    }
    getGenreList();
  }, []);

  const baseImgURL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="flex m-5 border-2 border-rose-500">
      {movie.poster_path === null && (
        <img
          className="max-h-96 flex-initial"
          src={PlaceHolder}
          alt={movie.title}
        />
      )}
      {movie.poster_path !== null && (
        <img
          className="max-h-96 flex-initial"
          src={`${baseImgURL + movie.poster_path}`}
          alt={movie.title}
        />
      )}
      <div
        style={
          {
            "--image-url": `url(${baseImgURL + movie.backdrop_path})`,
          } as React.CSSProperties
        }
        className={`flex-1`}
      >
        <div className="flex-inline">
          <h1
            title={"Original Title: " + movie.original_title}
            className="text-2xl"
          >
            {movie.title}
          </h1>
          <h1 className="text-xl">{movie.release_date}</h1>
          <AdultIcon adult={movie.adult} />

          {movie.genre_ids.map((genre, index) => (
            <span>
              {(index > 0 ? ", " : "") +
                movieGenreList.find(({ id, name }) => {
                  return genre === id;
                })?.name}
            </span>
          ))}
          <br />
          <span> Original Language: {movie.original_language}</span>
        </div>

        <p>{movie.overview}</p>

        <br />
        <h1>TMDB Details</h1>
        <div className="">
          <ul>
            <li>popularity:{movie.popularity}</li>
            <li>average vote:{movie.vote_average}</li>
            <li>vote count:{movie.vote_count}</li>
          </ul>
        </div>

        <div className="flex">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              window.open(
                "https://www.themoviedb.org/movie/" + movie.id,
                movie.title
              )
            }
          >
            TMDB
          </button>
          <LastWatchedButton movie={movie} lastWatchedData={lastWatchedData} />
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Add to Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePane;
