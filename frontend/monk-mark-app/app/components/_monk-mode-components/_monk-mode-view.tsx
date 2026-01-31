import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FocusTimer from './_focus-timer';
import { useAppState } from '../../_state-controller/state-controller';
import { FocusSessionService } from '../../_services/focus-session-service';
import { LibraryService } from '../../_services/library-service';
import { NotebookHdrService } from '../../_services/_notebook-hdr-service';
import { Ionicons } from '@expo/vector-icons';

interface BookResult {
  guid: string;
  book_name: string;
  author_name: string;
  description: string;
  cover_image_url: string;
}

interface MonkModeViewProps {
  selectedBook: BookResult | null;
}

const MonkModeView: React.FC<MonkModeViewProps> = ({ selectedBook }) => {
  const [currentHours, setCurrentHours] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [initialTimeSeconds, setInitialTimeSeconds] = useState(0);

  const {
    focusSession,
    setFocusSession,
    setShowTopBar,
    setShowBottomNavigation,
    setCurrentRoute,
    focusSessionMetadata,
    setFocusSessionMetadata,
    user,
    setCurrentNotebookGuid
  } = useAppState();

  // Get isRunning from global state
  const isRunning = focusSessionMetadata?.isRunning ?? false;

  if (!selectedBook) {
    return null;
  }

  const handleTimeUpdate = (hours: number, minutes: number, seconds: number) => {
    setCurrentHours(hours);
    setCurrentMinutes(minutes);
    setCurrentSeconds(seconds);
  };

  const handlePlay = async () => {
    if (!focusSession || !user?.guid) return;

    try {
      // Calculate initial time in seconds
      const totalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
      setInitialTimeSeconds(totalSeconds);

      // Update last_read in library record
      await LibraryService.updateLastReadLibraryBookRecord(focusSession.libraryHdrGuid);

      // Create focus session in database
      const createdSession = await FocusSessionService.createFocusSession({
        userGuid: user.guid,
        libraryHdrGuid: focusSession.libraryHdrGuid,
        timeHrs: currentHours + currentMinutes / 60,
        timeSeconds: totalSeconds,
      });

      // Update focus session with the created guid
      setFocusSession({
        ...focusSession,
        focusSessionGuid: createdSession.focusSessionGuid,
      });

      // Update metadata with running state and book info
      setFocusSessionMetadata({
        bookName: selectedBook.book_name,
        coverImageUrl: selectedBook.cover_image_url,
        isRunning: true,
      });

      // Hide top and bottom bars
      setShowTopBar(false);
      setShowBottomNavigation(false);
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const handlePause = () => {
    setFocusSessionMetadata({
      ...focusSessionMetadata,
      bookName: focusSessionMetadata?.bookName ?? selectedBook.book_name,
      coverImageUrl: focusSessionMetadata?.coverImageUrl ?? selectedBook.cover_image_url,
      isRunning: false,
    });
    setShowTopBar(true);
    setShowBottomNavigation(true);
  };

  const handleStop = async () => {
    if (!focusSession?.focusSessionGuid) return;

    try {
      // Calculate elapsed time
      const remainingSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
      const elapsedSeconds = initialTimeSeconds - remainingSeconds;
      const elapsedHours = elapsedSeconds / 3600;

      // Update focus session in database
      await FocusSessionService.updateFocusSession({
        focusSessionGuid: focusSession.focusSessionGuid,
        timeHrs: elapsedHours,
        timeSeconds: elapsedSeconds,
      });

      // Stop timer and clear metadata
      setFocusSessionMetadata(null);

      // Show top and bottom bars
      setShowTopBar(true);
      setShowBottomNavigation(true);
    } catch (error) {
      console.error('Error stopping focus session:', error);
    }
  };

  const handleNoteTaking = async () => {
    if (!focusSession?.libraryHdrGuid || !focusSession?.userGuid) {
      console.error('Missing required focus session data');
      return;
    }

    try {
      // Check if notebook exists for this library
      const notebook = await NotebookHdrService.getByLibrary(focusSession.libraryHdrGuid);

      let notebookGuid: string;

      if (notebook) {
        // Notebook found, use its guid
        notebookGuid = notebook.guid;
      } else {
        // No notebook found, create a new one
        const newNotebook = await NotebookHdrService.create({
          user_guid: focusSession.userGuid,
          library_hdr_guid: focusSession.libraryHdrGuid,
          name: `${focusSession.bookName} - Notes`,
          running_no: "test-running-no",
          description: `Notes for ${focusSession.bookName}`,
        });
        notebookGuid = newNotebook.guid;
      }

      // Store the notebook guid in state
      setCurrentNotebookGuid(notebookGuid);

      // Navigate to note taker
      setCurrentRoute(6);
    } catch (error) {
      console.error('Error handling notebook:', error);
      // Still navigate even if there's an error
      setCurrentRoute(6);
    }
  };

  return (
    <View style={styles.container}>
      <FocusTimer isRunning={isRunning} onTimeUpdate={handleTimeUpdate} />

      <View style={styles.bookSection}>
        <Image
          source={{ uri: selectedBook.cover_image_url }}
          style={styles.bookCover}
          resizeMode="cover"
        />

        {/* <View style={styles.bookInfo}>
          <Text style={styles.bookName}>{selectedBook.book_name}</Text>
          <Text style={styles.author}>by {selectedBook.author_name}</Text>
        </View> */}

        {/* Focus timer control buttons */}
        <View style={styles.controlButtons}>
          {!isRunning ? (
            // play button
            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <Ionicons name="play" size={32} color="white" />
            </TouchableOpacity>
          ) : (
            <>
              {/* pause button */}
              <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                <Ionicons name="pause" size={32} color="white" />
              </TouchableOpacity>

              {/* stop button */}
              <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                <Ionicons name="stop" size={32} color="white" />
              </TouchableOpacity>

              {/* note taking button */}
              <TouchableOpacity style={styles.noteButton} onPress={handleNoteTaking}>
                <Ionicons name="create-outline" size={32} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a4a5e',
  },
  bookSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bookCover: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  bookName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f4c542',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stopButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6b9d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  noteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
  },
});

export default MonkModeView;
