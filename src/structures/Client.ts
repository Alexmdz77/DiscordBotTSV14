import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    GatewayIntentBits,
    PartialUser,
} from "discord.js";
import type { CommandType } from "../typings/Command";
import type { RegisterCommandsOptions } from "../typings/Client";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import mongoose from 'mongoose'

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    language: String;

    constructor() {
        super({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildVoiceStates,
        ] });
    }

    start() {
        this.registerModules();
        this.mongoDBConnect();
        this.login(process.env.TOKEN);
    }
    
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
    async mongoDBConnect() {
        await mongoose.connect(
            process.env.MONGO_URI || '',
            {
                keepAlive: true,
                autoIndex: false,
            }
        )
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }

    async registerModules() {
        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}/../modules/*/commands/*{.ts,.js}`
        );
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });
        
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        // Event
        const eventFiles = await globPromise(
            `${__dirname}/../modules/*/events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}
