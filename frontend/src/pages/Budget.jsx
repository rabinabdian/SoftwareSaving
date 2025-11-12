import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getBudgets, createBudget, getPurchases, createPurchase, getPurchaseSummary, getStores } from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Budget() {
  const { t, language } = useLanguage();
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });

  const [budgets, setBudgets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  // Form data
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('All');

  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseStore, setPurchaseStore] = useState('');
  const [purchaseCategory, setPurchaseCategory] = useState('All');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (userEmail) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchData = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const [budgetsData, purchasesData, summaryData, storesData] = await Promise.all([
        getBudgets(userEmail, { month: currentMonth }),
        getPurchases(userEmail, { month: currentMonth }),
        getPurchaseSummary(userEmail, { month: currentMonth }),
        getStores(),
      ]);

      setBudgets(budgetsData);
      setPurchases(purchasesData);
      setSummary(summaryData);
      setStores(storesData);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSave = () => {
    localStorage.setItem('userEmail', userEmail);
    fetchData();
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!budgetAmount || !userEmail) return;

    try {
      await createBudget({
        user_email: userEmail,
        month: currentMonth,
        total_budget: parseFloat(budgetAmount),
        category: budgetCategory,
      });

      alert('Budget created successfully');
      setShowBudgetForm(false);
      setBudgetAmount('');
      setBudgetCategory('All');
      fetchData();
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Error creating budget');
    }
  };

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    if (!purchaseAmount || !userEmail) return;

    try {
      await createPurchase({
        user_email: userEmail,
        store_id: purchaseStore || null,
        amount: parseFloat(purchaseAmount),
        category: purchaseCategory,
        notes: purchaseNotes,
      });

      alert('Purchase recorded successfully');
      setShowPurchaseForm(false);
      setPurchaseAmount('');
      setPurchaseStore('');
      setPurchaseCategory('All');
      setPurchaseNotes('');
      fetchData();
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Error recording purchase');
    }
  };

  const categories = ['All', 'Dairy', 'Bakery', 'Meat', 'Vegetables', 'Fruits', 'Grains', 'Beverages', 'Other'];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Email input screen
  if (!userEmail || !localStorage.getItem('userEmail')) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('budgetTracker')}</h1>
          <p className="text-gray-600 mb-6">
            Please enter your email to manage your budget
          </p>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
          />
          <button
            onClick={handleEmailSave}
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.total_budget, 0);
  const totalSpent = summary?.total || 0;
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('budgetTracker')}</h1>
          <div className="space-x-2">
            <button
              onClick={() => setShowBudgetForm(!showBudgetForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              {t('add')} {t('monthlyBudget')}
            </button>
            <button
              onClick={() => setShowPurchaseForm(!showPurchaseForm)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              {t('addPurchase')}
            </button>
          </div>
        </div>

        {/* Budget Stats */}
        {!loading && totalBudget > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-sm text-blue-700 font-medium mb-1">{t('monthlyBudget')}</div>
              <div className="text-3xl font-bold text-blue-900">
                {t('currency')}{totalBudget.toFixed(2)}
              </div>
            </div>
            <div className={`${percentSpent > 80 ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-6`}>
              <div className={`text-sm font-medium mb-1 ${percentSpent > 80 ? 'text-red-700' : 'text-green-700'}`}>
                {t('spent')}
              </div>
              <div className={`text-3xl font-bold ${percentSpent > 80 ? 'text-red-900' : 'text-green-900'}`}>
                {t('currency')}{totalSpent.toFixed(2)}
              </div>
              <div className="text-sm mt-1">
                {percentSpent.toFixed(1)}% of budget
              </div>
            </div>
            <div className={`${remaining < 0 ? 'bg-red-50' : 'bg-gray-50'} rounded-lg p-6`}>
              <div className={`text-sm font-medium mb-1 ${remaining < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                {t('remaining')}
              </div>
              <div className={`text-3xl font-bold ${remaining < 0 ? 'text-red-900' : 'text-gray-900'}`}>
                {t('currency')}{remaining.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!loading && totalBudget > 0 && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  percentSpent > 100 ? 'bg-red-500' : percentSpent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Create Budget Form */}
        {showBudgetForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('add')} {t('monthlyBudget')}</h2>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category')}
                </label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(cat.toLowerCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Purchase Form */}
        {showPurchaseForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('addPurchase')}</h2>
            <form onSubmit={handleCreatePurchase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('stores')}
                </label>
                <select
                  value={purchaseStore}
                  onChange={(e) => setPurchaseStore(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {language === 'he' ? store.name_he : store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category')}
                </label>
                <select
                  value={purchaseCategory}
                  onChange={(e) => setPurchaseCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(cat.toLowerCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('notes')}
                </label>
                <textarea
                  value={purchaseNotes}
                  onChange={(e) => setPurchaseNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPurchaseForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Spending by Category */}
      {!loading && summary && summary.summary.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Spending by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary.summary}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {summary.summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {summary.summary.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{t('currency')}{item.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{item.count} purchases</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Purchases */}
      {!loading && purchases.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('purchases')}</h2>
          <div className="space-y-3">
            {purchases.slice(0, 10).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">
                    {purchase.store_name ? (language === 'he' ? purchase.store_name_he : purchase.store_name) : 'Manual Entry'}
                  </div>
                  <div className="text-sm text-gray-600">{purchase.category}</div>
                  {purchase.notes && (
                    <div className="text-sm text-gray-500 mt-1">{purchase.notes}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(purchase.purchase_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {t('currency')}{purchase.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && purchases.length === 0 && !showPurchaseForm && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <span className="text-6xl">💰</span>
          <p className="mt-4 text-gray-600">No purchases recorded yet</p>
        </div>
      )}
    </div>
  );
}
