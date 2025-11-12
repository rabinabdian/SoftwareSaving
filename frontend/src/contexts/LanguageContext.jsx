import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    priceComparison: 'Price Comparison',
    coupons: 'Coupons',
    priceAlerts: 'Price Alerts',
    budget: 'Budget Tracker',

    // Common
    search: 'Search',
    searchPlaceholder: 'Search products...',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    currency: '₪',

    // Home
    welcome: 'Welcome to Marketplace Savings',
    subtitle: 'Save money on your shopping in Israel',
    totalProducts: 'Products',
    totalStores: 'Stores',
    activeCoupons: 'Active Coupons',

    // Price Comparison
    compareNow: 'Compare Prices',
    cheapestAt: 'Cheapest at',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    compareProducts: 'Compare Products',
    priceHistory: 'Price History',
    savingsLabel: 'You save',

    // Coupons
    availableCoupons: 'Available Coupons',
    couponCode: 'Coupon Code',
    validUntil: 'Valid Until',
    minPurchase: 'Min Purchase',
    discount: 'Discount',
    allStores: 'All Stores',
    allCategories: 'All Categories',

    // Price Alerts
    myAlerts: 'My Price Alerts',
    createAlert: 'Create Price Alert',
    targetPrice: 'Target Price',
    notifyWhen: 'Notify me when price drops to',
    alertCreated: 'Alert created successfully',
    alertDeleted: 'Alert deleted',

    // Budget
    budgetTracker: 'Budget Tracker',
    monthlyBudget: 'Monthly Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    addPurchase: 'Add Purchase',
    purchases: 'Purchases',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    notes: 'Notes',
    totalSpent: 'Total Spent',

    // Categories
    all: 'All',
    dairy: 'Dairy',
    bakery: 'Bakery',
    meat: 'Meat',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    grains: 'Grains',
    beverages: 'Beverages',
    oils: 'Oils',

    // Stores
    stores: 'Stores',
  },
  he: {
    // Navigation
    home: 'בית',
    priceComparison: 'השוואת מחירים',
    coupons: 'קופונים',
    priceAlerts: 'התראות מחיר',
    budget: 'מעקב תקציב',

    // Common
    search: 'חיפוש',
    searchPlaceholder: 'חפש מוצרים...',
    loading: 'טוען...',
    error: 'שגיאה',
    save: 'שמור',
    cancel: 'ביטול',
    delete: 'מחק',
    edit: 'ערוך',
    add: 'הוסף',
    currency: '₪',

    // Home
    welcome: 'ברוכים הבאים לחיסכון בשוק',
    subtitle: 'חסכו כסף בקניות שלכם בישראל',
    totalProducts: 'מוצרים',
    totalStores: 'חנויות',
    activeCoupons: 'קופונים פעילים',

    // Price Comparison
    compareNow: 'השווה מחירים',
    cheapestAt: 'הכי זול ב',
    outOfStock: 'אזל מהמלאי',
    inStock: 'במלאי',
    compareProducts: 'השווה מוצרים',
    priceHistory: 'היסטוריית מחירים',
    savingsLabel: 'החיסכון שלך',

    // Coupons
    availableCoupons: 'קופונים זמינים',
    couponCode: 'קוד קופון',
    validUntil: 'בתוקף עד',
    minPurchase: 'קנייה מינימלית',
    discount: 'הנחה',
    allStores: 'כל החנויות',
    allCategories: 'כל הקטגוריות',

    // Price Alerts
    myAlerts: 'ההתראות שלי',
    createAlert: 'צור התראת מחיר',
    targetPrice: 'מחיר יעד',
    notifyWhen: 'הודע לי כשהמחיר יורד ל',
    alertCreated: 'התראה נוצרה בהצלחה',
    alertDeleted: 'התראה נמחקה',

    // Budget
    budgetTracker: 'מעקב תקציב',
    monthlyBudget: 'תקציב חודשי',
    spent: 'הוצאו',
    remaining: 'נותר',
    addPurchase: 'הוסף קנייה',
    purchases: 'קניות',
    amount: 'סכום',
    category: 'קטגוריה',
    date: 'תאריך',
    notes: 'הערות',
    totalSpent: 'סה״כ הוצא',

    // Categories
    all: 'הכל',
    dairy: 'חלב ומוצריו',
    bakery: 'מאפים',
    meat: 'בשר ועוף',
    vegetables: 'ירקות',
    fruits: 'פירות',
    grains: 'דגנים',
    beverages: 'משקאות',
    oils: 'שמנים',

    // Stores
    stores: 'חנויות',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'he';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
