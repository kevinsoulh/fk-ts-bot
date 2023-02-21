import { CommandInteraction } from 'discord.js' 
import { ExtendedClient } from '../../';

module.exports = {
    name: 'interactionCreate',
    async execute (interaction: CommandInteraction | any, client: ExtendedClient) {
        const { commands } = client;
        const command = commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}