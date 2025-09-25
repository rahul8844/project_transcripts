import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import VoiceTextInput from '../../components/VoiceTextInput/VoiceTextInput';
import {useMenu, MenuCategory, MenuItem} from '../../hooks/useMenu';

const MenuItemsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {t, isRTL} = useLanguage();
  const {Menu: menuCategories} = useMenu();

  // Include an 'All' category for quick filtering
  const categoriesWithAll: MenuCategory[] = [
    {id: 'all', name: t('common.all'), icon: '⭐', items: []},
    ...menuCategories,
  ];

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'Mild':
        return COLORS.SUCCESS_GREEN;
      case 'Medium':
        return COLORS.WARNING_ORANGE;
      case 'Hot':
        return COLORS.ERROR_RED;
      case 'Extra Hot':
        return '#8B0000';
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const filteredItems = (() => {
    const query = searchQuery.toLowerCase();
    if (selectedCategory === 'all') {
      const all = menuCategories.flatMap(cat => cat.items);
      return all.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }
    const cat = menuCategories.find(c => c.id === selectedCategory);
    const list = cat ? cat.items : [];
    return list.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  })();

  const renderCategoryButton = (category: MenuCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category.id)}>
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.id && styles.selectedCategoryText,
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({item}: {item: MenuItem}) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemHeader}>
        <View style={styles.menuItemTitleRow}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        <View style={styles.menuItemMeta}>
          <View style={styles.vegetarianBadge}>
            <Text style={styles.vegetarianText}>
              {item.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
            </Text>
          </View>
          <View
            style={[
              styles.spiceBadge,
              {backgroundColor: getSpiceLevelColor(item.spiceLevel)},
            ]}>
            <Text style={styles.spiceText}>{item.spiceLevel}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>{t('common.addToEvent')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title={t('header.cateringMenu')} subtitle={t('header.authenticCuisine')} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <VoiceTextInput
          style={[styles.searchInput, isRTL && styles.rtlInput]}
          placeholder={t('menuItems.searchMenuItems')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Category Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}>
          {categoriesWithAll.map(renderCategoryButton)}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_APP,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.ACCENT_APP,
    borderColor: COLORS.ACCENT_APP,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: COLORS.WHITE,
  },
  menuContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItemCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 3,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemHeader: {
    marginBottom: 8,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: COLORS.ACCENT_APP,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vegetarianBadge: {
    marginRight: 8,
  },
  vegetarianText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  spiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spiceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  menuItemDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.ACCENT_APP,
  },
  addButton: {
    backgroundColor: COLORS.ACCENT_APP,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  rtlInput: {
    textAlign: 'right',
  },
});

export default MenuItemsScreen;
