const mongoose = require('mongoose')
const guildSettingsSchema = mongoose.Schema({
  guildID: {
    type: String,
    unique: true
  },
  guildName: {
    type: String
  },
  prefix: {
    type: String,
    max: 1,
    default: '.'
  },
  musicTextChannel: {
    type: String
  },
  musicVoiceChannel: {
    type: String
  },
  xp: {
    type: Boolean,
    default: false
  },
  ignoredChannels: []
})
var guildSettings = mongoose.model('guildSettings', guildSettingsSchema)
function updateMusicChannel (data) {
  guildSettings.findOneAndUpdate(
    { guildID: data.guildID },
    {
      musicTextChannel: data.musicTextChannel,
      musicVoiceChannel: data.musicVoiceChannel
    },
    function (error, doc, res) {
      if (error) console.log(error)
      if (res) console.log('done')
    }
  )
}
function updateIgnoredChannels (data) {
  guildSettings.findOne({ guildID: data.guildID }, function (error, result) {
    if (error) console.log(error)
    if (result) {
      result.ignoredChannels.push(data.ignoredChannel)
      result.save().then(() => {
        console.log('saved ignore channel\n' + result)
      })
    }
  })
}

async function addNewGuild (guild) {
  guildSettings.findOne({ guildID: guild.id }, async function (error, result) {
    if (error) console.log(error)
    if (result) return
    if (!result) {
      const newGuild = new guildSettings({
        guildID: guild.id,
        guildName: guild.name,
        musicVoiceChannel: null,
        musicTextChannel: null
      })
      await newGuild.save().then(function (err) {
        if (err) console.log(err)
        console.log('saved new guild\n' + newGuild)
      })
    }
  })
}
async function queryGuildSettings (guildID) {
  const result = await guildSettings.findOne({ guildID: guildID }).exec()
  return result
}
async function updatePrefix (prefix, guildID) {
  const a = await guildSettings.findOneAndUpdate(
    { guildID: guildID },
    {
      prefix: prefix
    }
  )
  return a
}
async function updateXPstatus (guildID, bool) {
  const a = await guildSettings.findOneAndUpdate(
    { guildID: guildID },
    {
      xp: bool
    }
  )
  return a
}
module.exports = {
  updateIgnoredChannels,
  updateMusicChannel,
  addNewGuild,
  queryGuildSettings,
  updatePrefix,
  updateXPstatus
}
