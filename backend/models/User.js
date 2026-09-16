const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'coordinator', 'admin'], 
    default: 'student' 
  },
  usn: { type: String }, // e.g., 1MS24CI091
  department: { type: String, default: 'Computer Science' },
  year: { type: String, default: '3rd Year' },
  interests: [{ type: String }], // e.g. ["Coding", "AI/ML", "Robotics"]
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
