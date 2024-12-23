import { useState, useEffect } from 'react';  
import { Select } from 'antd';  
import axios from 'axios';  
import { useNavigate } from 'react-router-dom'
 
import AllRecipes from './AllRecipes';

const { Option } = Select;  

const Main = () => {  
    const [text, setText] = useState('');  
    const [areas, setAreas] = useState([]);  
    const [allIngredients, setAllIngredients] = useState([]);  
    const [selectedAreas, setSelectedAreas] = useState([]);  
    const [selectedIngredients, setSelectedIngredients] = useState([]);  
    const navigate = useNavigate()
    useEffect(() => {  
      const fetchAreas = async () => {  
          try {  
              const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');  
              const areaList = response.data.meals.map(meal => meal.strArea);  
              setAreas(areaList);  
          } catch (error) {  
              console.error('Error fetching areas:', error);  
          }  
      };  

      fetchAreas();  

      const fetchIngredients = async () => {  
        try {  
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');  
            const ingredientsList = response.data.meals.map(meal => meal.strIngredient); 
            setAllIngredients(ingredientsList);  
        } catch (error) {  
            console.error('Error fetching areas:', error);  
        }  
      };  

      fetchIngredients();  

    }, [selectedAreas, selectedIngredients]);  

    const handleSubmit = (e) =>{
      e.preventDefault()
      navigate(`/meal/${text}`)
      setText('')
  }


    return (  
        <>
        <div id='main'>
          <form id="myform" onSubmit={handleSubmit}>
              <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder='Search food by name or id...'/>
          </form>
          <br/>
          <Select
            placeholder="Filter by Area"
            mode="tags"
            onChange={(values) => setSelectedAreas(values)}
            style={{ width: '300px'}}
          >
            {areas.map(area => (
              <Option key={area} value={area}>
                {area}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Ingredients"
            mode="tags"
            onChange={(values) => setSelectedIngredients(values)}
            style={{ width: '300px', marginLeft: '10px'}}
          >
            {allIngredients.map(ingredient => (
              <Option key={ingredient} value={ingredient}>
                {ingredient}
              </Option>
            ))}
          </Select>

          <AllRecipes 
            filterByIngredients={selectedIngredients.length > 0} 
            filterByAreas={selectedAreas.length > 0} 
            selectedIngredients={selectedIngredients}
            selectedAreas={selectedAreas} 
          />
        </div>
        </> 
    );  
};  

export default Main;