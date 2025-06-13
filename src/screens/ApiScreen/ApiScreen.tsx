import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../shared/tokens';
import { Button } from '../../shared/button';
import { ApiPresenter } from './ApiPresenter';
import { Recipe, ApiView } from './ApiInterfaces';

export default function ApiScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedInstructions, setExpandedInstructions] = useState<string[]>([]);

  const view: ApiView = {
    setRecipes,
    setSearchQuery,
    setIsLoading,
    setError,
    setExpandedInstructions,
    showError: (error: string) => Alert.alert('Сообщение', error),
  };

  const presenter = new ApiPresenter(view);

  return (
    <View style={styles.container}>
      <View style={styles.linearLayout}>
        <Text style={styles.title}>Поиск рецептов</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите блюдо (например, паста)..."
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button text="Найти рецепты" onPress={() => presenter.onSearchRecipes(searchQuery)} />
        {error && <Text style={styles.error}>{error}</Text>}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.blue} />
          </View>
        ) : (
          <View style={styles.recipeList}>
            <FlatList
              data={recipes}
              keyExtractor={item => item.idMeal}
              renderItem={({ item }) => (
                <View style={styles.recipe}>
                  <Text style={styles.recipeTitle}>{item.strMeal}</Text>
                  {item.strMealThumb ? (
                    <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                  ) : null}
                  <Text style={styles.sectionTitle}>Ингредиенты:</Text>
                  {item.ingredients.map((ing, index) => (
                    <Text key={index} style={styles.ingredient}>
                      - {ing.ingredient} {ing.measure ? `(${ing.measure})` : ''}
                    </Text>
                  ))}
                  <Text style={styles.sectionTitle}>Инструкции:</Text>
                  <TouchableOpacity onPress={() => presenter.onToggleInstructions(item.idMeal)}>
                    <Text style={styles.instructions}>
                      {expandedInstructions.includes(item.idMeal)
                        ? item.strInstructions
                        : `${item.strInstructions.slice(0, 100)}...`}
                    </Text>
                    <Text style={styles.toggleText}>
                      {expandedInstructions.includes(item.idMeal) ? 'Скрыть' : 'Показать больше'}
                    </Text>
                  </TouchableOpacity>
                  <Button
                    text="Добавить как привычку"
                    onPress={() => presenter.onAddHabit(item.strMeal)}
                  />
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ... стили остаются такими же ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 16,
  },
  linearLayout: {
    flexDirection: 'column',
    gap: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    color: Colors.black,
    padding: 10,
    borderRadius: 8,
  },
  recipeList: {
    height: '80%',
    paddingBottom: 20,
  },
  recipe: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  ingredient: {
    color: Colors.gray,
    fontSize: 14,
  },
  instructions: {
    color: Colors.gray,
    fontSize: 14,
  },
  toggleText: {
    color: Colors.blue,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  error: {
    color: Colors.red,
    fontSize: 16,
    textAlign: 'center',
  },
});