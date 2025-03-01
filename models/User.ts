import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  image: { type: String, default: '' },

});

export default mongoose.models.User || mongoose.model('User', UserSchema, 'users'); 