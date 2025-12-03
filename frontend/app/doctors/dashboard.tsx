import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { useRouter } from "expo-router";

const DashboardScreen = () => {
  const router = useRouter();
  const [timeSort, setTimeSort] = useState('latest');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [cancerFilter, setCancerFilter] = useState('all');

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCancerPicker, setShowCancerPicker] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const skinConditions = [
    'all',
    'actinic keratosis',
    'basal cell carcinoma',
    'dermatofibroma',
    'melanoma',
    'nevus',
    'pigmented benign keratosis',
    'seborrheic keratosis',
    'squamous cell carcinoma',
    'vascular lesion',
  ];

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/diagnosis/pending`);
      setInquiries(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInquiries();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterAndSortInquiries = () => {
    let filtered = [...inquiries];

    if (conditionFilter !== 'all') {
      filtered = filtered.filter((item) => item.prediction === conditionFilter);
    }

    if (cancerFilter === 'cancerous') {
      filtered = filtered.filter((item) => item.is_cancerous);
    } else if (cancerFilter === 'non-cancerous') {
      filtered = filtered.filter((item) => !item.is_cancerous);
    }

    if (timeSort === 'latest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    return filtered;
  };

  const DropdownPicker = ({ visible, onClose, options, selected, onSelect, title }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionItem, selected === option.value && styles.optionItemSelected]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, selected === option.value && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const filteredInquiries = filterAndSortInquiries();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>All Inquiries</Text>

          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.filterButtonText}>
              {timeSort === 'latest' ? 'Latest First' : 'Oldest First'}
            </Text>
            <Text style={styles.filterIcon}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={() => setShowConditionPicker(true)}>
            <Text style={styles.filterButtonText} numberOfLines={1}>
              {conditionFilter === 'all' ? 'All Conditions' : conditionFilter}
            </Text>
            <Text style={styles.filterIcon}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={() => setShowCancerPicker(true)}>
            <Text style={styles.filterButtonText}>
              {cancerFilter === 'all' ? 'All' : cancerFilter === 'cancerous' ? 'Cancerous' : 'Non-Cancerous'}
            </Text>
            <Text style={styles.filterIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.inquiriesList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {filteredInquiries.map((inquiry) => (
          <TouchableOpacity
            key={inquiry._id}
            style={styles.inquiryCard}
            onPress={() => router.push({
              pathname: "/info",
              params: { email: inquiry.patient_email, id: inquiry._id },
            })}
          >
            <Image source={{ uri: inquiry.image_url }} style={styles.inquiryImage} />

            <View style={styles.inquiryInfo}>
              <Text style={styles.patientEmail}>{inquiry.patient_email}</Text>

              <View style={styles.conditionRow}>
                <Text style={styles.conditionLabel}>Condition:</Text>
                <Text style={styles.conditionValue}>
                  {inquiry.prediction.charAt(0).toUpperCase() + inquiry.prediction.slice(1)}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.cancerBadge,
                    inquiry.is_cancerous ? styles.cancerBadgeDanger : styles.cancerBadgeSafe,
                  ]}
                >
                  <Text
                    style={[
                      styles.cancerBadgeText,
                      inquiry.is_cancerous ? styles.cancerBadgeTextDanger : styles.cancerBadgeTextSafe,
                    ]}
                  >
                    {inquiry.is_cancerous ? 'Cancerous' : 'Non-Cancerous'}
                  </Text>
                </View>

                <Text style={styles.confidence}>{inquiry.confidence.toFixed(1)}% confidence</Text>
              </View>

              <Text style={styles.timestamp}>{formatDate(inquiry.created_at)}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {filteredInquiries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No inquiries found</Text>
          </View>
        )}
      </ScrollView>

      <DropdownPicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        options={[
          { value: 'latest', label: 'Latest First' },
          { value: 'oldest', label: 'Oldest First' },
        ]}
        selected={timeSort}
        onSelect={setTimeSort}
        title="Sort by Time"
      />

      <DropdownPicker
        visible={showConditionPicker}
        onClose={() => setShowConditionPicker(false)}
        options={skinConditions.map((c) => ({ value: c, label: c === 'all' ? 'All Conditions' : c }))}
        selected={conditionFilter}
        onSelect={setConditionFilter}
        title="Filter by Condition"
      />

      <DropdownPicker
        visible={showCancerPicker}
        onClose={() => setShowCancerPicker(false)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'cancerous', label: 'Cancerous' },
          { value: 'non-cancerous', label: 'Non-Cancerous' },
        ]}
        selected={cancerFilter}
        onSelect={setCancerFilter}
        title="Filter by Cancer Status"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    padding: 20, paddingTop: 50,
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign:'center' },
  filtersContainer: {
    backgroundColor: '#fff', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  refreshButton: { borderWidth: 1, borderColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  refreshText: { fontSize: 13, fontWeight: '600', color: '#007AFF' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#f8f9fa', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0',
  },
  filterButtonText: { fontSize: 12, color: '#333', flex: 1 },
  filterIcon: { fontSize: 10, color: '#666', marginLeft: 4 },
  inquiriesList: { flex: 1 },
  inquiryCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
    padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 3,
  },
  inquiryImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#e0e0e0' },
  inquiryInfo: { flex: 1, marginLeft: 12 },
  patientEmail: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  conditionLabel: { fontSize: 12, color: '#666', marginRight: 4 },
  conditionValue: { fontSize: 12, fontWeight: '600', color: '#007AFF' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cancerBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 8 },
  cancerBadgeDanger: { backgroundColor: '#fee' },
  cancerBadgeSafe: { backgroundColor: '#efe' },
  cancerBadgeText: { fontSize: 10, fontWeight: '600' },
  cancerBadgeTextDanger: { color: '#d32f2f' },
  cancerBadgeTextSafe: { color: '#2e7d32' },
  confidence: { fontSize: 11, color: '#666' },
  timestamp: { fontSize: 11, color: '#999' },
  chevron: { fontSize: 24, color: '#ccc', marginLeft: 8 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { fontSize: 16, color: '#999' },

  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%', maxHeight: '60%', backgroundColor: '#fff',
    borderRadius: 12, padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
  optionsList: { marginTop: 10 },
  optionItem: { paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  optionItemSelected: { backgroundColor: '#fafafa' },
  optionText: { fontSize: 14, color: '#333' },
  optionTextSelected: { fontWeight: '600', color: '#007AFF' },
});

export default DashboardScreen;
