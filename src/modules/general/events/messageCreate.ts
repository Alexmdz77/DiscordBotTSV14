import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../../../";
import { Event } from "../../../structures/Event";
import type { ExtendedInteraction } from "../../../typings/Command";
import { addNewGuild, addNewMember } from "../../../helpers";

export default new Event("messageCreate", async (message) => {
    
    await addNewGuild(message.guild);
    await addNewMember(null, message.member);
    
});
