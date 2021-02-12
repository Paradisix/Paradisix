/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Kick
 * @extends Command
 */ export default class Kick extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Kicks a user from the server',
            category: 'Moderator',
            usage:
                '<MentionUserInGuild>/<User ID in guild> [reason], [] is optional',
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
        const permsMissing = [];
        if (
            !message.guild.members.cache
                .get(this.client.user.id)
                .hasPermission('MANAGE_MESSAGES')
        ) {
            permsMissing.push('MANAGE_MESSAGES');
        }
        if (
            !message.guild.members.cache
                .get(this.client.user.id)
                .hasPermission('KICK_MEMBERS')
        ) {
            permsMissing.push('KICK_MEMBERS');
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
        const reason = args.splice(1, args.length).join(' ');
        if (!user) {
            try {
                if (isNaN(parseInt(args[0]))) throw new Error('Not number');
                user = await this.client.users.fetch(args[0]);
            } catch (err) {
                if (err == 'DiscordAPIError: Unknown User')
                    return message.channel.send(
                        this.client.embeds.error(
                            'Kick command error',
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
                    'Kick command error',
                    'User not in server'
                )
            );
        if (
            user.permissions.has('MANAGE_MESSAGES') ||
            user.permissions.has('BAN_MEMBERS') ||
            user.permissions.has('KICK_MEMBERS')
        ) {
            return message.channel.send(
                this.client.embeds.error(
                    'Kick command error',
                    `Cannot kick ${user} as he is a MOD or an Admin`
                )
            );
        }
        const logsChannel = message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        if (
            !user.manageable
        ) {
            return message.channel.send(
                this.client.embeds.error(
                    'Kick command error',
                    'Cannot kick someone higher than the bot.'
                )
            );
        }
        if (!reason) {
            try {
                user.send(
                    this.client.embeds.main(
                        message.guild.name,
                        `You have been kicked from \`${message.guild.name}\``
                    )
                );
            } catch (error) {
                console.log(error);
            }
            await user.kick();
            if (logsChannel) {
                await logsChannel.send(
                    this.client.embeds.logs(
                        'User Kicked',
                        `${user} was kicked from the server by ${message.author}`
                    )
                );
            }
        }
        if (reason) {
            try {
                user.send(
                    this.client.embeds.main(
                        message.guild.name,
                        `You have been kicked from \`${message.guild.name}\` for the reason: ${reason}`
                    )
                );
            } catch (error) {
                console.log(error);
            }
            await user.kick({reason: reason});
            if (logsChannel) {
                await logsChannel.send(
                    this.client.embeds.logs(
                        'User kicked',
                        `${user} was kicked from the server by ${message.author} for the reason: ${reason}`
                    )
                );
            }
        }

        const success = await message.channel.send(
            this.client.embeds.success(
                'User Kicked Successfully',
                `${user} was kicked successfully from the server`
            )
        );
        return success.delete({timeout: 5000});
    }
}
