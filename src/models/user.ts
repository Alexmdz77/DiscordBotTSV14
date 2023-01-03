import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
	id: string;
	username: string;
	discriminator: string;
	language: string;
	premium: Boolean,
}

const userSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	username: String,
	discriminator: String,
	language: {
		type: String,
		default: 'fr_FR'
	},
	premium: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true,
	strict: false
})
userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default model<IUser>('User', userSchema);