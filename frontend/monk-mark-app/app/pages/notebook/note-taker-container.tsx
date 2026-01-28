import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NoteTakingView from '@/app/components/_notebook-components/_note-taking-view';

const NoteTakerContainer: React.FC<any> = () => {


  return (
    <View>
        <NoteTakingView></NoteTakingView>
    </View>
  );
};



export default NoteTakerContainer;
