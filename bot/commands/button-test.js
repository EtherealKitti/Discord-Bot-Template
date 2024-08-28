const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Button test go brr"
    },
    ["execute"]: async (client,sqliteDatabase,interaction,utilities) => {
        await interaction.reply({
            ["components"]: [
                {
                    ["components"]: [
                        {
                            ["type"]: discord.ComponentType.Button,
                            ["label"]: "Test",
                            ["style"]: discord.ButtonStyle.Primary,
                            ["customId"]: `${client.user.id}/test`
                        }
                    ]
                }
            ]
        });
        
        interaction.channel.createMessageComponentCollector().on("collect",async (interaction) => {
            await interaction.channel.send(interaction.customId);
        });
    }
};