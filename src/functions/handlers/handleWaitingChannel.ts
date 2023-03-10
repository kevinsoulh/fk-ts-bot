import dotenv from 'dotenv';
dotenv.config();
import { ExtendedClient } from '../../';
import { Events } from 'discord.js';

module.exports = async (client: ExtendedClient) => {
    client.handleWaitingChannel = async () => {
        client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
            let newUserChannel = newState.channel;
            let oldUserChannel = oldState.channel;

            if (oldUserChannel === null && newUserChannel !== null) {

                if(newUserChannel.id === process.env.waitingChannelId) {

                    // User joins a voice channel
                    handleVoiceChannel(newUserChannel);
                }
            } else if(oldUserChannel !== null && newUserChannel !== null) {

                if(newUserChannel.id === process.env.waitingChannelId) {

                    // User was moved from one channel to another
                    handleVoiceChannel(newUserChannel);
                }
            }
        });
    };

    async function handleVoiceChannel(voiceChannel: any ) {
        let members = voiceChannel.members;

        if(members.size > 1) {

            // Move all users to a different voice channel
            let targetVoiceChannel = client.channels.cache.get(process.env.justTalkingChannelId || '');
            if(!targetVoiceChannel) return console.error("The target voice channel does not exist");
            for(let member of members.values()) {
                await member.voice.setChannel(targetVoiceChannel);
            }
        }
    }
}