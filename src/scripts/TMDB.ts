import axios from "axios";
import Movie from "../types/Movie";
import TvShow from "../types/TvShow";
import { getCookie } from "./cookieUtils";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

class TMDBAPI {
  private static instance: TMDBAPI;
  private movieGenres: { id: number; name: string }[] = [];
  private tvShowGenres: { id: number; name: string }[] = [];

  private promises: Promise<any>[] = [];
  private constructor() {}

  static async getInstance(): Promise<TMDBAPI> {
    if (TMDBAPI.instance) {
      await Promise.all(this.instance.promises);
    }

    if (!TMDBAPI.instance) {
      TMDBAPI.instance = new TMDBAPI();
      const moviePromise = this.getMovieGenres();
      const tvShowPromise = this.getTvShowGenres();

      this.instance.promises.push(moviePromise);
      this.instance.promises.push(tvShowPromise);

      TMDBAPI.instance.movieGenres = await moviePromise;
      TMDBAPI.instance.tvShowGenres = await tvShowPromise;
    }

    return TMDBAPI.instance;
  }

  static async searchMoviesByTitle(title: string): Promise<Movie[]> {
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

  static async searchTVShowsByTitle(title: string): Promise<TvShow[]> {
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

  static async getMovieDetails(movieId: number): Promise<any | null> {
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

  private static async getMovieGenres() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: {
          api_key: getCookie("TMDB_API_KEY"),
        },
      });

      return response.data.genres;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      return [];
    }
  }
  private static async getTvShowGenres() {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
        params: {
          api_key: getCookie("TMDB_API_KEY"),
        },
      });

      return response.data.genres;
    } catch (error) {
      console.error("Error fetching tv show genres:", error);
      return [];
    }
  }

  static async getTVShowDetails(tvShowId: number): Promise<any | null> {
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
  static async getTVShowImdbID(tvShowid: number) {
    return (await TMDBAPI.getTVShowDetails(tvShowid))?.imdb_id;
  }
  static async getMovieImdbID(movieId: number) {
    return (await TMDBAPI.getMovieDetails(movieId))?.imdb_id;
  }

  static async movieGenresList() {
    return (await this.getInstance()).movieGenres;
  }

  static async tvShowGenresList() {
    return (await this.getInstance()).tvShowGenres;
  }
}

export default TMDBAPI;
