import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Modal, Tag } from 'antd';
import ReactPlayer from 'react-player';


const Navbar = () => {
  const [meal, setMeal] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
    handleRandomMeal()
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleNavigate = () => {
    navigate("/explore");
  };

  const handleRandomMeal = async () => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    const data = await res.json()
    setMeal(data.meals[0])
  };

  return (
    <>
    <nav>
    
      <Link to={"/"}>
        <div id='logo'>
          <img src="/diet.png" alt="logo" width={50} />
          <h2>Kitchen Navigator</h2>
        </div>
      </Link>
   
      <div onClick={handleNavigate} style={{ cursor: "pointer" }}>
        Explore
      </div>

      <div onClick={showModal} style={{ cursor: "pointer" }}>
        Mystery Feast
      </div>
      
    </nav>
    <Modal 
      title={<h2>{meal.strMeal}</h2>} 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      footer={false} 
      width={1000}
      style={{height: '80vh', overflowY: 'auto'}}
      >
        <>
          <div className="container">
            <div className="video-container">
              <ReactPlayer url={meal.strYoutube} width='100%' />
            </div>
            <div className='info'>
              <p><strong>Category:</strong> {meal.strCategory}</p>
              <p><strong>Area:</strong> {meal.strArea}</p>
              <p><strong>Instructions:</strong> {meal.strInstructions}</p>
            </div>
            <div className="ingredients">
              <h3>Ingredients:</h3>
                {Object.keys(meal)
                  .filter(key => key.includes('Ingredient') && meal[key])
                  .map(key => (
                    <Tag key={key}>{meal[key]}</Tag>
                  ))}
            </div>
          </div>
        </>
    </Modal>
    </>
  )
}

export default Navbar