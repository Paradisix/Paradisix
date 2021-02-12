/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class WarnDelete
 * @extends Command
 */ export default class WarnDelete extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'warndelete',
            description: 'Deletes a warning from a user with it\'s id',
            category: 'Moderator',
            usage: '<MentionUser/user Id> <warnId | all>',
			aliases: ['wd'],
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
		const user = message.mentions.members.first() || message.member
		
		const warnId = args[1];
		if(!warnId){
			return message.channel.send(this.client.cmdHelp)
		}
		const warns = this.client.warns.get(user.id)
		if(!warns){
			return message.channel.send(this.client.embeds.main('', 'This user has no warnings'))
		}
		if(warnId.toLowerCase() == 'all'){
			this.client.warns.delete(user.id)
			return message.channel.send(this.client.embeds.success('Warnings deleted', `All warnings for ${user.user} has been cleared successfully`))
		}
		else if(isNaN(warnId)){
			return message.channel.send(this.client.cmdHelp)
		}
		else if(warnId > warns.length - 1){
			return message.channel.send(this.client.embeds.error('Warning not found', `There is no warning with the id: \`${warnId}\``))
		}
		else{
			warns.splice(warnId - 1, 1)
			const tempArr = warns.slice()
			for(let i = 0; i < tempArr.length; i++){
				tempArr[i].warningId = i + 1
			}
			this.client.warns.set(user.id, tempArr)
			return message.channel.send(this.client.embeds.success('Warning deleted', `The warning with id: \`${warnId}\` has been deleted`))
		}
	}
}
