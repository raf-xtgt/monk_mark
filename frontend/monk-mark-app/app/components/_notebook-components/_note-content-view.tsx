import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoteTakingTimer from './_note-taking-timer';
import NoteTakingPanel from './_note-taking-panel';
import { useAppState } from '../../_state-controller/state-controller';

const NoteContentView: React.FC = () => {
  const { focusSession, user } = useAppState();

  return (
    <View>
     <Text>Note content view</Text>
    </View>
  );
};



export default NoteContentView;
