/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Mod
 * @extends Command
 */ export default class Mod extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'mod',
            description: 'Puts a star before the name of a user',
            category: 'Misc',
            usage: '<MentionUser>',
			hasPerms: ['ADMINISTRATOR']
        });
    }

    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
		const user = message.mentions.members.first()
		if(!user.manageable){
			return message.channel.send(this.client.embeds.error('Mod command error', 'Cannot edit nickname as user is higher than the bot'))
		}
		user.setNickname(`⭐${user.displayName}`)
		message.channel.send(this.client.embeds.success('User modded', `${user.user} has been modded successfully`))
	}
}
