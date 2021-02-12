/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Warn
 * @extends Command
 */ export default class Warn extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'warn',
            description: 'Warns a user in the server',
            category: 'Moderator',
            usage: '<MentionUser/user Id> <reason>',
			hasRoles: ['739195634955059220']
        });
    }

    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
		if(!args[0]){
			return message.channel.send(this.client.embeds.cmdHelp)
		}
		const user = message.mentions.members.first() || await message.guild.members.fetch(args[0])
		if(!user){
			return message.channel.send(this.client.embeds.cmdHelp)
		}
		const reason = args.splice(1).join(' ');
		if(!reason){
			return message.channel.send(this.client.embeds.cmdHelp)
		}
		let latestWarn = this.client.warns.get(user.id)
		if(!latestWarn){
			latestWarn = 1;
			this.client.warns.set(user.id, [])
			this.client.warns.push(user.id, { warningId: latestWarn, reason: reason, warnedBy: message.author.tag, timestamp: Date.now()})
		}
		else{
			latestWarn = latestWarn.length + 1
			this.client.warns.push(user.id, { warningId: latestWarn, reason: reason, warnedBy: message.author.tag, timestamp: Date.now()})
		}
		message.channel.send(this.client.embeds.success('User has been warned', `${user.user} has been warned successfully`))
		user.send(this.client.embeds.main('Warning', `You have been warned by ${message.author} in ${message.guild.name} for the reason \`${reason}\``))
	}
}
