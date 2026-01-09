
import React from 'react';
import { Recipe } from '../types';

interface RecipeDisplayProps {
  recipe: Recipe | null;
  loading: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium animate-pulse">Our Chef is designing your feast...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Cook?</h3>
        <p className="text-gray-500 max-w-xs">Enter your ingredients above to generate a unique recipe using what you already have.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-orange-500 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
        <div className="flex items-center space-x-4 text-orange-100 text-sm font-medium">
          <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg> Fast Prep</span>
          <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg> Zero Waste</span>
        </div>
      </div>
      
      <div className="p-8 space-y-8">
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 rounded-full mr-3"></span>
            Ingredients & Measurements
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipe.measurements.map((item, idx) => (
              <li key={idx} className="flex items-start bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 text-sm">
                <span className="text-orange-500 mr-2 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1 h-6 bg-orange-500 rounded-full mr-3"></span>
            Cooking Instructions
          </h3>
          <div className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <h4 className="text-amber-800 font-bold mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>
            Chef's Pro Tip
          </h4>
          <p className="text-amber-900 text-sm italic">{recipe.chefTips}</p>
        </section>
      </div>
    </div>
  );
};
