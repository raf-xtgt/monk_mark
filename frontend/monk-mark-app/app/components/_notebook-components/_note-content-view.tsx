import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../_state-controller/state-controller';

interface NoteContentViewProps {
    index: number;
    content: string;
    isActive: boolean;
    onPress: () => void;
    onContentChange: (text: string) => void;
    onDiscard: () => void;
}

const NoteContentView: React.FC<NoteContentViewProps> = ({
    index,
    content,
    isActive,
    onPress,
    onContentChange,
    onDiscard,
}) => {
    return (
        <View style={[styles.container, isActive && styles.activeContainer]}>
            <TouchableOpacity
                style={styles.touchableArea}
                onPress={onPress}
                activeOpacity={1}
            >
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Start typing your note..."
                    placeholderTextColor="#999"
                    value={content}
                    onChangeText={onContentChange}
                    onFocus={onPress}
                    textAlignVertical="top"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.discardButton}
                onPress={onDiscard}
                activeOpacity={0.7}
            >
                <Ionicons name="close-circle" size={24} color="#ff6b6b" />
            </TouchableOpacity>

            <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fffacd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        opacity: 0.85,
        position: 'relative',
    },
    activeContainer: {
        opacity: 1,
        borderWidth: 2,
        borderColor: '#4FC3F7',
    },
    touchableArea: {
        flex: 1,
        minHeight: 120,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        minHeight: 120,
    },
    discardButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    indexBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    indexText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default NoteContentView;
