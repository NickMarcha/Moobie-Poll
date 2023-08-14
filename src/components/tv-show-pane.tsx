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
  addToPollHandler: (tvShow: TvShow) => void;
};

const TvShowPane = ({
  tvShow,
  lastWatchedData,
  addToPollHandler,
}: tvtShowPaneProps) => {
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
  const Buttons = () => {
    return (
      <div className="flex flex-1 grow-0">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() =>
            window.open(
              "https://www.themoviedb.org/tv/" + tvShow.id,
              tvShow.name
            )
          }
        >
          TMDB
        </button>
        <LastWatchedButton tvShow={tvShow} lastWatchedData={lastWatchedData} />
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => addToPollHandler(tvShow)}
        >
          Add to Poll
        </button>
      </div>
    );
  };

  const PosterAndButtons = () => {
    return (
      <div
        id="PosterAndButton"
        className="flex flex-col flex-initial  justify-between items-stretch"
      >
        <img
          className=" shrink basis-auto self-auto max-h-96"
          src={
            tvShow.poster_path === null
              ? PlaceHolder
              : `${baseImgURL + tvShow.poster_path}`
          }
          alt={tvShow.name}
        />
        <div className="grow-0 shrink basis-auto self-auto">
          <Buttons />
        </div>
      </div>
    );
  };

  const TMDBDetails = () => {
    return (
      <>
        <h1>TMDB Details</h1>
        <div className="flex-1">
          <ul>
            <li>popularity:{tvShow.popularity}</li>
            <li>average vote:{tvShow.vote_average}</li>
            <li>vote count:{tvShow.vote_count}</li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <div
      id="panel"
      className="flex m-5 border-2 justify-stretch border-rose-500 h-[420px] grow-0"
    >
      {/* Poster */}
      <PosterAndButtons />

      {/* Content */}

      <div className="flex-1 flex flex-col justify-stretch ml-2 ">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            {/* Title */}
            <div className="flex-auto inline-flex grow-0">
              <h1
                title={"Original Name: " + tvShow.original_name}
                className="text-2xl"
              >
                {tvShow.name}
              </h1>
              <h1
                title={"First Air Date: " + tvShow.first_air_date}
                className="text-xl ml-2 bg-slate-700 rounded-xl p-1 h-8"
              >
                {tvShow.first_air_date.split("-")[0]}
              </h1>
              <AdultIcon adult={tvShow.adult} />
            </div>
            <span>
              {tvShow.genre_ids?.map((genre, index) => (
                <span>
                  {(index > 0 ? ", " : "") +
                    tvShowGenreList.find(({ id, name }) => {
                      return genre === id;
                    })?.name}
                </span>
              ))}
            </span>
            <span> Original Language: {tvShow.original_language}</span>
            <span>
              {" "}
              Original Country(s):{" "}
              {tvShow.origin_country.map((country, index) => {
                if (index > 0) return ", " + country;
                return country;
              })}
            </span>
          </div>
          <div className="flex flex-col ml-2 border-2 border-gray-600 rounded-sm">
            <TMDBDetails />
          </div>
        </div>
        <p className="flex-1 overflow-auto shrink mr-2 p-4 bg-slate-800 rounded-3xl">
          {tvShow.overview}
        </p>
      </div>
    </div>
  );
};

export default TvShowPane;
