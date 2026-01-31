import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '../../_state-controller/state-controller';
import { API_BASE_URL } from '../../_constants/api-constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NoteContentCameraProps {
    onClose: () => void;
}

const NoteContentCamera: React.FC<NoteContentCameraProps> = ({ onClose }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [highlights, setHighlights] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
    const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const { noteContentViewMetadata, setNoteContentViewMetadata, user, currentNotebookGuid } = useAppState();

    if (!permission) {
        return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Camera permission required</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCapture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo?.uri) {
                    setCapturedImage(photo.uri);
                    setHighlights([]);
                }
            } catch (error) {
                console.error('Error capturing photo:', error);
            }
        }
    };

    const handlePanGesture = (event: any) => {
        const { state, x, y, translationX, translationY } = event.nativeEvent;

        if (state === State.BEGAN) {
            setPanStart({ x, y });
        } else if (state === State.END && panStart) {
            const width = Math.abs(translationX);
            const height = Math.abs(translationY);

            if (width > 20 && height > 20) {
                const newHighlight = {
                    x: Math.min(panStart.x, x),
                    y: Math.min(panStart.y, y),
                    width,
                    height,
                };
                setHighlights([...highlights, newHighlight]);
            }
            setPanStart(null);
        }
    };

    const handleSave = async () => {
        console.log("capturedImage", capturedImage)
        console.log("noteContentViewMetadata", noteContentViewMetadata)
        if (!capturedImage || noteContentViewMetadata.activeNoteIndex === null) return;

        try {
            const storageKey = `note_image_${Date.now()}`;
            await AsyncStorage.setItem(storageKey, capturedImage);

            const updatedNotes = [...noteContentViewMetadata.notes];
            const activeNote = updatedNotes[noteContentViewMetadata.activeNoteIndex];

            if (!activeNote) {
                console.error('Active note not found');
                return;
            }

            if (!activeNote.images) {
                activeNote.images = [];
            }

            activeNote.images.push({
                uri: capturedImage,
                highlights,
                asyncStorageKey: storageKey,
            });

            setNoteContentViewMetadata({
                ...noteContentViewMetadata,
                notes: updatedNotes,
            });

            // Upload file to backend
            if (user?.guid && currentNotebookGuid) {
                try {
                    // Create FormData with React Native compatible file object
                    const formData = new FormData();

                    // In React Native, we need to append the file with specific format
                    formData.append('file', {
                        uri: capturedImage,
                        type: 'image/jpeg',
                        name: `note_${Date.now()}.jpg`,
                    } as any);

                    formData.append('user_guid', user.guid);
                    formData.append('notebook_hdr_guid', currentNotebookGuid);

                    // Add notebook_content_guid if the active note has a guid
                    if (activeNote.guid) {
                        formData.append('notebook_content_guid', activeNote.guid);
                    }

                    if (highlights.length > 0) {
                        formData.append('highlight_metadata', JSON.stringify({ highlights }));
                    }

                    const response = await fetch(`${API_BASE_URL}/notebook-content-file-links/upload-file`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('Upload successful:', result);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }

            // Reset for next capture
            setCapturedImage(null);
            setHighlights([]);
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };

    const handleDiscard = () => {
        setCapturedImage(null);
        setHighlights([]);
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>
            </View>

            {!capturedImage ? (
                <>
                    <CameraView style={styles.camera} ref={cameraRef} facing="back" />
                    <View style={styles.captureContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                            <Ionicons name="camera" size={40} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <ScrollView style={styles.previewContainer}>
                    <PanGestureHandler onHandlerStateChange={handlePanGesture} onGestureEvent={handlePanGesture}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="contain" />
                            {highlights.map((highlight, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.highlight,
                                        {
                                            left: highlight.x,
                                            top: highlight.y,
                                            width: highlight.width,
                                            height: highlight.height,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </PanGestureHandler>
                    <Text style={styles.instructionText}>Swipe on the image to highlight text</Text>
                    <View style={styles.actionButtons}>
                        {/* discard captured image button */}
                        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Discard</Text>
                        </TouchableOpacity>

                        {/* save captured image button */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    camera: {
        flex: 1,
    },
    captureContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#4FC3F7',
    },
    previewContainer: {
        flex: 1,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.33,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    highlight: {
        position: 'absolute',
        backgroundColor: 'rgba(173, 255, 47, 0.3)',
        borderWidth: 2,
        borderColor: 'rgba(173, 255, 47, 0.8)',
    },
    instructionText: {
        color: '#fff',
        textAlign: 'center',
        marginVertical: 16,
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingBottom: 40,
    },
    discardButton: {
        backgroundColor: '#ff6b6b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    saveButton: {
        backgroundColor: '#4FC3F7',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#4FC3F7',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NoteContentCamera;
