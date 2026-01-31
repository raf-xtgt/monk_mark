import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import NoteTakingTimer from './_note-taking-timer';
import NoteTakingPanel from './_note-taking-panel';
import NotebookBackground from './_notebook-background';
import NoteContentView from './_note-content-view';
import { useAppState } from '../../_state-controller/state-controller';
import { NotebookContentService } from '../../_services/_notebook-content-service';

const NoteTakingView: React.FC = () => {
  const {
    focusSession,
    user,
    noteContentViewMetadata,
    setNoteContentViewMetadata,
    currentNotebookGuid,
  } = useAppState();

  // Load existing notes when component mounts or currentNotebookGuid changes
  useEffect(() => {
    const loadNotes = async () => {
      if (!currentNotebookGuid) {
        console.log('No notebook guid available');
        return;
      }

      try {
        const notebookContents = await NotebookContentService.getByNotebookHdr(currentNotebookGuid);
        
        if (notebookContents && notebookContents.length > 0) {
          // Transform API response to match noteContentViewMetadata structure
          const loadedNotes = notebookContents.map((content: any, index: number) => ({
            index: index,
            guid: content.guid,
            content: content.content_text || '',
            isNew: false,
          }));

          setNoteContentViewMetadata({
            notes: loadedNotes,
            activeNoteIndex: null,
          });
        } else {
          // No existing notes, start with empty state
          setNoteContentViewMetadata({
            notes: [],
            activeNoteIndex: null,
          });
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        // Start with empty state on error
        setNoteContentViewMetadata({
          notes: [],
          activeNoteIndex: null,
        });
      }
    };

    loadNotes();
  }, [currentNotebookGuid]);

  const handleAddNote = async () => {
    if (!focusSession || !user || !currentNotebookGuid) {
      Alert.alert('Error', 'Session, user, or notebook information is missing.');
      return;
    }

    try {
      // Create empty note record in database immediately
      const payload = {
        notebook_hdr_guid: currentNotebookGuid,
        user_guid: user.guid,
        library_hdr_guid: focusSession.libraryHdrGuid,
        focus_session_guid: focusSession.focusSessionGuid,
        content_text: '',
        sequence_no: noteContentViewMetadata.notes.length,
      };

      const result = await NotebookContentService.create(payload);

      // Add new note with guid from database
      const newNote = {
        index: noteContentViewMetadata.notes.length,
        guid: result.guid,
        content: '',
        isNew: false, // Not new anymore since it's already in the database
      };

      setNoteContentViewMetadata({
        notes: [...noteContentViewMetadata.notes, newNote],
        activeNoteIndex: newNote.index,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Failed to create note. Please try again.');
    }
  };

  const handleSaveNote = async () => {
    if (noteContentViewMetadata.activeNoteIndex === null) {
      Alert.alert('No Active Note', 'Please select a note to save.');
      return;
    }

    const activeNote = noteContentViewMetadata.notes.find(
      (note) => note.index === noteContentViewMetadata.activeNoteIndex
    );

    if (!activeNote) {
      Alert.alert('Error', 'Active note not found.');
      return;
    }

    if (!activeNote.content.trim()) {
      Alert.alert('Empty Note', 'Please add some content before saving.');
      return;
    }

    if (!activeNote.guid) {
      Alert.alert('Error', 'Note ID is missing.');
      return;
    }

    try {
      // Update existing note
      const payload = {
        content_text: activeNote.content,
        sequence_no: activeNote.index,
      };

      await NotebookContentService.update(activeNote.guid, payload);
      Alert.alert('Success', 'Note updated successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const handleHighlightNote = () => {
    console.log('Highlight note functionality - To be implemented');
    Alert.alert('Coming Soon', 'Highlight feature will be available soon!');
  };

  const handleCapturePhoto = () => {
    console.log('Camera functionality - To be implemented');
    Alert.alert('Coming Soon', 'Camera feature will be available soon!');
  };

  const handleNoteCameraPress = (index: number) => {
    console.log(`Camera pressed for note ${index}`);
    // Set the note as active first
    setNoteContentViewMetadata({
      ...noteContentViewMetadata,
      activeNoteIndex: index,
    });
    // TODO: Implement camera functionality for specific note
    Alert.alert('Coming Soon', `Camera feature for note ${index + 1} will be available soon!`);
  };

  const handleNotePress = (index: number) => {
    setNoteContentViewMetadata({
      ...noteContentViewMetadata,
      activeNoteIndex: index,
    });
  };

  const handleContentChange = (index: number, text: string) => {
    const updatedNotes = noteContentViewMetadata.notes.map((note) =>
      note.index === index ? { ...note, content: text } : note
    );

    setNoteContentViewMetadata({
      ...noteContentViewMetadata,
      notes: updatedNotes,
    });
  };

  const handleDiscard = (index: number) => {
    Alert.alert(
      'Discard Note',
      'Are you sure you want to discard this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            // Remove the note
            const filteredNotes = noteContentViewMetadata.notes.filter(
              (note) => note.index !== index
            );

            // Reindex remaining notes
            const reindexedNotes = filteredNotes.map((note, idx) => ({
              ...note,
              index: idx,
            }));

            // Update active index if needed
            let newActiveIndex = noteContentViewMetadata.activeNoteIndex;
            if (newActiveIndex === index) {
              newActiveIndex = null;
            } else if (
              newActiveIndex !== null &&
              newActiveIndex > index
            ) {
              newActiveIndex--;
            }

            setNoteContentViewMetadata({
              notes: reindexedNotes,
              activeNoteIndex: newActiveIndex,
            });
          },
        },
      ]
    );
  };

  // Sort notes by index in ascending order
  const sortedNotes = [...noteContentViewMetadata.notes].sort(
    (a, b) => a.index - b.index
  );

  return (
    <View style={styles.container}>
      <NotebookBackground />

      <NoteTakingTimer />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedNotes.map((note) => (
          <NoteContentView
            key={note.index}
            index={note.index}
            content={note.content}
            isActive={noteContentViewMetadata.activeNoteIndex === note.index}
            onPress={() => handleNotePress(note.index)}
            onContentChange={(text) => handleContentChange(note.index, text)}
            onDiscard={() => handleDiscard(note.index)}
            onCameraPress={() => handleNoteCameraPress(note.index)}
          />
        ))}
      </ScrollView>

      <NoteTakingPanel
        onAddNote={handleAddNote}
        onSaveNote={handleSaveNote}
        onHighlightNote={handleHighlightNote}
        onCapturePhoto={handleCapturePhoto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 100,
  },
});

export default NoteTakingView;
