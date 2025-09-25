import React from 'react';
import { 
  Utensils, 
  Coffee, 
  Apple, 
  Fish, 
  Beef, 
  IceCream, 
  Wine, 
  Cookie,
  ChefHat,
  Sparkles
} from 'lucide-react';

interface MenuCategoryProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'plats': <Utensils className="w-5 h-5" />,
  'boissons': <Coffee className="w-5 h-5" />,
  'fruits': <Apple className="w-5 h-5" />,
  'poisson': <Fish className="w-5 h-5" />,
  'viande': <Beef className="w-5 h-5" />,
  'desserts': <IceCream className="w-5 h-5" />,
  'alcool': <Wine className="w-5 h-5" />,
  'snacks': <Cookie className="w-5 h-5" />,
  'spécialités': <ChefHat className="w-5 h-5" />,
  'promotions': <Sparkles className="w-5 h-5" />
};

const categoryColors: { [key: string]: string } = {
  'plats': 'bg-orange-100 text-orange-600 border-orange-200',
  'boissons': 'bg-blue-100 text-blue-600 border-blue-200',
  'fruits': 'bg-green-100 text-green-600 border-green-200',
  'poisson': 'bg-cyan-100 text-cyan-600 border-cyan-200',
  'viande': 'bg-red-100 text-red-600 border-red-200',
  'desserts': 'bg-pink-100 text-pink-600 border-pink-200',
  'alcool': 'bg-purple-100 text-purple-600 border-purple-200',
  'snacks': 'bg-yellow-100 text-yellow-600 border-yellow-200',
  'spécialités': 'bg-indigo-100 text-indigo-600 border-indigo-200',
  'promotions': 'bg-amber-100 text-amber-600 border-amber-200'
};

const MenuCategory: React.FC<MenuCategoryProps> = ({ category, isActive, onClick, count }) => {
  const icon = categoryIcons[category.toLowerCase()] || <Utensils className="w-5 h-5" />;
  const colorClass = categoryColors[category.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <button
      onClick={onClick}
      className={`
        category-card flex items-center space-x-2 sm:space-x-3 lg:space-x-4 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-lg border-2 transition-all duration-200 whitespace-nowrap
        ${isActive 
          ? `${colorClass} shadow-medium transform scale-105 category-active` 
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
        }
      `}
    >
      <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg icon-bounce ${isActive ? 'bg-white' : 'bg-gray-100'}`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          {icon}
        </div>
      </div>
      <div className="text-left min-w-0 flex-1">
        <div className="font-medium capitalize text-sm sm:text-base lg:text-lg truncate">{category}</div>
        <div className="text-xs sm:text-sm opacity-75 hidden sm:block">{count} produit{count > 1 ? 's' : ''}</div>
      </div>
    </button>
  );
};

export default MenuCategory;
