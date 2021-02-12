/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Unban
 * @extends Command
 */ export default class Unban extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'unban',
            description: 'Prevokes a user ban from the server',
            category: 'Moderator',
            usage: '<User Id>',
            hasPerms: ['BAN_MEMBERS'],
        });
    }

    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const permsMissing = [];
        if (
            !message.guild.members.cache
                .get(message.client.user.id)
                .hasPermission('MANAGE_MESSAGES')
        ) {
            permsMissing.push('MANAGE_MESSAGES');
        }
        if (
            !message.guild.members.cache
                .get(message.client.user.id)
                .hasPermission('BAN_MEMBERS')
        ) {
            permsMissing.push('BAN_MEMBERS');
        }
        if (permsMissing.length > 0) {
            return message.channel.send(
                this.client.embeds.permsMissing(permsMissing)
            );
        }
        message.delete();
        if (!args[0]) {
            return message.channel.send(this.client.cmdHelp);
        }
        let user = message.mentions.members.first();
        if (!user) {
            try {
                if (isNaN(parseInt(args[0]))) throw new Error('Not number');
                user = await this.client.users.fetch(args[0]);
            } catch (err) {
                if (err == 'DiscordAPIError: Unknown User')
                    return message.channel.send(
                        this.client.embeds.error(
                            'Unban command error',
                            'User not found, please check if he is a valid user'
                        )
                    );
                else if (err.message == 'Not number')
                    return message.channel.send(this.client.cmdHelp);
                else return console.log(err);
            }
        }
        user = message.guild.member(user);
        if (!user)
            return message.channel.send(
                this.client.embeds.error(
                    'Unban command error',
                    'User not in server'
                )
            );
        const logsChannel = message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        await message.guild.members.unban(user);
        if (logsChannel) {
            logsChannel.send(
                this.client.embeds.logs(
                    'User ban prevoked',
                    `${user} ban is prevoked by ${message.author}`
                )
            );
        }
        const successMessage = await message.channel.send(
            this.client.embeds.success(
                'User ban prevoked successfully',
                `${user} ban is prevoked successfully`
            )
        );
        return successMessage.delete({timeout: 5000});
    }
}
