import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NoteTakingTimer from './_note-taking-timer';

const NoteTakingView: React.FC<any> = () => {


  return (
    <View>
        <Text>Note taking view</Text>
        <NoteTakingTimer />
    </View>
  );
};



export default NoteTakingView;
