import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppState } from '../../_state-controller/state-controller';

const ProfileContainer: React.FC = () => {
  const { user } = useAppState();

  return (
    <View style={styles.container}>
      <View style={styles.profileCircle}>
        <Text style={styles.initials}>
          {user?.userName ? user.userName.substring(0, 2).toUpperCase() : 'U'}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user?.userName || 'Not set'}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'Not set'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  initials: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 10,
  },
  valueSmall: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
  },
});

export default ProfileContainer;
