const axios = require('axios');
const Discord = require('discord.js');
const emojiFlags = require('emoji-flags');
const config  = require("./../config.json");

function getPersonaStatus(personastate, embed) {
    switch (personastate) {
        case 0:
            embed.setColor("#0f1216");    
            return "⚫ Offline";
        case 1:
            embed.setColor("#43b52d");    
            return "✅ Online";
        case 2:
            embed.setColor("#be2121");    
            return "⛔ Busy";
        case 3:
            embed.setColor("#f58e2a");    
            return "🔸 Away";
        case 4:
            embed.setColor("#2b1a5c");    
            return "💤 Snooze";
        case 5:
            embed.setColor("#be87bd");    
            return "🔎 looking to trade";
        case 6:
            embed.setColor("#be87bd");    
            return "🔎 looking to play";
    }
}

const getSteamId = name => {
    return new Promise( (resolve,reject) => {
        axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.steamKey}&vanityurl=${name}`).then(response => {
                response = response.data.response;
                if (response.success != 1) {
                    var embed = new Discord.RichEmbed();
                    embed.setColor("d61e1e")
                        .setTitle("⚠ Perfil não encontrado")
                        .setDescription("Certifique-se que você criou uma url custom para seu profile\n**__Este bot usa custom urls e não o seu ID da steam__**")
                        .addField("Como criar uma custom url para seu profile", "- Vá até o seu profile da steam pelo navegador\n- Clique em Editar perfil\n- Altere o campo custom url para o que quiser\n- Digite o comando novamente no bot usando sua custom url nova")
                        .addField("Exemplo:", "```$steam LOLiFiSTER_```");

                    message.channel.send({ embed });
                    reject("No profile found");
                } else {
                    resolve(response.steamid);
                };
            })
            .catch(err => console.log(err));
    });
}

const getSteamInfo = steamid => {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${config.steamKey}&format=json&steamids=${steamid}&include_appinfo`).then(response => {
            let player = response.data.response.players[0];
            embed = new Discord.RichEmbed();

            //Basic Info
            embed.setThumbnail(player.avatarmedium);
            embed.setAuthor(player.personaname, player.avatar, player.profileurl);
            embed.setTitle(getPersonaStatus(player.personastate, embed));

            //Country Flag
            if (player.loccountrycode) {
                let flag = emojiFlags.countryCode(player.loccountrycode).emoji;
                embed.setFooter(`Country: ${flag}`);
            }
            //Private Profile
            if (player.communityvisibilitystate === 1) {
                embed.setFooter("⚠ Este perfil é privado");
            }

            //Game being played
            if (player.gameid) {
                getGameInfo(player.gameid).then(response => {
                    embed.setTitle(`🎮 ${response.name}`);
                    embed.setColor("#0e80f4");
                    embed.setURL(`http://store.steampowered.com/app/${player.gameid}`);

                    if (player.gameserverip) {
                        embed.addField("Join Server", `steam://connect/${player.gameserverip}`);
                        embed.setThumbnail(null);
                    }
                    if (player.lobbysteamid && player.steamid) {
                        embed.addField("Join Game", `steam://joinlobby/${player.gameid}/${player.lobbysteamid}/${player.steamid}/`, true);
                        embed.setThumbnail(null);
                    }
                    resolve(embed);
                });
            } else {
                resolve(embed);
            }
        }).catch(err => {
            reject(err);
        });
    });
};

const getGameInfo = gameid => {
    return new Promise((resolve,reject) => {
        axios.get(`http://store.steampowered.com/api/appdetails/?appids=${gameid}`).then(response => {
            response = response.data[gameid].data
            resolve(response);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports.run = async (bot, message, args) => {
    getSteamId(args[0])
    .then(steamid => getSteamInfo(steamid))
    .then(embed => message.channel.send({embed}))
    .catch(err => console.log(err));
};

module.exports.help = {
    name: "steam"
}