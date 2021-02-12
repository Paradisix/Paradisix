/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Help
 * @extends Command
 */ export default class Help extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'help',
            description:
                'List all of my commands or info about a specific command.',
            aliases: ['commands'],
            usage: 'command name',
            category: 'Misc',
        });
    }
    /**
     * @async
     * @function execute
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const description = [];
        const {commands} = this.client;
        const miscField = [];
        const modField = [];
        if (!args.length) {
            description.push("Here's a list of all of my commands:\n");
            commands.forEach(async cmd => {
                if (cmd.conf.disabled) {
                    return;
                }
                if (cmd.conf.hasPerms.length > 0) {
                    const commandreqperms = cmd.conf.hasPerms;
                    if (!message.member.permissions.has(commandreqperms)) {
                        return;
                    }
                }
				if(cmd.conf.hasRoles.length > 0){
					if(!message.member.roles.cache.some(role => cmd.conf.hasRoles.includes(role))){
						return;
					}
				}
                if (cmd.help.category) {
                    if (cmd.help.category == 'Misc') {
                        const commandhascat = cmd.help.name;
                        miscField.push(`\`${commandhascat}\``);
                    }
                    if (cmd.help.category == 'Moderator') {
                        const commandhascat = cmd.help.name;
                        modField.push(`\`${commandhascat}\``);
                    }
                }
            });
            /* ------------------------------------------------------------------------------- */
            const exampleEmbed = new this.client.discord.MessageEmbed()
                .setColor('#206694')
                .setTitle('Help')
                .setDescription(
                    `Here is all the commands you can execute.\nYou can send \`${this.client.config.prefix}help [command name]\` to get info on a specific command!`
                )
                .addField('Misc', miscField.join(' '));

            if (modField.length > 0) {
                exampleEmbed.addField('Moderators', modField.join(' '));
            }

            return message.channel.send(exampleEmbed);
        }

        /* ------------------------------------------------------------------------------- */

        const name = args[0].toLowerCase();
        const command =
            commands.get(name) ||
            commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(
                this.client.embeds.error(
                    'Invalid Command',
                    "That's not a valid command!"
                )
            );
        }

        const embed = await this.client.inHelp(
            command.help,
            command.conf,
            this.client
        );
        return message.channel.send(embed);
    }
}
