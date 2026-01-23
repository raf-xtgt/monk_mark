import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppState } from './state-controller/state-controller';
import TopBar from './components/top-bar/top-bar';
import BottomNavigation from './components/bottom-navigation/bottom-navigation';
import Router from './router';

const AppContainer: React.FC = () => {
  const { showTopBar, showBottomNavigation } = useAppState();
  const [currentRoute, setCurrentRoute] = useState(1);

  return (
    <View style={styles.container}>
      {showTopBar && <TopBar />}
      
      <View style={styles.content}>
        <Router currentRoute={currentRoute} />
      </View>
      
      {showBottomNavigation && (
        <BottomNavigation 
          currentRoute={currentRoute} 
          onNavigate={setCurrentRoute} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppContainer;
