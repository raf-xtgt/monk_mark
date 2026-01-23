import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { routes } from '../../router';

interface BottomNavigationProps {
  currentRoute: number;
  onNavigate: (routeId: number) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentRoute, onNavigate }) => {
  return (
    <View style={styles.container}>
      {routes.map((route) => (
        <TouchableOpacity
          key={route.id}
          style={styles.tab}
          onPress={() => onNavigate(route.id)}
        >
          <Text style={[
            styles.tabText,
            currentRoute === route.id && styles.activeTabText
          ]}>
            {route.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#757575',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
