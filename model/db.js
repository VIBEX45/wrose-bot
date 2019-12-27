let message;
let isInit = false;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./data/db.json')
const db = low(adapter)
let database = {
    guild: this.guild,
    musicChannel: this.musicChannel,
    musicTextChannel: this.musicTextChannel,
    init() {
        msg = message,
            isInit = true;
    },
    async getGuild(guildID) {
        return await db.get(guildID).value()
    },
    getDB(guildID) {
        db.set(guildID, {
            musicChannel: null,
            musicTextChannel: null
        }).write();
        db.get(`${guildID}`).update()
    },
    updateDB() {

    }
}

module.exports = {
    db,
    database
};