import axios from "axios";
import { getCookie } from "./cookieUtils";

let pollOps: any = {
  title: "What is up next?",
  media: {
    id: "poy9NPNwnJr",
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Against_Malaria_Foundation.svg/1200px-Against_Malaria_Foundation.svg.png",
    width: 640,
    height: 480,
  },
  poll_options: [],
  poll_config: {
    allow_comments: false,
    allow_indeterminate: false,
    allow_other_option: false,
    allow_vpn_users: false,
    deadline_at: 1690633920,
    duplication_checking: "ip",
    edit_vote_permissions: "nobody",
    force_appearance: null,
    hide_absolute_numbers: 0,
    hide_embed_vote_count: 0,
    hide_other_option_results: 0,
    hide_participants: false,
    hide_share_button: 1,
    hide_unavailable_options: 0,
    is_multiple_choice: true,
    is_private: true,
    layout: "drag",
    max_points: 2,
    multiple_choice_max: 0,
    multiple_choice_min: 0,
    number_of_winners: 1,
    open_at: null,
    randomize_options: true,
    require_captcha: 0,
    require_voter_account: 0,
    require_voter_names: false,
    results_visibility: "after_deadline",
    show_write_in_options: 0,
    strict_checking: 1,
    vote_type: "default",
    use_custom_design: true,
    custom_design_colors: {
      border: "#e5e7eb",
      box_bg: "#221F21",
      box_border: "#0192CE",
      box_border_top: "#0192CE",
      box_shadow: 1,

      hide_share_button: 0,
      id: 14097,

      input_highlight: "#CA2C46",

      is_premium: 0,

      name: "AM Theme",

      page_appearance: "auto",
      page_bg: "#9E9FA3",
      page_layout: "default",
      poll_layout: "box",
      primary_button_bg: "#CA2C46",

      primary_button_text: "#ffffff",

      text: "#FFFFFF",
      title: "#FFFFFF",

      use_custom_text: 0,
    },
  },

  type: "ranking", // API Documentatin is wrong, this is the correct value
};

const starPollClient = axios.create({
  baseURL: "https://api.strawpoll.com/v3",
  headers: {
    "X-API-Key": getCookie("StrawPoll_API_KEY"),
  },
});

const createPoll = async (
  deadlineSeconds: number,
  entries: { id: string; name: string }[]
) => {
  pollOps.poll_config.deadline_at = Math.floor(
    new Date(Date.now() + deadlineSeconds * 1000).getTime() / 1000
  );

  pollOps.poll_options = entries.map((entry) => {
    return {
      id: entry.id, //does nothing
      type: "text",

      value: entry.name,
    };
  });
  return await starPollClient.post("/polls", pollOps).then((res) => {
    const pollId = res.data.id;
    return pollId;
  });
};

const getPollResults = async (pollId: string) => {
  try {
    if (!pollId || pollId === "") {
      throw new Error("No pollId provided");
    }
    return (await starPollClient.get(`/polls/${pollId}/results`)).data;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const getPollResultsArray = async (pollId: string) => {
  try {
    return (await getPollResults(pollId)).poll_options as ResultEntry[];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export interface ResultEntry {
  description: string;
  has_votes: boolean;
  id: string;
  is_write_in: boolean;
  max_votes: number;
  position: number;
  type: string;
  uuid: string;
  value: string;
  vote_count: number;
  vote_points: number;
}
const StrawPollAPI = {
  getPollResultsArray,

  createPoll,
  pollOps,
};
export default StrawPollAPI;
