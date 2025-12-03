import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { useRouter, useLocalSearchParams } from 'expo-router';

const DiagnosisSubmissionScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpRecommendations, setFollowUpRecommendations] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '' }
  ]);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const updateMedication = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async () => {
    const savedEmail = await SecureStore.getItemAsync("email");
    // Validation
    if (!diagnosisSummary.trim()) {
      Alert.alert('Required', 'Please provide a diagnosis summary');
      return;
    }

    if (!treatmentPlan.trim()) {
      Alert.alert('Required', 'Please provide a treatment plan');
      return;
    }

    // Filter out empty medications
    const validMedications = medications.filter(
      med => med.name.trim() || med.dosage.trim() || med.frequency.trim()
    );

    const submissionData = {
      diagnosisSummary,
      treatmentPlan,
      medications: validMedications,
      followUpRecommendations,
      medicalNotes,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/diagnosis/${id}/report?doctor_email=${savedEmail}`,
        submissionData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API response:", response.data);

      Alert.alert("Success", "Diagnosis submitted successfully", [
        { text: "OK", onPress: () => router.replace("/doctors/dashboard") },
      ]);
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit diagnosis");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnosis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Diagnosis Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis Summary</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide a concise summary of the patient's diagnosis..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={diagnosisSummary}
            onChangeText={setDiagnosisSummary}
            textAlignVertical="top"
          />
        </View>

        {/* Treatment Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment Plan</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Outline the recommended treatment plan for the patient..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={treatmentPlan}
            onChangeText={setTreatmentPlan}
            textAlignVertical="top"
          />
        </View>

        {/* Prescribed Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescribed Medications</Text>
          {medications.map((medication, index) => (
            <View key={index} style={styles.medicationContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., Atorvastatin"
                placeholderTextColor="#999"
                value={medication.name}
                onChangeText={(value) => updateMedication(index, 'name', value)}
              />
              <View style={styles.medicationRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="e.g., 20mg"
                  placeholderTextColor="#999"
                  value={medication.dosage}
                  onChangeText={(value) => updateMedication(index, 'dosage', value)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="e.g., Once daily"
                  placeholderTextColor="#999"
                  value={medication.frequency}
                  onChangeText={(value) => updateMedication(index, 'frequency', value)}
                />
              </View>
              {medications.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeMedication(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addMedication}
          >
            <Text style={styles.addButtonText}>+ Add another medication</Text>
          </TouchableOpacity>
        </View>

        {/* Follow-up Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up Recommendations</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Detail any necessary follow-up appointments or actions..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={followUpRecommendations}
            onChangeText={setFollowUpRecommendations}
            textAlignVertical="top"
          />
        </View>

        {/* Medical Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Notes</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add any additional observations or internal notes..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={medicalNotes}
            onChangeText={setMedicalNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Info Note */}
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Patient data is securely saved when you proceed.
          </Text>
        </View> */}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Diagnosis</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  medicationContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  medicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  removeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
  },
  removeButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#00BCD4',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
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
  submitButton: {
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DiagnosisSubmissionScreen;