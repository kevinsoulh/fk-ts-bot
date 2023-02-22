import { ExtendedClient } from '../../';
import { ActivityType } from 'discord.js';

module.exports = {
    name: 'ready',
    onde: true,
    async execute(client: ExtendedClient) {
        client.user?.setPresence({
            activities: [{
                name: 'F&K',
                type: ActivityType.Watching
            }],
            status: 'online'
        })

        console.log(`${client.user?.tag} - I'm ready!!`);
    }
}