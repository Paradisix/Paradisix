/* eslint-disable valid-jsdoc */
/**
 * @class Command
 */
export default class Command {
    /**
     *
     * @param {import('./Client.js').default} client
     * @param {Object} options
     */
    constructor(
        client,
        {
            name = null,
            description = 'No description provided',
            category = 'Misc',
            usage = '',
            disabled = false,
            options = [],
            aliases = [],
            hasPerms = [],
            cooldown = 3,
			hasRoles = []
        }
    ) {
        (this.client = client),
            (this.conf = {
                disabled,
                aliases,
                hasPerms,
                cooldown,
                options,
				hasRoles
            });
        this.help = {
            name,
            description,
            category,
            usage,
        };
    }
}
