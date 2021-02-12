/* eslint-disable new-cap */
/* eslint-disable valid-jsdoc */
import Discord from 'discord.js';
import embedFile from './embeds.js';
import fs from 'fs';
import config from '../config.js';
import Enmap from 'enmap';
/**
 * @class Client
 * @extends Discord.Client
 */
export default class Client extends Discord.Client {
    /**
     * @param {*} options
     */
    constructor(options) {
        super(options);
        this.discord = Discord;
        this.cooldowns = new Discord.Collection();
        this.embeds = embedFile;
        this.config = config;
        this.commands = new this.discord.Collection();
        this.cmdHelp = new this.discord.MessageEmbed();
		this.warns = new Enmap({ name: 'warnings'});
    }
    /**
     * @description Creates an help command from the command info
     * @function inHelp
     * @param {string} guildId
     * @param {object} commandHelp
     * @param {object} commandConf
     * @return {Promise<Discord.MessageEmbed>} Returns help embed
     */
    async inHelp(commandHelp, commandConf) {
        const prefix = this.config.prefix;
        const commandName = commandHelp.name.replace(
            /^./,
            commandHelp.name[0].toUpperCase()
        );
        const embed = new this.discord.MessageEmbed()
            .setColor('#4A90E2')
            .setTitle(commandName);
        if (commandHelp.description) {
            embed.setDescription(`${commandHelp.description}`);
        } else {
            embed.setDescription('No description provided');
        }

        if (commandConf.aliases[0]) {
            embed.addField(
                'Command aliases',
                `\`${commandConf.aliases.join('` | `')}\``
            );
        } else {
            embed.addField('Command aliases', '`No aliases found`');
        }

        if (commandConf.options[0]) {
            embed.addField(
                'Command Options',
                `\`${commandConf.options.join('` | `')}\``
            );
        } else {
            embed.addField('Command Options', '`No options found`');
        }

        if (commandHelp.usage) {
            embed.addField(
                'Command Usage',
                `\`${prefix}${commandHelp.name} ${commandHelp.usage}\``
            );
        } else {
            embed.addField('Command Usage', `\`${prefix}${commandHelp.name}\``);
        }
        return embed;
    }

    /**
     * Covert millisecond to time in hours:minutes:seconds format
     * @function msToTime
     * @param {number} duration
     * @return {string} Returns a string of time in hours:minutes:second format
     */
    msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
    }

    /**
     * Code pause
     * @async
     * @function pauseCode
     * @return {Promise<void>} Promise<void>
     */
    async pauseCode() {
        await new Promise(res => setTimeout(res, 1000));
    }

    /**
     * loads the bot
     * @async
     * @function init
     * @return {Promise<void>}
     */
    async init() {
        // Command Handler
        const cmdFiles = fs
            .readdirSync('./commands')
            .filter(file => file.endsWith('.js'));
        for (const file of cmdFiles) {
            const {default: Cmd} = await import(`../commands/${file}`);
            const command = new Cmd(this);
            this.commands.set(command.help.name, command);
            console.log(`Loaded Command ${command.help.name}`);
        }

        // Events handler
        const eventsFiles = fs
            .readdirSync('./events')
            .filter(file => file.endsWith('.js'));
        for (const file of eventsFiles) {
            const {default: Event} = await import(`../events/${file}`);
            const event = new Event(this);
            this.on(event.name, async (...args) => event.execute(...args));
            console.log(`Loaded Event ${event.name}`);
        }

        // Discord login
        await this.login();
    }
}
