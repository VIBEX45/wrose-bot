const muteModel = require('../model/mute.model')
module.exports = (client) => {
  return async function (oldState, newState) {
    const serverQueue = client.queue.get(newState.guild.id)
    if (newState.id === client.user.id && serverQueue) { return client.queue.delete(newState.guild.id) }
    if (serverQueue) {
      if (serverQueue.voiceChannel.members.size < 2) {
        setTimeout(() => {
          serverQueue.queue = []
          serverQueue.textChannel.send('Tao đã chờ ở đây quá lâu rồi!')
          if (serverQueue.radio) serverQueue.dispatcher.destroy()
          else serverQueue.connection.dispatcher.end()
        }, 10000)
      }
    }
    const userData = {
      id: newState.id,
      guildID: newState.guild.id
    }
    const user = await muteModel.exist(userData)
    const i = 0
    if (user.length !== 0) {
      if (!newState.guild.me.hasPermission('MUTE_MEMBERS')) return
      if (newState.serverMute === false) newState.setMute(true)
    }
    // const tempVoiceChannel = newState.guild.channels.cache.find(x => x.name ==="Create new voice");
    // if(!tempVoiceChannel) return;
    //   if(newState.member.voice.channel === tempVoiceChannel) {
    //     const alreadyC = newState.guild.channels.cache.find(
    //       (x) => x.name === newState.member.user.username
    //     );
    //     if (alreadyC) await newState.member.voice.setChannel(shit);
    //     else {
    //       let temp = await newState.guild.channels.create(
    //         newState.member.user.username,
    //         { type: "voice" }
    //       );
    //       await newState.member.voice.setChannel(tempVoiceChannel);
    //     }
    // }
  }
}
