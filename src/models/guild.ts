import { HexColorString } from 'discord.js';
import { model, Schema, Document, Model } from 'mongoose';

export interface IGuild extends Document {
	id: string;
	language: string;
	embedColor: HexColorString;
	premium: Boolean,
}

const GuildSchema: Schema = new Schema<IGuild>({
	id: {
		type: String,
		required: true,
		unique: true
	},
	language: { type: String, default: 'fr_FR' },
	embedColor: { type: String, default: '#3f69de' },
	premium: { type: Boolean, default: false },
}, {
	timestamps: true,
	strict: false
})

export default model<IGuild>('Guild', GuildSchema);