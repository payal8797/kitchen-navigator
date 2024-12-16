import { useEffect, useState } from "react";
import Slider from "react-slick";
import FoodBox from "../../components/FoodBox";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const displayFood = async () => {
    const getAllCategories = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const categoriesData = await getAllCategories.json();
    setCategories(categoriesData.categories);

  };

  useEffect(() => {
    displayFood();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section id="menu">
      <h2>Explore by Categories</h2>
      <Slider {...sliderSettings} id="categoryContainer">
        {categories.map((category) => (
          <div key={category.idCategory}>
            <FoodBox category={category} />
          </div>
        ))}
      </Slider>

      
    </section>
  );
};

export default Categories;
