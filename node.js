const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = 'xxx'; //bot token

const SOURCE_CHANNEL_ID = '1286467435532128370'; //The channel to forward messages from
const TARGET_CHANNEL_ID = '1305591096402771988'; //The channel to forward messages to

const DELAY_TIME = 2000;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    try {
        const sourceChannel = await client.channels.fetch(SOURCE_CHANNEL_ID);

        let messages = await sourceChannel.messages.fetch({ limit: 100 });
        console.log(`Fetched ${messages.size} old messages from the source channel.`);

        let delay = 0;
        messages.forEach((message) => {
            setTimeout(() => {
                forwardMessage(message);
            }, delay);
            delay += DELAY_TIME;
        });

    } catch (error) {
        console.error('Error fetching old messages:', error);
    }
});

client.on('messageCreate', (message) => {
    if (message.channel.id === SOURCE_CHANNEL_ID && !message.author.bot) {
        forwardMessage(message);
    }
});

async function forwardMessage(message) {
    try {
        const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
        if (targetChannel) {
            const timestamp = message.createdAt.toLocaleString();

            let forwardedMessage = `${message.author.tag} [${timestamp}]: ${message.content}`;
            
            if (message.attachments.size > 0) {
                message.attachments.forEach((attachment) => {
                    forwardedMessage += `\n${attachment.url}`;
                });
            }
            
            targetChannel.send(forwardedMessage);

            console.log(`Forwarded message from ${message.author.tag} at ${timestamp}`);
        } else {
            console.error('Target channel not found.');
        }
    } catch (error) {
        console.error('Error forwarding message:', error);
    }
}

client.login(TOKEN).catch(console.error);
