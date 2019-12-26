const fs = require("fs");
const config = require("../config/config.json");
module.exports = async message => {
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    fs.readdirSync("./commands/").forEach(dir => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => {
            file.endsWith(".js");
            var filename = file.split('.').slice(0, -1).join('.')
            if (cmd === filename) {
                require("../commands/" + dir + '/' + cmd).run(message, args);
            }
        });
    });
};