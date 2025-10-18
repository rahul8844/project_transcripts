import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import VoiceTextInput from '../../components/VoiceTextInput/VoiceTextInput';
import {useMenu, MenuCategory, MenuItem} from '../../hooks/useMenu';
import styles from './styles';

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
        return COLORS.HOT_RED;
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
      <Header
        title={t('header.cateringMenu')}
        subtitle={t('header.authenticCuisine')}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <VoiceTextInput
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

export default MenuItemsScreen;
