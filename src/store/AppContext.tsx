import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { Post, Comment, MoodEntry } from '../types';
import { mockPosts } from '../data/posts';
import { mockComments } from '../data/comments';
import { mockMoodHistory, mockCurrentUser } from '../data/users';

interface AppContextType {
  user: {
    id: string;
    anonymousName: string;
    avatar: string;
    department: string;
  };
  updateNickname: (name: string) => void;
  
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  getPost: (postId: string) => Post | undefined;
  
  comments: Record<string, Comment[]>;
  addComment: (postId: string, comment: Comment) => void;
  getComments: (postId: string) => Comment[];
  
  blockedKeywords: string[];
  addBlockedKeyword: (keyword: string) => void;
  removeBlockedKeyword: (keyword: string) => void;
  
  moodHistory: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  
  myPosts: Post[];
  myComments: Comment[];
  myCollections: Post[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(mockCurrentUser);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const grouped: Record<string, Comment[]> = {};
    mockComments.forEach(c => {
      if (!grouped[c.postId]) grouped[c.postId] = [];
      grouped[c.postId].push(c);
    });
    return grouped;
  });
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(mockMoodHistory);

  useEffect(() => {
    const savedUser = Taro.getStorageSync('user');
    if (savedUser) setUser(savedUser);
    
    const savedKeywords = Taro.getStorageSync('blockedKeywords');
    if (savedKeywords) setBlockedKeywords(savedKeywords);
    
    const savedPosts = Taro.getStorageSync('posts');
    if (savedPosts) setPosts(savedPosts);
    
    const savedMood = Taro.getStorageSync('moodHistory');
    if (savedMood) setMoodHistory(savedMood);
  }, []);

  useEffect(() => {
    Taro.setStorageSync('user', user);
  }, [user]);

  useEffect(() => {
    Taro.setStorageSync('blockedKeywords', blockedKeywords);
  }, [blockedKeywords]);

  useEffect(() => {
    Taro.setStorageSync('posts', posts);
  }, [posts]);

  useEffect(() => {
    Taro.setStorageSync('moodHistory', moodHistory);
  }, [moodHistory]);

  const updateNickname = (name: string) => {
    setUser(prev => ({ ...prev, anonymousName: name }));
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
  };

  const getPost = (postId: string) => {
    return posts.find(p => p.id === postId);
  };

  const addComment = (postId: string, comment: Comment) => {
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
    updatePost(postId, {
      comments: (comments[postId]?.length || 0) + 1
    });
  };

  const getComments = (postId: string) => {
    return comments[postId] || [];
  };

  const addBlockedKeyword = (keyword: string) => {
    if (!blockedKeywords.includes(keyword)) {
      setBlockedKeywords(prev => [...prev, keyword]);
    }
  };

  const removeBlockedKeyword = (keyword: string) => {
    setBlockedKeywords(prev => prev.filter(k => k !== keyword));
  };

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodHistory(prev => [entry, ...prev]);
  };

  const myPosts = posts.filter(p => p.userId === user.id);
  const myCollections = posts.filter(p => p.isCollected);
  const myComments = Object.values(comments).flat().filter(c => c.userId === user.id);

  return (
    <AppContext.Provider value={{
      user,
      updateNickname,
      posts,
      addPost,
      updatePost,
      getPost,
      comments,
      addComment,
      getComments,
      blockedKeywords,
      addBlockedKeyword,
      removeBlockedKeyword,
      moodHistory,
      addMoodEntry,
      myPosts,
      myComments,
      myCollections
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
