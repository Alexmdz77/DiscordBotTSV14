import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
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

export default mongoose.model('Member', memberSchema);