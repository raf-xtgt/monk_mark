import MonkModeBookSearch from '@/app/components/_monk-mode-components/_monk-mode-book-search';
import MonkModeView from '@/app/components/_monk-mode-components/_monk-mode-view';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface BookResult {
  guid: string;
  book_name: string;
  author_name: string;
  description: string;
  cover_image_url: string;
}

const MonkModeContainer: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);

  const handleBookSelect = (book: BookResult) => {
    setSelectedBook(book);
  };

  return (
    <View style={styles.container}>
      {!selectedBook ? (
        <MonkModeBookSearch onBookSelect={handleBookSelect} />
      ) : (
        <MonkModeView selectedBook={selectedBook} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default MonkModeContainer;
