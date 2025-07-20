import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.", author: "Unknown" },
  { text: "One day at a time.", author: "AA Mantra" },
  { text: "Recovery is about progression, not perfection.", author: "Unknown" },
  { text: "Sometimes the smallest step in the right direction ends up being the biggest step of your life.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "I understood, through rehab, things about creating characters. I understood that creating whole people means knowing where we come from, how we can make a mistake and how we overcome things to make ourselves stronger.", author: "Samuel L. Jackson" },
  { text: "Though no one can go back and make a brand-new start, anyone can start from now and make a brand-new ending.", author: "Carl Bard" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "I think that the power is the principle. The principle of moving forward, as though you have the confidence to move forward, eventually gives you confidence when you look back and see what you've done.", author: "Robert Downey Jr." }
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  if (!quote) return null;

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={quote.text}
        className="flex-1"
      >
        <p className="text-slate-700 dark:text-slate-200 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 text-lg mb-4 italic">
          "{quote.text}"
        </p>
        
        <p className="text-right text-sm text-slate-500 dark:text-slate-400 ocean:text-cyan-500 forest:text-green-500 sunset:text-orange-500 lavender:text-purple-500">
          — {quote.author}
        </p>
      </motion.div>
      
      <button 
        onClick={refreshQuote}
        className="mt-6 self-end flex items-center text-sm text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 hover:underline"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        New quote
      </button>
    </div>
  );
};

export default MotivationalQuote;