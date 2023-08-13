import React from "react";
import { useImperativeHandle } from "react";
import useArray from "../hooks/useArray";
import StrawPollAPI from "../scripts/StrawPollAPI";
import { sendToClip } from "../scripts/util";

type createPollProps = {};

export type AddToPollHandle = {
  addToPoll: (entry: string) => void;
};
const CreatePoll = React.forwardRef<AddToPollHandle, createPollProps>(
  (props, ref) => {
    //Happens so rarely that I don't want to make a new image for it
    //return <img title="adult:false" src={WidePeepoHHappy} alt="not adult" />;
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

    return (
      <div>
        <div className="flex flex-row">
          <h1 className="text-4xl">Create Poll</h1>
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
            className="bg-purple-500 hover:bg-purple-700  text-white font-bold py-1 px-2 rounded"
            onClick={createPoll}
          >
            Create Poll
          </button>
          <button
            disabled={pollID === ""}
            onClick={() => window.open(`https://strawpoll.com/${pollID}`)}
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
