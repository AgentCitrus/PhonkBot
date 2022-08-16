const fs = require('fs');
const path = require('path');
const editJsonFile = require('edit-json-file');
const { serverData } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	name: 'messageCreate',
	execute(message) {
		let servObj = serverData.filter(data => data.server == message.guild.id).at(0);

		if (servObj.quipCooldown < 0) {
			servObj.quipCooldown = (Math.floor(Math.random() * servObj.defaultQuipCooldown) + 1);
		} else if (servObj.quipCooldown == 0) {
			fs.readFile('./quips.txt', 'utf-8', (err, data) => {
				if (err) {
					throw err;
				}
				let lines = data.split('\n');
				message.channel.send(lines[Math.floor(Math.random() * lines.length)]);
			})
		}

		servObj.quipCooldown--;
		file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
		file.save();
	}
};