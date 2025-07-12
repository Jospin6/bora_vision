'use client';

import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaHeart, FaPaperPlane, FaReply } from 'react-icons/fa';

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  text: string;
  likes: number;
  liked: boolean;
  timestamp: string;
  replies?: Comment[];
}

interface CommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  commentsCount: number;
}

export default function Comments({ isOpen, onClose, videoId, commentsCount }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        username: 'marie_photo',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true
      },
      text: 'Magnifique ! 😍 Comment tu fais pour avoir cette qualité ?',
      likes: 24,
      liked: false,
      timestamp: '2h',
      replies: [
        {
          id: '1-1',
          user: {
            username: 'alex_creator',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          text: 'Merci ! J\'utilise un iPhone 15 Pro avec un bon éclairage naturel 📱',
          likes: 8,
          liked: false,
          timestamp: '1h'
        }
      ]
    },
    {
      id: '2',
      user: {
        username: 'tom_video',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      text: 'Incroyable cette transition ! 🔥',
      likes: 156,
      liked: true,
      timestamp: '4h'
    },
    {
      id: '3',
      user: {
        username: 'sarah_art',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      text: 'Tu peux faire un tuto ? 🙏',
      likes: 89,
      liked: false,
      timestamp: '6h'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleLike = (commentId: string, isReply?: boolean, parentId?: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === commentId 
                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            )
          };
        } else if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      })
    );
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        username: 'vous',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      text: newComment,
      likes: 0,
      liked: false,
      timestamp: 'maintenant'
    };

    if (replyingTo) {
      setComments(prevComments =>
        prevComments.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
      setReplyingTo(null);
    } else {
      setComments(prevComments => [comment, ...prevComments]);
    }

    setNewComment('');
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold">
            Commentaires ({formatCount(commentsCount)})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors touch-manipulation"
          >
            <FaTimes className="text-white text-xl" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-semibold text-sm">
                      {comment.user.username}
                    </span>
                    {comment.user.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                  </div>
                  
                  <p className="text-white text-sm leading-relaxed mb-2">
                    {comment.text}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center space-x-1 group"
                    >
                      <FaHeart 
                        className={`text-sm transition-colors ${
                          comment.liked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                        }`} 
                      />
                      <span className="text-gray-400 text-xs">
                        {comment.likes > 0 ? formatCount(comment.likes) : ''}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <FaReply className="text-sm" />
                      <span className="text-xs">Répondre</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-semibold text-sm">
                            {reply.user.username}
                          </span>
                          <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                        </div>
                        
                        <p className="text-white text-sm leading-relaxed mb-2">
                          {reply.text}
                        </p>
                        
                        <button
                          onClick={() => handleLike(reply.id, true, comment.id)}
                          className="flex items-center space-x-1 group"
                        >
                          <FaHeart 
                            className={`text-sm transition-colors ${
                              reply.liked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                            }`} 
                          />
                          <span className="text-gray-400 text-xs">
                            {reply.likes > 0 ? formatCount(reply.likes) : ''}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="border-t border-gray-800 p-4 safe-area-pb">
          {replyingTo && (
            <div className="flex items-center justify-between mb-3 p-2 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300 text-sm">
                Réponse à {comments.find(c => c.id === replyingTo)?.user.username}
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmitComment} className="flex items-end space-x-3">
            <div className="flex-shrink-0">
              <img
                src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Votre avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? "Écrivez une réponse..." : "Ajoutez un commentaire..."}
                className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                rows={1}
                style={{ minHeight: '44px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`p-3 rounded-full transition-all duration-200 touch-manipulation ${
                newComment.trim()
                  ? 'bg-gradient-to-r from-[#FF0050] to-[#7C3AED] text-white active:scale-95'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}