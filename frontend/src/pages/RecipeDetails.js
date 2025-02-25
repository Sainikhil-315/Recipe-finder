import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Recipe not found");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p className="text-center">Loading recipe...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!recipe) return null;

  return (
    <div className="container mt-4">
      {/* Recipe Title and Image */}
      <div className="row">
        <div className="col-md-6">
          <img width={450} height={450} src={recipe.image} alt={recipe.title} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <h1 className="text-danger">{recipe.title}</h1>
          <p className="text-muted">{recipe.description}</p>

          {/* Category and State */}
          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>State:</strong> {recipe.state}</p>

          {/* Benefits */}
          <p className="fw-bold">Benefits: {recipe.benefits}</p>

          {/* Rating Section */}
          <h4>Rate this Recipe</h4>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`fs-3 me-1 ${star <= (hover || rating) ? "text-warning" : "text-secondary"}`}
                style={{ cursor: "pointer" }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
              >
                ★
              </span>
            ))}
          </div>
          <p>Your rating: {rating}</p>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="mt-4 p-3 bg-light rounded shadow">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Steps Section */}
      <div className="mt-4 p-3 bg-light rounded shadow">
        <h3>Making Steps</h3>
        <ul>
          {recipe.steps.map((step, index) => (
            <li key={index}><strong>Step {index + 1}:</strong> {step}</li>
          ))}
        </ul>
      </div>

      {/* Recommended Hotels Section */}
      {recipe.recommendedHotels && recipe.recommendedHotels.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded shadow">
          <h3>Recommended Hotels</h3>
          <ul>
            {recipe.recommendedHotels.map((hotel) => (
              <li key={hotel._id}>
                <strong>{hotel.name}</strong> - {hotel.location} (⭐ {hotel.rating})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
