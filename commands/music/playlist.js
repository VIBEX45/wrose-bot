let ytdl = require("ytdl-core");
let dude = require("yt-dude");
const plModel = require("../../model/playlist.model");
let {
  getSongInfo,
  getThumbnail,
  secondsCoverter,
} = require("../../utils/utility");
const Pagination = require("discord-paginationembed");
module.exports = {
  config: {
    name: "playlist",
    description: "Add a song to a specific playlist",
    usage: "playlist [playlist] [url]",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let messageFlags = args[0];
    if (messageFlags === "--add") {
      if (ytdl.validateURL(args[1])) {
        addSong(args[1]);
      } else if (!ytdl.validateURL(args[1])) {
        args.splice(args.indexOf("--add"), 1);
        let query = await dude.search(args.join(" "));
        let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
        addPlaylist(videoUrl);
      }
    }
    if (messageFlags === "--show") {
      let mention = message.mentions.users.first();
      let user = mention.id ? mention.id : message.author.id;

      let embeds = [];
      let songArr = await plModel.getPlaylist(user);
      for (const song of songArr) {
        await embeds.push(song.songName);
      }
      const playlist = new Pagination.FieldsEmbed()
        .setArray(embeds)
        .setAuthorizedUsers([])
        .setChannel(message.channel)
        .setPageIndicator(true)
        .formatField("Name", (i) => i + "\n")
        .setDeleteOnTimeout(true)
        .setElementsPerPage(10)
        .setEmojisFunctionAfterNavigation(true)
        .setDisabledNavigationEmojis(["DELETE"]);
      playlist.embed
        .setThumbnail(
          client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setColor("#0390fc")
        .setFooter("Created by wrose");
      await playlist.build();
    }
    if (messageFlags === "--delete") {
      args.splice(args.indexOf(messageFlags), 1);
      let deletingSong = args.join(" ");
      try {
        let a = await plModel.deleteSong(deletingSong, message.author.id);
        message.channel.send({
          embed: {
            color: 15158332,
            title: "Delete one song from " + message.author.tag + " playlist",
            fields: [
              {
                name: "Song name",
                value: a.songName,
              },
              {
                name: "Song URL",
                value: a.link,
              },
            ],
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }
    async function addPlaylist(url) {
      try {
        let a = await plModel.addPlaylist(url, message.author.id);
        let songInfo = await getSongInfo(url);
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Added one song playlist",
            fields: [
              {
                name: "Song name",
                value: songInfo.title,
              },
              {
                name: "Song URL",
                value: songInfo.video_url,
              },
              {
                name: "Playlist author",
                value: message.author.tag,
              },
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
