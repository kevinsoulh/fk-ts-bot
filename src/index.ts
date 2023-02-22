import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as fs from 'fs';
import config from './config.js';
import DisTube from 'distube';
import { SpotifyPlugin } from '@distube/spotify';

export class ExtendedClient extends Client {
    commands = new Collection<string, any>();
    commandArray: any[] = [];

    handleCommands: () => void | Promise<void> = () => {};
    handleEvents: () => void | Promise<void> = () => {};

    distube: any = new Object();
    emotes: { play: string; success: string; error: string; } = {
        play: '▶️',
        success: '✅',
        error: '⛔'
    } as any;
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
        GatewayIntentBits.GuildVoiceStates,
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

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});

client.handleCommands();
client.handleEvents();
client.login(config.DISCORD_TOKEN);