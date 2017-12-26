const config  = require("./config.json");
const Discord = require("discord.js");
const colors  = require("colors");
const fs      = require("fs");
const figlet  = require("figlet");

figlet.text('GATAOBOT', {
    font: 'big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
fs.readdir(config.cmdPath, (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <=0) {
        console.log(" ⚠ Error: No comands to load! ⚠ ".bgRed.white);
        return;
    }
    console.log(`✔ ${jsfiles.length} Commands loaded!`.green);

    jsfiles.forEach((f,i) => {
        let props = require(config.cmdPath+f);
        console.log(`${i+1}: ${props.help.name} (${f})`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log("Bot Ready! 👌".bgGreen.black);

    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log("Invite link:");
        console.log(colors.underline.cyan(link));
    })
    .catch(err => {
        console.log(err.stack);
    });
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let cmd = bot.commands.get(command.slice(config.prefix.length));
    if(cmd) {
        cmd.run(bot, message, args);
    } 
});

bot.login(config.token);