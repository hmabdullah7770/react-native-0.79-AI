import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { verifyemailrequest, matchusenamerequest, matchotpreques, signuprequest } from '../../Redux/action/auth';
import SocialModal from './SocialModal';
import SocialBox from './SocialBox';

const SocialLink = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    whatsapp: false,
    facebook: false,
    instagram: false,
    website: false
  });
  
  const [platformData, setPlatformData] = useState({
    whatsapp: '',
    facebook: '',
    instagram: '',
    website: ''
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  
  const handleBoxPress = (platform) => {
    setCurrentPlatform(platform);
    setModalVisible(true);
  };
  
  const handleSaveData = (platform, value) => {
    setPlatformData({
      ...platformData,
      [platform]: value
    });
    
    setSelectedPlatforms({
      ...selectedPlatforms,
      [platform]: value.trim() !== ''
    });
    
    setModalVisible(false);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  const isNextEnabled = Object.values(selectedPlatforms).some(value => value === true);
  
  const platformLabels = {
    whatsapp: 'WhatsApp Number',
    facebook: 'Facebook Profile',
    instagram: 'Instagram Profile',
    website: 'Store Website'
  };
  
  const handleNext = () => {
    // Here you would handle the submission of the social links data
    console.log('Submitted data:', platformData);
    // Continue to the next screen or submit to backend
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Socials</Text>
      
      <View style={styles.boxesContainer}>
        {Object.keys(platformLabels).map((platform) => (
          <SocialBox
            key={platform}
            platform={platform}
            label={platformLabels[platform]}
            value={platformData[platform]}
            isSelected={selectedPlatforms[platform]}
            onPress={() => handleBoxPress(platform)}
          />
        ))}
      </View>
      
      <Text style={styles.instructionText}>
        Choose at least one of them. I recommend you select all, as people interact with you using different platforms.
      </Text>
      
      <TouchableOpacity
        style={[styles.nextButton, !isNextEnabled && styles.disabledButton]}
        disabled={!isNextEnabled}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      
      <SocialModal
        visible={modalVisible}
        platform={currentPlatform}
        platformLabel={currentPlatform ? platformLabels[currentPlatform] : ''}
        initialValue={currentPlatform ? platformData[currentPlatform] : ''}
        onSave={(value) => handleSaveData(currentPlatform, value)}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default SocialLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  boxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
    paddingHorizontal: 20
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#cccccc'
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});