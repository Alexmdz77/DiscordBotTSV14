import { language } from "../../../helpers";
import { Command } from "../../../structures/Command";

export default new Command({
    name: "ping",
    description: "replies with pong and the latency",
    deferReply: true,
    ephemeral: true,
    run: async ({ interaction }) => {
        const response = await language(interaction.guild, "commands.ping.response", { ping: interaction.client.ws.ping.toString() });
        interaction.followUp(response);
    }
});
