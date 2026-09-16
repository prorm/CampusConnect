const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technical', 'Cultural', 'Sports', 'Literary', 'Social'], 
    required: true 
  },
  description: { type: String, required: true },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coordinatorName: { type: String },
  membersCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  status: { 
    type: String, 
    enum: ['active', 'pending_approval', 'inactive'], 
    default: 'active' 
  },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);
