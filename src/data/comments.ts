import { Comment } from '../types';

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    userId: 'user1',
    anonymousName: '匿名企鹅',
    content: '感同身受！我之前也是这样，后来学会了用邮件留证据，领导也不敢随便甩锅了',
    createdAt: '2024-01-15 11:30'
  },
  {
    id: 'c2',
    postId: '1',
    userId: 'user2',
    anonymousName: '匿名小熊',
    content: '抱抱你，加油！ 💪',
    createdAt: '2024-01-15 11:15'
  },
  {
    id: 'c3',
    postId: '1',
    userId: 'user3',
    anonymousName: '匿名狐狸',
    content: '可以试试和领导沟通一下，说明自己的工作量，实在不行就勇敢说不',
    createdAt: '2024-01-15 10:45'
  },
  {
    id: 'c4',
    postId: '2',
    userId: 'user1',
    anonymousName: '匿名企鹅',
    content: '恭喜恭喜！接好运～',
    createdAt: '2024-01-15 09:30'
  },
  {
    id: 'c5',
    postId: '3',
    userId: 'user4',
    anonymousName: '匿名兔子',
    content: '抱抱你，管理真的不容易 💪',
    createdAt: '2024-01-15 09:00'
  }
];
