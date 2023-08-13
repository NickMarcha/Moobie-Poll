import TvShow from "../types/TvShow";
import LastWatchedEntry from "../types/LastWatchedEntry";
import LastWatchedButton from "./last-watched-button";
import AdultIcon from "./adult-icon";
import PlaceHolder from "../images/PlaceHolder.png";
import { useEffect, useState } from "react";
import TMDBAPI from "../scripts/TMDB";
type tvtShowPaneProps = {
  tvShow: TvShow;
  lastWatchedData: LastWatchedEntry[];
};

const TvShowPane = ({ tvShow, lastWatchedData }: tvtShowPaneProps) => {
  const [tvShowGenreList, setTvShowGenreList] = useState<
    { id: number; name: string }[]
  >([]);
  const baseImgURL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    async function getGenreList() {
      setTvShowGenreList(await TMDBAPI.tvShowGenresList());
    }
    getGenreList();
  }, []);

  return (
    <div className="flex m-5 border-2 border-rose-500">
      {tvShow.poster_path === null && (
        <img
          className="max-h-96 flex-auto"
          src={PlaceHolder}
          alt={tvShow.name}
        />
      )}
      {tvShow.poster_path !== null && (
        <img
          className="max-h-96 flex-auto"
          src={`${baseImgURL + tvShow.poster_path}`}
          alt={tvShow.name}
        />
      )}

      <div className="flex-auto">
        <div className="flex-inline">
          <h1
            title={"Original Name: " + tvShow.original_name}
            className="text-2xl"
          >
            {tvShow.name}
          </h1>
          <h1 className="text-xl">{tvShow.first_air_date}</h1>
          <AdultIcon adult={tvShow.adult} />
          {tvShow.genre_ids.map((genre, index) => (
            <span>
              {(index > 0 ? ", " : "") +
                tvShowGenreList.find(({ id, name }) => {
                  return genre === id;
                })?.name}
            </span>
          ))}
          <br />
          <span> Original Language: {tvShow.original_language}</span>
          <br />
          <span>
            {" "}
            Original Country(s):{" "}
            {tvShow.origin_country.map((country, index) => {
              if (index > 0) return ", " + country;
              return country;
            })}
          </span>
        </div>
        <p>{tvShow.overview}</p>
        <br></br>

        <br />
        <h1>TMDB Details</h1>
        <div className="">
          <ul>
            <li>popularity:{tvShow.popularity}</li>
            <li>average vote:{tvShow.vote_average}</li>
            <li>vote count:{tvShow.vote_count}</li>
          </ul>
        </div>

        <div className="flex">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              window.open(
                "https://www.themoviedb.org/tv/" + tvShow.id,
                tvShow.name
              )
            }
          >
            TMDB
          </button>
          <LastWatchedButton
            tvShow={tvShow}
            lastWatchedData={lastWatchedData}
          />
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Add to Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default TvShowPane;
