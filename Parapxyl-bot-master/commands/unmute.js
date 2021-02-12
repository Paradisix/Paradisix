/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Unmute
 * @extends Command
 */ export default class Unmute extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Removes the mute from a user',
            usage: '<mentionUser/userID>',
            category: 'Moderator',
            hasPerms: ['KICK_MEMBERS'],
        });
    }

    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const missingPerms = [];
        if (
            !message.guild.members.cache
                .get(message.client.user.id)
                .hasPermission('MANAGE_MESSAGES')
        ) {
            missingPerms.push('MANAGE_MESSAGES');
        }
        if (
            !message.guild.members.cache
                .get(message.client.user.id)
                .hasPermission('MANAGE_ROLES')
        ) {
            missingPerms.push('MANAGE_ROLES');
        }
        if (
            !message.guild.members.cache
                .get(message.client.user.id)
                .hasPermission('MANAGE_CHANNELS')
        ) {
            missingPerms.push('MANAGE_CHANNELS');
        }
        if (missingPerms.length != 0) {
            return message.channel.send(
                this.client.embeds.permsMissing(missingPerms)
            );
        }
        message.delete;

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
                            'Unmute command error',
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
                    'Unmute command error',
                    'User not in server'
                )
            );
        const muteRole = message.guild.roles.cache.find(
            r => r.name === 'Muted'
        );
        if (!user.roles.cache.get(muteRole)) {
            return message.channel.send(
                this.client.embeds.error(
                    'Unmute command error',
                    `${user.user} is not muted`
                )
            );
        }
        await user.roles.remove(muteRole);
        await message.channel.send(
            this.client.embeds.success(
                'User Un-muted successfully',
                `${user.user} has been un-muted`
            )
        );
        const logsChannel = await message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        if (logsChannel) {
            return logsChannel.send(
                this.client.embeds.logs(
                    'User Un-Muted',
                    `${user.user} has been un-muted`
                )
            );
        }
    }
}
