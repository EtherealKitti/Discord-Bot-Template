const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Button test go brr"
    },
    ["execute"]: async (client,sqliteDatabase,interaction,utilities) => {
        interaction.channel.createMessageComponentCollector().on("collect",async (component) => {
            interaction.channel.send(component.customId);
        });
        
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
    }
};