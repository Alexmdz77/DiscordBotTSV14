import { Event } from "../../../structures/Event";
import { addNewMember } from "../../../helpers";

export default new Event("guildMemberAdd", async (member) => {
    await addNewMember(null, member);
});
