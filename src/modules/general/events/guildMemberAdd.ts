import { Event } from "../../../structures/Event";
import { addNewGuild, addNewMember } from "../../../helpers";

export default new Event("guildMemberAdd", async (member) => {
    await addNewGuild(member.guild);
    await addNewMember(null, member);
});
