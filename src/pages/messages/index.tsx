import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockMessages } from '../../data/messages';
import { useApp } from '../../components/AppProvider';
import styles from './index.module.scss';

type MessageType = 'all' | 'comment' | 'hug' | 'private';

interface ConversationItem {
  userId: string;
  userName: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: any[];
}

const MessagesPage: React.FC = () => {
  const { privateMessages } = useApp();
  const [activeTab, setActiveTab] = useState<MessageType>('all');
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [otherMessages, setOtherMessages] = useState<any[]>([]);

  useEffect(() => {
    const convMap = new Map<string, ConversationItem>();
    
    privateMessages.forEach(pm => {
      const key = pm.fromUserId;
      const existing = convMap.get(key);
      if (!existing || new Date(pm.createdAt.replace(/\//g, '-')).getTime() > new Date(existing.lastTime.replace(/\//g, '-')).getTime()) {
        convMap.set(key, {
          userId: pm.fromUserId,
          userName: pm.fromAnonymousName || '匿名用户',
          lastMessage: pm.content,
          lastTime: pm.createdAt,
          unreadCount: pm.isRead ? 0 : 1,
          messages: [pm]
        });
      } else if (!pm.isRead) {
        existing.unreadCount++;
        existing.messages.push(pm);
      }
    });

    const sortedConvs = Array.from(convMap.values()).sort((a, b) => {
      const dateA = new Date(a.lastTime.replace(/\//g, '-')).getTime();
      const dateB = new Date(b.lastTime.replace(/\//g, '-')).getTime();
      return dateB - dateA;
    });
    
    setConversations(sortedConvs);
  }, [privateMessages]);

  useEffect(() => {
    const filtered = mockMessages.filter(m => m.type !== 'private');
    setOtherMessages(filtered);
  }, []);

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0) + otherMessages.filter(m => !m.isRead).length;

  const handleConversationClick = (conv: ConversationItem) => {
    Taro.navigateTo({ 
      url: `/pages/chat/index?fromId=${conv.userId}&fromName=${encodeURIComponent(conv.userName)}` 
    });
  };

  const handleOtherMessageClick = (message: any) => {
    if (message.postId) {
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
    { key: 'all', label: '全部' },
    { key: 'private', label: '私信' },
    { key: 'comment', label: '评论' },
    { key: 'hug', label: '拥抱' }
  ];

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
          </View>
        ))}
      </View>

      <ScrollView className={styles.content} scrollY>
        {activeTab === 'all' && (
          <>
            {conversations.length > 0 && (
              <View className={styles.section}>
                <Text className={styles.sectionTitle}>私信会话</Text>
                <View className={styles.conversationList}>
                  {conversations.map(conv => (
                    <View
                      key={conv.userId}
                      className={classnames(
                        styles.conversationItem,
                        conv.unreadCount > 0 && styles.unread
                      )}
                      onClick={() => handleConversationClick(conv)}
                    >
                      <View className={styles.convAvatar}>
                        <Text className={styles.convAvatarText}>{conv.userName.charAt(0)}</Text>
                      </View>
                      <View className={styles.convInfo}>
                        <View className={styles.convHeader}>
                          <Text className={styles.convName}>{conv.userName}</Text>
                          <Text className={styles.convTime}>{conv.lastTime}</Text>
                        </View>
                        <View className={styles.convLastMsg}>
                          <Text className={styles.convMessage} numberOfLines={1}>{conv.lastMessage}</Text>
                          {conv.unreadCount > 0 && (
                            <View className={styles.unreadBadge}>
                              <Text className={styles.unreadCount}>{conv.unreadCount}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {otherMessages.length > 0 && (
              <View className={styles.section}>
                <Text className={styles.sectionTitle}>互动通知</Text>
                <View className={styles.messageList}>
                  {otherMessages.map(message => (
                    <View
                      key={message.id}
                      className={classnames(
                        styles.messageItem,
                        !message.isRead && styles.messageUnread
                      )}
                      onClick={() => handleOtherMessageClick(message)}
                    >
                      <View className={styles.avatar}>
                        {message.fromAnonymousName?.charAt(0) || '📢'}
                      </View>
                      <View className={styles.messageInfo}>
                        <View className={styles.messageHeader}>
                          <Text className={styles.senderName}>
                            {message.fromAnonymousName || '系统通知'}
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
              </View>
            )}
          </>
        )}

        {activeTab === 'private' && (
          <>
            {conversations.length > 0 ? (
              <View className={styles.conversationList}>
                {conversations.map(conv => (
                  <View
                    key={conv.userId}
                    className={classnames(
                      styles.conversationItem,
                      conv.unreadCount > 0 && styles.unread
                    )}
                    onClick={() => handleConversationClick(conv)}
                  >
                    <View className={styles.convAvatar}>
                      <Text className={styles.convAvatarText}>{conv.userName.charAt(0)}</Text>
                    </View>
                    <View className={styles.convInfo}>
                      <View className={styles.convHeader}>
                        <Text className={styles.convName}>{conv.userName}</Text>
                        <Text className={styles.convTime}>{conv.lastTime}</Text>
                      </View>
                      <View className={styles.convLastMsg}>
                        <Text className={styles.convMessage} numberOfLines={1}>{conv.lastMessage}</Text>
                        {conv.unreadCount > 0 && (
                          <View className={styles.unreadBadge}>
                            <Text className={styles.unreadCount}>{conv.unreadCount}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>💬</Text>
                <Text className={styles.emptyText}>暂无私信</Text>
              </View>
            )}
          </>
        )}

        {(activeTab === 'comment' || activeTab === 'hug') && (
          <>
            {otherMessages.filter(m => m.type === activeTab).length > 0 ? (
              <View className={styles.messageList}>
                {otherMessages.filter(m => m.type === activeTab).map(message => (
                  <View
                    key={message.id}
                    className={classnames(
                      styles.messageItem,
                      !message.isRead && styles.messageUnread
                    )}
                    onClick={() => handleOtherMessageClick(message)}
                  >
                    <View className={styles.avatar}>
                      {message.fromAnonymousName?.charAt(0) || '📢'}
                    </View>
                    <View className={styles.messageInfo}>
                      <View className={styles.messageHeader}>
                        <Text className={styles.senderName}>
                          {message.fromAnonymousName || '系统通知'}
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
                <Text className={styles.emptyText}>暂无{activeTab === 'comment' ? '评论' : '拥抱'}通知</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
