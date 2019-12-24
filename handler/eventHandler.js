const fs = require('fs');
const path = require('path');
module.exports = client => {
    const eventPath = './events/';
    let events = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
    events.forEach(event => {
        event = event.replace(/\.js$/i, '');

        client.on(event, require(path.resolve(eventPath, event)));
    })
}