const fs = require('fs');
const path = require('path');
const editJsonFile = require('edit-json-file');
const { defaultQuipCooldowns } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.guilds.cache.forEach(guild => {
            if (!defaultQuipCooldowns.some(obj => obj.server == guild.id)) {
                file.append("defaultQuipCooldowns", { server: guild.id, defaultQuipCooldown: 10 })
                console.log(`New server ${guild.name} registered`)
                file.save();
            }
        })
    }
};