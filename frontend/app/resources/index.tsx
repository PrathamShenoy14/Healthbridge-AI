import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, FileText, Search, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const ResourceScreen = () => {
  const router = useRouter();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/file/`);
      setResources(response.data); // full list
      setFilteredResources(response.data); // initially same
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources by title whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter((res) =>
        res.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  const handleBackPress = () => router.back();

  const handleOpenPdf = async (pdfUrl: string) => {
    Linking.openURL(pdfUrl);
  };

  const ResourceCard = ({ resource }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      activeOpacity={0.7}
      onPress={() => handleOpenPdf(resource.url)}
    >
      <View style={styles.resourceContent}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <FileText size={24} color="#13abec" />
          </View>
          <Text style={styles.pdfLabel}>PDF</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>
        </View>
      </View>
      <Eye size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resources</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainTitle}>HealthBridge AI Sources</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sources"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Resource Cards */}
        <View style={styles.resourceList}>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <Text
              style={{
                textAlign: 'center',
                color: '#6B7280',
                marginTop: 20,
                fontSize: 16,
              }}
            >
              No resources found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  placeholder: { width: 40 },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginTop: 24, marginBottom: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151', padding: 0 },
  resourceList: { gap: 16 },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resourceContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { alignItems: 'center', marginRight: 16 },
  iconWrapper: { backgroundColor: '#EFF6FF', padding: 8, borderRadius: 12 },
  pdfLabel: { fontSize: 10, fontWeight: '600', color: '#13abec', marginTop: 4 },
  textContainer: { flex: 1 },
  resourceTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  resourceDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  viewButton: { padding: 8, borderRadius: 8 },
});

export default ResourceScreen;
