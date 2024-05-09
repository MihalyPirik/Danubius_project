import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const DiscordSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  discordId: {
    type: String,
    required: true,
    unique: true
  },
});

DiscordSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const DiscordModel = mongoose.model('DiscordModel', DiscordSchema, 'discordUsers');

export default DiscordModel;