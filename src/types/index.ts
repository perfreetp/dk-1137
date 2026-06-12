export interface User {
  id: string;
  anonymousName: string;
  avatar: string;
  department?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  anonymousName: string;
  content: string;
  images?: string[];
  category: 'complaint' | 'help' | 'happy' | 'daily';
  visibility: 'department' | 'park';
  topicId?: string;
  topicName?: string;
  hugs: number;
  comments: number;
  isHugged: boolean;
  isCollected: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  anonymousName: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  postCount: number;
  isFollowed: boolean;
}

export interface Message {
  id: string;
  type: 'comment' | 'hug' | 'private' | 'system';
  fromUserId?: string;
  fromAnonymousName?: string;
  postId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry';
  note?: string;
  createdAt: string;
}

export interface BlockedKeyword {
  id: string;
  keyword: string;
}
