import React, { useEffect } from "react";
import axios from "axios";
import MoviePane from "../components/movie-pane";
import TvShowPane from "../components/tv-show-pane";
import Movie from "../types/Movie";
import TvShow from "../types/TvShow";
import LastWatchedEntry from "../types/LastWatchedEntry";
import TMDBAPI from "../scripts/TMDB";
import { getCookie } from "../scripts/cookieUtils";

const CreatePollPage = () => {
  const [TMDBMovieOptions, setTMDBMovieOptions] = React.useState<Movie[]>([]);
  const [TMDBTVShowOptions, setTMDBTVShowOptions] = React.useState<TvShow[]>(
    []
  );

  const URLToLastWatchedSheet =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_LmFyibmM16ZKvUfUNr4J_t_33YDhV3hzk-7vS4kUp7y14Hf6cwVMCDwVU-cjElurZcjWtm-j55R5/pub?gid=0&single=true&output=csv";
  const [lastWatchedData, setLastWatchedData] = React.useState([]);

  const [isSearching, setIsSearching] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");

  const getDataFromAPI = async () => {
    console.log("Options Fetched from API");
    if (searchTerm.length < 3) {
      setTMDBMovieOptions([]);
      setTMDBTVShowOptions([]);
      setIsSearching(false);
    }
    setIsSearching(true);
    const moviesProomise = TMDBAPI.searchMoviesByTitle(searchTerm);
    const tvShowsPromise = TMDBAPI.searchTVShowsByTitle(searchTerm);
    const movies = await moviesProomise;
    const tvShows = await tvShowsPromise;
    setTMDBMovieOptions(movies);
    setTMDBTVShowOptions(tvShows);
    setIsSearching(false);
  };

  useEffect(() => {
    async function fetchData() {
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
        console.log("Last Watched Data:", formattedData);

        setLastWatchedData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {getCookie("TMDB_API_KEY") && (
        <div>
          {/* <h1 className="text-4xl">{TMDB_API_KEY.TMDB_API_KEY}</h1> */}
          <h1 className="">Is Searching: {isSearching ? "True" : "False"}</h1>
          <h1 className="">Search Term: {searchTerm}</h1>
          <h1 className="">Movies length: {TMDBMovieOptions.length}</h1>
          <h1 className="">TV Shows length: {TMDBTVShowOptions.length}</h1>

          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => getDataFromAPI()}
          />

          <div className="flex">
            <div className="flex-1 w-1/2">
              <h1 className="text-4xl">Movies</h1>
              {TMDBMovieOptions.map((option, key) => (
                <MoviePane
                  key={key}
                  movie={option}
                  lastWatchedData={lastWatchedData}
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
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePollPage;
