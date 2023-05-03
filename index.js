// Importowanie niezbędnych modułów
const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');

// Tworzenie instancji klienta
const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
]})

// Dodawanie komend
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event uruchamiający się, gdy bot jest gotowy
client.once('ready', () => {
    console.log('Bot gotowy!');
});

// Event aktywności bota// Set status and activity
client.on("ready", () => {
    client.user.setPresence({
      status: "online", // "idle", "dnd", and "invisible" are also valid status
      activities: [{
        name: "p.pomoc",
        type: "PLAYING"
      }]
    });
  });
  

// Event uruchamiający się, gdy nowa wiadomość zostanie wysłana
client.on('messageCreate', async message => {
    // Sprawdzenie, czy wiadomość została wysłana przez bota lub nie zaczyna się od prefiksu
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Podział wiadomości na komendę i argumenty
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Sprawdzenie, czy komenda istnieje
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // Sprawdzenie, czy komenda wymaga argumentów
    if (command.args && !args.length) {
        let reply = `Nie podałeś żadnych argumentów, ${message.author}!`;

        if (command.usage) {
            reply += `\nPoprawne użycie: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    // Obsługa błędów
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Wystąpił błąd podczas wykonywania komendy!');
    }
});

// Logowanie do Discorda z wykorzystaniem tokenu bota z pliku konfiguracyjnego
client.login(token);
