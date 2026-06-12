import { User, MoodEntry } from '../types';

export const mockCurrentUser: User = {
  id: 'currentUser',
  anonymousName: '匿名树洞',
  avatar: 'https://picsum.photos/id/64/200/200',
  department: '产品部',
  createdAt: '2024-01-01'
};

export const mockMoodHistory: MoodEntry[] = [
  { id: 'm1', mood: 'happy', note: '今天项目上线成功，好开心！', createdAt: '2024-01-15' },
  { id: 'm2', mood: 'calm', note: '平静的一天', createdAt: '2024-01-14' },
  { id: 'm3', mood: 'anxious', note: '周一焦虑症发作', createdAt: '2024-01-13' },
  { id: 'm4', mood: 'happy', note: '收到客户好评！', createdAt: '2024-01-12' },
  { id: 'm5', mood: 'calm', note: '开会讨论新方案', createdAt: '2024-01-11' },
  { id: 'm6', mood: 'sad', note: '被领导批评了', createdAt: '2024-01-10' },
  { id: 'm7', mood: 'calm', note: '正常工作中', createdAt: '2024-01-09' },
  { id: 'm8', mood: 'happy', note: '周五啦！', createdAt: '2024-01-08' },
  { id: 'm9', mood: 'anxious', note: '项目deadline快到了', createdAt: '2024-01-07' },
  { id: 'm10', mood: 'happy', note: '第一次打卡', createdAt: '2024-01-06' }
];

export const mockBlockedKeywords: string[] = [
  '敏感词1',
  '敏感词2',
  '政治'
];
