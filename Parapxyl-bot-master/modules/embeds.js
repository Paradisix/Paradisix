import Discord from 'discord.js';
export default {
    main(title, description, footer, timestamp) {
        if (!title) {
            title = '';
        }
        if (!description) {
            description = '';
        }
        if (!footer) {
            footer = '';
        }

        if (timestamp == false) {
            const message = new Discord.MessageEmbed()
                .setColor('#206694')
                .setTitle(title)
                .setDescription(description)
                .setFooter(footer);
            return message;
        } else {
            const message = new Discord.MessageEmbed()
                .setColor('#206694')
                .setTitle(title)
                .setDescription(description)
                .setTimestamp()
                .setFooter(footer);
            return message;
        }
    },

    error(title, description) {
        if (!title) {
            title = '';
        }
        if (!description) {
            description = '';
        }

        const message = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle(title)
            .setDescription(description);
        return message;
    },

    success(title, description) {
        if (!title) {
            title = '';
        }
        if (!description) {
            description = '';
        }
        const message = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle(title)
            .setDescription(description);
        return message;
    },
    lackPerms(permsArr) {
        const message = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Insufficient permissions')
            .setDescription(
                `You don't have enough permission(s) to execute this command\nRequired permissions: \`\`\`${permsArr.join(
                    '\n'
                )}\`\`\``
            );
        return message;
    },
lackRoles(rolesArr) {
        const message = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Missing Roles')
            .setDescription(
                `You are missing Role(s) to execute this command\nRequired Roles: <@!${rolesArr.join(
                    '> <@'
                )}>`
            );
        return message;
    },
    logs(title, description) {
        const message = new Discord.MessageEmbed()
            .setColor('#206694')
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
        return message;
    },

    help(title, description, aliasesField, optionsField, usageField) {
        if (title == '') {
            title = 'No Title';
        }
        if (description == '') {
            description = 'No Description';
        }
        if (aliasesField == '') {
            aliasesField = 'No Aliases';
        }
        if (optionsField == '') {
            optionsField = 'No Options';
        }
        if (usageField == '') {
            usageField = 'No Usage';
        }
        const message = new Discord.MessageEmbed()
            .setColor('#206694')
            .setTitle(title)
            .setDescription(description)
            .addFields(
                {name: 'Aliases', value: `\`${aliasesField}\``},
                {name: 'Options', value: `\`${optionsField}\``},
                {name: 'Usage', value: `\`${usageField}\``}
            );
        return message;
    },

    links(linksArr) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Our links')
            .setColor('#206694')
            .addFields(...linksArr);
        return embed;
    },
	async warnings(warns, message, userTag){
		const newArr = warns.map(warn => {return {name: `Warning ID: ${warn.warningId}`, value: `\n\nWarned By: ${warn.warnedBy}\n\nReason: ${warn.reason}`}})
		for(let i = 0; i !== newArr.length; i += 4){
			if(newArr.length == 0){
				break;
			}
			const tempArr = newArr.splice(0, i + 5);
			const embed = new Discord.MessageEmbed()
				.setColor('#206694')
				.setTitle(`${userTag} Warnings`)
				.addFields(tempArr)
			message.channel.send(embed)
		}
		
	}
};
