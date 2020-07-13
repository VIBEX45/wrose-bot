const Discord = require('discord.js')
module.exports = {
  config: {
    name: 'queue',
    usage: 'queue',
    aliases: ['q'],
    description: 'Show current queue songs.',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: 'No songs in queue'
        }
      })
    } else {
      const songs = serverQueue.queue
      const embed = new Discord.MessageEmbed()
        .setColor('#0390fc')
        .setTitle('Songs in queue')
        .setThumbnail(
          client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
        )
      songs.forEach(entry => {
        const requestedBy = 'Requested ' + entry.requester
        embed.addField(entry.title, requestedBy)
      })
      message.channel.send(embed)
    }
  }
}
