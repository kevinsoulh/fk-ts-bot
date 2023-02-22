import { ExtendedClient } from '../../';

module.exports = {
    name: 'ready',
    onde: true,
    async execute(client: ExtendedClient) {
        const status = (queue: any) =>
            `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
                queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
            }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
        client.distube
            .on('playSong', (queue: { textChannel: { send: (arg0: string) => any; }; }, song: { name: any; formattedDuration: any; user: any; }) =>
                queue.textChannel.send(
                `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
                    song.user
                }\n${status(queue)}`
                )
            )
            .on('addSong', (queue: { textChannel: { send: (arg0: string) => any; }; }, song: { name: any; formattedDuration: any; user: any; }) =>
                queue.textChannel.send(
                `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
                )
            )
            .on('addList', (queue: { textChannel: { send: (arg0: string) => any; }; }, playlist: { name: any; songs: string | any[]; }) =>
                queue.textChannel.send(
                `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
                    playlist.songs.length
                } songs) to queue\n${status(queue)}`
                )
            )
            .on('error', (channel: { send: (arg0: string) => void; }, e: { toString: () => string | any[]; }) => {
                if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
                else console.error(e)
            })
            .on('empty', (channel: { send: (arg0: string) => any; }) => channel.send('Voice channel is empty! Leaving the channel...'))
            .on('searchNoResult', (message: { channel: { send: (arg0: string) => any; }; }, query: any) =>
                message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
            )
            .on('finish', (queue: { textChannel: { send: (arg0: string) => any; }; }) => queue.textChannel.send('Finished!'))
    }
}