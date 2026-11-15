import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import {
  MessagesSquare,
  Search,
  Filter,
  Trash2,
  ThumbsUp,
  MessageSquare,
  User,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminCommunity = () => {
  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [postToDelete, setPostToDelete] = useState(null);
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [comments, setComments] = useState([]);

  const { showToast } = useNotification();

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

  const handleDeletePost = () => {
    if (!postToDelete) return;
    try {
      storageService.deleteDiscussion(postToDelete.id);
      showToast('Discussion thread deleted.', 'success');
      setPostToDelete(null);
      if (activeDiscussion?.id === postToDelete.id) setActiveDiscussion(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const handleDeleteComment = (commentId) => {
    storageService.deleteComment(commentId);
    setComments(storageService.getComments(activeDiscussion.id));
    loadData();
    showToast('Comment removed by moderator.', 'info');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#EEEEEC] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Student Forum Moderation
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Community Discussions Moderation
          </h2>
          <p className="text-xs text-[#777777]">
            Review student threads, moderate inappropriate comments, and enforce campus guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F8F6] border border-[#EEEEEC] px-3.5 py-2 rounded-2xl text-xs font-bold text-[#111111]">
          <MessagesSquare className="w-4 h-4 text-[#91C932]" />
          <span>{discussions.length} Total Discussion Threads</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEEEEC] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threads, content, authors..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8F8F6] border border-[#EEEEEC] rounded-xl text-xs text-[#111111] focus:bg-white focus:border-[#111111] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#777777]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F8F6] border border-[#EEEEEC] text-[#111111] outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Academics">Academics</option>
            <option value="Campus Life">Campus Life</option>
            <option value="General Questions">General Questions</option>
            <option value="Technical Discussions">Technical Discussions</option>
            <option value="Events">Events</option>
          </select>
        </div>
      </div>

      {/* Discussions Table */}
      <div className="bg-white rounded-3xl border border-[#EEEEEC] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F8F6] border-b border-[#EEEEEC] text-[#777777] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Thread Title & Snippet</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Engagement</th>
                <th className="p-4">Posted Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEC]">
              {filteredDiscussions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777777]">
                    No discussions found.
                  </td>
                </tr>
              ) : (
                filteredDiscussions.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="p-4 max-w-sm">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#111111]">{d.title}</h4>
                        <p className="text-[11px] text-[#777777] line-clamp-1">{d.content}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEEEEC] text-[#111111]">
                        {d.category}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-xs font-bold text-[#111111]">{d.authorName}</p>
                      <p className="text-[10px] font-mono text-[#777777]">{d.authorRoll}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-xs text-[#777777]">
                        <span className="flex items-center gap-1 font-bold text-[#111111]">
                          <ThumbsUp className="w-3 h-3 text-[#91C932]" /> {d.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[#111111]">
                          <MessageSquare className="w-3 h-3 text-blue-500" /> {d.commentsCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#777777]">
                      {new Date(d.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setActiveDiscussion(d);
                          setComments(storageService.getComments(d.id));
                        }}
                        className="btn-secondary text-[11px] font-bold px-2.5 py-1"
                      >
                        Inspect Thread
                      </button>

                      <button
                        onClick={() => setPostToDelete(d)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        title="Delete Thread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Moderate Thread Comments Modal */}
      <Modal
        isOpen={!!activeDiscussion}
        onClose={() => setActiveDiscussion(null)}
        title={activeDiscussion?.title || 'Inspect Thread'}
        subtitle={`Posted by ${activeDiscussion?.authorName} (${activeDiscussion?.authorRoll})`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F8F8F6] border border-[#EEEEEC] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
              Main Discussion Content:
            </span>
            <p className="text-xs text-[#111111] leading-relaxed whitespace-pre-line">
              {activeDiscussion?.content}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Moderate Comments ({comments.length})
            </h4>

            {comments.length === 0 ? (
              <p className="text-xs text-[#777777]">No comments on this thread.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {comments.map((com) => (
                  <div
                    key={com.id}
                    className="p-3 rounded-xl bg-white border border-[#EEEEEC] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#111111] flex items-center gap-1.5">
                        <span>{com.authorName}</span>
                        <span className="text-[10px] text-[#777777] font-mono">({com.authorRoll})</span>
                      </div>
                      <p className="text-xs text-[#777777]">{com.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(com.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                      title="Remove Spam / Inappropriate Comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Thread Dialog */}
      <ConfirmDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeletePost}
        title="Delete Discussion Thread"
        message={`Delete "${postToDelete?.title}" and all its replies?`}
        isDestructive
        confirmText="Delete Thread"
      />
    </div>
  );
};

