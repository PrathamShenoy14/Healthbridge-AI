import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
} from 'react-native';
import { ArrowLeft, Home, MessageCircle, FileText, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const AboutUsScreen = () => {
  const router = useRouter();

  const handleBackPress = () => router.back();

  const handleGetInvolved = () => {
    Linking.openURL('mailto:contact@healthbridgeai.com');
  };

  const TeamMember = ({ name, role, imageUri }) => (
    <View style={styles.teamMemberCard}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.teamImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.memberName}>{name}</Text>
      <Text style={styles.memberRole}>{role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#0d171b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtWdOcTgxHKvri-Q0C1absOEDOOD-tBxpgenCoOMKnyk-n2tCjcZqBsP8LkzykvmCnj2gn_I5F8a0zCYaY9EoVRh0bzQTs6TcYbkKO4S0CDxFzz05Ek_n_1LN61VzP_KHGkIJDsdSRcJ3KvI7z8QJ8UCrwHvCHYWebs1Ir7zAh72L2y80Lz6W5-g2en_gp0a951VcVMCUMuzd5lTulXz961UhpFJQ0uwC5mQORYuFuBA2yABjXf5geuhJraJfTtZcV1i2vQU4j5-8' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.sectionsContainer}>
          {/* Mission Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              HealthBridge AI is dedicated to bridging the healthcare gap in rural communities. We leverage AI to enhance medical access, ensuring everyone receives timely, quality care, regardless of location.
            </Text>
          </View>

          {/* Vision Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Vision</Text>
            <Text style={styles.sectionText}>
              We envision a future where advanced healthcare is universally accessible. HealthBridge AI aims to be the cornerstone of this transformation, empowering rural healthcare providers with cutting-edge AI tools.
            </Text>
          </View>

          {/* Problem Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Problem</Text>
            <Text style={styles.sectionText}>
              Rural areas often face significant healthcare challenges: limited access to specialists, long travel distances to medical facilities, and shortages of healthcare professionals. HealthBridge AI addresses these issues directly.
            </Text>
          </View>

          {/* Team Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Team</Text>
            <Text style={styles.sectionText}>
              Our team comprises experienced healthcare professionals, AI experts, and community advocates. We are united by a shared commitment to improving healthcare accessibility and outcomes in rural regions.
            </Text>

            {/* Team Members */}
            <View style={styles.teamGrid}>
              <TeamMember
                name="Dr. Anya Sharma"
                role="Chief Medical Officer"
                imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuD6nKEUIa0cZU0kaWr_gzGvboAH-zUTdlHB4nnyhHudvxRDAy3ji2OxkGZiaU2pNAtFaJJery848HzziwoCxTCyTag5KpJMZg_xFdRfTSIh4Q0qig-DPIUs3DoAiaAH20Ot9Gnd39NPNzK8Jg2wiaV7IPom6H9qjd9M9clKWObI2eWEOOsjs3ht-aOWyz5iUlervuush-0KDVCtWVV9KB_xeoblCFFNSUdbJ7QUqTbDKOWAYZe3Ij2M2WySTz5PrdWrCu1bRAc7HxA"
              />
              <TeamMember
                name="Dr. Ben Carter"
                role="Head of AI Research"
                imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCkKmpB4-cOkDaD_q8FkqsZ1ucnXLevDEX0Z1O-yKhdh4jt-iDiAGxDJxl252FL3yGyz3EwjV7OKkbP369WUCIQpt5kozIWpoGc8iq1vVUeLhwh5_tlucy92AWAK8tDmRfpV8XmIzaB5ycPVbt8cFqR5XalyUNzEqSLArKfrc9_VQdRe3ssBQy4GBILY4FbL0YRnpKFqbow69q6zECYDeANp2WyGcqiVJq4PEbRdlxJmV8qgXWbp1qKZxGG5vlHCClEQk_vReavkFA"
              />
              <TeamMember
                name="Ms. Chloe Davis"
                role="Community Outreach Lead"
                imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuDHNSoUSo7kivfob-61uY3W4JZWAPKep80Y1zAAwTkxJEsJ8KMymUlHoM3nCZCXdBbB1RnrjnpPPIVw-5S64O0VthcIeAFFQVaHLCHG8LWAsxEieQCE76c0ujALX9TOv3ZsdMzVO9FhOFCHCH1XquenCvkxvenbSUbV-GFHDZp07EC_TlRaxBAhiQacCGBC0EWSOExqzZ42AcB27_5_sOgz_JZo341Mo6XJO31Abm-saHo-3XLFBRO6jwFqDxtepeRCsVmL9ZY9BJM"
              />
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.sectionText}>
              For inquiries, partnerships, or to learn more, please reach out to us at contact@healthbridgeai.com.
            </Text>

            {/* Get Involved Button */}
            <TouchableOpacity
              style={styles.getInvolvedButton}
              activeOpacity={0.8}
              onPress={handleGetInvolved}
            >
              <Text style={styles.getInvolvedText}>Get Involved</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Home size={24} color="#13abec" fill="#13abec" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MessageCircle size={24} color="#4c829a" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <FileText size={24} color="#4c829a" />
          <Text style={styles.navText}>Resources</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <User size={24} color="#4c829a" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
    backgroundColor: 'rgba(246, 247, 248, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#e7f0f3',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d171b',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#e7f0f3',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 0,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d171b',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#4c829a',
    lineHeight: 22,
  },
  teamGrid: {
    marginTop: 24,
    gap: 24,
  },
  teamMemberCard: {
    alignItems: 'center',
    marginBottom: 8,
  },
  imageWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    backgroundColor: '#e7f0f3',
    marginBottom: 16,
  },
  teamImage: {
    width: '100%',
    height: '100%',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d171b',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#4c829a',
  },
  getInvolvedButton: {
    backgroundColor: '#13abec',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getInvolvedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(246, 247, 248, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#e7f0f3',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: '#4c829a',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#13abec',
    fontWeight: '500',
  },
});

export default AboutUsScreen;