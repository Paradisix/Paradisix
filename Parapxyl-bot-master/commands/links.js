/* eslint-disable no-empty */
/* eslint-disable valid-jsdoc */
import Command from '../modules/Command.js';
/**
 * @class Links
 * @extends Command
 */ export default class Links extends Command {
    /**
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, {
            name: 'links',
            description: 'Sends all the links of the bot',
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
        return message.channel.send(
            this.client.embeds.links(this.client.config.links)
        );
    }
}
