require('dotenv/config');

const { Client } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

client.on('read', () => {
    console.login('The bot is online.')
});

const CHANNELS = ['1205114084157169664'];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

});

client.login(process.env.TOKEN);
