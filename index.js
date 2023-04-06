const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // ...
    ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: 'p.pomoc' }],
    status: 'online',
  });
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; // ignoruje wiadomości bez prefiksu lub od innych botów
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  });

client.login(token);