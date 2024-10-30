import { client } from "../app";

const { Events} = require('discord.js');
type ClientType = typeof client;

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: ClientType) {
		if (client.user) console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};