const discord = require("discord.js");
const path = require("path");

module.exports = {
    ["command"]: {
        ["name"]: path.basename(__filename).split(".")[0],
        ["description"]: "Button test go brr"
    },
    ["execute"]: async (client,sqliteDatabase,interaction,utilities) => {
        const message = await interaction.reply({
            ["components"]: [
                {
                    ["type"]: discord.ComponentType.ActionRow,
                    ["components"]: [
                        {
                            ["type"]: discord.ComponentType.Button,
                            ["label"]: "Test",
                            ["style"]: discord.ButtonStyle.Primary,
                            ["customId"]: "test"
                        }
                    ]
                }
            ]
        });

        message.awaitMessageComponent()
        .then(async (interaction) => {
            await interaction.reply(interaction.customId);
        });
    }
};