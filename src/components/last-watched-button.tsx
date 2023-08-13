import { useEffect, useRef, useState } from "react";
import LastWatchedEntry from "../types/LastWatchedEntry";
import TvShow from "../types/TvShow";
import Movie from "../types/Movie";
import TMDBAPI from "../scripts/TMDB";
import Fuse from "fuse.js";
import * as levenshtein from "fast-levenshtein";

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
  const [imdbID, setImdbID] = useState<string>("");
  const [imdbURL, setImdbURL] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef && dialogRef.current) {
      const dialog = dialogRef.current;
      console.log("Adding event listeners");

      dialog.addEventListener("close", () => {
        setShowDialog(false);
      });
      dialog.addEventListener("cancel", () => {
        setShowDialog(false);
      });
      dialog.addEventListener("click", handleDialogClick);

      return () => {
        console.log("Removing event listeners");

        dialog.removeEventListener("close", () => {
          setShowDialog(false);
        });
        dialog.removeEventListener("cancel", () => {
          setShowDialog(false);
        });
        dialog.removeEventListener("click", handleDialogClick);
      };
    }
  }, [dialogRef]);

  useEffect(() => {
    if (showDialog) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  const handleClick = async () => {
    await getImdbID();
    setShowDialog(true);
  };

  const getImdbURL = (id: string) => {
    return "https://www.imdb.com/title/" + id + "/";
  };

  const handleDialogClick = (e: MouseEvent) => {
    const dialogElement = e.target as HTMLDialogElement;
    if (!dialogElement) {
      return;
    }

    const dialogDimensions = dialogElement.getBoundingClientRect();
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

      setImdbID(newImdbID);
      setImdbURL(getImdbURL(newImdbID));
      return;
    }

    if (movie) {
      const movieID = movie.id;
      const newImdbID: any = await TMDBAPI.getMovieImdbID(movieID);

      setImdbID(newImdbID);
      setImdbURL(getImdbURL(newImdbID));
      return;
    }

    console.log("No movie or tv show provided");
  };

  function searchMovies(
    searchTerm: string,
    imdbArray: LastWatchedEntry[]
  ): LastWatchedEntry[] {
    const options = {
      keys: ["movieName"],
      threshold: 0.4,
      includeScore: true,
    };

    if (!showDialog) {
      return [];
    }
    const fuse = new Fuse(imdbArray, options);
    const results = fuse.search(searchTerm);

    const matchedMovies = results
      .filter(
        (result) => result.score !== null && result.score && result.score < 1.0
      )
      .map((result) => result.item);

    const levenshteinMatches = imdbArray.filter((entry) => {
      const normalizedSearch = searchTerm.toLowerCase();
      const normalizedTitle = entry.movieName.toLowerCase();
      const distance = levenshtein.get(normalizedSearch, normalizedTitle);

      // You can adjust the threshold based on your preference
      return distance <= normalizedSearch.length * 0.3;
    });

    // Combine the results from both approaches
    const combinedResults = [...matchedMovies, ...levenshteinMatches];
    const cleanedResults = combinedResults.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.dateWatched === value.dateWatched)
    );

    return cleanedResults;
  }
  function getName() {
    if (tvShow) {
      return tvShow.name;
    }
    if (movie) {
      return movie.title;
    }
    return "No movie or tv show provided";
  }

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Last Watched
      </button>
      <dialog
        ref={dialogRef}
        // open={showDialog} Should not be used directly https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
        className="z-10 mt-2 text-white p-5 bg-gray-900 rounded-lg backdrop:bg-opacity-30 backdrop:bg-blue-500"
      >
        <div>
          <div className="flex flex-row justify-between">
            <h1 className="text-5xl">{tvShow ? tvShow.name : movie?.title}</h1>
            <div className="flex flex-row justify-between">
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  window.open(imdbURL, tvShow ? tvShow.name : movie?.title)
                }
              >
                IMDB
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
          <h1 className="text-3xl">Url Matches</h1>
          <table className="table-auto">
            <thead>
              <tr>
                <th className="text-3xl border px-4 py-2">Entry Name</th>
                <th className="text-3xl border px-4 py-2">TimeStamp</th>
              </tr>
            </thead>
            <tbody>
              {lastWatchedData
                .filter((entry, key) => entry.imdbURL === imdbURL)
                .map((entry) => (
                  <tr>
                    <td className="text-2xl border px-4 py-2">
                      {entry.movieName}
                    </td>
                    <td className="text-3xl border px-4 py-2">
                      {entry.dateWatched}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <h1 className="text-3xl">Possible Matches</h1>
          <table className="table-auto">
            <thead>
              <tr>
                <th className="text-3xl border px-4 py-2">Entry Name</th>
                <th className="text-3xl border px-4 py-2">IMDB</th>
                <th className="text-3xl border px-4 py-2">TimeStamp</th>
              </tr>
            </thead>
            <tbody>
              {searchMovies(getName(), lastWatchedData).map((entry, key) => (
                <tr key={key}>
                  <td className="text-2xl border px-4 py-2">
                    {entry.movieName}
                  </td>
                  <td className="text-2xl border px-4 py-2">
                    <button
                      className={
                        imdbURL === entry.imdbURL
                          ? "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                          : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      }
                      title={
                        imdbURL === entry.imdbURL
                          ? "Same as above"
                          : "Different IMDB link"
                      }
                      onClick={() =>
                        window.open(
                          entry.imdbURL,
                          tvShow ? tvShow.name : movie?.title
                        )
                      }
                    >
                      IMDB
                    </button>
                  </td>
                  <td className="text-3xl border px-4 py-2">
                    {entry.dateWatched}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>
    </div>
  );
};

export default LastWatchedButton;
