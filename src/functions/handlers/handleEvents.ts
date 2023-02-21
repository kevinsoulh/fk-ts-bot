import * as fs from 'fs';
import { ExtendedClient } from '../../';

module.exports = (client: ExtendedClient) => {
    client.handleEvents = async () => {

        const eventFolders = fs.readdirSync('./events');
        for (const folder of eventFolders) {
            const eventFiles = fs
            .readdirSync(`./events/${folder}`)
            .filter((file) => file.endsWith('.js'));

           switch (folder) {
            case "client":
                for (const file of eventFiles) {
                    const event = require(`../../events/${folder}/${file}`);
                    if (event.once) client.once(event.name, (...args: any) => event.execute(...args, client));
                    else client.on(event.name, (...args: any) => event.execute(...args, client)); 
                }
                break;
            default:
                break;
           }
        }
    }
}