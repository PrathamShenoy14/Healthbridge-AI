import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

const SideMenu = ({ visible, onClose, topOffset = 70 }) => {
  const router = useRouter();
  const menuWidth = width * 0.75;
  const slideAnim = useRef(new Animated.Value(menuWidth)).current;
  const [email, setEmail] = useState('');

  useEffect(() => {
  const fetchEmail = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync('email'); // your key
      if (storedEmail) setEmail(storedEmail);
    } catch (e) {
      console.log('Error fetching email:', e);
    }
  };

    fetchEmail();
}, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: menuWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <>
      {/* Overlay */}
      {visible && <TouchableOpacity style={styles.overlay} onPress={onClose} />}

      {/* Sliding Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
            paddingTop: topOffset, // content starts below hamburger
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.userName}>{email || 'User'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/resources")}> 
          <MaterialIcons name="description" size={20} color="#111827" />
          <Text style={styles.menuText}>Resources</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#111827"
          />
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="logout" size={20} color="#111827" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HealthBridge AI v1.0</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    height: height, // full screen height
    width: width * 0.65, // 75% screen width
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 5,
    elevation: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 12,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    paddingLeft:10,
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
    fontWeight:"500"
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

export default SideMenu;
