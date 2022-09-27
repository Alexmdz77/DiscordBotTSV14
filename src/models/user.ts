import mongoose from 'mongoose';

export default mongoose.model(
	'User',
	new mongoose.Schema({
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
);