import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/config';

const PersonalInfoScreen = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  // Demographic Details
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const genderOptions = ['Male', 'Female'];
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  // Medical History
  const [conditions, setConditions] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [allergies, setAllergies] = useState('');

  // Current Medications (dynamic)
  const [medications, setMedications] = useState([]);

  // ---------------- GET ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await SecureStore.getItemAsync('email');
        setUserEmail(email ?? ""); 
        const res = await axios.get(`${API_BASE_URL}/personal/info?email=${email}`);

        const d = res.data;

        setAge(d.age || '');
        setGender(d.gender || '');
        setAddress(d.address || '');
        setContact(d.contact || '');
        setConditions(d.conditions || '');
        setSurgeries(d.surgeries || '');
        setAllergies(d.allergies || '');
        setMedications(Array.isArray(d.medications) ? d.medications : []);
      } catch (err) {
        console.log('GET ERROR:', err);
      }
    };

    fetchData();
  }, []);

  // ---------------- PUT UPDATE ----------------
  const handleSaveChanges = async () => {
    try {
      const email = await SecureStore.getItemAsync("email");

      await axios.put(`${API_BASE_URL}/personal/info?email=${email}`, {
        age,
        gender,
        address,
        contact,
        conditions,
        surgeries,
        allergies,
        medications
      });

      router.back();
    } catch (error) {
      console.log("PUT ERROR:", error);
    }
  };

  const handleBackPress = () => router.back();

  const handleAddMedication = () => {
    setMedications(prev => [...prev, '']);
  };

  const handleMedicationChange = (text, idx) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[idx] = text;
      return updated;
    });
  };

  const handleRemoveMedication = (idx) => {
    setMedications(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Info Update</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Patient details placeholder */}
          <View style={styles.patientInfoCard}>
            <Text style={styles.patientName}>{userEmail}</Text>
          </View>

          {/* Demographic Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographic Details</Text>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="Age"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  activeOpacity={0.7}
                  onPress={() => setGenderModalVisible(true)}
                >
                  <Text style={styles.selectText}>{gender}</Text>
                  <ChevronDown size={18} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact</Text>
              <TextInput
                style={styles.input}
                value={contact}
                onChangeText={setContact}
                placeholder="Phone"
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Medical History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical History</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Conditions</Text>
              <TextInput style={styles.textArea} value={conditions} onChangeText={setConditions} multiline />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Surgeries</Text>
              <TextInput style={styles.textArea} value={surgeries} onChangeText={setSurgeries} multiline />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Allergies</Text>
              <TextInput style={styles.textArea} value={allergies} onChangeText={setAllergies} multiline />
            </View>
          </View>

          {/* Medications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Medications</Text>

            {medications.map((med, idx) => (
              <View key={idx} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>Medication {idx + 1}</Text>
                <View style={styles.medRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    value={med}
                    onChangeText={(text) => handleMedicationChange(text, idx)}
                    placeholder="Name & dosage"
                  />
                  <TouchableOpacity onPress={() => handleRemoveMedication(idx)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddMedication} activeOpacity={0.7}>
              <Plus size={20} color="#13abec" />
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>

          {/* Save */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* GENDER MODAL */}
      <Modal visible={genderModalVisible} transparent animationType="fade" onRequestClose={() => setGenderModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setGenderModalVisible(false)}>
          <View style={styles.modalContent}>
            {genderOptions.map(opt => (
              <TouchableOpacity key={opt} style={styles.dropdownItem}
                onPress={() => { setGender(opt); setGenderModalVisible(false); }}>
                <Text style={styles.dropdownText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

/* ----------------------- STYLES ------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', elevation: 2,
  },
  backButton: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  placeholder: { width: 40 },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 },
  patientInfoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center',
    marginBottom: 24, elevation: 2,
  },
  patientName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  patientId: { fontSize: 14, color: '#6B7280' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputGroup: { flex: 1, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, fontSize: 16, color: '#111827',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  selectInput: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  selectText: { fontSize: 16, color: '#111827' },
  textArea: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 18,          // increase padding
  minHeight: 60,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  fontSize: 16,
  textAlignVertical: 'top'   // must stay top for multiline
},
  medRow: { flexDirection: 'row', alignItems: 'center' },
  removeButton: {
    backgroundColor: '#FFF', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  removeButtonText: { color: '#EF4444', fontWeight: '600' },
  addButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#BFDBFE', borderStyle: 'dashed',
  },
  addButtonText: { fontSize: 16, fontWeight: '600', color: '#13abec', marginLeft: 8 },
  actionButtons: { flexDirection: 'row', marginTop: 24 },
  saveButton: {
    flex: 1, backgroundColor: '#13abec', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: 240, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 8,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { fontSize: 16, color: '#111827' },
});

export default PersonalInfoScreen;
