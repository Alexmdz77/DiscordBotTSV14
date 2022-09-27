import { Event } from "../../../structures/Event";
import { addNewGuild } from "../../../helpers";

export default new Event("guildCreate", async (guild) => {
    await addNewGuild(guild);
});
