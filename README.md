# 💰 Marketplace Savings - Israel

A comprehensive web application for saving money while shopping in Israel. Compare prices across stores, find coupons, track price changes, and manage your shopping budget.

## ✨ Features

### 🏪 Price Comparison
- Compare prices across major Israeli supermarkets (Shufersal, Rami Levy, Victory, etc.)
- View price history charts
- See savings potential across different stores
- Real-time price data

### 🎟️ Coupon & Discount Aggregator
- Browse active coupons and discounts
- Filter by store and category
- Copy coupon codes instantly
- See minimum purchase requirements and expiry dates

### 🔔 Price Tracking & Alerts
- Set target prices for products
- Get notified when prices drop
- Manage multiple price alerts
- Track price trends over time

### 💰 Budget Tracking
- Set monthly budgets
- Record purchases automatically
- Track spending by category
- Visualize spending patterns with charts
- Get alerts when approaching budget limits

### 🌐 Bilingual Support
- Full Hebrew (עברית) and English support
- RTL layout for Hebrew
- Seamless language switching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SoftwareSaving
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Development Mode

1. **Start the backend server** (Terminal 1)
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

2. **Start the frontend development server** (Terminal 2)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
SoftwareSaving/
├── backend/
│   ├── database.js       # Database schema and initialization
│   ├── server.js         # Express API server
│   ├── package.json      # Backend dependencies
│   └── savings.db        # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   │   └── Layout.jsx
│   │   ├── contexts/     # React contexts (Language)
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PriceComparison.jsx
│   │   │   ├── Coupons.jsx
│   │   │   ├── PriceAlerts.jsx
│   │   │   └── Budget.jsx
│   │   ├── utils/        # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   └── tailwind.config.js # Tailwind CSS configuration
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite3** - Database
- **node-cron** - Scheduled tasks for price alerts

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Recharts** - Data visualization

## 📊 API Endpoints

### Stores
- `GET /api/stores` - Get all stores

### Products
- `GET /api/products` - Get products (with search & category filters)
- `GET /api/products/:id` - Get product details

### Price Comparison
- `GET /api/prices/compare/:productId` - Compare prices across stores
- `GET /api/prices/search?search=query` - Search products with price info
- `GET /api/prices/history/:productId` - Get price history

### Coupons
- `GET /api/coupons` - Get active coupons (filter by store/category)
- `POST /api/coupons` - Create new coupon

### Price Alerts
- `GET /api/alerts/:email` - Get user's price alerts
- `POST /api/alerts` - Create new price alert
- `DELETE /api/alerts/:id` - Delete price alert

### Budget
- `GET /api/budgets/:email` - Get user's budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget

### Purchases
- `GET /api/purchases/:email` - Get user's purchases
- `POST /api/purchases` - Record new purchase
- `GET /api/purchases/:email/summary` - Get spending summary

### Statistics
- `GET /api/stats` - Get general statistics

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Create new project from GitHub repository
3. Set environment variables:
   - `PORT=3001`
4. Deploy backend service
5. Note the deployed URL

### Frontend Deployment (Vercel/Netlify)

1. Create account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL=<your-backend-url>/api`
5. Deploy

## 🔒 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

For production, update with your deployed backend URL.

## 🎯 Features in Detail

### Price Comparison
The price comparison feature allows users to:
- Search for products across all stores
- View current prices from multiple retailers
- See which store has the best price
- View price history charts to identify trends
- Calculate potential savings

### Coupon System
Users can:
- Browse all active coupons
- Filter by store and product category
- See discount details (percentage, fixed amount, BOGO)
- Copy coupon codes with one click
- Check expiry dates and minimum purchase requirements

### Price Alerts
Automated price monitoring:
- Set target prices for favorite products
- Receive notifications when prices drop
- Manage multiple alerts simultaneously
- Automatic checking every hour via cron jobs

### Budget Tracking
Comprehensive spending management:
- Set monthly budgets by category
- Record purchases manually or scan receipts
- View spending by category with pie charts
- Track progress against budget limits
- Get visual warnings when approaching limits

## 🌍 Localization

The app supports both Hebrew and English:
- All UI text is translated
- Automatic RTL layout for Hebrew
- Store names and product names in both languages
- Date and number formatting per locale

## 📝 Sample Data

The application comes with sample data including:
- 6 popular Israeli supermarket chains
- 10 common grocery products
- Sample prices for all product/store combinations
- Example coupons and discounts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Israeli supermarket chains for price data inspiration
- React and Vite communities
- Tailwind CSS team
- Recharts for beautiful charts

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for smarter shopping in Israel 🇮🇱
