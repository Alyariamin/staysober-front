import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Users, Link, BookOpen, Shield } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'emergency' | 'support' | 'education' | 'community';
}

const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const resources: Resource[] = [
    {
      id: '1',
      title: 'SAMHSA\'s National Helpline',
      description: '24/7, 365-day-a-year treatment referral and information service for individuals and families facing mental and/or substance use disorders.',
      link: 'https://www.samhsa.gov/find-help/national-helpline',
      category: 'emergency'
    },
    {
      id: '2',
      title: 'National Suicide Prevention Lifeline',
      description: '988 provides 24/7, free and confidential support for people in distress, prevention and crisis resources.',
      link: 'https://988lifeline.org/',
      category: 'emergency'
    },
    {
      id: '3',
      title: 'Alcoholics Anonymous (AA)',
      description: 'Fellowship of men and women who share their experience, strength and hope with each other to recover from alcoholism.',
      link: 'https://www.aa.org/',
      category: 'support'
    },
    {
      id: '4',
      title: 'Narcotics Anonymous (NA)',
      description: 'Nonprofit fellowship of men and women for whom drugs had become a major problem.',
      link: 'https://www.na.org/',
      category: 'support'
    },
    {
      id: '5',
      title: 'SMART Recovery',
      description: 'Global community of mutual-support groups offering free, science-based mutual support meetings.',
      link: 'https://www.smartrecovery.org/',
      category: 'support'
    },
    {
      id: '6',
      title: 'National Institute on Alcohol Abuse and Alcoholism',
      description: 'Research and resources for understanding alcohol use disorder.',
      link: 'https://www.niaaa.nih.gov/',
      category: 'education'
    },
    {
      id: '7',
      title: 'National Institute on Drug Abuse',
      description: 'Research and resources for understanding substance use disorders.',
      link: 'https://www.drugabuse.gov/',
      category: 'education'
    },
    {
      id: '8',
      title: 'Reddit r/stopdrinking',
      description: 'Supportive community for people struggling with alcohol addiction.',
      link: 'https://www.reddit.com/r/stopdrinking/',
      category: 'community'
    }
  ];

  const categories = [
    { id: 'emergency', label: 'Emergency Help', icon: Phone, color: 'text-red-600 dark:text-red-400' },
    { id: 'support', label: 'Support Groups', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'education', label: 'Educational Resources', icon: BookOpen, color: 'text-green-600 dark:text-green-400' },
    { id: 'community', label: 'Online Communities', icon: Link, color: 'text-purple-600 dark:text-purple-400' }
  ];
  
  const filteredResources = activeCategory 
    ? resources.filter(resource => resource.category === activeCategory)
    : resources;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Support Resources</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Need immediate help?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">
                SAMHSA's National Helpline
              </h3>
              <p className="text-red-700 dark:text-red-200 mb-3">
                1-800-662-4357 (HELP)
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                24/7, 365-day-a-year treatment referral and information service for individuals facing substance use disorders.
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-1">
                National Suicide Prevention Lifeline
              </h3>
              <p className="text-red-700 dark:text-red-200 mb-3">
                988 or 1-800-273-8255
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                24/7 free and confidential support for people in distress, prevention and crisis resources.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === null 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Resources
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <category.icon className={`h-4 w-4 mr-2 ${
                activeCategory === category.id ? 'text-white' : category.color
              }`} />
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredResources.map(resource => {
          const category = categories.find(c => c.id === resource.category);
          
          return (
            <motion.div 
              key={resource.id}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center mb-3">
                  {category && (
                    <category.icon className={`h-5 w-5 mr-2 ${category.color}`} />
                  )}
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{resource.title}</h3>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  {resource.description}
                </p>
                
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Resources;