# 🛍️ Tanzania E-commerce Price Intelligence System

🚀 **Advanced AI-powered price tracking and prediction system for Tanzanian e-commerce platforms**

![Tanzania E-commerce](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)

## 📋 Project Overview

This system tracks product prices across major Tanzanian e-commerce platforms, stores historical data, and uses machine learning to predict future price trends. It provides valuable insights for both sellers and buyers in the Tanzanian market.

## 🎯 Problem Statement

In Tanzania's rapidly growing e-commerce sector, prices fluctuate frequently due to:
- Supply and demand variations
- Import cost changes (USD/TZS fluctuations)
- Regional price differences (Dar es Salaam vs Dodoma vs Mwanza)

**Current Challenges:**
- Sellers lack tools to track competitor prices
- Buyers struggle to find optimal purchasing times
- No centralized system for price comparison and prediction

## 🛠️ Tech Stack

### Backend
- **Python** (FastAPI/Flask)
- **Machine Learning**: Scikit-learn, Prophet, ARIMA
- **Database**: SQLite/PostgreSQL
- **Web Scraping**: BeautifulSoup, Selenium, Scrapy

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Chart.js** for interactive charts

### Data Processing
- **Pandas** for data manipulation
- **NumPy** for numerical operations
- **Matplotlib/Seaborn** for visualization

## 🏗️ System Architecture

```
[Web Scrapers] → [Database] → [ML Models]
                      ↓
               [Backend API]
                      ↓
               [Frontend Dashboard]
```

## 📊 Features

### 🔍 Data Collection
- **Multi-platform scraping**: Jumia Tanzania, ZoomTanzania, Kilimo Mart
- **Real-time price tracking**
- **Historical data storage**
- **Product categorization**

### 🤖 Machine Learning
- **Price prediction** using Linear Regression, Random Forest, XGBoost
- **Time series forecasting** with ARIMA and LSTM
- **Trend analysis** and anomaly detection
- **Regional price comparison**

### 📈 Analytics Dashboard
- **Interactive price charts**
- **Product search and filtering**
- **City-wise price comparison**
- **Prediction visualization**
- **Trend analysis reports**

## 📁 Project Structure

```
tanzania-price-tracker/
│
├── data/
│   ├── raw/                 # Raw scraped data
│   └── processed/           # Cleaned and processed data
│
├── scraper/
│   ├── jumia_scraper.py     # Jumia Tanzania scraper
│   ├── zoom_scraper.py      # ZoomTanzania scraper
│   └── base_scraper.py      # Base scraper class
│
├── models/
│   ├── train_model.py       # ML model training
│   ├── predict.py           # Price prediction
│   ├── saved_model.pkl      # Trained model
│   └── time_series.py       # Time series models
│
├── backend/
│   ├── app.py               # FastAPI application
│   ├── routes.py            # API routes
│   ├── database.py          # Database configuration
│   └── models.py            # Database models
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utility functions
│   ├── public/
│   └── package.json
│
├── notebooks/
│   ├── analysis.ipynb       # Data analysis
│   └── model_exploration.ipynb
│
├── sample_data/
│   └── sample_prices.csv    # Sample dataset
│
├── docs/
│   └── project_explanation.md
│
├── requirements.txt
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tanzania-price-tracker.git
cd tanzania-price-tracker
```

2. **Set up Python environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Set up frontend**
```bash
cd frontend
npm install
```

4. **Run the application**
```bash
# Backend
cd backend
python app.py

# Frontend (in new terminal)
cd frontend
npm start
```

## 📊 Sample Data

The system includes sample data for testing:
- **Products**: Rice, Cooking Oil, Sugar, etc.
- **Locations**: Dar es Salaam, Dodoma, Mwanza
- **Platforms**: Jumia, ZoomTanzania
- **Time Period**: 6 months of historical data

## 🤖 Machine Learning Models

### Phase 1: Basic Prediction
- **Linear Regression** for simple price trends
- **Random Forest** for non-linear patterns

### Phase 2: Advanced Models
- **XGBoost** for improved accuracy
- **ARIMA** for time series forecasting

### Phase 3: Deep Learning
- **LSTM Networks** for complex patterns
- **Prophet** for seasonal trends

## 🌐 Supported Platforms

- ✅ Jumia Tanzania
- ✅ ZoomTanzania
- 🔄 Kilimo Mart (in development)
- 🔄 Kupatana (planned)

## 📈 API Endpoints

### Data Endpoints
- `GET /api/products` - List all products
- `GET /api/prices` - Get price history
- `POST /api/scrape` - Trigger scraping

### Prediction Endpoints
- `POST /api/predict` - Predict future prices
- `GET /api/trends` - Get trend analysis

### Analytics Endpoints
- `GET /api/analytics/compare` - Compare prices across platforms
- `GET /api/analytics/trends` - Get market trends

## 🎨 Frontend Features

### Dashboard
- **Real-time price monitoring**
- **Interactive charts and graphs**
- **Product search and filters**
- **Location-based comparisons**

### User Interface
- **Modern, responsive design**
- **Dark/light mode toggle**
- **Mobile-friendly interface**
- **Accessibility features**

## 🧪 Testing

```bash
# Run Python tests
pytest

# Run frontend tests
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Project**: Tanzania E-commerce Price Intelligence System

## 🙏 Acknowledgments

- Tanzania National Bureau of Statistics (NBS) for reference data
- Open source community for the amazing tools and libraries
- Tanzanian e-commerce platforms for providing valuable market data

## 📞 Contact

- **Email**: your.email@example.com
- **GitHub**: https://github.com/yourusername
- **LinkedIn**: https://linkedin.com/in/yourprofile

---

🔥 **Built with ❤️ for the Tanzanian e-commerce ecosystem**
