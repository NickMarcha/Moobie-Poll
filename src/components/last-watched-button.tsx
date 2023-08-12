import React, { useEffect, useRef, useState } from "react";
import LastWatchedEntry from "../types/LastWatchedEntry";
import TvShow from "../types/TvShow";
import Movie from "../types/Movie";
import TMDBAPI from "../scripts/TMDB";

type LastWatchedProps = {
  tvShow?: TvShow;
  movie?: Movie;
  lastWatchedData: LastWatchedEntry[];
};

const LastWatchedButton = ({
  tvShow,
  movie,
  lastWatchedData,
}: LastWatchedProps) => {
  //const [imdbID, setImdbID] = React.useState<string>("");
  const [imdbID, setImdb] = useState<string>("");
  const [imdbURL, setImdbURL] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleClick = async () => {
    await getImdbID();
    setShowDialog(true);
  };

  const getImdbURL = (id: string) => {
    return "https://www.imdb.com/title/" + id + "/";
  };

  const handleDialogClick: React.MouseEventHandler<HTMLDialogElement> = (e) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      !dialogDimensions ||
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setShowDialog(false);
    }
  };

  const getImdbID = async () => {
    if (tvShow) {
      const tvShowID = tvShow.id;
      const newImdbID: any = await TMDBAPI.getTVShowImdbID(tvShowID);
      console.log(newImdbID);

      setImdb(newImdbID);
      setImdbURL(getImdbURL(newImdbID));
      return;
    }

    if (movie) {
      const movieID = movie.id;
      const newImdbID: any = await TMDBAPI.getMovieImdbID(movieID);
      console.log(newImdbID);
      setImdb(newImdbID);
      setImdbURL(getImdbURL(newImdbID));
      return;
    }

    console.log("No movie or tv show provided");
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Click me
      </button>
      <dialog
        onClick={handleDialogClick}
        open={showDialog}
        className="z-10 mt-2 bg-green-900 rounded-lg backdrop:bg-opacity-30 backdrop:bg-blue-500"
      >
        <div>
          <h1>
            <a href={imdbURL}>
              IMDB{imdbID} link{imdbURL}
            </a>
          </h1>
          {lastWatchedData
            .filter((entry, key) => entry.imdbURL === imdbURL)
            .map((entry) => (
              <div>
                <h1>{entry.dateWatched}</h1>
              </div>
            ))}
        </div>
      </dialog>
    </div>
  );
};

export default LastWatchedButton;
