import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockMessages } from '../../data/messages';
import { useApp } from '../../components/AppProvider';
import styles from './index.module.scss';

type MessageType = 'all' | 'comment' | 'hug' | 'private';

const MessagesPage: React.FC = () => {
  const { privateMessages } = useApp();
  const [activeTab, setActiveTab] = useState<MessageType>('all');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const allMessages = [
      ...privateMessages.map(pm => ({
        id: pm.id,
        type: 'private' as const,
        fromUserId: pm.fromUserId,
        fromAnonymousName: pm.fromAnonymousName,
        content: pm.content,
        isRead: pm.isRead,
        createdAt: pm.createdAt
      })),
      ...mockMessages
    ];
    allMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/\//g, '-')).getTime();
      const dateB = new Date(b.createdAt.replace(/\//g, '-')).getTime();
      return dateB - dateA;
    });
    setMessages(allMessages);
  }, [privateMessages]);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const getFilteredMessages = () => {
    if (activeTab === 'all') return messages;
    return messages.filter(m => m.type === activeTab);
  };

  const handleMessageClick = (message: any) => {
    if (!message.isRead) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      ));
    }
    
    if (message.type === 'private' && message.fromUserId) {
      Taro.navigateTo({ 
        url: `/pages/chat/index?fromId=${message.fromUserId}&fromName=${encodeURIComponent(message.fromAnonymousName || '')}` 
      });
    } else if (message.postId) {
      Taro.navigateTo({ url: `/pages/post-detail/index?id=${message.postId}` });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hug': return '🤗 拥抱';
      case 'comment': return '💬 评论';
      case 'private': return '✉️ 私信';
      case 'system': return '📢 系统';
      default: return '';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'hug': return styles.typeHug;
      case 'comment': return styles.typeComment;
      case 'private': return styles.typePrivate;
      case 'system': return styles.typeSystem;
      default: return '';
    }
  };

  const tabs = [
    { key: 'all', label: '全部', count: messages.length },
    { key: 'comment', label: '评论', count: messages.filter(m => m.type === 'comment').length },
    { key: 'hug', label: '拥抱', count: messages.filter(m => m.type === 'hug').length },
    { key: 'private', label: '私信', count: messages.filter(m => m.type === 'private').length }
  ];

  const filteredMessages = getFilteredMessages();

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>💌 消息</Text>
        <Text className={styles.subtitle}>
          {unreadCount > 0 ? `你有${unreadCount}条未读消息` : '暂无未读消息'}
        </Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key as MessageType)}
          >
            {tab.label}
            {tab.count > 0 && activeTab !== tab.key && (
              <View className={styles.tabBadge}>{tab.count}</View>
            )}
          </View>
        ))}
      </View>

      <ScrollView className={styles.content} scrollY>
        {filteredMessages.length > 0 ? (
          <View className={styles.messageList}>
            {filteredMessages.map(message => (
              <View
                key={message.id}
                className={classnames(
                  styles.messageItem,
                  !message.isRead && styles.messageUnread
                )}
                onClick={() => handleMessageClick(message)}
              >
                <View 
                  className={classnames(
                    styles.avatar,
                    message.type === 'system' && styles.systemAvatar
                  )}
                >
                  {message.fromAnonymousName?.charAt(0) || '📢'}
                </View>
                <View className={styles.messageInfo}>
                  <View className={styles.messageHeader}>
                    <Text className={styles.senderName}>
                      {message.type === 'system' ? '系统通知' : message.fromAnonymousName}
                    </Text>
                    <Text className={styles.messageTime}>{message.createdAt}</Text>
                  </View>
                  <Text className={styles.messageContent}>
                    <Text className={classnames(styles.messageType, getTypeClass(message.type))}>
                      {getTypeLabel(message.type)}
                    </Text>
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
