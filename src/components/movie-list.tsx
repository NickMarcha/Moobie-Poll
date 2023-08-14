import LastWatchedEntry from "../types/LastWatchedEntry";
import Movie from "../types/Movie";
import MoviePane from "./movie-pane";

type MovieListProps = {
  TMDBMovieOptions: Movie[];
  lastWatchedData: LastWatchedEntry[];
  addToPollHandler: (movie: Movie) => void;
};
const MovieList: React.FC<MovieListProps> = ({
  TMDBMovieOptions,
  lastWatchedData,
  addToPollHandler,
}) => {
  return (
    <div className="flex-1 w-1/2">
      <h1 className="text-4xl text-center mt-2	text-gray-300 font-bold">
        Movies
      </h1>
      {TMDBMovieOptions.map((option, key) => (
        <MoviePane
          key={key}
          movie={option}
          lastWatchedData={lastWatchedData}
          addToPollHandler={addToPollHandler}
        />
      ))}
    </div>
  );
};

export default MovieList;
