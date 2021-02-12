/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Unsuspend
 * @extends Command
 */ export default class Unsuspend extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'unsuspend',
            description: 'Unsuspends a user if he is suspended',
            category: 'Moderator',
            usage: '<MentionUser/user Id>',
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
                            'unsuspend command error',
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
                    'Unsuspend command error',
                    'User not in server'
                )
            );
        if (!user.roles.cache.get(this.client.config.suspendedRole)) {
            return message.channel.send(
                this.client.embeds.error(
                    'Unsuspend command error',
                    'The user is not suspended.'
                )
            );
        }
        const logsChannel = message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        try {
            user.send(
                this.client.embeds.main(
                    message.guild.name,
                    `You have been Unsuspended from \`${message.guild.name}\``
                )
            );
        } catch (error) {
            console.error(error);
        }
        await user.roles.remove(this.client.config.suspendedRole);
        if (logsChannel) {
            await logsChannel.send(
                this.client.embeds.logs(
                    'User Unsuspended',
                    `${user.user} was Unsuspended by ${message.author}`
                )
            );
        }
        const success = await message.channel.send(
            this.client.embeds.success(
                'User Unsuspended Successfully',
                `${user.user} was Unsuspended successfully.`
            )
        );
        return success.delete({timeout: 5000});
    }
}
