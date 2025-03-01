import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Add other fields as necessary
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 