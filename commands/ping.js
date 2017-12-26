const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.channel.send("neutro é meme!");
}

module.exports.help = {
    name: "ping"
}