import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as fs from 'fs';
import config from './config.js';

export class ExtendedClient extends Client {
    commands = new Collection<string, any>();
    commandArray: any[] = [];

    handleCommands: () => void | Promise<void> = () => {};
    handleEvents: () => void | Promise<void> = () => {};
}

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration,
    ]
});

const functionFolders = fs.readdirSync('./functions');
for (const folder of functionFolders) {

    const functionFiles = fs.
    readdirSync(`./functions/${folder}`)
    .filter(file => file.endsWith('.js'));
    
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }

}

client.handleCommands();
client.handleEvents();
client.login(config.DISCORD_TOKEN);