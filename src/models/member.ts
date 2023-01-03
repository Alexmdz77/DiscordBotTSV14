import { model, Schema, Document } from 'mongoose';

export interface IMember extends Document {
	userId: string;
	guildId: string;
}

const memberSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	guildId: {
		type: String,
		required: true
	},
}, {
	timestamps: true,
	strict: false
})
memberSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default model<IMember>('Member', memberSchema);