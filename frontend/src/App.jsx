import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import PriceComparison from './pages/PriceComparison';
import Coupons from './pages/Coupons';
import PriceAlerts from './pages/PriceAlerts';
import Budget from './pages/Budget';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<PriceComparison />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/alerts" element={<PriceAlerts />} />
            <Route path="/budget" element={<Budget />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
