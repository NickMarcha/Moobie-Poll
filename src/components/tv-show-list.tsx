import LastWatchedEntry from "../types/LastWatchedEntry";
import TvShow from "../types/TvShow";
import TvShowPane from "./tv-show-pane";

type TvShowListProps = {
  TMDBTVShowOptions: TvShow[];
  lastWatchedData: LastWatchedEntry[];
  addToPollHandler: (tvShow: TvShow) => void;
};
const TvShowList: React.FC<TvShowListProps> = ({
  TMDBTVShowOptions,
  lastWatchedData,
  addToPollHandler,
}) => {
  return (
    <div className="flex-1 w-1/2">
      <h1 className="text-4xl text-center mt-2	text-gray-300 font-bold">
        TV Shows
      </h1>
      {TMDBTVShowOptions.map((option, key) => (
        <TvShowPane
          key={key}
          tvShow={option}
          lastWatchedData={lastWatchedData}
          addToPollHandler={addToPollHandler}
        />
      ))}
    </div>
  );
};

export default TvShowList;
