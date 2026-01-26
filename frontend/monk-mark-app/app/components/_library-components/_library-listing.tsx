import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { LibraryService } from '../../_services/library-service';
import { useAppState } from '../../_state-controller/state-controller';
import LibraryCard from './_library_card';

interface LibraryBook {
  guid: string;
  book_name: string;
  cover_image_url?: string;
  total_sessions?: number;
  total_time_hrs?: number;
}

const LibraryListing: React.FC = () => {
  const { user } = useAppState();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<LibraryBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async (bookName?: string) => {
    if (!user?.guid) return;

    try {
      setLoading(true);
      setError(null);

      const payload: any = {
        user_guid: user.guid,
      };

      if (bookName && bookName.trim()) {
        payload.book_name = bookName.trim();
      }

      const result = await LibraryService.getLibraryBookRecordsByCriteria(payload);
      
      const booksData = Array.isArray(result) ? result : [];
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load library books');
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user?.guid]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      fetchBooks();
    } else {
      fetchBooks(text);
    }
  };

  const renderBookGrid = () => {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth > 768 ? (screenWidth - 48) / 4 : (screenWidth - 48) / 2;
    const numColumns = screenWidth > 768 ? 4 : 2;

    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading your library...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (filteredBooks.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No books found matching your search' : 'Your library is empty'}
          </Text>
        </View>
      );
    }

    const rows: LibraryBook[][] = [];
    for (let i = 0; i < filteredBooks.length; i += numColumns) {
      rows.push(filteredBooks.slice(i, i + numColumns));
    }

    return (
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((book) => (
              <View key={book.guid} style={[styles.cardWrapper, { width: cardWidth }]}>
                <LibraryCard
                  bookName={book.book_name}
                  coverImageUrl={book.cover_image_url}
                  totalSessions={book.total_sessions || 0}
                  totalTimeHours={book.total_time_hrs || 0}
                  onPress={() => console.log('Book pressed:', book.book_name)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search library"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderBookGrid()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  searchIcon: {
    position: 'absolute',
    right: 28,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 0,
  },
  cardWrapper: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default LibraryListing;
