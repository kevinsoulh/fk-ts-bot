import { ExtendedClient } from '../..';
import { 
    Events,
    CommandInteractionOptionResolver, 
    CommandInteraction, SlashCommandBuilder, 
    StringSelectMenuBuilder, 
    PermissionFlagsBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    APITextInputComponent, 
    GuildMember,
    VoiceChannel
} from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Complete music system.')
    .addSubcommand(subcommand =>
        subcommand.setName("play")
            .setDescription("Play a song.")
            .addStringOption(option =>
                option.setName("query")
                    .setDescription("The song you want to play.")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("volume")
            .setDescription("Ajust the song volume.")
            .addIntegerOption(option =>
                option.setName("percent")
                    .setDescription("10 = 10%.")
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("options")
            .setDescription("Select an option.")
            .addStringOption(option =>
                option.setName("options")
                    .setDescription("Select an option.")
                    .setRequired(true)
                    .addChoices(
                        {name: "queue", value: "queue"},
                        {name: "skip", value: "skip"},
                        {name: "pause", value: "pause"},
                        {name: "resume", value: "resume"}, 
                        {name: "stop", value: "stop"}, 
                    )
            )
    ),
    

	async execute(interaction: CommandInteraction & { options: CommandInteractionOptionResolver }, client: ExtendedClient) {
        const { options, guild, channel } = interaction;

        const member = (interaction.member as GuildMember);

        const subcommand = options.getSubcommand();
        const query = options.getString('query');
        const volume = options.getInteger('percent');
        const option = options.getString('options');
        const voiceChannel = member?.voice.channel;

        const embed = new EmbedBuilder();

        if(!voiceChannel) {
            embed.setColor('Red')
            embed.setDescription('You must be in a voice channel to execute music commands.')
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try{
            switch(subcommand) {
                case 'play':

                    if(guild?.members.me?.voice.channelId !== null) {
                        if(member.voice.channelId !== guild?.members.me?.voice.channelId) {
                            embed.setColor('Red')
                            embed.setDescription(`You can't use music commands here as the bot is already active on <#${guild?.members.me?.voice.channelId}>`)
                            return await interaction.reply({ embeds: [embed], ephemeral: true });
                        }
    
                    }
                    
                    client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
                    await interaction.reply({ content: `🎶 Request received.` })
                    break;
                case 'volume':
                    client.distube.setVolume(voiceChannel, volume);
                    await interaction.reply({ content: `🔊 Volume has been set to ${volume}%` })
                    break;
                case 'options':
                    const queue = client.distube.getQueue(voiceChannel);
                    if(!queue) {
                        embed.setColor('Red')
                        embed.setDescription(`There is no active queue.`)
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    switch(option) {
                        case 'skip':
                            await queue.skip(voiceChannel);
                            embed.setColor('Blue')
                            embed.setDescription(`⏩ The song has been skipped.`)
                            await interaction.reply({ embeds: [embed], ephemeral: true });
                            break;
                        case 'stop':
                            await queue.stop(voiceChannel);
                            embed.setColor('Red')
                            embed.setDescription(`⏹️ The queue has been stopped.`)
                            await interaction.reply({ embeds: [embed], ephemeral: true });
                            break;
                        case 'pause':
                            await queue.pause(voiceChannel);
                            embed.setColor('Orange')
                            embed.setDescription(`⏸️ The song has been paused.`)
                            await interaction.reply({ embeds: [embed], ephemeral: true });
                            break;
                        case 'resume':
                            await queue.resume(voiceChannel);
                            embed.setColor('Green')
                            embed.setDescription(`⏯️ The song has been resumed.`)
                            await interaction.reply({ embeds: [embed], ephemeral: true });
                            break;
                        case 'queue':
                            embed.setColor('Purple')
                            embed.setDescription(`${queue.songs.map(
                                (song: { name: any; formattedDuration: any; }, id: number) => 
                                `\n**${id + 1}.** ${song.name} - \`${song.formattedDuration}\``
                            )}`);
                            await interaction.reply({ embeds: [embed], ephemeral: true });
                            break;
                    }
            }
        } catch(err) {
            console.log(err);
            embed.setColor('Red')
            embed.setDescription(`⛔ | Something went wrong...`)
            embed.addFields({ name: 'Error', value: '`'+`${err}`+'`' })
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } 
    },
};