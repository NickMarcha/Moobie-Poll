import axios from "axios";

const FindYoutubeVideoId = (url: string) => {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
};

function sendToClip(str: string) {
  if (typeof navigator.clipboard == "undefined") {
    console.log("navigator.clipboard");
    var textArea = document.createElement("textarea");
    textArea.value = str;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log(msg);
    } catch (err) {
      console.warn("Was not possible to copy te text: ", err);
    }

    document.body.removeChild(textArea);
    return;
  }
  navigator.clipboard.writeText(str).then(
    function () {
      console.info(`successful!`);
    },
    function (err) {
      console.warn("unsuccessful!", err);
    }
  );
}
const flagCdnURLStart = "https://flagcdn.com/48x36/";
const flagCdnURLEnd = ".png";
const flagLookup: Map<string, string> = new Map<string, string>([
  ["england", "https://flagcdn.com/48x36/gb-eng.png"],
  ["wales", "https://flagcdn.com/48x36/gb-wls.png"],
  ["ww", "https://i.imgur.com/vJXGYCI.png"],
  ["scotland", "https://flagcdn.com/48x36/gb-sct.png"],
]);

function getFlagUrl(flagCode: string) {
  flagCode = flagCode.toLowerCase();
  if (flagLookup.has(flagCode)) {
    return flagLookup.get(flagCode);
  } else {
    return flagCdnURLStart + flagCode + flagCdnURLEnd;
  }
}

async function getYoutubeVideoTitle(videoId: string) {
  try {
    const response = await axios.get(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );

    const videoTitle = response.data.title;

    return videoTitle;
  } catch (error) {
    console.error("Error fetching video title:", error);
    return null;
  }
}

function getImdbIdFromUrl(url: string) {
  const imdbRegex =
    /^(?:http:\/\/|https:\/\/)?(?:www\.)?(?:imdb.com\/title\/)?(tt[0-9]*)/gim;
  const imdbId = Array.from(url.matchAll(imdbRegex));
  if (imdbId && imdbId[0] && imdbId[0][1]) {
    return imdbId[0][1];
  } else {
    return null;
  }
}

export {
  sendToClip,
  getFlagUrl,
  FindYoutubeVideoId,
  getYoutubeVideoTitle,
  getImdbIdFromUrl,
};
