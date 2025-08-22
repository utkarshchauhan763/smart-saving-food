import React, { useState, useEffect } from 'react';
import { menuAPI, preferencesAPI, authUtils } from './services/api';

const MenuSection = () => {
  // State for menu data from backend
  const [todayMenu, setTodayMenu] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State to store student's diet preferences
  const [dietPreferences, setDietPreferences] = useState({});
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [submittedMeals, setSubmittedMeals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load data on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      loadTodayMenu();
      loadUserPreferences();
    } else {
      setLoading(false);
      setError('Please login to view the menu.');
    }
  }, []);

  // Load today's menu from backend
  const loadTodayMenu = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching today\'s menu...');
      const response = await menuAPI.getTodayMenu();
      
      console.log('Menu API response:', response);
      
      if (response.success && response.menu && response.menu.meals) {
        console.log('Setting menu data:', response.menu.meals);
        setTodayMenu(response.menu.meals);
      } else {
        console.log('No menu found, using default menu');
        // Use default menu if no menu found
        setTodayMenu({
          breakfast: [
            { id: 1, name: 'Chapati', type: 'solid', unit: 'pieces' },
            { id: 2, name: 'Aloo Sabzi', type: 'liquid', unit: 'bowls' },
            { id: 3, name: 'Tea', type: 'liquid', unit: 'cups' },
            { id: 4, name: 'Butter', type: 'solid', unit: 'pieces' }
          ],
          lunch: [
            { id: 5, name: 'Rice', type: 'liquid', unit: 'bowls' },
            { id: 6, name: 'Dal', type: 'liquid', unit: 'bowls' },
            { id: 7, name: 'Chapati', type: 'solid', unit: 'pieces' },
            { id: 8, name: 'Mixed Vegetable', type: 'liquid', unit: 'bowls' }
          ],
          snacks: [
            { id: 10, name: 'Samosa', type: 'solid', unit: 'pieces' },
            { id: 11, name: 'Tea', type: 'liquid', unit: 'cups' }
          ],
          dinner: [
            { id: 13, name: 'Chapati', type: 'solid', unit: 'pieces' },
            { id: 14, name: 'Dal', type: 'liquid', unit: 'bowls' },
            { id: 15, name: 'Rice', type: 'liquid', unit: 'bowls' }
          ]
        });
        setError('Using default menu - no menu found for today.');
      }
    } catch (err) {
      console.error('Menu loading error:', err);
      setError('Failed to load menu: ' + err.message);
      // Set default menu in case of error
      setTodayMenu({
        breakfast: [{ id: 1, name: 'Default Item', type: 'solid', unit: 'pieces' }],
        lunch: [{ id: 2, name: 'Default Item', type: 'solid', unit: 'pieces' }],
        snacks: [{ id: 3, name: 'Default Item', type: 'solid', unit: 'pieces' }],
        dinner: [{ id: 4, name: 'Default Item', type: 'solid', unit: 'pieces' }]
      });
    } finally {
      setLoading(false);
    }
  };

  // Load user's existing preferences
  const loadUserPreferences = async () => {
    try {
      const response = await preferencesAPI.getUserPreferences();
      if (response.success && response.preferences) {
        const todayPrefs = response.preferences.find(
          pref => new Date(pref.date).toDateString() === new Date().toDateString()
        );
        
        if (todayPrefs) {
          setDietPreferences(todayPrefs.preferences || {});
          setSubmittedMeals(Object.keys(todayPrefs.preferences || {}));
        }
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
      // Don't show error for preferences loading failure
    }
  };

  // Handle quantity change for each food item
  const handleQuantityChange = (itemId, quantity) => {
    setDietPreferences(prev => ({
      ...prev,
      [selectedMeal]: {
        ...prev[selectedMeal],
        [itemId]: parseInt(quantity) || 0
      }
    }));
  };

  // Submit preferences for current meal to backend
  const handleMealSubmit = async () => {
    const mealPrefs = dietPreferences[selectedMeal];
    if (!mealPrefs || Object.values(mealPrefs).every(qty => qty === 0)) {
      setError('Please select quantities for at least one item.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const preferencesData = {
        date: new Date().toISOString().split('T')[0],
        mealType: selectedMeal,
        preferences: mealPrefs
      };

      const response = await preferencesAPI.savePreferences(preferencesData);
      
      if (response.success) {
        setSubmittedMeals(prev => [...prev.filter(meal => meal !== selectedMeal), selectedMeal]);
        setSuccess(`${selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} preferences saved successfully!`);
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to save preferences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get current date
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const mealTimes = {
    breakfast: '7:00 AM - 9:00 AM',
    lunch: '12:00 PM - 2:00 PM',
    snacks: '4:00 PM - 5:00 PM',
    dinner: '7:00 PM - 9:00 PM'
  };

  const mealIcons = {
    breakfast: '🍳',
    lunch: '🍽️',
    snacks: '🍪',
    dinner: '🌙'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Today's Menu</h2>
        <p className="text-gray-600">{today}</p>
        {currentUser && (
          <p className="text-sm text-blue-600 mt-2">
            Welcome, {currentUser.name}! ({currentUser.role})
          </p>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading menu...</p>
        </div>
      ) : !currentUser ? (
        <div className="text-center py-12">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Please login to view and select your meal preferences.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Meal Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {Object.keys(todayMenu).map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedMeal === meal
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mealIcons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </button>
            ))}
          </div>

          {/* Current Meal Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {mealIcons[selectedMeal]} {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
              </h3>
              <span className="text-gray-600 font-medium">
                {mealTimes[selectedMeal]}
              </span>
              {submittedMeals.includes(selectedMeal) && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Submitted
                </span>
              )}
            </div>

            {/* Food Items */}
            {todayMenu[selectedMeal] && todayMenu[selectedMeal].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {todayMenu[selectedMeal].map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.type === 'solid' ? '🥖 Solid' : '🥣 Liquid'} - {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${item.id || index}`} className="text-sm text-gray-600">
                        Qty:
                      </label>
                      <input
                        id={`quantity-${item.id || index}`}
                        type="number"
                        min="0"
                        max="10"
                        value={dietPreferences[selectedMeal]?.[item.id || index] || ''}
                        onChange={(e) => handleQuantityChange(item.id || index, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No items available for {selectedMeal}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleMealSubmit}
                disabled={!todayMenu[selectedMeal] || todayMenu[selectedMeal].length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Save {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Preferences
              </button>
            </div>
          </div>

          {/* Summary */}
          {Object.keys(dietPreferences).length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Preferences Summary</h3>
              {Object.entries(dietPreferences).map(([meal, items]) => (
                <div key={meal} className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {mealIcons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(items).map(([itemId, quantity]) => {
                      const item = todayMenu[meal]?.find(i => (i.id || i.index) === parseInt(itemId));
                      return quantity > 0 ? (
                        <span key={itemId} className="bg-white px-3 py-1 rounded-md text-sm">
                          {item?.name || 'Unknown'}: {quantity} {item?.unit || 'units'}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuSection;
