import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCoupons, getStores } from '../utils/api';

export default function Coupons() {
  const { t, language } = useLanguage();
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchCoupons();
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [selectedStore, selectedCategory]);

  const fetchStores = async () => {
    try {
      const data = await getStores();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStore) params.store = selectedStore;
      if (selectedCategory) params.category = selectedCategory;

      const data = await getCoupons(params);
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories = ['All', 'Dairy', 'Bakery', 'Meat', 'Vegetables', 'Fruits', 'Grains', 'Beverages'];

  const getDiscountText = (coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% ${t('discount')}`;
    } else if (coupon.discount_type === 'fixed') {
      return `${t('currency')}${coupon.discount_value} ${t('discount')}`;
    } else if (coupon.discount_type === 'bogo') {
      return 'Buy 2 Get 1 Free';
    }
    return '';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('availableCoupons')}</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('stores')}
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">{t('allStores')}</option>
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {t(category.toLowerCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        )}

        {/* Coupons Grid */}
        {!loading && coupons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                {/* Coupon Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{coupon.logo || '🎟️'}</span>
                    <span className="text-sm font-medium bg-white text-primary-600 px-2 py-1 rounded">
                      {coupon.category || 'All'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">
                    {language === 'he' ? coupon.store_name_he : coupon.store_name}
                  </h3>
                </div>

                {/* Coupon Body */}
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    {language === 'he' ? coupon.title_he : coupon.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'he' ? coupon.description_he : coupon.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('discount')}:</span>
                      <span className="font-semibold text-green-600">
                        {getDiscountText(coupon)}
                      </span>
                    </div>

                    {coupon.min_purchase > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('minPurchase')}:</span>
                        <span className="font-semibold">
                          {t('currency')}{coupon.min_purchase}
                        </span>
                      </div>
                    )}

                    {coupon.valid_until && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('validUntil')}:</span>
                        <span className="font-semibold">
                          {new Date(coupon.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Code */}
                  {coupon.code && (
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-200 transition"
                    >
                      <div className="text-xs text-gray-600 mb-1">{t('couponCode')}</div>
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {coupon.code}
                      </div>
                      {copiedCode === coupon.code && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Copied!
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Coupons */}
        {!loading && coupons.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">🎟️</span>
            <p className="mt-4 text-gray-600">No coupons found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
