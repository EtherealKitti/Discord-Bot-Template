const discord = require("discord.js");

module.exports = (client,utility) => {
    client.on(discord.Events.ClientReady,() => {
        console.log("Funni event go brr");
    });
};