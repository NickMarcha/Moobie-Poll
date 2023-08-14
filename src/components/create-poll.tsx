import React, { useEffect, useRef, useState } from "react";
import { useImperativeHandle } from "react";
import useArray from "../hooks/useArray";
import StrawPollAPI from "../scripts/StrawPollAPI";
import { sendToClip } from "../scripts/util";
import { useCookies } from "react-cookie";
import CopyIcon from "../icons/copy-icon";

type createPollProps = {};

export type AddToPollHandle = {
  addToPoll: (entry: string) => void;
};
const CreatePoll = React.forwardRef<AddToPollHandle, createPollProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      addToPoll: (entry: string) => {
        push(entry);
      },
    }));
    const { array, set, push, filter, update, remove, clear } =
      useArray<string>([]);
    const [pollID, setPollID] = React.useState<string>("");
    const [countDownDate, setCountDownDate] = React.useState(new Date());
    const [deadline, setDeadline] = React.useState<number | "">(180);

    async function createPoll() {
      if (deadline === "") {
        alert("Please enter a deadline");
        return;
      }
      const newPollID = await StrawPollAPI.createPoll(
        deadline,
        array.map((entry, index) => ({ id: index.toString(), name: entry }))
      );
      const newCountdownDate = new Date(Date.now() + deadline * 1000);
      setCountDownDate(newCountdownDate);
      setPollID(newPollID);
    }
    const [StrawPoll_API_KEY] = useCookies(["StrawPoll_API_KEY"]);
    const [StrawPollisValid, setStrawPollisValid] = useState(false);

    const StrawPoll_APIPromise = useRef<null | Promise<boolean>>(null);
    useEffect(() => {
      async function checkIfValidAPIKey(key: string) {
        const checkPromise = StrawPollAPI.checkIfValidAPIKey(key);
        StrawPoll_APIPromise.current = checkPromise;
        const bResult = await checkPromise;
        if (StrawPoll_APIPromise.current === checkPromise) {
          setStrawPollisValid(bResult);
        } else {
        }
      }

      checkIfValidAPIKey(StrawPoll_API_KEY.StrawPoll_API_KEY);
    }, [StrawPoll_API_KEY]);

    return (
      <div>
        <div className="flex flex-row">
          <h1 className="text-4xl">
            Create Poll
            {StrawPollisValid ? (
              ""
            ) : (
              <span
                className="ml-4 text-xl bg-gray-500 text-white font-bold rounded"
                title="You won't be able to see results early if you don't have a valid API key"
              >
                {" "}
                (as guest)
              </span>
            )}
          </h1>
        </div>

        <div className="flex flex-col m-5">
          {array.map((entry, index) => (
            <div className="flex flex-row m-1" key={index}>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => remove(index)}
              >
                Remove
              </button>
              <h1 className="text-2xl">{entry}</h1>
            </div>
          ))}
        </div>
        <div className="flex flex-row ml-4">
          <button
            disabled={array.length < 1}
            title="Copy all entries to clipboard"
            className="bg-purple-500 disabled:bg-[#334155] disabled:cursor-not-allowed hover:bg-purple-700  text-white font-bold py-1 px-2 rounded"
            onClick={() => {
              const value = array.flatMap((entry) => entry + "\n").join("");
              sendToClip(value);
            }}
          >
            <CopyIcon />
          </button>

          <button
            disabled={array.length < 2}
            title="Create a Ranked Choice Straw Poll with all entries"
            className="bg-purple-500 disabled:bg-[#334155] disabled:cursor-not-allowed hover:bg-purple-700  text-white font-bold py-1 px-2 rounded"
            onClick={createPoll}
          >
            Create Poll
          </button>
          <button
            disabled={pollID === ""}
            onClick={() => window.open(`https://strawpoll.com/${pollID}`)}
            title="Open the poll in new tab, right click to copy link"
            onContextMenu={(event) => {
              event.preventDefault();
              sendToClip(`https://strawpoll.com/${pollID}`);
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded disabled:bg-[#334155] disabled:cursor-not-allowed"
          >
            Open Poll
          </button>
          <input
            className="border-2 border-gray-300 bg-white w-16 h-10 rounded-lg text-sm focus:outline-none"
            type="number"
            id="deadline"
            value={deadline}
            onChange={(e) => {
              if (e.target.value === "") {
                setDeadline("");
              } else {
                setDeadline(parseInt(e.target.value));
              }
            }}
          />
          <label htmlFor="deadline" className="text-2xl">
            Deadline in seconds
          </label>
        </div>
      </div>
    );
  }
);

export default CreatePoll;
