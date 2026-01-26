import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LibraryService } from '../../_services/library-service';
import { useAppState } from '../../_state-controller/state-controller';
import { Ionicons } from '@expo/vector-icons';

interface BookRecord {
  guid: string;
  book_name: string;
  book_desc: string;
  storage_path: string;
  last_read: string;
}

const RecentReading: React.FC = () => {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppState();

  useEffect(() => {
    loadRecentBooks();
  }, [user]);

  const loadRecentBooks = async () => {
    if (!user?.guid) return;

    try {
      setLoading(true);
      const result = await LibraryService.getLibraryBookRecordsByCriteria({
        user_guid: user.guid,
      });
      console.log('Loaded books:', result);
      setBooks(result || []);
    } catch (error) {
      console.error('Error loading recent books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Continue reading</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Ionicons name="book" size={20} color="#000" />
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reading list yet</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {books.map((book) => (
            <View key={book.guid} style={styles.bookCard}>
              {book.storage_path ? (
                <Image
                  source={{ uri: book.storage_path }}
                  style={styles.bookCover}
                  resizeMode="cover"
                  onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                />
              ) : (
                <View style={[styles.bookCover, styles.placeholderCover]}>
                  <Ionicons name="book" size={48} color="#ccc" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  scrollContent: {
    paddingRight: 20,
  },
  bookCard: {
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bookCover: {
    width: 160,
    height: 240,
    borderRadius: 8,
  },
  placeholderCover: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
});

export default RecentReading;
