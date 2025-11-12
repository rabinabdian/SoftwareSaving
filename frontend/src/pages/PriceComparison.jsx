import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { searchProducts, comparePrices, getPriceHistory } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PriceComparison() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setLoading(true);
    try {
      const prices = await comparePrices(product.id);
      setPriceData(prices);

      // Fetch price history
      setHistoryLoading(true);
      const history = await getPriceHistory(product.id, { days: 30 });

      // Group by date
      const historyByDate = {};
      history.forEach(item => {
        const date = new Date(item.recorded_at).toLocaleDateString('en-US');
        if (!historyByDate[date]) {
          historyByDate[date] = { date, prices: [] };
        }
        historyByDate[date].prices.push(item.price);
      });

      const chartData = Object.values(historyByDate).map(item => ({
        date: item.date,
        avgPrice: (item.prices.reduce((a, b) => a + b, 0) / item.prices.length).toFixed(2),
        minPrice: Math.min(...item.prices).toFixed(2),
      })).slice(0, 10).reverse();

      setPriceHistory(chartData);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('compareProducts')}</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            {t('search')}
          </button>
        </form>

        {/* Search Results */}
        {loading && <div className="text-center py-8">{t('loading')}</div>}

        {!loading && searchResults.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900">
                  {language === 'he' ? product.name_he : product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'he' ? product.category_he : product.category}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">
                    {product.min_price ? `${t('currency')}${product.min_price}` : 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.store_count} {t('stores')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Comparison Results */}
      {selectedProduct && priceData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'he' ? selectedProduct.name_he : selectedProduct.name}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'he' ? selectedProduct.category_he : selectedProduct.category}
          </p>

          {/* Best Price Highlight */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-green-700 font-medium">{t('cheapestAt')}</span>
                <h3 className="text-2xl font-bold text-green-900">
                  {language === 'he' ? priceData[0].store_name_he : priceData[0].store_name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-green-600">
                  {t('currency')}{priceData[0].price}
                </span>
                {priceData.length > 1 && (
                  <p className="text-sm text-green-700 mt-1">
                    {t('savingsLabel')}: {t('currency')}
                    {(priceData[priceData.length - 1].price - priceData[0].price).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* All Prices */}
          <div className="space-y-3">
            {priceData.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  index === 0
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.logo}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'he' ? item.store_name_he : item.store_name}
                    </h4>
                    <span
                      className={`text-xs ${
                        item.in_stock ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.in_stock ? t('inStock') : t('outOfStock')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {t('currency')}{item.price}
                  </span>
                  {index > 0 && (
                    <p className="text-sm text-red-600">
                      +{t('currency')}
                      {(item.price - priceData[0].price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price History Chart */}
          {!historyLoading && priceHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('priceHistory')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="minPrice"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Min Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Avg Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
