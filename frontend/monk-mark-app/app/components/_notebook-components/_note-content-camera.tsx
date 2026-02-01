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
    const [selectedHighlightIndex, setSelectedHighlightIndex] = useState<number | null>(null);
    const [resizeMode, setResizeMode] = useState<'none' | 'move' | 'resize-br' | 'resize-tr' | 'resize-bl' | 'resize-tl'>('none');
    const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
    const [imageLayout, setImageLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const imageContainerRef = useRef<View>(null);
    const { noteContentViewMetadata, setNoteContentViewMetadata, user, currentNotebookGuid } = useAppState();

    // Fixed size for tap highlights (relative to screen width)
    const TAP_HIGHLIGHT_WIDTH = SCREEN_WIDTH * 0.15;
    const TAP_HIGHLIGHT_HEIGHT = SCREEN_WIDTH * 0.1;

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
            
            // Check if user tapped on an existing highlight
            let foundHighlight = false;
            for (let i = highlights.length - 1; i >= 0; i--) {
                const h = highlights[i];
                const RESIZE_HANDLE_SIZE = 30;
                
                // Check if tap is on bottom-right resize handle
                if (x >= h.x + h.width - RESIZE_HANDLE_SIZE && x <= h.x + h.width &&
                    y >= h.y + h.height - RESIZE_HANDLE_SIZE && y <= h.y + h.height) {
                    setSelectedHighlightIndex(i);
                    setResizeMode('resize-br');
                    foundHighlight = true;
                    break;
                }
                // Check if tap is on top-right resize handle
                if (x >= h.x + h.width - RESIZE_HANDLE_SIZE && x <= h.x + h.width &&
                    y >= h.y && y <= h.y + RESIZE_HANDLE_SIZE) {
                    setSelectedHighlightIndex(i);
                    setResizeMode('resize-tr');
                    foundHighlight = true;
                    break;
                }
                // Check if tap is on bottom-left resize handle
                if (x >= h.x && x <= h.x + RESIZE_HANDLE_SIZE &&
                    y >= h.y + h.height - RESIZE_HANDLE_SIZE && y <= h.y + h.height) {
                    setSelectedHighlightIndex(i);
                    setResizeMode('resize-bl');
                    foundHighlight = true;
                    break;
                }
                // Check if tap is on top-left resize handle
                if (x >= h.x && x <= h.x + RESIZE_HANDLE_SIZE &&
                    y >= h.y && y <= h.y + RESIZE_HANDLE_SIZE) {
                    setSelectedHighlightIndex(i);
                    setResizeMode('resize-tl');
                    foundHighlight = true;
                    break;
                }
                // Check if tap is inside highlight (for moving)
                if (x >= h.x && x <= h.x + h.width && y >= h.y && y <= h.y + h.height) {
                    setSelectedHighlightIndex(i);
                    setResizeMode('move');
                    foundHighlight = true;
                    break;
                }
            }
            
            if (!foundHighlight) {
                setSelectedHighlightIndex(null);
                setResizeMode('none');
            }
        } else if (state === State.ACTIVE && panStart) {
            if (selectedHighlightIndex !== null && resizeMode !== 'none') {
                // Update existing highlight
                const updatedHighlights = [...highlights];
                const h = updatedHighlights[selectedHighlightIndex];
                const currentX = panStart.x + translationX;
                const currentY = panStart.y + translationY;
                
                if (resizeMode === 'move') {
                    // Move the highlight by translation amount
                    const originalH = highlights[selectedHighlightIndex];
                    h.x = originalH.x + translationX;
                    h.y = originalH.y + translationY;
                } else if (resizeMode === 'resize-br') {
                    // Resize from bottom-right
                    h.width = Math.max(30, currentX - h.x);
                    h.height = Math.max(30, currentY - h.y);
                } else if (resizeMode === 'resize-tr') {
                    // Resize from top-right
                    const originalH = highlights[selectedHighlightIndex];
                    const newY = originalH.y + translationY;
                    const newHeight = originalH.y + originalH.height - newY;
                    if (newHeight > 30) {
                        h.y = newY;
                        h.height = newHeight;
                    }
                    h.width = Math.max(30, currentX - h.x);
                } else if (resizeMode === 'resize-bl') {
                    // Resize from bottom-left
                    const originalH = highlights[selectedHighlightIndex];
                    const newX = originalH.x + translationX;
                    const newWidth = originalH.x + originalH.width - newX;
                    if (newWidth > 30) {
                        h.x = newX;
                        h.width = newWidth;
                    }
                    h.height = Math.max(30, currentY - h.y);
                } else if (resizeMode === 'resize-tl') {
                    // Resize from top-left
                    const originalH = highlights[selectedHighlightIndex];
                    const newX = originalH.x + translationX;
                    const newY = originalH.y + translationY;
                    const newWidth = originalH.x + originalH.width - newX;
                    const newHeight = originalH.y + originalH.height - newY;
                    if (newWidth > 30) {
                        h.x = newX;
                        h.width = newWidth;
                    }
                    if (newHeight > 30) {
                        h.y = newY;
                        h.height = newHeight;
                    }
                }
                
                setHighlights(updatedHighlights);
            }
        } else if (state === State.END && panStart) {
            if (selectedHighlightIndex === null) {
                // Creating new highlight
                const deltaX = Math.abs(translationX);
                const deltaY = Math.abs(translationY);
                const endX = panStart.x + translationX;
                const endY = panStart.y + translationY;
                
                console.log('Creating highlight:', { panStart, endX, endY, deltaX, deltaY });
                
                // Check if it's a tap (minimal movement)
                if (deltaX < 10 && deltaY < 10) {
                    // Create fixed-size highlight at tap location
                    const newHighlight = {
                        x: panStart.x - TAP_HIGHLIGHT_WIDTH / 2,
                        y: panStart.y - TAP_HIGHLIGHT_HEIGHT / 2,
                        width: TAP_HIGHLIGHT_WIDTH,
                        height: TAP_HIGHLIGHT_HEIGHT,
                    };
                    console.log('Tap highlight:', newHighlight);
                    setHighlights([...highlights, newHighlight]);
                } else {
                    // Create highlight from swipe (horizontal or vertical)
                    const width = Math.abs(translationX);
                    const height = Math.abs(translationY);
                    
                    // Accept both horizontal and vertical swipes
                    if (width > 20 || height > 20) {
                        const newHighlight = {
                            x: Math.min(panStart.x, endX),
                            y: Math.min(panStart.y, endY),
                            width: Math.max(width, 30),
                            height: Math.max(height, 30),
                        };
                        console.log('Swipe highlight:', newHighlight);
                        setHighlights([...highlights, newHighlight]);
                    }
                }
            }
            
            setPanStart(null);
            setSelectedHighlightIndex(null);
            setResizeMode('none');
        }
    };

    const handleImageLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setImageLayout({ x, y, width, height });
        console.log('Image layout:', { x, y, width, height });
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

            <View style={styles.previewContainer}>
                <PanGestureHandler 
                    onHandlerStateChange={handlePanGesture} 
                    onGestureEvent={handlePanGesture}
                >
                    {/* This View must be the container for BOTH the image and highlights. 
                    Everything inside here is positioned relative to this box. 
                    */}
                    <View 
                        style={styles.imageContainer}
                        ref={imageContainerRef}
                        onLayout={handleImageLayout}
                    >
                        <Image 
                            source={{ uri: capturedImage }} 
                            style={styles.previewImage} 
                            resizeMode="cover" 
                        />
                        
                        {/* Map highlights here - they will now overlay correctly */}
                        {highlights.map((highlight, index) => (
                            <View key={index} style={{ position: 'absolute', zIndex: 100 }}>
                                <View
                                    style={[
                                        styles.highlight,
                                        {
                                            left: highlight.x,
                                            top: highlight.y,
                                            width: highlight.width,
                                            height: highlight.height,
                                        },
                                        selectedHighlightIndex === index && styles.selectedHighlight,
                                    ]}
                                />
                                {/* Resize handles */}
                                {selectedHighlightIndex === index && (
                                    <>
                                        <View style={[styles.resizeHandle, { left: highlight.x - 5, top: highlight.y - 5 }]} />
                                        <View style={[styles.resizeHandle, { left: highlight.x + highlight.width - 5, top: highlight.y - 5 }]} />
                                        <View style={[styles.resizeHandle, { left: highlight.x - 5, top: highlight.y + highlight.height - 5 }]} />
                                        <View style={[styles.resizeHandle, { left: highlight.x + highlight.width - 5, top: highlight.y + highlight.height - 5 }]} />
                                    </>
                                )}
                            </View>
                        ))}
                    </View>
                </PanGestureHandler>

                {/* Footer content remains outside the PanGestureHandler */}
                <View>
                    <Text style={styles.instructionText}>Swipe on the image to highlight text</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Discard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        backgroundColor: '#000',
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
    selectedHighlight: {
        borderColor: 'rgba(255, 215, 0, 1)',
        borderWidth: 3,
    },
    resizeHandle: {
        position: 'absolute',
        width: 10,
        height: 10,
        backgroundColor: '#FFD700',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FFF',
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
