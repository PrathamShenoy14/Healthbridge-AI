import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import SideMenu from '@/components/SideMenu';
import { API_BASE_URL } from '@/config';
import Markdown from 'react-native-markdown-display';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    const initUser = async () => {
      const email = await SecureStore.getItemAsync('email');
      const uid = email || 'anonymous';
      setUserId(uid);
      fetchChatHistory(uid);
    };
    initUser();
  }, []);

  const fetchChatHistory = async (uid) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/history?user_id=${uid}&limit=50`);
      const data = await res.json();

      if (data.messages) {
        const formatted = [];
        data.messages.forEach((doc) => {
          const timestamp = doc.timestamp?.$date?.$numberLong
            ? new Date(Number(doc.timestamp.$date.$numberLong))
            : new Date();

          // User message
          if (doc.user_query || doc.image_url) {
            formatted.push({
              id: formatted.length + 1,
              text: doc.user_query || '',
              sender: 'user',
              image: doc.image_url || null,
              timestamp,
            });
          }

          // Bot message
          if (doc.bot_response) {
            formatted.push({
              id: formatted.length + 1,
              text: doc.bot_response,
              sender: 'assistant',
              timestamp,
            });
          }
        });
        setMessages(formatted);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (err) {
      console.log('Error fetching chat history:', err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !userId) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setLoading(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const formData = new FormData();
      formData.append('user_query', newMessage.text);
      formData.append('user_id', userId);

      const res = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.bot_response) {
        const botMessage = {
          id: messages.length + 2,
          text: data.bot_response,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.log('Error sending message:', err);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const newMessage = {
        id: messages.length + 1,
        text: message, // optional caption
        sender: 'user',
        image: imageUri,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setLoading(true);
      setMessage(''); // clear input if caption was used
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

      const formData = new FormData();
      formData.append('user_query', newMessage.text);
      formData.append('user_id', userId);
      formData.append('image', {
        uri: imageUri,
        name: `image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      try {
        const res = await fetch(`${API_BASE_URL}/chat/`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.bot_response) {
          const botMessage = {
            id: messages.length + 2,
            text: data.bot_response,
            sender: 'assistant',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } catch (err) {
        console.log('Error sending image:', err);
      } finally {
        setLoading(false);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    }
  };

  const renderMessage = (item) => {
    const isUser = item.sender === 'user';
    return (
      <View
        key={item.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <View style={styles.avatarIcon} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.assistantMessageBubble,
          ]}
        >
          {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
          {isUser ? (
            <Text style={[styles.messageText, styles.userMessageText]}>{item.text}</Text>
          ) : (
            <Markdown
              style={{
                body: styles.assistantMessageText,
                heading1: { fontSize: 18, fontWeight: 'bold', color: '#333' },
                heading2: { fontSize: 16, fontWeight: 'bold', color: '#333' },
                bullet_list: { marginVertical: 4 },
                list_item: { fontSize: 16, color: '#333' },
              }}
            >
              {item.text}
            </Markdown>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
      <View style={styles.assistantAvatar}>
        <View style={styles.avatarIcon} />
      </View>
      <View style={[styles.messageBubble, styles.assistantMessageBubble]}>
        <Text style={styles.assistantMessageText}>AI is generating answers...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="menu" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderMessage)}
          {loading && renderTypingIndicator()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              onContentSizeChange={() =>
                setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100)
              }
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: message.trim() ? '#2196F3' : '#ccc' },
              ]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f6f7f8',
  },
  headerSpacer: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', flex: 1, textAlign: 'center' },
  menuButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageContainer: { flexDirection: 'row', marginVertical: 4 },
  userMessageContainer: { justifyContent: 'flex-end' },
  assistantMessageContainer: { justifyContent: 'flex-start' },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  avatarIcon: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ffffff' },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, marginVertical: 2 },
  userMessageBubble: { backgroundColor: '#2196F3', borderBottomRightRadius: 4 },
  assistantMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: { fontSize: 16, lineHeight: 20 },
  userMessageText: { color: '#ffffff' },
  assistantMessageText: { color: '#333' },
  messageImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 8, resizeMode: 'cover' },
  inputContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#f8f8f8', borderRadius: 24, paddingHorizontal: 4, paddingVertical: 4 },
  addButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  addButtonText: { fontSize: 20, color: '#666', fontWeight: '300' },
  textInput: { flex: 1, fontSize: 16, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 120, color: '#333' },
  sendButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});

export default ChatScreen;
