import React, { useState } from 'react';
import './MealPlanner.css';

function MealPlanner() {
  const [formData, setFormData] = useState({
    meals_per_day: 3,
    target_calories_per_day: 1000,
    target_protein_per_day: 10,
    exclude_ingredients: '',
    meal_ids: [],
    calories_variation: 0,
  });
  const [mealPlans, setMealPlans] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/meal_plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMealPlans(data.meal_plans);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error fetching meal plans: ' + error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: name === 'meal_ids' ? value.split(',').map(item => item.trim()) : parseInt(value),
    };
    setFormData(updatedFormData);
  };

  const renderMealPlans = () => (
    <tbody>
      <tr>
        <th>Options</th>
        <th>Total Calories</th>
        <th>Total Protein (g)</th>
        <th>Meal Details</th>
      </tr>
      {mealPlans.map((plan) => (
        <tr key={plan.id}>
          <td>{plan.id}</td>
          <td>{plan.total_calories}</td>
          <td>{plan.total_protein}</td>
          <td>
            <table>
              <thead>
                <tr>
                  <th>Meal ID</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fat</th>
                  <th>Type</th>
                  <th>Ingredients</th>
                  <th>Directions</th>
                </tr>
              </thead>
              <tbody>
                {plan.meals.map(meal => (
                  <tr key={meal['Meal Id']}>
                    <td>{meal['Meal Id']}</td>
                    <td>{meal.Calories}</td>
                    <td>{meal.Protein}g</td>
                    <td>{meal.Carbs}g</td>
                    <td>{meal.Fat}g</td>
                    <td>{meal.Type}</td>
                    <td>{meal.Ingredients}</td>
                    <td>{meal.Directions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <>
      <div className="input-container">
        <h2>Meal Planner</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="mealsPerDay">Meals per day:</label>
            <input type="number" id="mealsPerDay" name="meals_per_day" value={formData.meals_per_day} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="targetCalories">Target calories per day:</label>
            <input type="number" id="targetCalories" name="target_calories_per_day" value={formData.target_calories_per_day} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="targetProtein">Target protein per day:</label>
            <input type="number" id="targetProtein" name="target_protein_per_day" value={formData.target_protein_per_day} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="excludeIngredients">Exclude ingredients:</label>
            <input type="text" id="excludeIngredients" name="exclude_ingredients" value={formData.exclude_ingredients} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="mealIds">Meal IDs:</label>
            <input type="text" id="mealIds" name="meal_ids" value={formData.meal_ids.join(', ')} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="caloriesVariation">Calories Variation:</label>
            <input type="number" id="caloriesVariation" name="calories_variation" value={formData.calories_variation} onChange={handleChange} />
          </div>
          <button type="submit" className="button">Get Meal Plans</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <div className="table-container">
        {mealPlans.length > 0 && (
          <table className="meal-plans">
            {renderMealPlans()}
          </table>
        )}
      </div>
    </>
  );
}

export default MealPlanner;
