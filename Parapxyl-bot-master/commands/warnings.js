/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Warnings
 * @extends Command
 */ export default class Warnings extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'warnings',
            description: 'Shows warnings on yourself or a user in the server',
            category: 'Misc',
            usage: '[MentionUser/user Id], [] is optional',
			aliases: ['warns']
        });
    }

    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
		const user = message.mentions.members.first() || message.member
		const warns = this.client.warns.get(user.id)
		if(!warns){
			return message.channel.send(this.client.embeds.error('Warnings', `${user.user} has no warnings`))
		}
		await this.client.embeds.warnings(warns, message, user.user.tag)
	}
}
