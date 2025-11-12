import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import db, { initDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Helper function to promisify database queries
const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// =====================
// STORES ENDPOINTS
// =====================

app.get('/api/stores', async (req, res) => {
  try {
    const stores = await dbAll('SELECT * FROM stores ORDER BY name');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PRODUCTS ENDPOINTS
// =====================

app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR name_he LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND (category = ? OR category_he = ?)';
      params.push(category, category);
    }

    query += ' ORDER BY name';

    const products = await dbAll(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PRICE COMPARISON ENDPOINTS
// =====================

app.get('/api/prices/compare/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const prices = await dbAll(`
      SELECT
        p.id, p.price, p.currency, p.in_stock, p.recorded_at,
        s.id as store_id, s.name as store_name, s.name_he as store_name_he, s.logo, s.website,
        pr.name as product_name, pr.name_he as product_name_he, pr.image
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      JOIN products pr ON p.product_id = pr.id
      WHERE p.product_id = ?
      AND p.id IN (
        SELECT MAX(id) FROM prices WHERE product_id = ? GROUP BY store_id
      )
      ORDER BY p.price ASC
    `, [productId, productId]);

    if (prices.length === 0) {
      return res.status(404).json({ error: 'No prices found for this product' });
    }

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices/search', async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const results = await dbAll(`
      SELECT DISTINCT
        pr.id, pr.name, pr.name_he, pr.category, pr.category_he, pr.image,
        MIN(p.price) as min_price,
        MAX(p.price) as max_price,
        COUNT(DISTINCT p.store_id) as store_count
      FROM products pr
      LEFT JOIN prices p ON pr.id = p.product_id
      WHERE (pr.name LIKE ? OR pr.name_he LIKE ?)
      AND p.id IN (
        SELECT MAX(id) FROM prices GROUP BY product_id, store_id
      )
      GROUP BY pr.id
      ORDER BY pr.name
    `, [`%${search}%`, `%${search}%`]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// COUPONS ENDPOINTS
// =====================

app.get('/api/coupons', async (req, res) => {
  try {
    const { store, category } = req.query;
    let query = `
      SELECT c.*, s.name as store_name, s.name_he as store_name_he, s.logo
      FROM coupons c
      LEFT JOIN stores s ON c.store_id = s.id
      WHERE c.is_active = 1
      AND (c.valid_until IS NULL OR c.valid_until >= datetime('now'))
    `;
    const params = [];

    if (store) {
      query += ' AND c.store_id = ?';
      params.push(store);
    }

    if (category) {
      query += ' AND (c.category = ? OR c.category = "All")';
      params.push(category);
    }

    query += ' ORDER BY c.created_at DESC';

    const coupons = await dbAll(query, params);
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const { store_id, title, title_he, description, description_he, code, discount_type, discount_value, min_purchase, valid_until, category } = req.body;

    const result = await dbRun(
      `INSERT INTO coupons (store_id, title, title_he, description, description_he, code, discount_type, discount_value, min_purchase, valid_until, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [store_id, title, title_he, description, description_he, code, discount_type, discount_value, min_purchase, valid_until, category]
    );

    res.status(201).json({ id: result.id, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PRICE ALERTS ENDPOINTS
// =====================

app.get('/api/alerts/:email', async (req, res) => {
  try {
    const alerts = await dbAll(`
      SELECT a.*, p.name as product_name, p.name_he as product_name_he, p.image
      FROM price_alerts a
      JOIN products p ON a.product_id = p.id
      WHERE a.user_email = ?
      ORDER BY a.created_at DESC
    `, [req.params.email]);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const { user_email, product_id, target_price } = req.body;

    if (!user_email || !product_id || !target_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      'INSERT INTO price_alerts (user_email, product_id, target_price) VALUES (?, ?, ?)',
      [user_email, product_id, target_price]
    );

    res.status(201).json({ id: result.id, message: 'Price alert created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM price_alerts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and trigger price alerts
async function checkPriceAlerts() {
  try {
    const activeAlerts = await dbAll(`
      SELECT a.*, p.name as product_name
      FROM price_alerts a
      JOIN products p ON a.product_id = p.id
      WHERE a.is_active = 1 AND a.triggered = 0
    `);

    for (const alert of activeAlerts) {
      const currentPrice = await dbGet(`
        SELECT MIN(price) as min_price
        FROM prices
        WHERE product_id = ?
        AND id IN (SELECT MAX(id) FROM prices WHERE product_id = ? GROUP BY store_id)
      `, [alert.product_id, alert.product_id]);

      if (currentPrice && currentPrice.min_price <= alert.target_price) {
        await dbRun('UPDATE price_alerts SET triggered = 1 WHERE id = ?', [alert.id]);
        console.log(`Alert triggered for ${alert.user_email}: ${alert.product_name} is now ₪${currentPrice.min_price}`);
      }
    }
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
}

// =====================
// BUDGET TRACKING ENDPOINTS
// =====================

app.get('/api/budgets/:email', async (req, res) => {
  try {
    const { month } = req.query;
    let query = 'SELECT * FROM budgets WHERE user_email = ?';
    const params = [req.params.email];

    if (month) {
      query += ' AND month = ?';
      params.push(month);
    }

    query += ' ORDER BY month DESC';

    const budgets = await dbAll(query, params);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/budgets', async (req, res) => {
  try {
    const { user_email, month, total_budget, category } = req.body;

    if (!user_email || !month || !total_budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      'INSERT INTO budgets (user_email, month, total_budget, category) VALUES (?, ?, ?, ?)',
      [user_email, month, total_budget, category || 'All']
    );

    res.status(201).json({ id: result.id, message: 'Budget created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/budgets/:id', async (req, res) => {
  try {
    const { total_budget, spent } = req.body;
    const updates = [];
    const params = [];

    if (total_budget !== undefined) {
      updates.push('total_budget = ?');
      params.push(total_budget);
    }
    if (spent !== undefined) {
      updates.push('spent = ?');
      params.push(spent);
    }

    params.push(req.params.id);

    await dbRun(`UPDATE budgets SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PURCHASES ENDPOINTS
// =====================

app.get('/api/purchases/:email', async (req, res) => {
  try {
    const { month, category } = req.query;
    let query = `
      SELECT pu.*, p.name as product_name, p.name_he as product_name_he, s.name as store_name, s.name_he as store_name_he
      FROM purchases pu
      LEFT JOIN products p ON pu.product_id = p.id
      LEFT JOIN stores s ON pu.store_id = s.id
      WHERE pu.user_email = ?
    `;
    const params = [req.params.email];

    if (month) {
      query += ` AND strftime('%Y-%m', pu.purchase_date) = ?`;
      params.push(month);
    }

    if (category) {
      query += ' AND pu.category = ?';
      params.push(category);
    }

    query += ' ORDER BY pu.purchase_date DESC';

    const purchases = await dbAll(query, params);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    const { user_email, product_id, store_id, amount, quantity, category, notes } = req.body;

    if (!user_email || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      'INSERT INTO purchases (user_email, product_id, store_id, amount, quantity, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_email, product_id, store_id, amount, quantity || 1, category, notes]
    );

    // Update budget spent amount
    const currentMonth = new Date().toISOString().slice(0, 7);
    await dbRun(
      `UPDATE budgets SET spent = spent + ?
       WHERE user_email = ? AND month = ? AND (category = ? OR category = 'All')`,
      [amount, user_email, currentMonth, category || 'All']
    );

    res.status(201).json({ id: result.id, message: 'Purchase recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchases/:email/summary', async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month || new Date().toISOString().slice(0, 7);

    const summary = await dbAll(`
      SELECT
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM purchases
      WHERE user_email = ? AND strftime('%Y-%m', purchase_date) = ?
      GROUP BY category
    `, [req.params.email, currentMonth]);

    const total = await dbGet(`
      SELECT SUM(amount) as total FROM purchases
      WHERE user_email = ? AND strftime('%Y-%m', purchase_date) = ?
    `, [req.params.email, currentMonth]);

    res.json({
      summary,
      total: total?.total || 0,
      month: currentMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// PRICE HISTORY ENDPOINT
// =====================

app.get('/api/prices/history/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { storeId, days } = req.query;

    let query = `
      SELECT p.price, p.recorded_at, s.name as store_name, s.name_he as store_name_he
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ?
    `;
    const params = [productId];

    if (storeId) {
      query += ' AND p.store_id = ?';
      params.push(storeId);
    }

    if (days) {
      query += ` AND p.recorded_at >= datetime('now', '-${parseInt(days)} days')`;
    }

    query += ' ORDER BY p.recorded_at DESC';

    const history = await dbAll(query, params);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// STATISTICS ENDPOINT
// =====================

app.get('/api/stats', async (req, res) => {
  try {
    const productsCount = await dbGet('SELECT COUNT(*) as count FROM products');
    const storesCount = await dbGet('SELECT COUNT(*) as count FROM stores');
    const couponsCount = await dbGet('SELECT COUNT(*) as count FROM coupons WHERE is_active = 1');

    res.json({
      products: productsCount.count,
      stores: storesCount.count,
      activeCoupons: couponsCount.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule price alerts check every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled price alerts check...');
  checkPriceAlerts();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketplace Savings API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
});
