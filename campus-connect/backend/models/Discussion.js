import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Academics', 'Campus Life', 'General Questions', 'Technical Discussions', 'Events'],
    default: 'General Questions'
  },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRoll: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  likes: [{ type: String }],
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Discussion = mongoose.model('Discussion', discussionSchema);

const commentSchema = new mongoose.Schema({
  discussionId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRoll: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  content: { type: String, required: true }
}, { timestamps: true });

export const Comment = mongoose.model('Comment', commentSchema);

