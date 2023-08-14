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
  addToPollHandler: (movie: Movie) => void;
};

const MoviePane = ({
  movie,
  lastWatchedData,
  addToPollHandler,
}: moviePaneProps) => {
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

  const Buttons = () => {
    return (
      <div className="flex flex-1 grow-0">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
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
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => addToPollHandler(movie)}
        >
          Add to Poll
        </button>
      </div>
    );
  };

  const PosterAndButtons = () => {
    return (
      <div
        id="PosterAndButton"
        className="flex flex-col flex-initial  justify-between items-stretch"
      >
        <img
          className=" shrink basis-auto self-auto max-h-96"
          src={
            movie.poster_path === null
              ? PlaceHolder
              : `${baseImgURL + movie.poster_path}`
          }
          alt={movie.title}
        />
        <div className="grow-0 shrink basis-auto self-auto">
          <Buttons />
        </div>
      </div>
    );
  };

  const TMDBDetails = () => {
    return (
      <div className="border-2 border-gray-600 rounded-sm p-1">
        <h1>TMDB Details</h1>

        <ul>
          <li>popularity:{movie.popularity}</li>
          <li>average vote:{movie.vote_average}</li>
          <li>vote count:{movie.vote_count}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="flex m-5 border-2 justify-stretch border-rose-500 h-[420px] grow-0">
      {/* Poster */}
      <PosterAndButtons />
      {/* Content */}

      <div className="flex-1 flex flex-col justify-stretch ml-2 ">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            {/* Title */}
            <div className="flex-auto inline-flex grow-0 mt-1 text-gray-300 font-semibold">
              <h1
                title={"Original Title: " + movie.original_title}
                className="text-2xl"
              >
                {movie.title}
              </h1>
              <h1
                title={"First Air Date: " + movie.release_date}
                className="text-xl ml-2 bg-slate-700 rounded-xl p-1 h-8"
              >
                {movie.release_date.split("-")[0]}
              </h1>
              <AdultIcon adult={movie.adult} />
            </div>
            <span>
              {movie.genre_ids?.map((genre, index) => (
                <span key={index}>
                  {(index > 0 ? ", " : "") +
                    movieGenreList.find(({ id, name }) => {
                      return genre === id;
                    })?.name}
                </span>
              ))}
            </span>
            <span> Original Language: {movie.original_language}</span>
          </div>
          <div className="flex flex-col ml-2 ">
            <TMDBDetails />
          </div>
        </div>
        <p className="flex-1 overflow-auto shrink mr-2 p-4 bg-slate-800 rounded-3xl">
          {movie.overview}
        </p>
      </div>
    </div>
  );
};

export default MoviePane;
