const foods = ["tomato", "broccoli", "cucumber", "potato", "apple"];
const months = ["2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07"];

const seasonalFactors = {
  tomato: [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1],
  broccoli: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9],
  cucumber: [1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  potato: [1.0, 1.0, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2, 1.1, 1.0, 1.0, 1.0],
  apple: [1.0, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9]
};

const basePrices = {
  tomato: 3.50,
  broccoli: 2.80,
  cucumber: 1.20,
  potato: 1.50,
  apple: 2.20
};

const generateData = () => {
  return foods.map(food => ({
    name: food,
    monthly: months.map((m, i) => {
      const basePrice = basePrices[food];
      const seasonalFactor = seasonalFactors[food][i];
      const inflationFactor = 1 + (i * 0.02);
      const randomVariation = 0.9 + (Math.random() * 0.2);
      const price = basePrice * seasonalFactor * inflationFactor * randomVariation;
      return {
        month: m,
        price: +price.toFixed(2)
      };
    }),
    currentPrice: +(basePrices[food] * seasonalFactors[food][11] * (1 + (11 * 0.02)) * (0.9 + Math.random() * 0.2)).toFixed(2)
  }))
};

export const foodData = generateData();
export const monthsList = months;
export const foodsList = foods;
