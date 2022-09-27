import User from "../models/user";
import Member from "../models/member";
import GuildModel from "../models/guild";
import { ApplicationCommandOptionType, Guild, GuildMember, InteractionType } from "discord.js";
import config from "../config.json"
import { ExtendedInteraction } from "../typings/Command";
import { client } from "..";

export function interpolate(str: string, vars: { [x: string]: any; }) {
    for (let key in vars) {
        str = str.replace(new RegExp(`%${key}%`, 'g'), vars[key]);
    }
    return str;
}

export async function addNewMember(interaction?: ExtendedInteraction, member?: GuildMember) {

    if (interaction && !member) member = interaction.member as GuildMember;
    
    // find one and update user in db
    const user = await User.findOneAndUpdate({id: interaction.member.user.id}, interaction.member.user, {new: true, upsert: true});
    if(!user) new User(interaction.member.user).save();
    
    // Add member to db
    const memberdb = await Member.findOne({userId: interaction.member.id, guildId: interaction.member.guild.id});
    if(!memberdb) new Member({userId: interaction.member.id, guildId: interaction.member.guild.id}).save();
    
    // Add command interaction option user to db if not set
    if(interaction.type === InteractionType.ApplicationCommand){
        for (const option of interaction.options.data) {
            if(option.type === ApplicationCommandOptionType.User) {
                // find one and update user in db
                const user = await User.findOneAndUpdate({id: option.user.id}, option.user, {new: true, upsert: true});
                if(!user) new User(option.user).save();

                // Add member to db
                const member = await Member.findOne({userId: option.value, guildId: interaction.guild.id});
                if(!member) new Member({userId: option.value, guildId: interaction.guild.id}).save();
            }
        }
    }
}

export async function addNewGuild(guild : Guild) {
    // Add guild to db
    const thisguild = await GuildModel.findOne({id: guild.id})
    if(!thisguild) new GuildModel({
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        ownerId: guild.ownerId,
        preferredLocale: guild.preferredLocale
    }).save();
}

export async function language(guilddb: any, key: string, replacement?: { [key: string]: string }): Promise<string> {
    
    const language = guilddb.language || config.language
    delete require.cache[require.resolve(`../lang/${language}.json`)];
    const lang = require("../lang/"+language);

    replacement = {...config.emojis, ...replacement}
    let targetValue = !key || typeof key !== "string" ? // Path null ou non string 
    lang : key.split('.').reduce((o: { [x: string]: any; }, i: string | number) => { // Conversion du path en array et parcours de l'objet
            if (!o || !o[i]) { // key non trouvé
                console.error("Key does not exist : "+key);
            }
            return o[i];
    }, lang);
    if (replacement) {
        for (const [key, value] of Object.entries(replacement)) {
            const re = new RegExp(`\\$${key}`, 'g');
            targetValue = targetValue.replace(re, value)
        }
    }
    return targetValue
}

export async function setInteractionProperties(interaction: ExtendedInteraction) {

    interaction.lang = language;

    interaction.sendErrorMessage = async (interaction: ExtendedInteraction, error: string = "Error", ephemeral: boolean = true) => {
        // check if interaction is already replied
        if (interaction.deferred) {
            return interaction.followUp({ embeds: [{ description: error }], ephemeral: ephemeral });
        } else {
            return interaction.reply({ embeds: [{ description: error }], ephemeral: ephemeral });
        }
    }
}