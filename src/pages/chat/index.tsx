import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ChatMessage {
  id: string;
  fromUserId: string;
  fromName: string;
  content: string;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const [otherName, setOtherName] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const { fromId, fromName } = Taro.getCurrentInstance().router?.params || {};
    if (fromName) {
      setOtherName(decodeURIComponent(fromName));
    }
    
    setMessages([
      {
        id: '1',
        fromUserId: 'other',
        fromName: '匿名用户',
        content: '你好呀，看到你的帖子，感觉我们境遇很像，有空聊聊吗？',
        createdAt: '2024-01-14 20:00'
      }
    ]);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) {
      Taro.showToast({ title: '请输入消息', icon: 'none' });
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      fromUserId: 'me',
      fromName: '我',
      content: inputText.trim(),
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>与 {otherName} 的对话</Text>
      </View>

      <ScrollView className={styles.messageList} scrollY>
        {messages.map(msg => (
          <View
            key={msg.id}
            className={classnames(
              styles.messageItem,
              msg.fromUserId === 'me' ? styles.messageFromMe : styles.messageFromOther
            )}
          >
            {msg.fromUserId !== 'me' && (
              <View className={styles.avatar}>
                {msg.fromName.charAt(0)}
              </View>
            )}
            <View 
              className={classnames(
                styles.messageBubble,
                msg.fromUserId === 'me' ? styles.bubbleMe : styles.bubbleOther
              )}
            >
              {msg.content}
            </View>
            <Text className={styles.messageTime}>{msg.createdAt}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder='输入消息...'
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          onConfirm={handleSend}
        />
        <View className={styles.sendButton} onClick={handleSend}>
          <Text>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatPage;
