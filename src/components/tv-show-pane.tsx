import TvShow from "../types/TvShow";
import LastWatchedEntry from "../types/LastWatchedEntry";
import LastWatchedButton from "./last-watched-button";
type tvtShowPaneProps = {
  tvShow: TvShow;
  lastWatchedData: LastWatchedEntry[];
};

const TvShowPane = ({ tvShow, lastWatchedData }: tvtShowPaneProps) => {
  return (
    <div className="flex">
      <img
        className="max-h-96 flex-auto"
        src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
        alt={tvShow.name}
      />
      <div className="flex-auto">
        <div className="flex-inline">
          <h1 className="text-2xl">{tvShow.name}</h1>
          <h1 className="text-xl">{tvShow.first_air_date}</h1>
        </div>
        <p>{tvShow.overview}</p>
        <br></br>
        <p>{JSON.stringify(tvShow)}</p>
        <LastWatchedButton tvShow={tvShow} lastWatchedData={lastWatchedData} />
      </div>
    </div>
  );
};

export default TvShowPane;
