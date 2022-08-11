const fs = require('fs');
const path = require('path');
const editJsonFile = require('edit-json-file');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
    name: 'ready',
    execute(client) {
        console.log('Ready!');
    }
};