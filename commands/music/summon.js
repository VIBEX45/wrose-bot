let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "summon",
    usage: "summon",
    description: "It's like ShaZam but summon",
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "__***N I G G E R***__ join a voice channel first",
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
    if (musicModel.isPlaying === true) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "I'm playing at another channel, please wait till i finished all the command.",
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
    if (musicModel.isPlaying === false && !musicModel.voiceChannel) {
      musicModel.voiceChannel = message.member.voice.channel;
      musicModel.connection = await message.member.voice.channel.join();
    }
  }
};
