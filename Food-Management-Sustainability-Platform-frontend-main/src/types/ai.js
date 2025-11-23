export const ConsumptionCategory = {
    Produce: 'Produce',
    Dairy: 'Dairy',
    Protein: 'Protein',
    Grains: 'Grains',
    Snacks: 'Snacks',
    Other: 'Other',
};

// JSDoc types for reference
/**
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} name
 * @property {string} quantity
 * @property {string} expiryDate
 * @property {string} category
 * @property {string} addedDate
 */

/**
 * @typedef {Object} ConsumptionLog
 * @property {string} date
 * @property {string} category
 * @property {boolean} wasted
 * @property {number} amount
 */

/**
 * @typedef {Object} MealPlanDay
 * @property {string} day
 * @property {Array<{type: string, name: string, ingredients: string[], costEstimate: number, nutritionFocus: string}>} meals
 */

/**
 * @typedef {Object} SustainabilityMetrics
 * @property {number} sdgScore
 * @property {number} wasteProjectionKg
 * @property {number} moneySaved
 * @property {string[]} suggestions
 * @property {Array<{day: string, consumption: number, waste: number}>} weeklyTrends
 * @property {Array<{name: string, value: number}>} categoryBreakdown
 */

/**
 * @typedef {Object} CommunityPost
 * @property {string} id
 * @property {string} title
 * @property {string} distance
 * @property {string} type
 * @property {string[]} items
 * @property {string} [image]
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} role
 * @property {string} text
 * @property {number} timestamp
 */
