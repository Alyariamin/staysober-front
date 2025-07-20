import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Share2, User, Plus, Send } from 'lucide-react';

interface Story {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
  image?: string;
}

const Community: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Story[]>([
    {
      id: '1',
      author: 'Michael S.',
      timeAgo: '2 days ago',
      content: 'Today marks 1 year of sobriety for me. What a journey it has been. There were times when I thought I wouldn\'t make it, but with the support of my family and groups like this, I pushed through. To anyone struggling: it gets better, and you are stronger than you know.',
      likes: 128,
      comments: 42,
    },
    {
      id: '2',
      author: 'Sarah J.',
      timeAgo: '1 week ago',
      content: 'Six months sober today! I\'ve lost 20 pounds, rebuilt relationships with my children, and finally feel like myself again. The fog has lifted. I still have bad days, but now I know how to deal with them without reaching for a bottle.',
      likes: 95,
      comments: 23,
      image: 'https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: '3',
      author: 'David R.',
      timeAgo: '2 weeks ago',
      content: 'Three years sober today. If you\'re just starting out, know that it gets easier. Not easy, but easier. The cravings fade, your mind clears, and you start to build a life you don\'t need to escape from. Hang in there.',
      likes: 210,
      comments: 56,
    },
    {
      id: '4',
      author: 'Emma L.',
      timeAgo: '3 weeks ago',
      content: 'I slipped up last weekend after 4 months of sobriety. I was so disappointed in myself. But instead of letting it spiral, I got back to my meetings the next day. Recovery isn\'t a straight line - it\'s about getting back up when you fall. Today is day 5 again, and I\'m committed.',
      likes: 183,
      comments: 61,
    }
  ]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postContent.trim()) return;
    
    const newPost: Story = {
      id: Date.now().toString(),
      author: 'You',
      timeAgo: 'Just now',
      content: postContent,
      likes: 0,
      comments: 0
    };
    
    setPosts([newPost, ...posts]);
    setPostContent('');
    setShowPostForm(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
            Community Success Stories
          </h1>
          
          <button
            onClick={() => setShowPostForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share Your Story
          </button>
        </div>
        
        {showPostForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-4">
              Share Your Recovery Story
            </h3>
            
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ocean:focus:ring-cyan-500 forest:focus:ring-green-500 sunset:focus:ring-orange-500 lavender:focus:ring-purple-500 dark:bg-slate-700 dark:text-white resize-none"
                  placeholder="Share your journey, milestones, challenges, or words of encouragement for others..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostForm(false);
                    setPostContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Share Story
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        <div className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6 mb-8">
          <p className="text-slate-600 dark:text-slate-300 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">
            Reading about others' successes can be inspiring and motivating. Here are real stories from people on their recovery journey.
          </p>
        </div>
      </div>
      
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map(story => (
          <motion.div 
            key={story.id}
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 ocean:bg-cyan-50/50 forest:bg-green-50/50 sunset:bg-orange-50/50 lavender:bg-purple-50/50 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 ocean:bg-cyan-100 forest:bg-green-100 sunset:bg-orange-100 lavender:bg-purple-100 p-3 rounded-full mr-3">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
                    {story.author}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{story.timeAgo}</p>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-4 whitespace-pre-line">
                {story.content}
              </p>
              
              {story.image && (
                <div className="mb-4 -mx-6">
                  <img 
                    src={story.image} 
                    alt="Success story" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              <div className="flex border-t border-gray-100 dark:border-slate-700 ocean:border-cyan-200 forest:border-green-200 sunset:border-orange-200 lavender:border-purple-200 pt-4 space-x-4">
                <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ocean:hover:text-cyan-600 forest:hover:text-green-600 sunset:hover:text-orange-600 lavender:hover:text-purple-600">
                  <ThumbsUp className="h-4 w-4 mr-1.5" />
                  <span>{story.likes}</span>
                </button>
                <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ocean:hover:text-cyan-600 forest:hover:text-green-600 sunset:hover:text-orange-600 lavender:hover:text-purple-600">
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  <span>{story.comments}</span>
                </button>
                <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ocean:hover:text-cyan-600 forest:hover:text-green-600 sunset:hover:text-orange-600 lavender:hover:text-purple-600 ml-auto">
                  <Share2 className="h-4 w-4 mr-1.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="flex justify-center">
          <button className="py-2 px-4 border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            Load More Stories
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Community;