import { useState, useEffect } from 'react';  
import axios from 'axios';  
import MealBox from './MealBox';  
import { Pagination, Spin } from 'antd';  
import PropTypes from 'prop-types';



const AllRecipes = ({ filterByIngredients, filterByAreas, selectedIngredients = [], selectedAreas = [] }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  const fetchRecipesByLetter = async (letter) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      return response.data.meals || [];
    } catch (err) {
      console.error(`Error fetching recipes for letter ${letter}:`, err);
      return [];
    }
  };

  const fetchRecipesByIngredient = async (ingredient) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      return response.data.meals || [];
    } catch (err) {
      console.error(`Error fetching recipes for ingredient ${ingredient}:`, err);
      return [];
    }
  };

  const fetchRecipesByArea = async (area) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      return response.data.meals || [];
    } catch (err) {
      console.error(`Error fetching recipes for area ${area}:`, err);
      return [];
    }
  };

  const fetchAllRecipes = async () => {
    const allRecipes = [];
    for (let charCode = 97; charCode <= 122; charCode++) {
      const letter = String.fromCharCode(charCode);
      const recipesForLetter = await fetchRecipesByLetter(letter);
      allRecipes.push(...recipesForLetter);
    }
    return allRecipes;
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      let fetchedRecipes = new Set();

      if (!filterByIngredients && !filterByAreas) {
        // Fetch all recipes if no filters are applied
        const allRecipes = await fetchAllRecipes();
        fetchedRecipes = new Set(allRecipes);
      } else {
        // Fetch recipes based on selected filters
        if (filterByAreas && selectedAreas.length > 0) {
          const recipesByArea = await Promise.all(selectedAreas.map(fetchRecipesByArea));
          recipesByArea.forEach((recipes) => recipes.forEach((recipe) => fetchedRecipes.add(recipe)));
        }

        if (filterByIngredients && selectedIngredients.length > 0) {
          const recipesByIngredient = await Promise.all(selectedIngredients.map(fetchRecipesByIngredient));
          recipesByIngredient.forEach((recipes) => recipes.forEach((recipe) => fetchedRecipes.add(recipe)));
        }
      }

      // Convert Set back to array
      setRecipes(Array.from(fetchedRecipes));
      setLoading(false);
    };

    fetchRecipes();
  }, [filterByIngredients, filterByAreas, selectedIngredients, selectedAreas]);

  const currentRecipes = recipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div id="mealContainer">
        {loading && <div><Spin size="large" /></div>}
        {!loading && currentRecipes.map((meal) => (
          <MealBox key={meal.idMeal} meal={meal} />
        ))}
      </div>
      <br />
      <div id="mealContainer">
        <Pagination
          current={currentPage}
          pageSize={recipesPerPage}
          total={recipes.length}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};
AllRecipes.propTypes = {  
  filterByIngredients: PropTypes.bool.isRequired,
  filterByAreas: PropTypes.bool.isRequired, 
  selectedIngredients: PropTypes.arrayOf(PropTypes.string),
  selectedAreas: PropTypes.arrayOf(PropTypes.string)
};  
export default AllRecipes;