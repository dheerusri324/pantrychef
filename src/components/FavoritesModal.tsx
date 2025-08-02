import React, { useState } from 'react';
import { X, Heart, Clock, Users, ChefHat, Trash2, Eye } from 'lucide-react';

interface SavedRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  chefsTip: string;
  imagePrompt: string;
  savedAt: Date;
  status: 'favorite' | 'want-to-try';
  estimatedTime?: string;
  servings?: number;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: SavedRecipe[];
  onDeleteRecipe: (id: string) => void;
  onViewRecipe: (recipe: SavedRecipe) => void;
}

export default function FavoritesModal({ 
  isOpen, 
  onClose, 
  savedRecipes, 
  onDeleteRecipe,
  onViewRecipe 
}: FavoritesModalProps) {
  const [activeTab, setActiveTab] = useState<'favorite' | 'want-to-try'>('favorite');
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);

  if (!isOpen) return null;

  const filteredRecipes = savedRecipes.filter(recipe => recipe.status === activeTab);

  const handleViewRecipe = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform animate-slideUp">
        {!selectedRecipe ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  <ChefHat className="w-8 h-8 mr-3 text-orange-600" />
                  My Recipe Collection
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('favorite')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'favorite'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites ({savedRecipes.filter(r => r.status === 'favorite').length})
                </button>
                <button
                  onClick={() => setActiveTab('want-to-try')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'want-to-try'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Want to Try ({savedRecipes.filter(r => r.status === 'want-to-try').length})
                </button>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'favorite' ? (
                      <Heart className="w-12 h-12 text-gray-300" />
                    ) : (
                      <Clock className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    No {activeTab === 'favorite' ? 'favorite' : 'saved'} recipes yet
                  </h3>
                  <p className="text-gray-400">
                    {activeTab === 'favorite' 
                      ? 'Start cooking and save your favorite recipes here!'
                      : 'Save recipes you want to try later!'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe, index) => (
                    <div
                      key={recipe.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group animate-slideInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 relative overflow-hidden">
                        <img
                          src={`https://images.pexels.com/photos/${1640777 + index}/pexels-photo-${1640777 + index}.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop`}
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <div className={`p-2 rounded-full ${
                            activeTab === 'favorite' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {activeTab === 'favorite' ? (
                              <Heart className="w-4 h-4 fill-current" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                          {recipe.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recipe.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {recipe.estimatedTime || '30 mins'}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {recipe.servings || 4} servings
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewRecipe(recipe)}
                            className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Recipe Detail View */
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToList}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
                >
                  ← Back to Collection
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedRecipe.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedRecipe.description}
                  </p>
                </div>

                <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop`}
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop';
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
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
                    {selectedRecipe.instructions.map((step, index) => (
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
                  <h3 className="text-lg font-bold text-orange-800 mb-2">
                    Chef's Tip
                  </h3>
                  <p className="text-orange-700">{selectedRecipe.chefsTip}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}