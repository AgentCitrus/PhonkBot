const fs = require('fs');
const path = require('path');
const editJsonFile = require('edit-json-file');
const { serverData } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
    name: 'ready',
    execute(client) {
        for (i of serverData) {
            i.queue = [];
        }
        file.set("serverData", serverData);
        file.save();
        console.log('Ready!');
    }
};