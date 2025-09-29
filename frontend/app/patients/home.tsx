import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SideMenu from '@/components/SideMenu'
import { useState } from 'react';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleStartChat = () => {
    router.push("/patients/chat")
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
    console.log('Open menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>HealthBridge AI</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <MaterialIcons name="menu" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ5t9SK4IW8SKhgGkd0y2722hYy5qavAqBffRUcFQC8hFF_MHPnV-ZpLXr5IsU2luTTnRG7O3vEKAjwasABsdF7QNelrE2mmrkR-Zwb8vj--yRD-K9R-g20LzZALITUT0-wnKlUpiXxxSUpAM6BwhKvXeaAR6PXdTxqYijJk1AimxUT-qEgGUotmaOeSyJfBtK8e4rlanhhiBA67iiDESuD84ST7HMEFres7FoTfmmicqllJUUg_cFJL7FFT1VjNKdNnnO3S3gLfk'
            }}
            style={styles.heroBackground}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Connecting Rural Communities to Smarter Healthcare
                </Text>
                <Text style={styles.heroSubtitle}>
                  Your health companion in every corner of the country.
                </Text>
              </View>
              <TouchableOpacity style={styles.startChatButton} onPress={handleStartChat}>
                <Text style={styles.startChatButtonText}>Start Chat</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="help" size={24} color="#13abec" />
                </View>
                <View style={styles.stepConnector} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Ask Your Question</Text>
                <Text style={styles.stepDescription}>
                  Describe your symptoms to our AI assistant.
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="psychology" size={24} color="#13abec" />
                </View>
                <View style={styles.stepConnector} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>AI Analysis</Text>
                <Text style={styles.stepDescription}>
                  Our AI analyzes your information instantly.
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="volunteer-activism" size={24} color="#13abec" />
                </View>
                <View style={styles.stepConnector} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Guidance & Care</Text>
                <Text style={styles.stepDescription}>
                  Receive helpful guidance and care options.
                </Text>
              </View>
            </View>

            {/* Step 4 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="local-hospital" size={24} color="#13abec" />
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Connect to Doctors</Text>
                <Text style={styles.stepDescription}>
                  If needed, connect with a healthcare professional.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Our Impact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactCard}>
              <Text style={styles.impactLabel}>Villages Served</Text>
              <Text style={styles.impactNumber}>500+</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactLabel}>Patients Helped</Text>
              <Text style={styles.impactNumber}>10,000+</Text>
            </View>
          </View>
        </View>

        {/* Trust & Safety Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Trust & Safety</Text>
          <View style={styles.trustContainer}>
            <View style={styles.trustItem}>
              <MaterialIcons name="verified-user" size={32} color="#13abec" />
              <Text style={styles.trustItemText}>Verified Medical Knowledge</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="privacy-tip" size={32} color="#13abec" />
              <Text style={styles.trustItemText}>Privacy First</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="accessibility-new" size={32} color="#13abec" />
              <Text style={styles.trustItemText}>Easy Access</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f6f7f8',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  heroBackground: {
    minHeight: 420,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImageStyle: {
    borderRadius: 24,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  startChatButton: {
    backgroundColor: '#13abec',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    transform: [{ scale: 1 }],
  },
  startChatButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 20, // Space for bottom navigation
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  stepsContainer: {
    paddingHorizontal: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#13abec20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepConnector: {
    width: 1,
    flex: 1,
    backgroundColor: '#d1d5db',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 8,
  },
  impactCard: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  impactLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  impactNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  trustContainer: {
    paddingHorizontal: 8,
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  trustItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
});

export default HomeScreen;