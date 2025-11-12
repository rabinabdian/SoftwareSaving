const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Stores
export const getStores = () => fetchAPI('/stores');

// Products
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/products${query ? `?${query}` : ''}`);
};

export const getProduct = (id) => fetchAPI(`/products/${id}`);

// Price Comparison
export const comparePrices = (productId) => fetchAPI(`/prices/compare/${productId}`);

export const searchProducts = (search) => fetchAPI(`/prices/search?search=${encodeURIComponent(search)}`);

export const getPriceHistory = (productId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/prices/history/${productId}${query ? `?${query}` : ''}`);
};

// Coupons
export const getCoupons = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/coupons${query ? `?${query}` : ''}`);
};

export const createCoupon = (data) => fetchAPI('/coupons', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Price Alerts
export const getAlerts = (email) => fetchAPI(`/alerts/${email}`);

export const createAlert = (data) => fetchAPI('/alerts', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const deleteAlert = (id) => fetchAPI(`/alerts/${id}`, {
  method: 'DELETE',
});

// Budget
export const getBudgets = (email, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/budgets/${email}${query ? `?${query}` : ''}`);
};

export const createBudget = (data) => fetchAPI('/budgets', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateBudget = (id, data) => fetchAPI(`/budgets/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

// Purchases
export const getPurchases = (email, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/purchases/${email}${query ? `?${query}` : ''}`);
};

export const createPurchase = (data) => fetchAPI('/purchases', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getPurchaseSummary = (email, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/purchases/${email}/summary${query ? `?${query}` : ''}`);
};

// Statistics
export const getStats = () => fetchAPI('/stats');
