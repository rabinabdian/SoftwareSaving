import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'savings.db'));

// Initialize database tables
export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Stores table
      db.run(`CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_he TEXT NOT NULL,
        logo TEXT,
        website TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_he TEXT NOT NULL,
        category TEXT,
        category_he TEXT,
        image TEXT,
        barcode TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Prices table
      db.run(`CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        store_id INTEGER NOT NULL,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'ILS',
        in_stock BOOLEAN DEFAULT 1,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (store_id) REFERENCES stores(id)
      )`);

      // Coupons table
      db.run(`CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER,
        title TEXT NOT NULL,
        title_he TEXT NOT NULL,
        description TEXT,
        description_he TEXT,
        code TEXT,
        discount_type TEXT,
        discount_value REAL,
        min_purchase REAL,
        valid_from DATETIME,
        valid_until DATETIME,
        category TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id)
      )`);

      // Price alerts table
      db.run(`CREATE TABLE IF NOT EXISTS price_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        target_price REAL NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        triggered BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Budget tracking table
      db.run(`CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        month TEXT NOT NULL,
        total_budget REAL NOT NULL,
        spent REAL DEFAULT 0,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Purchases table
      db.run(`CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        product_id INTEGER,
        store_id INTEGER,
        amount REAL NOT NULL,
        quantity INTEGER DEFAULT 1,
        category TEXT,
        notes TEXT,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (store_id) REFERENCES stores(id)
      )`, (err) => {
        if (err) reject(err);
        else {
          console.log('Database initialized successfully');
          seedInitialData();
          resolve();
        }
      });
    });
  });
}

// Seed initial data
function seedInitialData() {
  // Check if stores already exist
  db.get('SELECT COUNT(*) as count FROM stores', (err, row) => {
    if (!err && row.count === 0) {
      const stores = [
        ['Shufersal', 'שופרסל', '🛒', 'https://www.shufersal.co.il'],
        ['Rami Levy', 'רמי לוי', '🏪', 'https://www.rami-levy.co.il'],
        ['Victory', 'ויקטורי', '🏬', 'https://www.victory.co.il'],
        ['Yeinot Bitan', 'יינות ביתן', '🍷', 'https://www.ybitan.co.il'],
        ['Mega', 'מגה', '🛍️', 'https://www.mega.co.il'],
        ['Osher Ad', 'אושר עד', '💰', 'https://www.osherad.co.il']
      ];

      const stmt = db.prepare('INSERT INTO stores (name, name_he, logo, website) VALUES (?, ?, ?, ?)');
      stores.forEach(store => stmt.run(store));
      stmt.finalize();

      console.log('Seeded initial stores data');

      // Seed sample products
      const products = [
        ['Milk 3%', 'חלב 3%', 'Dairy', 'חלב ומוצריו', '7290000000001'],
        ['Bread', 'לחם', 'Bakery', 'מאפים', '7290000000002'],
        ['Eggs (12)', 'ביצים (12)', 'Dairy', 'חלב ומוצריו', '7290000000003'],
        ['Chicken Breast', 'חזה עוף', 'Meat', 'בשר ועוף', '7290000000004'],
        ['Tomatoes (1kg)', 'עגבניות (1 ק״ג)', 'Vegetables', 'ירקות', '7290000000005'],
        ['Cucumbers (1kg)', 'מלפפונים (1 ק״ג)', 'Vegetables', 'ירקות', '7290000000006'],
        ['Rice (1kg)', 'אורז (1 ק״ג)', 'Grains', 'דגנים', '7290000000007'],
        ['Olive Oil (1L)', 'שמן זית (1 ליטר)', 'Oils', 'שמנים', '7290000000008'],
        ['Cottage Cheese', 'קוטג׳', 'Dairy', 'חלב ומוצריו', '7290000000009'],
        ['Orange Juice (1L)', 'מיץ תפוזים (1 ליטר)', 'Beverages', 'משקאות', '7290000000010']
      ];

      const productStmt = db.prepare('INSERT INTO products (name, name_he, category, category_he, barcode) VALUES (?, ?, ?, ?, ?)');
      products.forEach(product => productStmt.run(product));
      productStmt.finalize();

      console.log('Seeded initial products data');

      // Seed sample prices
      db.all('SELECT id FROM products', (err, productRows) => {
        if (!err && productRows.length > 0) {
          db.all('SELECT id FROM stores', (err, storeRows) => {
            if (!err && storeRows.length > 0) {
              const priceStmt = db.prepare('INSERT INTO prices (product_id, store_id, price) VALUES (?, ?, ?)');

              productRows.forEach(product => {
                storeRows.forEach(store => {
                  const basePrice = 5 + Math.random() * 45;
                  const price = Math.round(basePrice * 100) / 100;
                  priceStmt.run([product.id, store.id, price]);
                });
              });

              priceStmt.finalize();
              console.log('Seeded initial prices data');
            }
          });
        }
      });

      // Seed sample coupons
      const coupons = [
        [1, '10% off on dairy', '10% הנחה על מוצרי חלב', 'Get 10% discount on all dairy products', 'קבל 10% הנחה על כל מוצרי החלב', 'DAIRY10', 'percentage', 10, 50, 'Dairy'],
        [2, '₹20 off on orders above ₹200', '20 ש״ח הנחה על הזמנות מעל 200 ש״ח', 'Save ₹20 on orders above ₹200', 'חסוך 20 ש״ח בהזמנות מעל 200 ש״ח', 'SAVE20', 'fixed', 20, 200, 'All'],
        [3, 'Buy 2 Get 1 Free', 'קנה 2 קבל 1 חינם', 'Buy 2 products get 1 free', 'קנה 2 מוצרים קבל 1 חינם', 'B2G1', 'bogo', 0, 0, 'All'],
        [4, '15% off vegetables', '15% הנחה על ירקות', 'Fresh vegetables with 15% discount', 'ירקות טריים עם 15% הנחה', 'VEG15', 'percentage', 15, 30, 'Vegetables']
      ];

      const couponStmt = db.prepare(`INSERT INTO coupons (store_id, title, title_he, description, description_he, code, discount_type, discount_value, min_purchase, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      coupons.forEach(coupon => couponStmt.run(coupon));
      couponStmt.finalize();

      console.log('Seeded initial coupons data');
    }
  });
}

export default db;
