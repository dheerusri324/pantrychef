import React, { useState } from 'react';
import { ChefHat, Clock, Users, Utensils, Sparkles, Camera, Copy, Check, Heart, BookOpen, User, LogOut } from 'lucide-react';
import LoginModal from './components/LoginModal';
import FavoritesModal from './components/FavoritesModal';

interface RecipeInputs {
  ingredients: string;
  additionalIngredients: string;
  cuisineStyle: string;
  mealType: string;
  dietaryNeeds: string;
  tools: string;
  timeAllotment: string;
  skillLevel: string;
}

interface GeneratedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  chefsTip: string;
  imagePrompt: string;
}

interface SavedRecipe extends GeneratedRecipe {
  id: string;
  savedAt: Date;
  status: 'favorite' | 'want-to-try';
  estimatedTime?: string;
  servings?: number;
}

interface User {
  name: string;
  email: string;
}

function App() {
  const [inputs, setInputs] = useState<RecipeInputs>({
    ingredients: '',
    additionalIngredients: '',
    cuisineStyle: '',
    mealType: '',
    dietaryNeeds: '',
    tools: '',
    timeAllotment: '',
    skillLevel: ''
  });

  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [saveAnimation, setSaveAnimation] = useState<string | null>(null);

  const cuisineOptions = [
    'Italian', 'French', 'South Indian', 'North Indian', 'Mexican', 'Thai', 'Japanese',
    'Mediterranean', 'Chinese', 'Korean', 'Middle Eastern', 'American', 'Fusion'
  ];

  const mealTypeOptions = [
    'Quick Breakfast', 'Hearty Lunch', 'Weekend Dinner', 'Healthy Snack', 
    'Appetizer', 'Dessert', 'Brunch', 'Late Night'
  ];

  const dietaryOptions = [
    'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Low-Carb', 'Keto', 'Paleo', 'High-Protein'
  ];

  const toolOptions = [
    'Basic pan & pot', 'Air fryer', 'Pressure cooker', 'Microwave', 
    'Oven', 'Grill', 'Food processor', 'Blender'
  ];

  const timeOptions = [
    'Under 15 minutes', 'Under 30 minutes', 'Under 1 hour', 
    '1-2 hours', '2+ hours (slow cooking)'
  ];

  const skillOptions = [
    'Absolute Beginner', 'Some Experience', 'Intermediate', 'Confident Cook', 'Advanced Chef'
  ];

  const generateRecipe = () => {
    if (!inputs.ingredients.trim()) {
      alert('Please enter at least some ingredients!');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const generatedRecipe = createRecipe(inputs);
      setRecipe(generatedRecipe);
      setIsGenerating(false);
    }, 2000);
  };

  const createRecipe = (inputs: RecipeInputs): GeneratedRecipe => {
    const ingredientList = inputs.ingredients.split(',').map(i => i.trim()).filter(i => i);
    const mainIngredient = ingredientList[0] || 'mixed vegetables';
    
    // Generate creative recipe name
    const cuisinePrefix = inputs.cuisineStyle ? `${inputs.cuisineStyle} ` : '';
    const nameOptions = [
      `${cuisinePrefix}${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Delight`,
      `Fusion ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Bowl`,
      `Chef's ${cuisinePrefix}${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Special`,
      `Golden ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Creation`
    ];
    const recipeName = nameOptions[Math.floor(Math.random() * nameOptions.length)];

    // Generate description
    const description = `A delightful ${inputs.cuisineStyle || 'fusion'} dish that transforms simple ${mainIngredient} into an extraordinary culinary experience. Perfect for ${inputs.mealType || 'any meal'}, this recipe balances flavors beautifully while being ${inputs.timeAllotment || 'quick'} to prepare.`;

    // Generate ingredients with quantities
    const recipeIngredients = [
      ...ingredientList.map(ing => {
        if (ing.toLowerCase().includes('chicken')) return `1 lb ${ing}`;
        if (ing.toLowerCase().includes('rice')) return `1 cup ${ing}`;
        if (ing.toLowerCase().includes('onion')) return `1 medium ${ing}`;
        if (ing.toLowerCase().includes('tomato')) return `2 medium ${ing}s`;
        if (ing.toLowerCase().includes('garlic')) return `3 cloves ${ing}`;
        if (ing.toLowerCase().includes('ginger')) return `1 inch ${ing}`;
        return `1 cup ${ing}`;
      }),
      ...(inputs.additionalIngredients ? 
        inputs.additionalIngredients.split(',').map(i => i.trim()).filter(i => i) : 
        ['Salt to taste', 'Black pepper to taste', '2 tablespoons cooking oil', 'Fresh herbs for garnish']
      )
    ];

    // Generate cooking instructions
    const instructions = [
      `Prep all ingredients: wash and chop ${mainIngredient} into bite-sized pieces.`,
      'Heat oil in a pan over medium heat. Add aromatics (garlic, ginger, onions) and sauté until fragrant.',
      `Add ${mainIngredient} to the pan and cook for 5-7 minutes until partially cooked.`,
      'Season with salt, pepper, and any spices. Add other vegetables if using.',
      'Cook for an additional 8-10 minutes, stirring occasionally.',
      'Taste and adjust seasoning. Garnish with fresh herbs.',
      'Serve hot and enjoy your culinary creation!'
    ];

    // Generate chef's tip
    const chefsTip = `For extra depth of flavor, try marinating the ${mainIngredient} for 15 minutes before cooking. You can also add a splash of lemon juice at the end for brightness!`;

    // Generate AI image prompt
    const imagePrompt = `Professional food photography of ${recipeName}, beautifully plated on a white ceramic dish, garnished with fresh herbs, warm natural lighting, shallow depth of field, restaurant quality presentation, appetizing and colorful, shot from a 45-degree angle`;

    return {
      name: recipeName,
      description,
      ingredients: recipeIngredients,
      instructions,
      chefsTip,
      imagePrompt
    };
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Load saved recipes from localStorage
    const saved = localStorage.getItem(`recipes_${userData.email}`);
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSavedRecipes([]);
  };

  const saveRecipe = (status: 'favorite' | 'want-to-try') => {
    if (!user || !recipe) {
      setShowLoginModal(true);
      return;
    }

    const savedRecipe: SavedRecipe = {
      ...recipe,
      id: Date.now().toString(),
      savedAt: new Date(),
      status,
      estimatedTime: inputs.timeAllotment || '30 mins',
      servings: 4
    };

    const updatedRecipes = [...savedRecipes, savedRecipe];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(`recipes_${user.email}`, JSON.stringify(updatedRecipes));
    
    // Show save animation
    setSaveAnimation(status);
    setTimeout(() => setSaveAnimation(null), 2000);
  };

  const deleteRecipe = (id: string) => {
    if (!user) return;
    
    const updatedRecipes = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(`recipes_${user.email}`, JSON.stringify(updatedRecipes));
  };

  const viewSavedRecipe = (savedRecipe: SavedRecipe) => {
    setRecipe(savedRecipe);
    setShowFavoritesModal(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">PantryChef AI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  My Recipes ({savedRecipes.length})
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center px-3 py-2 bg-orange-50 rounded-lg">
                    <User className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your world-class culinary expert and creative recipe architect. 
            Transform any ingredients into extraordinary dishes!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Utensils className="w-6 h-6 mr-2 text-orange-600" />
              Recipe Inputs
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Ingredients Available *
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="e.g., chicken, rice, tomatoes, onions, spinach..."
                  value={inputs.ingredients}
                  onChange={(e) => setInputs({ ...inputs, ingredients: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Pantry Ingredients
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={2}
                  placeholder="e.g., salt, black pepper, olive oil, garlic powder, cumin..."
                  value={inputs.additionalIngredients}
                  onChange={(e) => setInputs({ ...inputs, additionalIngredients: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default pantry staples (salt, pepper, oil, herbs)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuisine Style
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.cuisineStyle}
                    onChange={(e) => setInputs({ ...inputs, cuisineStyle: e.target.value })}
                  >
                    <option value="">Select cuisine...</option>
                    {cuisineOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.mealType}
                    onChange={(e) => setInputs({ ...inputs, mealType: e.target.value })}
                  >
                    <option value="">Select meal type...</option>
                    {mealTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dietary Needs
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.dietaryNeeds}
                    onChange={(e) => setInputs({ ...inputs, dietaryNeeds: e.target.value })}
                  >
                    <option value="">Select dietary needs...</option>
                    {dietaryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Tools
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.tools}
                    onChange={(e) => setInputs({ ...inputs, tools: e.target.value })}
                  >
                    <option value="">Select tools...</option>
                    {toolOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Available
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.timeAllotment}
                    onChange={(e) => setInputs({ ...inputs, timeAllotment: e.target.value })}
                  >
                    <option value="">Select time...</option>
                    {timeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Cooking Skill
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    value={inputs.skillLevel}
                    onChange={(e) => setInputs({ ...inputs, skillLevel: e.target.value })}
                  >
                    <option value="">Select skill level...</option>
                    {skillOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateRecipe}
                disabled={isGenerating || !inputs.ingredients.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Your Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Recipe Magic!
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Recipe */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-100">
            {!recipe ? (
              <div className="text-center py-16">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Ready to Cook Something Amazing?
                </h3>
                <p className="text-gray-400">
                  Fill in your ingredients and preferences, then let PantryChef AI create the perfect recipe for you!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {recipe.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-bold text-orange-800 mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Chef's Tip
                  </h3>
                  <p className="text-orange-700">{recipe.chefsTip}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Your Delicious Creation
                  </h3>
                  <div className="mb-3">
                    <img 
                      src={`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <details className="cursor-pointer">
                    <summary className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                      View AI Image Prompt
                    </summary>
                    <div className="bg-white p-3 rounded border text-sm text-gray-700 font-mono mt-2">
                      {recipe.imagePrompt}
                    </div>
                    <button
                      onClick={() => copyToClipboard(recipe.imagePrompt)}
                      className="mt-2 flex items-center text-orange-600 hover:text-orange-800 transition-colors duration-200 text-sm"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy prompt
                        </>
                      )}
                    </button>
                  </details>
                </div>

                {/* Save Recipe Actions */}
                <div className="bg-white p-4 rounded-lg border-2 border-orange-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Save This Recipe
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => saveRecipe('favorite')}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        saveAnimation === 'favorite'
                          ? 'bg-red-500 text-white scale-105'
                          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${saveAnimation === 'favorite' ? 'fill-current' : ''}`} />
                      {saveAnimation === 'favorite' ? 'Saved to Favorites!' : 'Add to Favorites'}
                    </button>
                    <button
                      onClick={() => saveRecipe('want-to-try')}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        saveAnimation === 'want-to-try'
                          ? 'bg-blue-500 text-white scale-105'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      {saveAnimation === 'want-to-try' ? 'Saved to Try Later!' : 'Want to Try'}
                    </button>
                  </div>
                  {!user && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      <button onClick={() => setShowLoginModal(true)} className="text-orange-600 hover:underline">
                        Sign in
                      </button> to save recipes to your collection
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-orange-200">
          <p className="text-gray-500">
            Created with ❤️ by PantryChef AI • Transform your ingredients into culinary masterpieces
          </p>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        savedRecipes={savedRecipes}
        onDeleteRecipe={deleteRecipe}
        onViewRecipe={viewSavedRecipe}
      />
    </div>
  );
}

export default App;