/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Ban
 * @extends Command
 */ export default class Ban extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Bans a person from the server',
            category: 'Moderator',
            usage: '<MentionUser/user Id> [reason], [] is optional',
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
                            'Ban command error',
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
                    'Ban command error',
                    'User not in server'
                )
            );
        if (
            user.permissions.has('MANAGE_MESSAGES') ||
            user.permissions.has('BAN_MEMBERS') ||
            user.permissions.has('KICK_MEMBERS')
        )
            return message.channel.send(
                this.client.embeds.error(
                    'Ban command error',
                    `Cannot ban ${user.user} as he is a MOD or an Admins`
                )
            );
		
        const logsChannel = message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        if (
			!user.manageable
        ) {
            return message.channel.send(
                this.client.embeds.error(
                    'Ban command error',
                    'Cannot Ban someone higher than the bot.'
                )
            );
        }
        if (!reason) {
            try {
                user.send(
                    this.client.embeds.main(
                        message.guild.name,
                        `You have been banned from \`${message.guild.name}\``
                    )
                );
            } catch (error) {
                console.error(error);
            }
            await user.ban();
            if (logsChannel) {
                await logsChannel.send(
                    this.client.embeds.logs(
                        'User Banned',
                        `${user.user} was banned from the server by ${message.author}`
                    )
                );
            }
        }
        if (reason) {
            try {
                user.send(
                    this.client.embeds.main(
                        message.guild.name,
                        `You have been banned from \`${message.guild.name}\` for the reason: ${reason}`
                    )
                );
            } catch (error) {
                console.log(error);
            }
            await user.ban({reason: reason});
            if (logsChannel) {
                await logsChannel.send(
                    this.client.embeds.logs(
                        'User Banned',
                        `${user.user} was banned from the server by ${message.author} for the reason: ${reason}`
                    )
                );
            }
        }
        const success = await message.channel.send(
            this.client.embeds.success(
                'User Banned Successfully',
                `${user.user} was banned successfully from the server`
            )
        );
        return success.delete({timeout: 5000});
    }
}
