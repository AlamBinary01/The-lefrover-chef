
export interface Recipe {
  title: string;
  measurements: string[];
  instructions: string[];
  chefTips: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum DietaryPreference {
  NONE = 'None',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  KETO = 'Keto',
  PALEO = 'Paleo',
  GLUTEN_FREE = 'Gluten-Free'
}
