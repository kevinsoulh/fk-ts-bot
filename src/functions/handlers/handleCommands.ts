
import config from '../../config';
import { REST, Routes } from 'discord.js' ;
import * as fs from 'fs';
import { ExtendedClient } from '../../';

module.exports = async (client: ExtendedClient) => {
    client.handleCommands = async () => {

        const commandFolder = fs.readdirSync('./commands');

        for (const folder of commandFolder) {
            const commandFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter(file => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command: /${command.data.name} has passed through the handler.`);  
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

        try{
            console.log(`Started refreshing ${client.commandArray.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
                { body: client.commandArray },
            ) as any[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch(error) {
            console.error(error);
        }
    };

};

