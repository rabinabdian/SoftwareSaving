import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getStats } from '../utils/api';

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, stores: 0, activeCoupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: '📊',
      title: t('priceComparison'),
      description: 'Compare prices across all major Israeli supermarkets',
      descriptionHe: 'השווה מחירים בכל הרשתות הגדולות בישראל',
      link: '/compare',
      color: 'bg-blue-500',
    },
    {
      icon: '🎟️',
      title: t('coupons'),
      description: 'Find the best coupons and discounts',
      descriptionHe: 'מצא את הקופונים וההנחות הטובים ביותר',
      link: '/coupons',
      color: 'bg-green-500',
    },
    {
      icon: '🔔',
      title: t('priceAlerts'),
      description: 'Get notified when prices drop',
      descriptionHe: 'קבל התראה כשהמחירים יורדים',
      link: '/alerts',
      color: 'bg-yellow-500',
    },
    {
      icon: '💰',
      title: t('budget'),
      description: 'Track your spending and stay on budget',
      descriptionHe: 'עקוב אחר ההוצאות ושמור על התקציב',
      link: '/budget',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">{t('welcome')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.products}</div>
            <div className="text-gray-600 mt-2">{t('totalProducts')}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.stores}</div>
            <div className="text-gray-600 mt-2">{t('totalStores')}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">{stats.activeCoupons}</div>
            <div className="text-gray-600 mt-2">{t('activeCoupons')}</div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div className={`${feature.color} text-white text-4xl p-4 rounded-lg`}>
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Start Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start saving?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Compare prices, find discounts, and track your budget all in one place
        </p>
        <Link
          to="/compare"
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {t('compareNow')}
        </Link>
      </div>
    </div>
  );
}
