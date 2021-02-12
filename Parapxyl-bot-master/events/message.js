/* eslint-disable valid-jsdoc */
import Event from '../modules/Event.js';
/**
 * @class Message
 */
export default class Message extends Event {
    /**
     *
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, 'message');
    }
    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     */
    async execute(message) {
        // Prevent botception
        if (message.author.bot) return;
        // Prevent dm execution
        if (message.channel.type !== 'text') return;

        const prefix = this.client.config.prefix;

        // Mention the bot message
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
        if (message.content.match(mentionRegex)) {
            return message.channel.send(
                this.client.embeds.main('', `My prefix is \`${prefix}\``)
            );
        }
        // Check that the message starts with the prefix
        if (!message.content.startsWith(prefix)) {
            return;
        }

        // Command handler
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command =
            this.client.commands.get(commandName) ||
            this.client.commands.find(
                cmd =>
                    cmd.conf.aliases && cmd.conf.aliases.includes(commandName)
            );
        // If it's not a command bypass
        if (!command) return;

        if (command.conf.disabled == true) {
            if (
                message.author.id != this.client.config.owner &&
                message.author.id != this.client.config.coOwner
            ) {
                return message.channel.send(
                    this.client.embeds.error(
                        '',
                        `\`${command.help.name}\` is disabled as it is under development..`
                    )
                );
            }
        }
        if (command.conf.hasPerms) {
            const guildMember = message.guild.members.cache.get(
                message.author.id
            );
            if (guildMember.permissions.has(command.conf.hasPerms) == false) {
                return message.channel.send(
                    this.client.embeds.lackPerms(command.conf.hasPerms)
                );
            }
        }
		if (command.conf.hasRoles) {
            const guildMember = message.guild.members.cache.get(
                message.author.id
            );
            if (!guildMember.roles.cache.some(role => command.conf.hasRoles.includes(role))) {
                return message.channel.send(
                    this.client.embeds.lackRoles(command.conf.hasRoles)
                );
            }
        }

        const now = Date.now();

        if (!this.client.cooldowns.has(command.help.name)) {
            this.client.cooldowns.set(
                command.help.name,
                new this.client.discord.Collection()
            );
        }

        const timestamps = this.client.cooldowns.get(command.help.name);
        const cooldownAmount = command.conf.cooldown * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime =
                timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(
                    this.client.embeds.error(
                        '',
                        `please wait ${timeLeft.toFixed(
                            1
                        )} more second(s) before reusing the \`${
                            command.help.name
                        }\` command.`
                    )
                );
            }
        }
        try {
            this.client.cmdHelp = await this.client.inHelp(
                command.help,
                command.conf
            );
            command.execute(message, args);
        } catch (error) {
            message.channel.send(
                'An error has occured while executing the command'
            );
            console.log(error);
        }
    }
}
