const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/data.json");
const db = low(adapter);
const Discord = require('discord.js')
module.exports = {
  name: "topSongs",
  async run(message, args) {
    db.read();
    let songs = await db.get("songs").value();
    if (songs) {
      let embed = new Discord.RichEmbed()
        .setColor("#0390fc")
        .setTitle("Top requested song my storage");
      songs.forEach(entry => {
        embed.addField(entry.name, entry.count);
      });
      message.channel.send(embed);
    }
    if (!songs) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: 'My storage is empty'
        }
      })
    }
  }
};