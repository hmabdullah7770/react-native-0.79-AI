import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const SocialBox = ({ platform, label, value, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.box, isSelected && styles.selectedBox]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.boxTitle}>{label}</Text>
        {value ? (
          <Text style={styles.boxValue} numberOfLines={1}>
            {value}
          </Text>
        ) : (
          <Text style={styles.boxPlaceholder}>Tap to add</Text>
        )}
      </View>
      
      {isSelected && (
        <View style={styles.tickContainer}>
          <View style={styles.tickCircle}>
            <Text style={styles.tickSymbol}>✓</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SocialBox;

const styles = StyleSheet.create({
  box: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  boxValue: {
    fontSize: 14,
    color: '#333',
    paddingRight: 20 // Make space for the tick
  },
  boxPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic'
  },
  tickContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  tickCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tickSymbol: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  }
});