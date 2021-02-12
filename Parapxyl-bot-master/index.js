import Client from './modules/Client.js';

const client = new Client({partials: ['MESSAGE', 'REACTION']});

client.init();

client
    .on('disconnect', () => console.warn('Client is disconnecting...'))
    .on('reconnecting', () => console.log('Client is reconnecting...'))
    .on('warn', info => console.warn(info));

process.on('uncaughtException', err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error(errorMsg);
});

process.on('unhandledRejection', err => {
    console.error(err);
});
