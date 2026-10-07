export type MenuOption = {
  name: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  options?: MenuOption[];
  requiresTakeaway?: boolean;
};

export const menuItems: MenuItem[] = [
  // =====================================================
  // RICE DISHES
  // =====================================================
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    category: "Rice Dishes",
    options: [
      { name: "Small Scoop", price: 200 },
      { name: "Big Scoop", price: 500 },
    ],
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    category: "Rice Dishes",
    options: [
      { name: "Small Scoop", price: 200 },
      { name: "Big Scoop", price: 500 },
    ],
  },
  {
    id: "asun-rice",
    name: "Asun Rice",
    category: "Rice Dishes",
    price: 1000,
  },
  {
    id: "white-rice",
    name: "White Rice",
    category: "Rice Dishes",
    price: 400,
  },
  {
    id: "ofada-rice",
    name: "Ofada Rice & Sauce",
    category: "Rice Dishes",
    price: 2500,
  },

  // =====================================================
  // PASTA & NOODLES
  // =====================================================
  {
    id: "stir-fry-spaghetti",
    name: "Stir-fry Spaghetti",
    category: "Pasta & Noodles",
    price: 700,
  },
  {
    id: "loaded-noodles",
    name: "Loaded Noodles & Egg",
    category: "Pasta & Noodles",
    price: 2500,
  },

  // =====================================================
  // PROTEIN
  // =====================================================
  {
    id: "peppered-chicken",
    name: "Peppered Chicken",
    category: "Protein",
    options: [
      { name: "Small", price: 500 },
      { name: "Big", price: 1000 },
    ],
  },
  {
    id: "chicken-laps",
    name: "Peppered Chicken Laps",
    category: "Protein",
    price: 1500,
  },
  {
    id: "chicken-wings",
    name: "Peppered Chicken Wings",
    category: "Protein",
    price: 1500,
  },
  {
    id: "turkey",
    name: "Turkey",
    category: "Protein",
    options: [
      { name: "Small", price: 2500 },
      { name: "Big", price: 3000 },
    ],
  },
  {
    id: "beef",
    name: "Beef",
    category: "Protein",
    options: [
      { name: "Small", price: 200 },
      { name: "Big", price: 500 },
    ],
  },
  {
    id: "egg",
    name: "Egg",
    category: "Protein",
    price: 300,
  },
  {
    id: "titus-fish",
    name: "Titus Fish",
    category: "Protein",
    options: [
      { name: "Small", price: 1500 },
      { name: "Big", price: 2000 },
    ],
  },

  // =====================================================
  // SIDES
  // =====================================================
  {
    id: "coleslaw",
    name: "Coleslaw",
    category: "Sides",
    options: [
      { name: "Small", price: 500 },
      { name: "Big", price: 1000 },
    ],
  },
  {
    id: "plantain",
    name: "Plantain",
    category: "Sides",
    price: 200,
  },

  // =====================================================
  // PASTRIES
  // =====================================================
  {
    id: "meat-pie-medium",
    name: "Meat Pie",
    category: "Pastries",
    options: [
      { name: "Medium", price: 500 },
      { name: "Big", price: 1000 },
    ],
  },
  {
    id: "chicken-pie",
    name: "Chicken Pie",
    category: "Pastries",
    options: [
      { name: "Medium", price: 700 },
      { name: "Big", price: 1200 },
    ],
  },
  {
    id: "doughnut-jam",
    name: "Doughnut",
    category: "Pastries",
    options: [
      { name: "Jam Filled", price: 500 },
      { name: "Chocolate Filled", price: 800 },
    ],
  },
  {
    id: "sausage-roll",
    name: "Sausage Roll",
    category: "Pastries",
    price: 700,
  },
  {
    id: "egg-roll",
    name: "Egg Roll",
    category: "Pastries",
    price: 700,
  },
  {
    id: "small-chops-beef",
    name: "Small Chops",
    category: "Pastries",
    options: [
      { name: "Beef", price: 2000 },
    ],
  },
  {
    id: "small-chops-chicken",
    name: "Small Chops",
    category: "Pastries",
    options: [
      { name: "Chicken", price: 2500 },
    ],
  },

  // =====================================================
  // SNACKS
  // =====================================================
  {
    id: "chin-chin",
    name: "Chin Chin",
    category: "Snacks",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 500 },
      { name: "Medium", price: 1500 },
      { name: "Big", price: 2000 },
    ],
  },
  {
    id: "peanut",
    name: "Peanut",
    category: "Snacks",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 500 },
      { name: "Medium", price: 1500 },
      { name: "Big", price: 2500 },
    ],
  },
  {
    id: "plantain-chips",
    name: "Plantain Chips",
    category: "Snacks",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 500 },
      { name: "Medium", price: 1000 },
      { name: "Big", price: 1500 },
    ],
  },

  // =====================================================
  // YUMMY CAKES
  // =====================================================
  {
    id: "cup-cakes",
    name: "Cup Cakes",
    category: "Yummy Cakes",
    requiresTakeaway: false,
    price: 500,
  },
  {
    id: "foil-plate-cake",
    name: "Foil Plate Cake",
    category: "Yummy Cakes",
    requiresTakeaway: false,
    price: 1500,
    description:
      "Available in Red Velvet, Chocolate, and Vanilla.",
  },
  {
    id: "cake-parfait",
    name: "Cake Parfait",
    category: "Yummy Cakes",
    requiresTakeaway: false,
    price: 3000,
    description:
      "Available in Red Velvet, Chocolate, and Vanilla.",
  },

  // =====================================================
  // FRIES
  // =====================================================
  {
    id: "chicken-chips",
    name: "Chicken & Chips",
    category: "Fries",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 4000 },
      { name: "Large", price: 6000 },
    ],
  },

  // =====================================================
  // GRILLS
  // =====================================================
  {
    id: "chicken-barbecue",
    name: "Chicken Barbecue",
    category: "Grills",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 2500 },
      { name: "Medium", price: 3500 },
      { name: "Large", price: 4000 },
    ],
  },
  {
    id: "fish-barbecue",
    name: "Fish Barbecue",
    category: "Grills",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 5000 },
      { name: "Large", price: 7000 },
    ],
  },

  // =====================================================
  // DRINKS
  // =====================================================
  {
    id: "fruity-filled-zobo",
    name: "Fruity-Filled Zobo",
    category: "Drinks",
    requiresTakeaway: false,
    options: [
      { name: "Small", price: 300 },
      { name: "Big", price: 500 },
    ],
  },
  {
    id: "tiger-nut",
    name: "Tiger Nut",
    category: "Drinks",
    requiresTakeaway: false,
    price: 1000,
  },
  {
    id: "table-water",
    name: "Table Water",
    category: "Drinks",
    requiresTakeaway: false,
    price: 200,
  },
  {
    id: "soft-drink",
    name: "Soft Drink",
    category: "Drinks",
    requiresTakeaway: false,
    price: 500,
  },

  // =====================================================
  // CREAMY SHAWARMA
  // =====================================================
  {
    id: "chicken-shawarma-double-sausage",
    name: "Chicken Shawarma",
    category: "Creamy Shawarma",
    requiresTakeaway: false,
    options: [
      { name: "Double Sausage", price: 3800 },
    ],
  },
  {
    id: "beef-shawarma-double-sausage",
    name: "Beef Shawarma",
    category: "Creamy Shawarma",
    requiresTakeaway: false,
    options: [
      { name: "Double Sausage", price: 3500 },
    ],
  },
  {
    id: "chicken-shawarma-single-sausage",
    name: "Chicken Shawarma",
    category: "Creamy Shawarma",
    requiresTakeaway: false,
    options: [
      { name: "Single Sausage", price: 3500 },
    ],
  },
  {
    id: "double-shawarma-single-sausage",
    name: "Double Shawarma",
    category: "Creamy Shawarma",
    requiresTakeaway: false,
    options: [
      { name: "Single Sausage", price: 3000 },
    ],
  },
  {
    id: "economic-pack-shawarma",
    name: "Economic Pack Shawarma",
    category: "Creamy Shawarma",
    requiresTakeaway: false,
    price: 2500,
  },
];