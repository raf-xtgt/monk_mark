import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from './state-controller/state-controller';
import TopBar from './components/top-bar/top-bar';
import BottomNavigation from './components/bottom-navigation/bottom-navigation';
import Router from './router';
import { SessionService } from './services/session-service';

const AppContainer: React.FC = () => {
  const { showTopBar, showBottomNavigation, currentRoute, setCurrentRoute, setUser } = useAppState();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userState = await SessionService.getOrCreateUser({
          email: 'test-user@gmail.com',
        });
        setUser(userState);
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initializeUser();
  }, [setUser]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
});

export default AppContainer;
