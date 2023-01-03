import { CommandInteractionOptionResolver, GuildMember, TextChannel, InteractionType, ApplicationCommandOptionType } from "discord.js";
import { client } from "../../../";
import { Event } from "../../../structures/Event";
import { addNewGuild, addNewMember, language, setInteractionProperties } from "../../../helpers";
import type { ExtendedInteraction } from "../../../typings/Command";
import GuildModel from "../../../models/guild";

export default new Event("interactionCreate", async (interaction: ExtendedInteraction) => {
    
    await addNewMember(interaction);
    await addNewGuild(interaction.guild);

    await setInteractionProperties(interaction);

    // Chat Input Commands
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({embeds: [{description: await language(interaction.guild, 'errors.command_not_found')}] , ephemeral: true});

        const authorPerms = (interaction.channel as TextChannel).permissionsFor(interaction.member as GuildMember)
        if(command.userPermissions && !authorPerms.has(command.userPermissions)) return interaction.reply({embeds: [{description: await language(interaction.guild, 'errors.missingPerms')}] , ephemeral: true})
        
        if(command.deferReply) await interaction.deferReply({ephemeral: command.ephemeral || false});

        command.run({
            client,
            args: interaction.options as CommandInteractionOptionResolver,
            interaction: interaction as ExtendedInteraction,
            GuildModel: GuildModel.findOne({id: interaction.guild.id})
        });
    }
});