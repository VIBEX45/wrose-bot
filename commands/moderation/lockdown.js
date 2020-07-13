module.exports = {
  config: {
    name: 'lockdown',
    usage: 'lockdown [--remove]',
    description: 'Turn textChannel into lockdown status',
    ownerOnly: false,
    enabled: false
  },
  async run (client, message, args) {
    if (message.content.includes('--remove')) {
      await message.guild.channels.cache
        .find(x => x.id === message.channel.id)
        .overwritePermissions(
          [
            {
              id: message.guild.id,
              deny: ['SEND_MESSAGES', 'ADD_REACTION']
            }
          ],
          'Fuck you all'
        )
      message.channel.send('channel is no longer in lockdown')
    } else {
      await message.guild.channels.cache
        .find(x => x.id === message.channel.id)
        .overwritePermissions(
          [
            {
              id: message.guild.id,
              allow: ['SEND_MESSAGES', 'ADD_REACTION']
            }
          ],
          'Fuck you all'
        )
      message.channel.send('channel is on lockdown')
    }
  }
}
