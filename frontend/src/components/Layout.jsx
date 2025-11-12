import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout({ children }) {
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('home'), icon: '🏠' },
    { path: '/compare', label: t('priceComparison'), icon: '📊' },
    { path: '/coupons', label: t('coupons'), icon: '🎟️' },
    { path: '/alerts', label: t('priceAlerts'), icon: '🔔' },
    { path: '/budget', label: t('budget'), icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">💰</span>
              <div>
                <h1 className="text-2xl font-bold text-primary-600">
                  {language === 'he' ? 'חיסכון בשוק' : 'Marketplace Savings'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'he' ? 'חסוך כסף בקניות בישראל' : 'Save Money Shopping in Israel'}
                </p>
              </div>
            </Link>

            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              {language === 'he' ? 'EN' : 'עב'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            {language === 'he'
              ? '© 2024 חיסכון בשוק - חסוך כסף בקניות בישראל'
              : '© 2024 Marketplace Savings - Save Money Shopping in Israel'}
          </p>
        </div>
      </footer>
    </div>
  );
}
