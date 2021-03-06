const ytcore = require('ytdl-core')
const getVideoId = require('get-video-id')
const musicDB = require('../../model/musicData')
const { initQueue, addPlaylistToQueue } = require('../../utils/queue')
const {
  sendSongQueue,
  sendPlaying,
  emptyQueue,
  redMessage
} = require('../../utils/message')
const {
  sendErrorMail,
  updatePresence,
  getSongInfo,
  getvideourl
} = require('../../utils/utility')

const send = require('gmail-send')({
  user: 'minzycrackteam@gmail.com',
  pass: 'kjbarjuidzcevgcn',
  to: 'sktt1lka@gmail.com',
  subject: 'Error on DiscordBot',
  text: 'Error happened'
})
module.exports = {
  config: {
    name: 'play',
    usage: 'play [song name]',
    aliases: ['p'],
    description: 'Play a song from youtube',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.member.voice.channel.joinable) { return redMessage(message, "I can't join that voice channel!") }
    const serverQueue = client.queue.get(message.guild.id)
    const voiceChannel = message.member.voice.channel
    if (serverQueue && serverQueue.radio === true) {
      return message.reply('Occupied somewhere else')
    }
    if (serverQueue) {
      if (
        message.member.voice.channel &&
        serverQueue.voiceChannel !== message.member.voice.channel
      ) {
        return message.channel.send({
          embed: {
            color: 15158332,
            title:
              "I'm now playing in another voiceChannel, please wait or join that voiceChannel"
            // description:
            // "If you are desperate to listen to music, use --wait in your order and i will join you immediately after i finished playing for someone else"
          }
        })
      }
    }
    if (!message.member.voice.channel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          description: 'You have to be in a voiceChannel to use the command.'
        }
      })
    }
    try {
      const user = message.mentions.users.first()
        ? message.mentions.users.first().id
        : message.author.id
      if (args[0] !== '--playlist') {
        if (ytcore.validateURL(args[0])) {
          addQueue(args[0])
        }
        if (!ytcore.validateURL(args[0])) {
          const params = args.join(' ')
          const videoUrl = await getvideourl(params)
          if (videoUrl !== null) addQueue(videoUrl)
          else return message.reply('Please retry after 5 seconds')
        }
      }
      if (args[0] === '--playlist' && !serverQueue) {
        let tempQueue = await initQueue(message)
        tempQueue = await addPlaylistToQueue(message, tempQueue, user)
        client.queue.set(message.guild.id, tempQueue)
        play(message.guild.id)
      }
      if (args[0] === '--playlist' && serverQueue) {
        await addPlaylistToQueue(message, serverQueue, user)
      }

      // functions
      async function addQueue (url) {
        const songInfo = await getSongInfo(url)
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          thumbnail: getThumbnail(url),
          duration: secondsCoverter(songInfo.videoDetails.lengthSeconds),
          seconds: songInfo.videoDetails.lengthSeconds,
          requester: message.author.tag
        }
        if (!serverQueue) {
          const tempQueue = await initQueue(message)
          tempQueue.queue.push(song)
          client.queue.set(message.guild.id, tempQueue)
          play(message.guild.id)
        } else {
          serverQueue.queue.push(song)
          sendSongQueue(message, client)
        }
      }
      async function play (guild) {
        const serverQueue = client.queue.get(guild)
        if (!serverQueue.queue[0]) {
          serverQueue.isPlaying = false
          updatePresence(message, serverQueue)
          serverQueue.voiceChannel.leave()
          emptyQueue(message, client)
          client.queue.delete(guild)
        } else {
          sendPlaying(message, client)
          serverQueue.dispatcher = serverQueue.connection
            .play(
              ytcore(serverQueue.queue[0].url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                encoderArgs: [
                  '-af',
                  'equalizer=f=40:width_type=h:width=50:g=50'
                ]
              })
            )
            .on('start', () => {
              serverQueue.isPlaying = true
              updatePresence(message, serverQueue)
              addTopSong(serverQueue.queue[0].title, message.guild.id)
            })
            .on('finish', () => {
              serverQueue.queue.shift()
              play(message.guild.id)
            })
            .on('volumeChange', (oldVolume, newVolume) => {
              message.channel.send({
                embed: {
                  title: `Volume changed from ${oldVolume} to ${newVolume}.`,
                  author: {
                    name: message.client.user.username,
                    icon_url: message.client.user.avatarURL({
                      format: 'png',
                      dynamic: true,
                      size: 1024
                    })
                  }
                }
              })
            })
            .on('end', () => {
              serverQueue.queue.shift()
            })
            .on('error', (error) => {
              console.log(error)
              sendErrorMail(error)
            })
        }
      }
      function getThumbnail (url) {
        const ids = getVideoId(url)
        return `http://img.youtube.com/vi/${ids.id}/maxresdefault.jpg`
      }
      function addTopSong (title) {
        musicDB.updateCount(title, message.guild.id)
      }
      function secondsCoverter (second) {
        var timestamp = second

        // 2
        var hours = Math.floor(timestamp / 60 / 60)

        // 37
        var minutes = Math.floor(timestamp / 60) - hours * 60

        // 42
        var seconds = timestamp % 60
        if (hours > 0) {
          return hours + ':' + minutes + ':' + seconds
        } else return minutes + ':' + seconds
      }
    } catch (error) {
      console.log(error)
      message.channel.send({
        embed: {
          color: 15158332,
          title: error.name,
          description: error.message
        }
      })
      sendErrorMail(error)
    }
  }
}
