const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'pause',
    usage: 'pause',
    aliases: [],
    description: 'Pause current song queue',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) redMessage(message, 'Not playing')
    message.react('👍')
    serverQueue.dispatcher.pause()
  }
}
