from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys

# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)

# Enable CORS
CORS(app, origins=["*"])

# Tanzania e-commerce data
TANZANIA_PLATFORMS = [
    {"name": "Jumia Tanzania", "status": "active", "icon": "🛒"},
    {"name": "Azam Pay", "status": "active", "icon": "💳"},
    {"name": "Mo Kwanza", "status": "active", "icon": "📱"},
    {"name": "Asas Digital", "status": "active", "icon": "💻"},
    {"name": "JamboMart", "status": "active", "icon": "🛍️"},
    {"name": "ZoomTanzania", "status": "maintenance", "icon": "🔍"},
    {"name": "Kilimo Mart", "status": "active", "icon": "🌾"},
    {"name": "Kupatana", "status": "active", "icon": "🏪"}
]

# Sample product data
PRODUCTS = [
    {"name": "Rice 5kg", "category": "Food", "avg_price": 15000},
    {"name": "Cooking Oil 1L", "category": "Food", "avg_price": 8500},
    {"name": "Sugar 2kg", "category": "Food", "avg_price": 7000},
    {"name": "Maize Flour 2kg", "category": "Food", "avg_price": 4500},
    {"name": "Smartphone", "category": "Electronics", "avg_price": 450000},
    {"name": "Laptop", "category": "Electronics", "avg_price": 1250000},
    {"name": "TV 55 inch", "category": "Electronics", "avg_price": 890000},
    {"name": "Headphones", "category": "Electronics", "avg_price": 35000}
]

# Tanzania regions
REGIONS = [
    {"name": "Dar es Salaam", "lat": -6.7924, "lng": 39.2083},
    {"name": "Dodoma", "lat": -6.1630, "lng": 35.7516},
    {"name": "Mwanza", "lat": -2.5164, "lng": 32.9175},
    {"name": "Arusha", "lat": -3.3870, "lng": 36.6830},
    {"name": "Mbeya", "lat": -8.9145, "lng": 33.4567},
    {"name": "Tanga", "lat": -5.0689, "lng": 39.2988},
    {"name": "Morogoro", "lat": -6.8240, "lng": 37.6612},
    {"name": "Kilimanjaro", "lat": -3.3617, "lng": 37.3556},
    {"name": "Zanzibar", "lat": -6.1659, "lng": 39.2026},
    {"name": "Iringa", "lat": -7.4355, "lng": 35.6920}
]

@app.route('/')
def home():
    return jsonify({
        "message": "Tanzania E-commerce Price Intelligence API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/api/platforms",
            "/api/products",
            "/api/regions",
            "/api/predict",
            "/api/market-insights"
        ]
    })

@app.route('/api/platforms')
def get_platforms():
    return jsonify({
        "platforms": TANZANIA_PLATFORMS,
        "total": len(TANZANIA_PLATFORMS),
        "active": len([p for p in TANZANIA_PLATFORMS if p["status"] == "active"])
    })

@app.route('/api/products')
def get_products():
    category = request.args.get('category')
    if category:
        filtered_products = [p for p in PRODUCTS if p["category"] == category]
    else:
        filtered_products = PRODUCTS
    
    return jsonify({
        "products": filtered_products,
        "total": len(filtered_products),
        "categories": list(set(p["category"] for p in PRODUCTS))
    })

@app.route('/api/regions')
def get_regions():
    return jsonify({
        "regions": REGIONS,
        "total": len(REGIONS)
    })

@app.route('/api/predict', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()
        product_name = data.get('product_name')
        location = data.get('location')
        platform = data.get('platform')
        
        # Simple price prediction logic
        base_price = 15000
        location_factor = 1.0 if location == "Dar es Salaam" else 1.2
        platform_factor = 1.1 if platform == "Jumia Tanzania" else 1.0
        
        predicted_price = int(base_price * location_factor * platform_factor)
        
        return jsonify({
            "product_name": product_name,
            "location": location,
            "platform": platform,
            "predicted_price": predicted_price,
            "confidence": 0.85,
            "currency": "TZS",
            "prediction_date": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/market-insights')
def get_market_insights():
    return jsonify({
        "total_products": len(PRODUCTS),
        "total_platforms": len(TANZANIA_PLATFORMS),
        "total_regions": len(REGIONS),
        "market_trends": {
            "price_trend": "up",
            "demand_trend": "stable",
            "competition_level": "high"
        },
        "top_categories": [
            {"name": "Food", "count": 4, "avg_price": 8750},
            {"name": "Electronics", "count": 4, "avg_price": 656250}
        ],
        "last_updated": datetime.now().isoformat()
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/market/insights')
def get_market_insights():
    # Generate dynamic top gainers and losers with real calculations
    import random
    
    # Tanzania e-commerce platforms with realistic price data
    platforms = [
        {"name": "Jumia Tanzania", "base_price": 45000},
        {"name": "Azam Pay", "base_price": 38000},
        {"name": "Mo Kwanza", "base_price": 52000},
        {"name": "Asas Digital", "base_price": 41000},
        {"name": "JamboMart", "base_price": 35000},
        {"name": "ZoomTanzania", "base_price": 48000},
        {"name": "Kilimo Mart", "base_price": 29000},
        {"name": "Kupatana", "base_price": 33000},
        {"name": "Tigo Pesa", "base_price": 25000},
        {"name": "M-Pawa", "base_price": 27000}
    ]
    
    # Calculate dynamic price changes
    top_gainers = []
    top_losers = []
    
    for platform in platforms:
        # Simulate real-time price changes
        price_change = random.uniform(-15, 25)  # -15% to +25% change
        new_price = platform["base_price"] * (1 + price_change / 100)
        
        item = {
            "platform": platform["name"],
            "price": int(new_price),
            "change": round(price_change, 2),
            "volume": random.randint(100, 5000),
            "market_cap": int(new_price * random.randint(100, 5000)),
            "trend": "up" if price_change > 0 else "down",
            "confidence": round(random.uniform(0.75, 0.95), 2)
        }
        
        # Separate into gainers and losers
        if price_change > 5:  # Gainers: >5% increase
            top_gainers.append(item)
        elif price_change < -5:  # Losers: <-5% decrease
            top_losers.append(item)
    
    # Sort by percentage change
    top_gainers.sort(key=lambda x: x["change"], reverse=True)
    top_losers.sort(key=lambda x: x["change"])
    
    # Take top 5 from each
    top_gainers = top_gainers[:5]
    top_losers = top_losers[:5]
    
    # Generate regional analysis
    regions = [
        {"region": "Dar es Salaam", "avg_price": 42000, "change": 8.5},
        {"region": "Dodoma", "avg_price": 38000, "change": -2.3},
        {"region": "Mwanza", "avg_price": 41000, "change": 5.2},
        {"region": "Arusha", "avg_price": 44000, "change": 12.1},
        {"region": "Mbeya", "avg_price": 36000, "change": -4.8},
        {"region": "Tanga", "avg_price": 39000, "change": 3.7},
        {"region": "Morogoro", "avg_price": 37000, "change": 1.2},
        {"region": "Kilimanjaro", "avg_price": 43000, "change": 6.9}
    ]
    
    return jsonify({
        "topGainers": top_gainers,
        "topLosers": top_losers,
        "regional_analysis": regions,
        "market_summary": {
            "total_volume": sum(item["volume"] for item in top_gainers + top_losers),
            "avg_change": round(sum(item["change"] for item in top_gainers + top_losers) / len(top_gainers + top_losers), 2),
            "market_sentiment": "bullish" if len(top_gainers) > len(top_losers) else "bearish",
            "last_updated": datetime.now().isoformat()
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
