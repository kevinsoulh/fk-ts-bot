import config from '../../config';
import { setTimeout } from 'node:timers/promises';
import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { ExtendedClient } from '../..';
// const wait =  require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong.'),

	async execute(interaction: CommandInteraction, client: ExtendedClient) {

        console.log(client)

        await interaction.reply({ content: `Pong!`, ephemeral: true });   
    },
};