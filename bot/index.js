const discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const sqlite = require("sqlite3");
const token = "";
const userId = "";

const client = new discord.Client({
	["intents"]: [
		discord.IntentsBitField.Flags.Guilds,
		discord.IntentsBitField.Flags.GuildMembers,
		discord.IntentsBitField.Flags.GuildMessages,
		discord.IntentsBitField.Flags.MessageContent,
		discord.IntentsBitField.Flags.GuildPresences,
		discord.IntentsBitField.Flags.GuildModeration
	]
});

let commands = [];

for (const file of fs.readdirSync(`${__dirname}/commands`)) {
	commands.push(require(`${__dirname}/commands/${file}`).command);
}

new discord.REST({["version"]: 10}).setToken(token).put(
	discord.Routes.applicationCommands(userId),
	{
		["body"]: commands
	}
);

{
	const utility = {
		["database"]: (fileDirectory,databaseName) => {
			const databasePath = `${__dirname}/database${fileDirectory.replace(__dirname,"")}/${databaseName}.db`;
	
			if (!fs.existsSync(databasePath.replaceAll(`/${databaseName}.db`,""))) {
				fs.mkdirSync(path.dirname(databasePath),{["recursive"]: true});
			}
			
			return new sqlite.Database(databasePath);
		},
		["nameFromMember"]: (member) => {
			return member.nickname ? member.nickname : member.user.globalName ? member.user.globalName : member.user.username;
		},
		["relativeMemberHierarchyRelation"]: (guild,member1,member2) => {
			let member1HasRoles = member1.roles !== undefined;
			let member2HasRoles = member2.roles !== undefined;

			if (member1HasRoles && !member2HasRoles) {
				return "lower";
			}

			if (!member1HasRoles && member2HasRoles) {
				return "higher";
			}

			if (!member1HasRoles && !member2HasRoles) {
				return "same";
			}
			
			if (member1.roles.highest.position > member2.roles.highest.position || member1.user.id === guild.ownerId) {
				return "lower" ;
			}

			if (member1.roles.highest.position < member2.roles.highest.position || member2.user.id === guild.ownerId) {
				return "higher" ;
			}

			if (member1.roles.highest.position === member2.roles.highest.position) {
				return "same" ;
			}
		}
	};
	
	client.on(discord.Events.InteractionCreate,(interaction) => {
		if (interaction.isChatInputCommand()) {
			require(`${__dirname}/commands/${interaction.commandName}`).execute(client,utility,interaction);
		}
	});
	
	for (const file of fs.readdirSync(`${__dirname}/scripts`)) {
		require(`${__dirname}/scripts/${file}`)(client,utility);
	}
}

client.on(discord.Events.ClientReady,() => {
	function setStatus() {
		client.user.setActivity(`Used in ${Array.from(client.guilds.cache.entries()).length} servers`,{["type"]: discord.ActivityType.Custom});
	}
	
	setStatus();
	setInterval(setStatus,10_000);
});

client.login(token);