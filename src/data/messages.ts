import { Message } from '../types';

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    type: 'hug',
    fromUserId: 'user1',
    fromAnonymousName: '匿名企鹅',
    postId: '1',
    content: '给你一个温暖的抱抱 💕',
    isRead: false,
    createdAt: '2024-01-15 11:00'
  },
  {
    id: 'msg2',
    type: 'comment',
    fromUserId: 'user2',
    fromAnonymousName: '匿名小熊',
    postId: '1',
    content: '我之前也是这样，后来学会了用邮件留证据，领导也不敢随便甩锅了',
    isRead: false,
    createdAt: '2024-01-15 10:45'
  },
  {
    id: 'msg3',
    type: 'comment',
    fromUserId: 'user3',
    fromAnonymousName: '匿名狐狸',
    postId: '2',
    content: '恭喜恭喜！接好运～',
    isRead: true,
    createdAt: '2024-01-15 09:30'
  },
  {
    id: 'msg4',
    type: 'hug',
    fromUserId: 'user4',
    fromAnonymousName: '匿名兔子',
    postId: '3',
    content: '抱抱你，管理真的不容易 💪',
    isRead: true,
    createdAt: '2024-01-15 09:00'
  },
  {
    id: 'msg5',
    type: 'private',
    fromUserId: 'user5',
    fromAnonymousName: '匿名猫咪',
    content: '你好呀，看到你的帖子，感觉我们境遇很像，有空聊聊吗？',
    isRead: false,
    createdAt: '2024-01-14 20:00'
  },
  {
    id: 'msg6',
    type: 'system',
    content: '你的帖子「第一次当小组长...」被收录到「求助问答」话题精选 🌟',
    isRead: true,
    createdAt: '2024-01-14 18:00'
  },
  {
    id: 'msg7',
    type: 'comment',
    fromUserId: 'user6',
    fromAnonymousName: '匿名考拉',
    postId: '6',
    content: '建议先还房贷，剩余的可以分成3份：1份投资自己，1份存起来应急，1份用来改善生活',
    isRead: true,
    createdAt: '2024-01-14 16:30'
  },
  {
    id: 'msg8',
    type: 'hug',
    fromUserId: 'user7',
    fromAnonymousName: '匿名松鼠',
    postId: '7',
    content: '哈哈哈感同身受！',
    isRead: false,
    createdAt: '2024-01-14 13:00'
  }
];
