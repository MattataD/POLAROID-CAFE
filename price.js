// Individual Item Prices for Polaroid Cafe
// Each item has its own specific prices by size

const ITEM_PRICES = {
    // ===== COFFEE DRINKS =====
    'Americano Iced': { 'Medio': 100, 'Largo': 115 },
    'Biscoffee Iced': { 'Medio': 125, 'Largo': 140 },
    'Butterscotch Iced': { 'Medio': 115, 'Largo': 130 },
    'Cafe Matcha Iced': { 'Medio': 125, 'Largo': 140 },
    'Caramel Macchiato Iced': { 'Medio': 115, 'Largo': 130 },
    'Cinna White Iced': { 'Medio': 115, 'Largo': 130 },
    'Dark Mocha Iced': { 'Medio': 115, 'Largo': 130 },
    'Hazelnutella Iced': { 'Medio': 125, 'Largo': 140 },
    'Spanish Iced': { 'Medio': 115, 'Largo': 130 },
    'Vanilla Iced': { 'Medio': 110, 'Largo': 125 },
    'White Mocha Iced': { 'Medio': 115, 'Largo': 130 },

    'Black Hot Espresso': { '12oz': 80, },
    'Cafe Matcha Hot':{ '12oz': 120,},
    'Caramel Hot Espresso': { '12oz': 100, },
    'Latte':{ '12oz': 90, },
    'Mocha Hot': { '12oz': 100, },
    'Vanilla Hot Espresso':{ '12oz': 100,},
    
    'Caramel Frappucino': { 'Medio': 105, 'Largo': 120 },
    'Java Chips Frappucino': { 'Medio': 105, 'Largo': 120 },
    'Mochaccino Frappuccino': { 'Medio': 105, 'Largo': 120 },
    
    // ===== NON-COFFEE DRINKS =====
    'Chocolate': { 'Medio': 80, 'Largo': 95 },
    'MatchaMilktea': { 'Medio': 95, 'Largo': 115 },
    'Oreo': { 'Medio': 100, 'Largo': 115 },
    'Red Velvet Milktea': { 'Medio': 80, 'Largo': 95 },
    'Wintermelon': { 'Medio': 80, 'Largo': 95 },
    'Strawberry Milk': { 'Medio': 80, 'Largo': 95 },
    'Matcha Milk': { 'Medio': 100, 'Largo': 120 },
    'Choco Milk': { 'Medio': 90, 'Largo': 100 },
    'Alcapone': { 'Medio': 99, 'Largo': 115 },
    'Black Forest': { 'Medio': 99, 'Largo': 115 },
    'Blueberries N’ Cream': { 'Medio': 110, 'Largo': 125 },
    'Cookies N’ Cream': { 'Medio': 99, 'Largo': 115 },
    'Dark Choco': { 'Medio': 99, 'Largo': 115 },
    'Matcha Cream': { 'Medio': 125, 'Largo': 140 },
    'Red Velvet Frappe': { 'Medio': 99, 'Largo': 115 },
    'Strawberries N’ Cream': { 'Medio': 110, 'Largo': 125 },
    
    // ===== COOKIES =====
    'Belgian Chocolate': { 'Regular': 50 },
    'Campfire Smores': { 'Regular': 35 },
    'Cashew ChocoChip': { 'Regular': 30 },
    'Choco Chip': { 'Regular': 30 },
    'Lotus Biscoff': { 'Regular': 50 },
    'Matcha': { 'Regular': 30 },
    'Oreo Bomb': { 'Regular': 50 },
    'Red Velvet': { 'Regular': 30 },
    'Triple Choco': { 'Regular': 30 },
    
    // ===== BROWNIES =====
    'Biscoff Brownies': { 'Regular': 45 },
    'Brookies': { 'Regular': 55 },
    'Chocolate Brownies': { 'Regular': 40 },
    'Overload Brownies': { 'Regular': 45 },
    'Smores Brownies': { 'Regular': 45 },
    
    // ===== BREAD & PASTRIES =====
    'Almond Croissant': { 'Regular': 80 },
    'Banana Muffin': { 'Regular': 30 },
    'Chocolate Muffin': { 'Regular': 30 },
    'Messy Cookies & Brownies': {'Regular': 80 },
    'Pain Au Chocolat': { 'Regular': 80 },
    
    // ===== SNACKS =====
    'Beef Quesadilla':{ 'Regular': 140 },
    'Cajun Fries': { 'Regular': 70 },
    'Hash Brown': { 'Regular': 35 },
    'Nachos': { 'Regular': 140 },
    'Regular Fries': { 'Regular': 60 },
    'Savory Fries': { 'Regular': 70 },
};

// Helper function to normalize item names for matching
function normalizeItemName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/palette/gi, '')
        .replace(/&/g, '')
        .replace(/'/g, '')
        .trim();
}

// Helper function to find matching item price
function findItemPrice(itemName) {
    const normalized = normalizeItemName(itemName);
    
    // Try exact match first
    for (const [key, prices] of Object.entries(ITEM_PRICES)) {
        if (normalizeItemName(key) === normalized) {
            return { name: key, prices: prices };
        }
    }
    
    // Try partial match
    for (const [key, prices] of Object.entries(ITEM_PRICES)) {
        const normalizedKey = normalizeItemName(key);
        if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
            return { name: key, prices: prices };
        }
    }
    
    // Default fallback prices
    return {
        name: itemName,
        prices: { 'Regular': 50, 'Medio': 70, 'Largo': 90 }
    };
}

// Get price for specific item and size
function getItemPrice(itemName, size) {
    const item = findItemPrice(itemName);
    return item.prices[size] || 0;
}

// Get available sizes for specific item
function getAvailableSizesForItem(itemName) {
    const item = findItemPrice(itemName);
    return Object.keys(item.prices);
}

// Get all prices for specific item
function getAllPricesForItem(itemName) {
    const item = findItemPrice(itemName);
    return item.prices;
}

// Check if item exists in price list
function itemExists(itemName) {
    const normalized = normalizeItemName(itemName);
    return Object.keys(ITEM_PRICES).some(key => 
        normalizeItemName(key) === normalized || 
        normalized.includes(normalizeItemName(key))
    );
}