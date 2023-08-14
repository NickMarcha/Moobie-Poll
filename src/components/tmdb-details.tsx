import Movie from "../types/Movie";
import TvShow from "../types/TvShow";
type TMDBDetailsProps = {
  movie?: Movie;
  tvShow?: TvShow;
};

const TMDBDetails: React.FC<TMDBDetailsProps> = ({ movie, tvShow }) => {
  const className = "border-2 border-gray-600 rounded-sm p-1 bg-blue-950";
  if (movie) {
    return (
      <div className={className}>
        <h1 className="font-semibold">TMDB Details</h1>

        <ul>
          <li>Popularity: {movie.popularity}</li>
          <li>Average Vote: {movie.vote_average}</li>
          <li>Vote Count: {movie.vote_count}</li>
        </ul>
      </div>
    );
  } else if (tvShow) {
    return (
      <div className={className}>
        <h1>TMDB Details</h1>

        <ul>
          <li>popularity:{tvShow.popularity}</li>
          <li>average vote:{tvShow.vote_average}</li>
          <li>vote count:{tvShow.vote_count}</li>
        </ul>
      </div>
    );
  } else {
    return <>unsupported Type</>;
  }
};

export default TMDBDetails;
