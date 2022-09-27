import { language } from "../../../helpers";
import { Command } from "../../../structures/Command";

export default new Command({
    name: "ping",
    description: "replies with pong and the latency",
    deferReply: true,
    run: async ({ interaction }) => {
        const response = await language(interaction.guild, "commands.ping.reponse", { ping: interaction.client.ws.ping.toString() });
        interaction.followUp(response);
    }
});
