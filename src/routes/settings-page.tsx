import { useCookies } from "react-cookie";

const SettingsPage = () => {
  const [TMDB_API_KEY, setTMDB_API_KEY] = useCookies(["TMDB_API_KEY"]);
  const [StrawPoll_API_KEY, setStrawPoll_API_KEY] = useCookies([
    "StrawPoll_API_KEY",
  ]);

  return (
    <div>
      <form>
        <h1 className="text-3xl">Settings Page</h1>

        <h2 className="text-2xl">
          {" "}
          <a href="https://www.themoviedb.org/signup">TMDB API Key</a>
        </h2>
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={TMDB_API_KEY.TMDB_API_KEY}
          placeholder="TMDB API Key"
          autoComplete="on"
          onChange={(e) => setTMDB_API_KEY("TMDB_API_KEY", e.target.value)}
        />

        <h2 className="text-2xl">StrawPoll API Key</h2>

        <input
          type="password"
          autoComplete="on"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={StrawPoll_API_KEY.StrawPoll_API_KEY}
          placeholder="StrawPoll API Key"
          onChange={(e) =>
            setStrawPoll_API_KEY("StrawPoll_API_KEY", e.target.value)
          }
        />
      </form>
    </div>
  );
};

export default SettingsPage;
