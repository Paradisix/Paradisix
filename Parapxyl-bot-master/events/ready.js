/* eslint-disable valid-jsdoc */
import Event from '../modules/Event.js';
/**
 * @class Ready
 */
export default class Ready extends Event {
    /**
     *
     * @param {import('../modules/Client.js').default} client
     */
    constructor(client) {
        super(client, 'ready');
    }
    /**
     * @async
     * @function execute
     */ async execute() {
        console.log('Logged into discord');
        const status = '';
        this.client.user.setActivity(status, {type: 'Managing TeaTree Cafe'});
    }
}
