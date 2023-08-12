import axios from "axios";
import Movie from "../types/Movie";
import TvShow from "../types/TvShow";
import { getCookie } from "./cookieUtils";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function searchMoviesByTitle(title: string): Promise<Movie[]> {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: getCookie("TMDB_API_KEY"),
        query: title,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function searchTVShowsByTitle(title: string): Promise<TvShow[]> {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: getCookie("TMDB_API_KEY"),
        query: title,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function getMovieDetails(movieId: number): Promise<any | null> {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/external_ids`,
      {
        params: {
          api_key: getCookie("TMDB_API_KEY"),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
async function getTVShowDetails(tvShowId: number): Promise<any | null> {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/tv/${tvShowId}/external_ids`,
      {
        params: {
          api_key: getCookie("TMDB_API_KEY"),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching tv show details:", error);
    return null;
  }
}
async function getTVShowImdbID(tvShowid: number) {
  return (await getTVShowDetails(tvShowid))?.imdb_id;
}
async function getMovieImdbID(movieId: number) {
  return (await getMovieDetails(movieId))?.imdb_id;
}

const TMDBAPI = {
  searchMoviesByTitle,
  searchTVShowsByTitle,
  getTVShowImdbID,
  getMovieImdbID,
};

export default TMDBAPI;
