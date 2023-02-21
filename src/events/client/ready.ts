import config from '../../config';
import { ExtendedClient } from '../../';
import { ActivityType } from 'discord.js';

module.exports = {
    name: 'ready',
    onde: true,
    async execute(client: ExtendedClient) {
        client.user?.setPresence({
            activities: [{
                name: 'Test',
                type: ActivityType.Playing
            }],
            status: 'online'
        })

        console.log(`${client.user?.tag} - I'm ready!!`);
    }
}