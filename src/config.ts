import dotenv from 'dotenv';
dotenv.config();
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, CLOUDCONVERT_API_KEY } = process.env;

if(!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN || !CLOUDCONVERT_API_KEY) {
    throw new Error('Missing environment variables');
}

const config: Record<string, string> = {
    CLIENT_ID,
    GUILD_ID,
    DISCORD_TOKEN,
    CLOUDCONVERT_API_KEY
}

export default config;