import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAlerts, createAlert, deleteAlert, searchProducts } from '../utils/api';

export default function PriceAlerts() {
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });

  // Form state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (userEmail) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchAlerts = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const data = await getAlerts(userEmail);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSave = () => {
    localStorage.setItem('userEmail', userEmail);
    fetchAlerts();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    try {
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !targetPrice || !userEmail) return;

    try {
      await createAlert({
        user_email: userEmail,
        product_id: selectedProduct.id,
        target_price: parseFloat(targetPrice),
      });

      alert(t('alertCreated'));
      setShowCreateForm(false);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedProduct(null);
      setTargetPrice('');
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Error creating alert');
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      await deleteAlert(id);
      alert(t('alertDeleted'));
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  // Email input screen
  if (!userEmail || !localStorage.getItem('userEmail')) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('priceAlerts')}</h1>
          <p className="text-gray-600 mb-6">
            Please enter your email to manage price alerts
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

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('myAlerts')}</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            {showCreateForm ? t('cancel') : t('createAlert')}
          </button>
        </div>

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('createAlert')}</h2>

            {/* Product Search */}
            {!selectedProduct && (
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('search')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
                    >
                      {t('search')}
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searching && <div className="text-center py-4">{t('loading')}</div>}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setSearchResults([]);
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-white transition"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {language === 'he' ? product.name_he : product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Current min price: {t('currency')}{product.min_price}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            )}

            {/* Target Price Form */}
            {selectedProduct && (
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'he' ? selectedProduct.name_he : selectedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Current min price: {t('currency')}{selectedProduct.min_price}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="text-sm text-primary-500 hover:text-primary-600 mt-2"
                  >
                    Change product
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('targetPrice')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <span className="flex items-center px-4 bg-gray-100 rounded-lg">
                      {t('currency')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('notifyWhen')} {t('currency')}{targetPrice || '0.00'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
                >
                  {t('createAlert')}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Alerts List */}
        {loading && <div className="text-center py-12">{t('loading')}</div>}

        {!loading && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.triggered
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'he' ? alert.product_name_he : alert.product_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('targetPrice')}: {t('currency')}{alert.target_price}
                  </p>
                  {alert.triggered && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      ✓ Price target reached!
                    </p>
                  )}
                  {!alert.is_active && (
                    <p className="text-sm text-gray-500 mt-1">Inactive</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  {t('delete')}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && alerts.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <span className="text-6xl">🔔</span>
            <p className="mt-4 text-gray-600">No price alerts yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
            >
              {t('createAlert')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
