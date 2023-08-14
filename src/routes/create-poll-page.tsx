import React, { useEffect } from "react";
import axios from "axios";
import MoviePane from "../components/movie-pane";
import TvShowPane from "../components/tv-show-pane";
import Movie from "../types/Movie";
import TvShow from "../types/TvShow";
import LastWatchedEntry from "../types/LastWatchedEntry";
import TMDBAPI from "../scripts/TMDB";
import { getCookie } from "../scripts/cookieUtils";
import {
  FindYoutubeVideoId,
  getImdbIdFromUrl,
  getYoutubeVideoTitle,
} from "../scripts/util";
import CreatePoll, { AddToPollHandle } from "../components/create-poll";

const CreatePollPage = () => {
  const createPollRef = React.useRef<AddToPollHandle>(null);

  const [TMDBMovieOptions, setTMDBMovieOptions] = React.useState<Movie[]>([]);
  const [TMDBTVShowOptions, setTMDBTVShowOptions] = React.useState<TvShow[]>(
    []
  );

  const [youtubeTitle, setYoutubeTitle] = React.useState("");

  const URLToLastWatchedSheet =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_LmFyibmM16ZKvUfUNr4J_t_33YDhV3hzk-7vS4kUp7y14Hf6cwVMCDwVU-cjElurZcjWtm-j55R5/pub?gid=0&single=true&output=csv";
  const [lastWatchedData, setLastWatchedData] = React.useState([]);

  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const handleSearch = async () => {
    if (searchTerm.length < 3) {
      setTMDBMovieOptions([]);
      setTMDBTVShowOptions([]);
      setIsSearching(false);
    }
    const youtubeVideoId = FindYoutubeVideoId(searchTerm);
    const imdbId = getImdbIdFromUrl(searchTerm);
    if (youtubeVideoId) {
      setTMDBMovieOptions([]);
      setTMDBTVShowOptions([]);
      setIsSearching(false);
      const youtubeTitle = await getYoutubeVideoTitle(youtubeVideoId);
      if (youtubeTitle) {
        setYoutubeTitle(youtubeTitle);
      } else {
        setYoutubeTitle("No Title Found");
      }
    } else if (imdbId) {
      console.log(imdbId);
      const result = await TMDBAPI.searchByImdbID(imdbId);
      console.log(result);
      if (result["media_type"] === "tv") {
        setTMDBMovieOptions([]);
        setTMDBTVShowOptions([result]);
        setIsSearching(false);
      } else if (result["media_type"] === "movie") {
        setTMDBMovieOptions([result]);
        setTMDBTVShowOptions([]);
        setIsSearching(false);
      } else {
        setTMDBMovieOptions([]);
        setTMDBTVShowOptions([]);
        setIsSearching(false);
        console.log("Unrecognized media type");
      }
    } else {
      console.log("Options Fetched from API");
      setIsSearching(true);
      const moviesProomise = TMDBAPI.searchMoviesByTitle(searchTerm);
      const tvShowsPromise = TMDBAPI.searchTVShowsByTitle(searchTerm);
      const movies = await moviesProomise;
      const tvShows = await tvShowsPromise;
      setTMDBMovieOptions(movies);
      setTMDBTVShowOptions(tvShows);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    async function fetchWatchedData() {
      try {
        const response = await axios.get(URLToLastWatchedSheet);
        const lines = response.data.split("\n");
        //const headers = lines[0].split(',');
        const rows = lines.slice(2);

        const formattedData = rows.map((row: string) => {
          const values = row.split(",");
          const entry: LastWatchedEntry = {
            movieName: values[0],
            imdbURL: values[1],
            dateWatched: values[2].replace(/[\n\r]+/g, ""),
          };

          return entry;
        });
        setLastWatchedData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchWatchedData();
  }, []);

  function addToPoll(entry: string) {
    if (createPollRef.current) {
      createPollRef.current.addToPoll(entry);
    }
  }
  function addToPollMovie(movie: Movie) {
    addToPoll(`Movie: ${movie.title} (${movie.release_date.split("-")[0]})`);
  }
  function addToPollTVShow(tvShow: TvShow) {
    addToPoll(
      `TV Show: ${tvShow.name} (${tvShow.first_air_date.split("-")[0]})`
    );
  }
  function addToPollYoutube(youtubeTitle: string) {
    addToPoll(`Youtube: ${youtubeTitle}`);
  }
  function addRawToPoll() {
    addToPoll(searchTerm);
  }

  return (
    <>
      {!getCookie("TMDB_API_KEY") && (
        <div>
          <h1 className="text-4xl">Please set your TMDB API Key</h1>
        </div>
      )}

      <CreatePoll ref={createPollRef}></CreatePoll>

      {getCookie("TMDB_API_KEY") && (
        <div>
          <h1 className="text-4xl">Search for a Movie or TV Show</h1>

          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm text-black font-bold focus:outline-none"
            type="search"
            name="search"
            value={searchTerm}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && handleSearch();
            }}
          />
          <button
            disabled={isSearching}
            onClick={handleSearch}
            type="button"
            className="text-white bg-blue-700 disabled:cursor-not-allowed hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            {isSearching && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {isSearching ? "Loading..." : "Search"}
          </button>
          <button
            disabled={searchTerm.length === 0 || isSearching}
            onClick={addRawToPoll}
            type="button"
            title="Adds whatever is in the search box directly to the poll"
            className="text-white bg-blue-700 disabled:bg-[#334155] disabled:cursor-not-allowed hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            Add Raw to Poll
          </button>

          {(TMDBMovieOptions.length > 0 || TMDBTVShowOptions.length > 0) && (
            <div className="flex">
              <div className="flex-1 w-1/2">
                <h1 className="text-4xl">Movies</h1>
                {TMDBMovieOptions.map((option, key) => (
                  <MoviePane
                    key={key}
                    movie={option}
                    lastWatchedData={lastWatchedData}
                    addToPollHandler={addToPollMovie}
                  />
                ))}
              </div>
              <div className="flex-1 w-1/2">
                <h1 className="text-4xl">TV Shows</h1>
                {TMDBTVShowOptions.map((option, key) => (
                  <TvShowPane
                    key={key}
                    tvShow={option}
                    lastWatchedData={lastWatchedData}
                    addToPollHandler={addToPollTVShow}
                  />
                ))}
              </div>
            </div>
          )}

          {FindYoutubeVideoId(searchTerm) !== null && (
            <>
              <h1 className="text-4xl">Youtube Video: {youtubeTitle}</h1>
              <div className="flex-auto">
                <iframe
                  title="youtubeEmbed"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${FindYoutubeVideoId(
                    searchTerm
                  )}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => addToPollYoutube(youtubeTitle)}
              >
                Add to Poll
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CreatePollPage;
