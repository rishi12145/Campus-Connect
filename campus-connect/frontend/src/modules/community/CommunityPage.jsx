import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import {
  MessagesSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Send,
  Calendar,
  Sparkles,
  User,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommunityPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [discussions, setDiscussions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Create Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Academics');

  const categories = [
    'All',
    'Academics',
    'Campus Life',
    'General Questions',
    'Technical Discussions',
    'Events'
  ];

  const loadData = () => {
    setDiscussions(storageService.getDiscussions());
    if (activeDiscussion) {
      setComments(storageService.getComments(activeDiscussion.id));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, [activeDiscussion]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showToast('Please provide both title and content.', 'error');
      return;
    }

    try {
      storageService.createDiscussion({
        title: postTitle,
        content: postContent,
        category: postCategory,
        authorId: user?.id || 'usr-student-1',
        authorName: user?.fullName || 'Student',
        authorRoll: user?.rollNumber || '202351001',
        authorAvatar: user?.avatarUrl
      });

      showToast('Discussion published to student forum!', 'success');
      setIsCreateModalOpen(false);
      setPostTitle('');
      setPostContent('');
      loadData();
    } catch (err) {
      showToast('Failed to create post.', 'error');
    }
  };

  const handleToggleLike = (discussionId, e) => {
    e.stopPropagation();
    try {
      const res = storageService.toggleLike(discussionId, user?.id || 'usr-student-1');
      if (res.isLiked) {
        showToast('Liked post!', 'success');
      }
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDeletePost = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      storageService.deleteDiscussion(id);
      showToast('Discussion removed successfully.', 'success');
      loadData();
      if (activeDiscussion?.id === id) setActiveDiscussion(null);
    }
  };

  const handleOpenThread = (disc) => {
    setActiveDiscussion(disc);
    setComments(storageService.getComments(disc.id));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeDiscussion) return;

    storageService.addComment({
      discussionId: activeDiscussion.id,
      authorId: user?.id || 'usr-student-active',
      authorName: user?.fullName || 'Student',
      authorRoll: user?.rollNumber || 'Verified Student',
      authorAvatar: user?.avatarUrl,
      content: newCommentText.trim()
    });

    setNewCommentText('');
    setComments(storageService.getComments(activeDiscussion.id));
    loadData();
    showToast('Reply posted!', 'success');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      storageService.deleteComment(commentId);
      setComments(storageService.getComments(activeDiscussion.id));
      loadData();
      showToast('Comment deleted.', 'success');
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#262626] shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
              Student Collaboration Space
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Community Discussions
          </h2>
          <p className="text-xs sm:text-sm text-[#AAAAAA]">
            Ask coursework questions, brainstorm hackathon teams, and stay connected with campus life.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, authors, topics..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="text-xs font-semibold text-[#888888]">
            Showing <span className="text-white font-bold">{filteredDiscussions.length}</span> thread(s)
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262626]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#B7F34A] text-[#0A0A0A] shadow-md shadow-[#B7F34A]/25'
                    : 'bg-[#1F1F1F] text-[#AAAAAA] hover:bg-[#282828] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discussions Grid */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
            No discussions found matching your query. Start the first thread!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDiscussions.map((disc) => {
              const isLiked = disc.likes?.includes(user?.id);
              return (
                <motion.div
                  key={disc.id}
                  whileHover={{ y: -3 }}
                  onClick={() => handleOpenThread(disc)}
                  className="p-5 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl hover:border-[#B7F34A] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#222222] text-[#B7F34A] border border-[#333333]">
                        {disc.category}
                      </span>
                      <span className="text-[11px] text-[#777777]">
                        {new Date(disc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#B7F34A] transition-colors leading-snug">
                      {disc.title}
                    </h3>
                    <p className="text-xs text-[#AAAAAA] line-clamp-3 leading-relaxed">
                      {disc.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#222222] text-[#B7F34A] flex items-center justify-center font-bold text-[10px]">
                        {disc.authorName?.[0] || 'U'}
                      </div>
                      <span className="text-xs font-semibold text-[#CCCCCC]">{disc.authorName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleLike(disc.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isLiked
                            ? 'bg-[#B7F34A] text-[#0A0A0A]'
                            : 'bg-[#222222] text-[#AAAAAA] hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{disc.likes?.length || 0}</span>
                      </button>

                      <span className="flex items-center gap-1 text-[#888888] text-xs">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF9F43]" />
                        <span>{disc.commentsCount || 0}</span>
                      </span>

                      {(disc.authorId === user?.id || user?.role === 'admin') && (
                        <button
                          onClick={(e) => handleDeletePost(disc.id, e)}
                          className="p-1 rounded text-[#777777] hover:text-rose-400 transition-colors"
                          title="Delete thread"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Discussion Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Start a Campus Discussion"
        subtitle="Engage with fellow IIITV-ICD students on coursework, hackathons, or campus life."
      >
        <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Discussion Topic / Title *
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Any recommendations for preparing for Mid-Sem exams?"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            >
              <option value="Academics">Academics</option>
              <option value="Campus Life">Campus Life</option>
              <option value="General Questions">General Questions</option>
              <option value="Technical Discussions">Technical Discussions</option>
              <option value="Events">Events</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Discussion Details *
            </label>
            <textarea
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Elaborate your question, provide context, or share relevant code/notes..."
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider"
          >
            Post Discussion
          </button>
        </form>
      </Modal>

      {/* Discussion Thread Modal */}
      <Modal
        isOpen={!!activeDiscussion}
        onClose={() => setActiveDiscussion(null)}
        title={activeDiscussion?.title || 'Discussion Thread'}
        subtitle={`Started by ${activeDiscussion?.authorName} in ${activeDiscussion?.category}`}
      >
        <div className="space-y-6 text-xs text-[#CCCCCC]">
          <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#888888]">
              <span className="font-bold text-[#B7F34A]">{activeDiscussion?.category}</span>
              <span>{new Date(activeDiscussion?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-white leading-relaxed whitespace-pre-line">
              {activeDiscussion?.content}
            </p>
          </div>

          {/* Comments Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#FF9F43]" />
              <span>Replies ({comments.length})</span>
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-[#777777] italic py-2">No replies yet. Be the first to share insight!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-[#1A1A1A] border border-[#262626] space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#888888]">
                      <span className="font-bold text-[#B7F34A]">{c.authorName}</span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        {(c.authorId === user?.id || user?.role === 'admin') && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-[#777777] hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post a comment form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a helpful peer reply..."
                className="flex-1 px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
              <button
                type="submit"
                className="btn-lime text-xs px-4 py-2 font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
