from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import sys
from datetime import datetime, timedelta

# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(
    title="Tanzania E-commerce Price Intelligence API",
    description="AI-powered price tracking and prediction system for Tanzanian e-commerce platforms",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load simple model
try:
    import pickle
    with open('../models/price_prediction_model.pkl', 'rb') as f:
        model_data = pickle.load(f)
        predictor = model_data['model']
    print("Price prediction model loaded successfully")
except Exception as e:
    print(f"Error loading prediction model: {e}")
    predictor = None

# Pydantic models for request/response
class PricePredictionRequest(BaseModel):
    product_name: str
    location: str
    platform: str
    quantity: int
    date: str

class BatchPredictionRequest(BaseModel):
    predictions: List[PricePredictionRequest]

class PriceResponse(BaseModel):
    product_name: str
    location: str
    platform: str
    quantity: int
    date: str
    predicted_price: float

# Load sample data
def load_sample_data():
    """Load sample price data from CSV"""
    try:
        with open('../sample_data/sample_prices.csv', 'r') as f:
            lines = f.readlines()
            headers = lines[0].strip().split(',')
            data = []
            for line in lines[1:]:
                values = line.strip().split(',')
                if len(values) == len(headers):
                    row = dict(zip(headers, values))
                    # Convert price to number
                    try:
                        row['price'] = float(row['price'])
                        data.append(row)
                    except:
                        continue
            return data
    except Exception as e:
        print(f"Error loading sample data: {e}")
        return []

sample_data = load_sample_data()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Tanzania E-commerce Price Intelligence API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": predictor is not None,
        "sample_data_count": len(sample_data)
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": predictor is not None,
        "sample_data_loaded": len(sample_data) > 0
    }

@app.post("/predict", response_model=PriceResponse)
async def predict_price(request: PricePredictionRequest):
    """Predict price for a single product"""
    if not predictor:
        raise HTTPException(status_code=500, detail="Prediction model not available")
    
    try:
        predicted_price = predictor.predict(
            request.product_name,
            request.location,
            request.platform,
            request.quantity
        )
        
        return PriceResponse(
            product_name=request.product_name,
            location=request.location,
            platform=request.platform,
            quantity=request.quantity,
            date=request.date,
            predicted_price=round(predicted_price, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/batch", response_model=List[PriceResponse])
async def predict_prices_batch(request: BatchPredictionRequest):
    """Predict prices for multiple products"""
    if not predictor:
        raise HTTPException(status_code=500, detail="Prediction model not available")
    
    try:
        results = []
        for pred in request.predictions:
            predicted_price = predictor.predict(
                pred.product_name,
                pred.location,
                pred.platform,
                pred.quantity
            )
            
            result = PriceResponse(
                product_name=pred.product_name,
                location=pred.location,
                platform=pred.platform,
                quantity=pred.quantity,
                date=pred.date,
                predicted_price=round(predicted_price, 2)
            )
            results.append(result)
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/predict/future")
async def predict_future_prices(
    product_name: str,
    location: str,
    platform: str,
    quantity: int,
    days_ahead: int = Query(default=7, ge=1, le=30)
):
    """Predict prices for future dates"""
    if not predictor:
        raise HTTPException(status_code=500, detail="Prediction model not available")
    
    try:
        predictions = []
        base_date = datetime.now()
        
        for i in range(days_ahead):
            future_date = base_date + timedelta(days=i+1)
            
            predicted_price = predictor.predict(
                product_name, location, platform, quantity
            )
            
            prediction = {
                'date': future_date.strftime('%Y-%m-%d'),
                'predicted_price': round(predicted_price, 2),
                'product_name': product_name,
                'location': location,
                'platform': platform,
                'quantity': quantity
            }
            predictions.append(prediction)
        
        return {
            "product_name": product_name,
            "location": location,
            "platform": platform,
            "quantity": quantity,
            "predictions": predictions
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compare/platforms")
async def compare_platforms(
    product_name: str,
    location: str,
    quantity: int,
    date: str
):
    """Compare prices across different platforms"""
    if not predictor:
        raise HTTPException(status_code=500, detail="Prediction model not available")
    
    try:
        platforms = ['Jumia', 'ZoomTanzania']
        comparisons = []
        
        for platform in platforms:
            predicted_price = predictor.predict(
                product_name, location, platform, quantity
            )
            
            comparison = {
                'platform': platform,
                'predicted_price': round(predicted_price, 2),
                'product_name': product_name,
                'location': location,
                'quantity': quantity,
                'date': date
            }
            comparisons.append(comparison)
        
        return comparisons
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compare/locations")
async def compare_locations(
    product_name: str,
    platform: str,
    quantity: int,
    date: str
):
    """Compare prices across different locations"""
    if not predictor:
        raise HTTPException(status_code=500, detail="Prediction model not available")
    
    try:
        locations = ['Dar es Salaam', 'Dodoma', 'Mwanza']
        comparisons = []
        
        for location in locations:
            predicted_price = predictor.predict(
                product_name, location, platform, quantity
            )
            
            comparison = {
                'location': location,
                'predicted_price': round(predicted_price, 2),
                'product_name': product_name,
                'platform': platform,
                'quantity': quantity,
                'date': date
            }
            comparisons.append(comparison)
        
        return comparisons
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/products")
async def get_products(
    category: Optional[str] = None,
    location: Optional[str] = None,
    platform: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=1000)
):
    """Get products from sample data"""
    if not sample_data:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        # Apply filters
        filtered_data = sample_data
        
        if category:
            filtered_data = [item for item in filtered_data if category.lower() in item.get('category', '').lower()]
        if location:
            filtered_data = [item for item in filtered_data if location.lower() in item.get('location', '').lower()]
        if platform:
            filtered_data = [item for item in filtered_data if platform.lower() in item.get('platform', '').lower()]
        
        # Get unique products
        unique_products = {}
        for item in filtered_data:
            product_key = item['product_name']
            if product_key not in unique_products:
                unique_products[product_key] = {
                    'product_name': item['product_name'],
                    'category': item.get('category', 'General'),
                    'quantity': item.get('quantity', 1),
                    'unit': item.get('unit', 'unit')
                }
        
        products = list(unique_products.values())[:limit]
        
        return {
            "products": products,
            "total_count": len(products)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/prices")
async def get_prices(
    product_name: Optional[str] = None,
    location: Optional[str] = None,
    platform: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = Query(default=100, ge=1, le=1000)
):
    """Get price history from sample data"""
    if not sample_data:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        # Apply filters
        filtered_data = sample_data
        
        if product_name:
            filtered_data = [item for item in filtered_data if product_name.lower() in item.get('product_name', '').lower()]
        if location:
            filtered_data = [item for item in filtered_data if location.lower() in item.get('location', '').lower()]
        if platform:
            filtered_data = [item for item in filtered_data if platform.lower() in item.get('platform', '').lower()]
        
        # Apply date filters (simplified for demo)
        if start_date:
            filtered_data = [item for item in filtered_data if item.get('date', '') >= start_date]
        if end_date:
            filtered_data = [item for item in filtered_data if item.get('date', '') <= end_date]
        
        # Sort by date and limit
        filtered_data = sorted(filtered_data, key=lambda x: x.get('date', ''))[:limit]
        
        return {
            "prices": filtered_data,
            "total_count": len(filtered_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/analytics/trends")
async def get_price_trends(
    product_name: Optional[str] = None,
    location: Optional[str] = None,
    platform: Optional[str] = None
):
    """Get price trends and analytics"""
    if not sample_data:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        # Apply filters
        filtered_data = sample_data
        
        if product_name:
            filtered_data = [item for item in filtered_data if product_name.lower() in item.get('product_name', '').lower()]
        if location:
            filtered_data = [item for item in filtered_data if location.lower() in item.get('location', '').lower()]
        if platform:
            filtered_data = [item for item in filtered_data if platform.lower() in item.get('platform', '').lower()]
        
        if not filtered_data:
            return {"message": "No data found for the specified criteria"}
        
        # Calculate trends
        trends = {}
        
        # Overall price trend
        if len(filtered_data) > 1:
            prices = [item['price'] for item in filtered_data]
            start_price = prices[0]
            end_price = prices[-1]
            price_change = end_price - start_price
            price_change_percent = (price_change / start_price) * 100
            
            trends['overall'] = {
                'price_change': round(price_change, 2),
                'price_change_percent': round(price_change_percent, 2),
                'start_price': round(start_price, 2),
                'end_price': round(end_price, 2)
            }
        
        # By location
        location_prices = {}
        for item in filtered_data:
            loc = item.get('location', 'Unknown')
            if loc not in location_prices:
                location_prices[loc] = []
            location_prices[loc].append(item['price'])
        
        trends['by_location'] = {
            loc: round(sum(prices) / len(prices), 2) 
            for loc, prices in location_prices.items()
        }
        
        # By platform
        platform_prices = {}
        for item in filtered_data:
            plat = item.get('platform', 'Unknown')
            if plat not in platform_prices:
                platform_prices[plat] = []
            platform_prices[plat].append(item['price'])
        
        trends['by_platform'] = {
            plat: round(sum(prices) / len(prices), 2) 
            for plat, prices in platform_prices.items()
        }
        
        # By category
        category_prices = {}
        for item in filtered_data:
            cat = item.get('category', 'General')
            if cat not in category_prices:
                category_prices[cat] = []
            category_prices[cat].append(item['price'])
        
        trends['by_category'] = {
            cat: round(sum(prices) / len(prices), 2) 
            for cat, prices in category_prices.items()
        }
        
        return {
            "trends": trends,
            "data_points": len(filtered_data),
            "date_range": {
                "start": min(item.get('date', '') for item in filtered_data),
                "end": max(item.get('date', '') for item in filtered_data)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
