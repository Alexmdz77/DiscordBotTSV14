import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    ChatInputCommandInteraction,
    PermissionResolvable,
    Message,
    BaseInteraction,
    ButtonInteraction,
    CacheType
} from "discord.js";
import { ExtendedClient } from "../structures/Client";
import GuildModel from "../models/guild";

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */
export abstract class ExtendedInteraction extends ChatInputCommandInteraction {
    guildData: any;
    member: GuildMember;
    lang: Function;
    sendErrorMessage: Function;
}

interface RunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    GuildModel: GuildModel;
    args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    clientPermissions?: PermissionResolvable[];
    usage?: string;
    aliases?: string[];
    deferReply?: boolean;
    run: RunFunction;
} & ChatInputApplicationCommandData;