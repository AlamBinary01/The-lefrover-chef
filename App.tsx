
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { RecipeDisplay } from './components/RecipeDisplay';
import { ChatBot } from './components/ChatBot';
import { DietaryPreference, Recipe } from './types';
import { generateRecipe, analyzeIngredientsImage } from './services/geminiService';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState<DietaryPreference>(DietaryPreference.NONE);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateRecipe(ingredients, dietary);
      setRecipe(result);
    } catch (error) {
      console.error("Recipe generation failed:", error);
      alert("Something went wrong. The chef is a bit confused, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const identifiedIngredients = await analyzeIngredientsImage(base64String);
        setIngredients(prev => {
          const newList = [...new Set([...(prev ? prev.split(', ') : []), ...identifiedIngredients])];
          return newList.join(', ');
        });
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image analysis failed:", error);
      setIsAnalyzing(false);
      alert("Failed to analyze the image. Please try listing ingredients manually.");
    }
  };

  return (
    <Layout>
      <div className="space-y-12 pb-24">
        {/* Hero & Input Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-orange-50 p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">What's in your fridge?</h2>
            <p className="text-gray-500">List your random ingredients or snap a photo of your counter.</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Text Input */}
            <div className="relative">
              <textarea
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 transition-all resize-none"
                placeholder="e.g., 2 eggs, a tomato, leftover rice, cheese, some spinach..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <label className="cursor-pointer bg-white border border-gray-200 p-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center text-xs font-medium text-gray-600">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isAnalyzing} />
                  {isAnalyzing ? (
                    <div className="flex items-center"><div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div> Identifying...</div>
                  ) : (
                    <><svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Photo Upload</>
                  )}
                </label>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Dietary:</span>
              {Object.values(DietaryPreference).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setDietary(pref)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    dietary === pref 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !ingredients.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] ${
                isLoading || !ingredients.trim()
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-200'
              }`}
            >
              {isLoading ? 'Cheffing up something magic...' : 'Create Recipe'}
            </button>
          </div>
        </section>

        {/* Recipe Result */}
        <section id="recipe-result">
          <RecipeDisplay recipe={recipe} loading={isLoading} />
        </section>
      </div>

      {/* Persistent ChatBot */}
      <ChatBot />
    </Layout>
  );
};

export default App;
