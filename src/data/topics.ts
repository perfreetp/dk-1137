import { Topic } from '../types';

export const mockTopics: Topic[] = [
  {
    id: 'topic1',
    name: '职场吐槽',
    description: '工作压力大？领导奇葩？同事离谱？来这里吐吐槽吧！',
    coverImage: 'https://picsum.photos/id/64/100/100',
    postCount: 1256,
    isFollowed: true
  },
  {
    id: 'topic2',
    name: '求助问答',
    description: '职场困惑、生活难题，这里有热心小伙伴帮你出主意',
    coverImage: 'https://picsum.photos/id/91/100/100',
    postCount: 892,
    isFollowed: false
  },
  {
    id: 'topic3',
    name: '职场好消息',
    description: '升职加薪、跳槽成功、收到offer...分享你的喜悦！',
    coverImage: 'https://picsum.photos/id/177/100/100',
    postCount: 567,
    isFollowed: true
  },
  {
    id: 'topic4',
    name: '园区生活',
    description: '食堂美食、园区风景、通勤日常...记录园区里的点点滴滴',
    coverImage: 'https://picsum.photos/id/787/100/100',
    postCount: 2134,
    isFollowed: false
  },
  {
    id: 'topic5',
    name: '技能提升',
    description: '学习心得、技能分享、成长记录，一起进步！',
    coverImage: 'https://picsum.photos/id/1/100/100',
    postCount: 456,
    isFollowed: false
  },
  {
    id: 'topic6',
    name: '摸鱼时刻',
    description: '上班无聊？来这里找点乐子，互相治愈～',
    coverImage: 'https://picsum.photos/id/237/100/100',
    postCount: 1823,
    isFollowed: true
  },
  {
    id: 'topic7',
    name: '健康养生',
    description: '久坐办公、肩颈不适？分享健康养生小技巧',
    coverImage: 'https://picsum.photos/id/225/100/100',
    postCount: 345,
    isFollowed: false
  },
  {
    id: 'topic8',
    name: '租房经验',
    description: '园区附近租房攻略、合租体验、通勤时间...',
    coverImage: 'https://picsum.photos/id/1082/100/100',
    postCount: 678,
    isFollowed: false
  }
];
