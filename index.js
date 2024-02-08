require('dotenv/config');

const { Client } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

client.on('ready', () => {
    console.log('The bot is online.')
});

const CHANNELS = ['1205114084157169664'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'Chat GPT is a friendly chatbot.'
    });

    let prevMsgs = await message.channel.messages.fetch({ limit: 10});
    prevMsgs.reverse();

    prevMsgs.forEach((msg) => {
        if (msg.author.bot && msg.author.id !== client.user.id) return;

        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content,
            });

            return;
        }

        conversation.push({
            role: 'user',
            name: username,
            content: msg.content,
        })
    })

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversation,
    })
    .catch((error) => console.error('OpenAI Error:\n', error));

    if (!response) {
        message.reply('Trouble with OpenAI API. Try Again.');
    }

    message.reply(response.choices[0].message.content);
});

client.login(process.env.TOKEN);
