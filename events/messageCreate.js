const fs = require('fs');
const { defaultQuipCooldowns } = require('../config.json');

var quipCooldown = 0;

module.exports = {
	name: 'messageCreate',
	execute(message) {
		let defaultQuipCooldown = defaultQuipCooldowns.filter(data => data.server == message.guild.id).at(0).defaultQuipCooldown

		if (quipCooldown < 0) {
			quipCooldown = (Math.floor(Math.random() * defaultQuipCooldown) + 1);
		} else if (quipCooldown == 0) {
			fs.readFile('./quips.txt', 'utf-8', (err, data) => {
				if (err) {
					throw err;
				}
				let lines = data.split('\n');
				message.channel.send(lines[Math.floor(Math.random() * lines.length)]);
			})
		}

		quipCooldown--;
	}
};
