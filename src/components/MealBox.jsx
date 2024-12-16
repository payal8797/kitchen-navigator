import { useNavigate } from 'react-router-dom'

const MealBox = ({ meal }) => {

    const navigate = useNavigate();

    return ( 
        <div className='meal-box'>
        <img src={meal.strMealThumb} alt={meal.strMeal} onClick={()=>navigate(`/meal/${meal.idMeal}`)} loading='lazy'/>
            <p>{meal.strMeal}</p>
            
        </div>
       
    )
}

export default MealBox