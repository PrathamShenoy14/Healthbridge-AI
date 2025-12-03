import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from '@/config';

const PatientProfileScreen = () => {
  const router = useRouter();
  const { email, id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/personal/full-info?email=${email}&diagnosis_id=${id}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      Alert.alert('Error', 'Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnose = () => {
    // Navigate to diagnosis screen or handle diagnosis action
    // navigation?.navigate('DiagnosisScreen', { 
    //   diagnosisId: data?.diagnosis_info?._id,
    //   patientEmail: data?.personal_info?.patient_email 
    // });
    router.push({
                pathname: "/diagnose",
                params: {id: id },
              })
    console.log("CLICK")
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  const { personal_info, diagnosis_info } = data;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {personal_info.patient_email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View> */}
          <Text style={styles.patientName}>
            {personal_info.patient_email}
          </Text>
          <Text style={styles.patientId}>ID: {diagnosis_info._id}</Text>
        </View>

        {/* Diagnosis Image - Easy to inspect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis Image</Text>
          <View style={styles.imageContainer}>
            {/* <TouchableOpacity 
              activeOpacity={1}
              // onPress={() => {
              //   // Option to open full screen image viewer
              //   Alert.alert('Image', 'Open full screen viewer');
              // }}
            > */}
              <Image
                source={{ uri: diagnosis_info.image_url }}
                style={styles.diagnosisImage}
                resizeMode="contain"
              />
            {/* </TouchableOpacity> */}
            <View style={styles.imageMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Prediction:</Text>
                <Text style={[styles.metaValue, styles.predictionText]}>
                  {diagnosis_info.prediction}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Confidence:</Text>
                <Text style={styles.metaValue}>
                  {diagnosis_info.confidence}%
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Cancerous:</Text>
                <Text style={[
                  styles.metaValue, 
                  diagnosis_info.is_cancerous ? styles.dangerText : styles.safeText
                ]}>
                  {diagnosis_info.is_cancerous ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Status:</Text>
                <Text style={[styles.metaValue, styles.statusText]}>
                  {diagnosis_info.status}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaValue}>
                  {new Date(diagnosis_info.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Demographics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{personal_info.age}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{personal_info.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{personal_info.address}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{personal_info.contact}</Text>
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.historyItem}>
            <Text style={styles.historyLabel}>Conditions</Text>
            <Text style={styles.historyValue}>{personal_info.conditions}</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyLabel}>Surgeries</Text>
            <Text style={styles.historyValue}>{personal_info.surgeries}</Text>
          </View>
          <View style={styles.historyItem}>
            <Text style={styles.historyLabel}>Allergies</Text>
            <Text style={styles.historyValue}>{personal_info.allergies}</Text>
          </View>
        </View>

        {/* Current Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {personal_info.medications?.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationText}>{med}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Diagnose Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.diagnoseButton} 
          onPress={handleDiagnose}
          activeOpacity={0.8}
        >
          <Text style={styles.diagnoseButtonText}>Diagnose</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#333',
    textAlign:'center'
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD4B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  patientId: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  imageContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  diagnosisImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  imageMeta: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  predictionText: {
    color: '#FF6B6B',
    textTransform: 'capitalize',
  },
  dangerText: {
    color: '#FF6B6B',
  },
  safeText: {
    color: '#4CAF50',
  },
  statusText: {
    color: '#FFA726',
    textTransform: 'capitalize',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyItem: {
    marginBottom: 15,
  },
  historyLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  historyValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  medicationItem: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  medicationText: {
    fontSize: 14,
    color: '#333',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  diagnoseButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  diagnoseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PatientProfileScreen;