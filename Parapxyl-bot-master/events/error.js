/* eslint-disable valid-jsdoc */
import Event from '../modules/Event.js';
/**
 * @class error
 */
export default class Error extends Event {
    /**
     *
     * @param {import('../modules/Client.js').default} client
     */
    constructor(soldier) {
        super(soldier, 'error');
    }
    /**
     * @async
     * @function execute
     * @param {Error} error
     */
    async execute(error) {
        console.error(error);
    }
}
