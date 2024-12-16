import { useState, useEffect } from 'react';  
import axios from 'axios';  
import MealBox from './MealBox';  
import { Pagination, Spin } from 'antd';  
import PropTypes from 'prop-types';



const AllRecipes = ( {filterByIngredients, filterByAreas, selectedIngredients = [], selectedAreas=[]} ) => {  
  const [recipes, setRecipes] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [currentPage, setCurrentPage] = useState(1);  
  const recipesPerPage = 10;  
  const totalRecipes = recipes.length;  
  const indexOfLastRecipe = currentPage * recipesPerPage;  
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;  
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);  

  const onPageChange = (page) => {  
    setCurrentPage(page);  
  };   

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

  const fetchRecipesByIngredients = async () => {  
    const fetchedRecipes = [];  
    const recipesByIngredient = await Promise.all(  
      selectedIngredients?.map(fetchRecipesByIngredient)  
    );  
    recipesByIngredient.forEach((recipes) => {  
      fetchedRecipes.push(...recipes);   
    });  

    return fetchedRecipes;  
  };  

  const fetchRecipesByAreas = async () => {  
    const fetchedRecipes = [];  
    const recipesByArea = await Promise.all( 
      selectedAreas?.map(fetchRecipesByArea)  
    );  
    recipesByArea.forEach((recipes) => {  
      fetchedRecipes.push(...recipes);   
    });  
    return fetchedRecipes;  
  };  

  useEffect(() => {  
    const fetchRecipes = async () => {  
      setLoading(true);  
      let allRecipes = [];

      if (!filterByIngredients && !filterByAreas) {  
        allRecipes = await fetchAllRecipes();  
      } 
      else {  
        if (filterByAreas) { 
          const recipesByArea = await fetchRecipesByAreas();  
          allRecipes.push(...recipesByArea);  
        }  
        if (filterByIngredients) {  
          const recipesByIngredient = await fetchRecipesByIngredients();  
          allRecipes.push(...recipesByIngredient);  
        }  
      }  
      setRecipes(allRecipes);  
      setLoading(false);  
    };  

    fetchRecipes();  
  }, [filterByIngredients, filterByAreas, selectedIngredients, selectedAreas]);   

  return (  
    <>  

      <div id='mealContainer'>  
      {loading && <div><Spin size='large'/></div>}   
        {currentRecipes.map((meal) => (  
          <MealBox key={meal.idMeal} meal={meal} />  
        ))}  
      </div> 
      <br/> 
      <div id='mealContainer'> 
        
        <Pagination  
          current={currentPage}  
          pageSize={recipesPerPage}  
          total={totalRecipes}  
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