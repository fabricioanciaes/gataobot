const Discord = module.require("discord.js");
const ScrapeIt = module.require("scrape-it");

module.exports.run = async (bot, message, args) => {
    ScrapeIt(`http://steamcommunity.com/id/${args[0]}/`, {
            avatar: {
                selector: '.playerAvatarAutoSizeInner img',
                attr: 'src'
            },
            name: '.actual_persona_name',
            status: '.profile_in_game_header',
            game: '.profile_in_game_name',
            joinGame: {
                selector: '.profile_in_game_joingame a',
                attr: 'href',
                eq: 0,
            },
        private: '.profile_private_info'

    }).then(steam => {
        let embed = new Discord.RichEmbed();

        if (steam.private === "This profile is private.") {
            message.channel.send(`⚠ O perfil de **${args[0]}** é Privado`);
            return;
        }

        if (steam.status === "Currently In-Game") {
            if (steam.joinGame != "steam://") {
                embed.addField("Join Game", steam.joinGame);
            }
        } else {
            message.channel.send(`⚠ **${args[0]}** não está jogando agora`);
            return;
        }

        console.log(steam);
        
        embed.setColor("#f74141");
        embed.setAuthor(steam.name, steam.avatar, `http://steamcommunity.com/id/${args[0]}/`);
        embed.setTitle(steam.status);
        embed.setDescription(steam.game);

        

        

        message.channel.send({embed: embed});
    })
}

module.exports.help = {
    name: "steam"
}