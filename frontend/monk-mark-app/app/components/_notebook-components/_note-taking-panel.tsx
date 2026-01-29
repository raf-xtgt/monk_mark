import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../_state-controller/state-controller';

interface NoteTakingPanelProps {
    onAddNote?: () => void;
    onSaveNote?: () => void;
    onHighlightNote?: () => void;
    onCapturePhoto?: () => void;
}

const NoteTakingPanel: React.FC<NoteTakingPanelProps> = ({
    onAddNote,
    onSaveNote,
    onHighlightNote,
    onCapturePhoto,
}) => {
    return (
        <View style={styles.container}>
            {/* add note button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onAddNote}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={24} color="#333333" />
            </TouchableOpacity>

            {/* save note button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onSaveNote}
                activeOpacity={0.7}
            >
                <Ionicons name="save" size={24} color="#333333" />
            </TouchableOpacity>

            {/* capture image */}
            <TouchableOpacity
                style={styles.button}
                onPress={onCapturePhoto}
                activeOpacity={0.7}
            >
                <Ionicons name="camera" size={24} color="#333333" />
            </TouchableOpacity>
            
            {/* highlight image button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onHighlightNote}
                activeOpacity={0.7}
            >
                <Ionicons name="color-palette" size={24} color="#333333" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4FC3F7',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        gap: 8,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
});

export default NoteTakingPanel;
