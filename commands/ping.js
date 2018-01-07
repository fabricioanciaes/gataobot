const Discord = module.require("discord.js");
const emojiFlags = require('emoji-flags');

module.exports.run = async (bot, message, args) => {
    
    message.channel.send(`${emojiFlags.countryCode("BR").emoji} neutro é meme!`);

}

module.exports.help = {
    name: "ping"
}