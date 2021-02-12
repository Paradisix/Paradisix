/* eslint-disable valid-jsdoc */
/**
 * @class Event
 */
export default class Event {
    /**
     * @param {import('./Client.js').default} client
     * @param {string} name
     */
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }
}
