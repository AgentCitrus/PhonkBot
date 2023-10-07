const fs = require('fs');
const path = require('path');
const editJsonFile = require('edit-json-file');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        file.append("serverData", { server: guild.id, defaultQuipCooldown: 10, quipCooldown: 10, customCommands: {}, queue: [], loop: 'off' })
        console.log(`New server ${guild.name} registered`)
        file.save();
    }
};