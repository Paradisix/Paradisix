/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
import ms from 'ms';
/**
 * @class Mute
 * @extends Command
 */
export default class Mute extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Disables the ability of sending messages for a user',
            usage: '<mentionUser/userID> <Mute time>',
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
                            'Mute command error',
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
                    'Mute command error',
                    'User not in server'
                )
            );
        if (user.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send(
                this.client.embeds.error(
                    '',
                    `Cannot mute ${user.user} as he is a MOD or an Admin`
                )
            );
        }
        let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'RED',
                    permissions: [],
                },
                reason: "There wasn't a mute role when command was executed!",
            });
            message.guild.channels.cache.forEach(async channel => {
                await channel.updateOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                });
            });
        }
        const muteTime = parseInt(args[1]);
        if (!muteTime) {
            return message.channel.send(this.client.cmdHelp);
        }
        await user.roles.add(muteRole);
        await message.channel.send(
            this.client.embeds.success(
                'User muted successfully',
                `${user.user} has been muted for ${ms(ms(muteTime))}`
            )
        );
        const logsChannel = message.guild.channels.cache.get(
            this.client.config.logsChannel
        );
        if (logsChannel) {
            logsChannel.send(
                this.client.embeds.logs(
                    'User Muted',
                    `${user.user} has been muted for ${ms(ms(muteTime))}`
                )
            );
        }
        return setTimeout(async () => {
            if (user.roles.cache.some(r => r.name == 'Muted')) {
                user.roles.remove(muteRole.id);
                message.channel.send(
                    this.client.embeds.main(
                        '',
                        `${user.user} has been unmuted`,
                        '',
                        ''
                    )
                );
            }
        }, ms(muteTime));
    }
}
