import React from 'react';
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
  } = useAppState();

  const handleAddNote = () => {
    const newNote = {
      index: noteContentViewMetadata.notes.length,
      content: '',
      isNew: true,
    };

    setNoteContentViewMetadata({
      notes: [...noteContentViewMetadata.notes, newNote],
      activeNoteIndex: newNote.index,
    });
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

    if (!focusSession || !user) {
      Alert.alert('Error', 'Session or user information is missing.');
      return;
    }

    try {
      if (activeNote.isNew) {
        // Create new note
        // Note: notebook_hdr_guid should be provided by the focus session or created separately
        // For now, we'll use a placeholder or the library_hdr_guid as reference
        const payload = {
          notebook_hdr_guid: focusSession.libraryHdrGuid, // Using library as notebook reference
          user_guid: user.guid,
          library_hdr_guid: focusSession.libraryHdrGuid,
          focus_session_guid: focusSession.focusSessionGuid,
          content_text: activeNote.content,
          sequence_no: activeNote.index,
        };

        const result = await NotebookContentService.create(payload);

        // Update note with guid and mark as saved
        const updatedNotes = noteContentViewMetadata.notes.map((note) =>
          note.index === activeNote.index
            ? { ...note, guid: result.guid, isNew: false }
            : note
        );

        setNoteContentViewMetadata({
          ...noteContentViewMetadata,
          notes: updatedNotes,
        });

        Alert.alert('Success', 'Note saved successfully!');
      } else {
        // Update existing note
        if (!activeNote.guid) {
          Alert.alert('Error', 'Note ID is missing.');
          return;
        }

        const payload = {
          content_text: activeNote.content,
          sequence_no: activeNote.index,
        };

        await NotebookContentService.update(activeNote.guid, payload);
        Alert.alert('Success', 'Note updated successfully!');
      }
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
