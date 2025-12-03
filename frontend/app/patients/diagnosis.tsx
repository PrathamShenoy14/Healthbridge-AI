import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Upload, CheckCircle, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const DiagnosisScreen = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [diagnosisData, setDiagnosisData] = useState(null);

  // Fetch diagnosis status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDiagnosisStatus();
    }, [])
  );

  const fetchDiagnosisStatus = async () => {
    try {
      setFetchingStatus(true);
      const email = await SecureStore.getItemAsync('email');
      
      if (!email) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setFetchingStatus(false);
        return;
      }

      // Fetch latest diagnosis request for this patient
      const response = await axios.get(
        `${API_BASE_URL}/diagnosis/status/${email}`
      );

      if (response.data.status === 'no_record') {
        // No diagnosis request found - show upload screen
        setDiagnosisData(null);
      } else {
        // Diagnosis exists (either pending or diagnosed)
        setDiagnosisData(response.data);
      }
    } catch (error) {
      console.error('Error fetching diagnosis status:', error);
      // If error, default to upload screen
      setDiagnosisData(null);
    } finally {
      setFetchingStatus(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to select an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpload = () => {
    Alert.alert('Select Image Source', 'Choose where to get the image from', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleGetDiagnosis = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please upload an image first.');
      return;
    }

    try {
      setLoading(true);

      // Get email from SecureStore
      const email = await SecureStore.getItemAsync('email');
      if (!email) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('patient_email', email);
      
      // Append image file
      const imageFile = {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: selectedImage.fileName || 'diagnosis.jpg',
      };
      formData.append('file', imageFile as any);

      // Send to backend
      const response = await axios.post(
        `${API_BASE_URL}/diagnosis/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // After successful upload, refresh status
      Alert.alert('Success', 'Diagnosis request submitted successfully!');
      setSelectedImage(null);
      fetchDiagnosisStatus();
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      Alert.alert(
        'Error',
        'Failed to submit diagnosis request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching status
  if (fetchingStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Image Diagnosis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13abec" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // CASE 3: Diagnosis completed (status === "diagnosed")
  if (diagnosisData && diagnosisData.status === 'diagnosed') {
    const { doctor_report } = diagnosisData;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Diagnosis Results</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.diagnosisScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successIconContainer}>
            <FileText size={80} color="#10B981" />
          </View>

          <Text style={styles.successTitle}>Diagnosis Complete</Text>
          <Text style={styles.successSubtitle}>
            Your diagnosis has been reviewed and completed by our medical team.
          </Text>
          {/* Diagnosis Image */}
          {diagnosisData.image_url && (
            <View style={styles.diagnosisImageSection}>
              <Image
                source={{ uri: diagnosisData.image_url }}
                style={styles.diagnosisResultImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Diagnosis Summary */}
          <View style={styles.diagnosisSection}>
            <Text style={styles.diagnosisSectionTitle}>Diagnosis Summary</Text>
            <Text style={styles.diagnosisContentText}>
              {doctor_report?.diagnosisSummary || 'No diagnosis summary available'}
            </Text>
          </View>

          {/* Treatment Plan */}
          <View style={styles.diagnosisSection}>
            <Text style={styles.diagnosisSectionTitle}>Treatment Plan</Text>
            <Text style={styles.diagnosisContentText}>
              {doctor_report?.treatmentPlan || 'No treatment plan available'}
            </Text>
          </View>

          {/* Prescribed Medications */}
          {doctor_report?.medications && doctor_report.medications.length > 0 && (
            <View style={styles.diagnosisSection}>
              <Text style={styles.diagnosisSectionTitle}>Prescribed Medications</Text>
              {doctor_report.medications.map((medication, index) => (
                <View key={index} style={styles.medicationCard}>
                  <View style={styles.medicationHeader}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.iconText}>💊</Text>
                    </View>
                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>{medication.name}</Text>
                      <Text style={styles.medicationDetail}>
                        {medication.dosage} • {medication.frequency}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Follow-up Recommendations */}
          {doctor_report?.followUpRecommendations && (
            <View style={styles.diagnosisSection}>
              <Text style={styles.diagnosisSectionTitle}>Follow-up Recommendations</Text>
              <Text style={styles.diagnosisContentText}>
                {doctor_report.followUpRecommendations}
              </Text>
            </View>
          )}

          {/* Medical Notes */}
          {doctor_report?.medicalNotes && (
            <View style={styles.diagnosisSection}>
              <Text style={styles.diagnosisSectionTitle}>Medical Notes</Text>
              <Text style={styles.diagnosisContentText}>
                {doctor_report.medicalNotes}
              </Text>
            </View>
          )}

          {/* Doctor Info */}
          <View style={styles.doctorInfoSection}>
            {diagnosisData.assigned_doctor && (
              <View style={styles.doctorInfoRow}>
                <Text style={styles.doctorInfoLabel}>Reviewed by:</Text>
                <Text style={styles.doctorInfoValue}>{diagnosisData.assigned_doctor}</Text>
              </View>
            )}
            <View style={styles.doctorInfoRow}>
              <Text style={styles.doctorInfoLabel}>Date:</Text>
              <Text style={styles.doctorInfoValue}>
                {new Date(diagnosisData.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.doctorInfoRow}>
              <Text style={styles.doctorInfoLabel}>Request ID:</Text>
              <Text style={styles.doctorInfoValue}>{diagnosisData._id}</Text>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // CASE 2: Diagnosis pending (status === "pending")
  if (diagnosisData && diagnosisData.status === 'pending') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Image Diagnosis</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.successContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successIconContainer}>
            <CheckCircle size={80} color="#F59E0B" />
          </View>

          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Your diagnosis request has been successfully submitted and is pending review by our medical team.
          </Text>

          {diagnosisData.image_url && (
            <Image
              source={{ uri: diagnosisData.image_url }}
              style={styles.diagnosedImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Request ID</Text>
            <Text style={styles.resultValue}>{diagnosisData._id}</Text>

            <Text style={[styles.resultLabel, { marginTop: 16 }]}>Initial AI Analysis</Text>
            <Text style={styles.resultValue}>
              {diagnosisData.prediction} 
              {diagnosisData.confidence && ` (${diagnosisData.confidence.toFixed(1)}% confidence)`}
            </Text>
            
            {diagnosisData.is_cancerous !== null && diagnosisData.is_cancerous !== undefined && (
              <View style={[styles.statusBadge, { marginTop: 12, backgroundColor: diagnosisData.is_cancerous ? '#FEE2E2' : '#D1FAE5' }]}>
                <Text style={[styles.statusText, { color: diagnosisData.is_cancerous ? '#991B1B' : '#065F46' }]}>
                  {diagnosisData.is_cancerous ? '⚠️ Potentially Cancerous' : '✓ Non-Cancerous'}
                </Text>
              </View>
            )}

            <Text style={[styles.resultLabel, { marginTop: 16 }]}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>⏳ Pending Doctor Review</Text>
            </View>

            <Text style={[styles.resultLabel, { marginTop: 16 }]}>Submitted On</Text>
            <Text style={styles.resultValue}>
              {new Date(diagnosisData.created_at).toLocaleDateString()} at {new Date(diagnosisData.created_at).toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Our medical professionals will review your case and provide a detailed diagnosis report. You will be notified once the review is complete.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchDiagnosisStatus}
            activeOpacity={0.7}
          >
            <Text style={styles.refreshButtonText}>Refresh Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.goBackButtonText}>Go Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // CASE 1: No diagnosis request - show upload screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Image Diagnosis</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.mainTitle}>Upload an image for analysis</Text>
        <Text style={styles.subtitle}>
          Tap to select from your Photo Library or use the Camera.
        </Text>

        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handleUpload}
          activeOpacity={0.7}
          disabled={loading}
        >
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <View style={styles.changeImageOverlay} pointerEvents="none">
                <Upload size={24} color="#13abec" />
                <Text style={styles.changeImageText}>Tap to change image</Text>
              </View>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <View style={styles.uploadIconContainer}>
                <Upload size={32} color="#13abec" />
              </View>
              <Text style={styles.uploadTitle}>Tap to Upload Image</Text>
              <Text style={styles.uploadSubtitle}>
                Select an image from your gallery or camera
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.diagnosisButton,
            (!selectedImage || loading) && styles.diagnosisButtonDisabled,
          ]}
          onPress={handleGetDiagnosis}
          disabled={!selectedImage || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.diagnosisButtonText}>Get Diagnosis</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },

  scrollContent: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 40 },

  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },

  uploadContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    marginBottom: 24,
    overflow: 'hidden',
  },

  uploadContent: { alignItems: 'center', padding: 32 },
  uploadIconContainer: {
    backgroundColor: '#EFF6FF',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  uploadTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  uploadSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

  imagePreviewContainer: {
    width: '90%',
    height: '95%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: { width: '100%', height: '100%' },

  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  changeImageText: { fontSize: 14, fontWeight: '600', color: '#13abec' },

  diagnosisButton: {
    backgroundColor: '#13abec',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  diagnosisButtonDisabled: { backgroundColor: '#9CA3AF' },
  diagnosisButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Success Screen Styles (Pending)
  successContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIconContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  marginBottom: 10,
},
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  diagnosedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  diagnosisText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#13abec',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#13abec',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#13abec',
  },
  goBackButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Diagnosed Screen Styles (New)
  diagnosisScrollContent: {
    paddingBottom: 30,
  },
  diagnosisImageSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  diagnosisResultImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  diagnosisSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },
  diagnosisSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  diagnosisContentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A4A4A',
  },
  medicationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  medicationDetail: {
    fontSize: 13,
    color: '#666',
  },
  doctorInfoSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  doctorInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  doctorInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DiagnosisScreen;