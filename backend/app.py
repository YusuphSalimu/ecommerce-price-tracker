from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys

# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.predict import PricePredictor

app = FastAPI(
    title="Tanzania E-commerce Price Intelligence API",
    description="AI-powered price tracking and prediction system for Tanzanian e-commerce platforms",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the price predictor
try:
    predictor = PricePredictor()
    print("✅ Price prediction model loaded successfully")
except Exception as e:
    print(f"❌ Error loading prediction model: {e}")
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

class ComparisonResponse(BaseModel):
    platform: str
    predicted_price: float
    product_name: str
    location: str
    quantity: int
    date: str

class LocationComparisonResponse(BaseModel):
    location: str
    predicted_price: float
    product_name: str
    platform: str
    quantity: int
    date: str

# Load sample data for endpoints
def load_sample_data():
    """Load sample price data"""
    try:
        df = pd.read_csv('../sample_data/sample_prices.csv')
        df['date'] = pd.to_datetime(df['date'])
        return df
    except Exception as e:
        print(f"Error loading sample data: {e}")
        return pd.DataFrame()

sample_data = load_sample_data()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Tanzania E-commerce Price Intelligence API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/predict",
            "/predict/batch",
            "/predict/future",
            "/compare/platforms",
            "/compare/locations",
            "/products",
            "/prices",
            "/analytics/trends"
        ]
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
        predicted_price = predictor.predict_price(
            request.product_name,
            request.location,
            request.platform,
            request.quantity,
            request.date
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
        predictions_list = [pred.dict() for pred in request.predictions]
        results = predictor.predict_prices_batch(predictions_list)
        
        # Filter out error responses
        valid_results = [r for r in results if 'predicted_price' in r]
        
        return [PriceResponse(**result) for result in valid_results]
        
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
        predictions = predictor.predict_future_prices(
            product_name, location, platform, quantity, days_ahead
        )
        
        # Filter out error responses
        valid_predictions = [p for p in predictions if 'predicted_price' in p]
        
        return {
            "product_name": product_name,
            "location": location,
            "platform": platform,
            "quantity": quantity,
            "predictions": valid_predictions
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compare/platforms", response_model=List[ComparisonResponse])
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
        comparisons = predictor.compare_prices_across_platforms(
            product_name, location, quantity, date
        )
        
        # Filter out error responses
        valid_comparisons = [c for c in comparisons if 'predicted_price' in c]
        
        return [ComparisonResponse(**comp) for comp in valid_comparisons]
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/compare/locations", response_model=List[LocationComparisonResponse])
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
        comparisons = predictor.compare_prices_across_locations(
            product_name, platform, quantity, date
        )
        
        # Filter out error responses
        valid_comparisons = [c for c in comparisons if 'predicted_price' in c]
        
        return [LocationComparisonResponse(**comp) for comp in valid_comparisons]
        
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
    if sample_data.empty:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        df = sample_data.copy()
        
        # Apply filters
        if category:
            df = df[df['category'].str.contains(category, case=False, na=False)]
        if location:
            df = df[df['location'].str.contains(location, case=False, na=False)]
        if platform:
            df = df[df['platform'].str.contains(platform, case=False, na=False)]
        
        # Get unique products
        products = df[['product_name', 'category', 'quantity', 'unit']].drop_duplicates().head(limit)
        
        return {
            "products": products.to_dict('records'),
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
    if sample_data.empty:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        df = sample_data.copy()
        
        # Apply filters
        if product_name:
            df = df[df['product_name'].str.contains(product_name, case=False, na=False)]
        if location:
            df = df[df['location'].str.contains(location, case=False, na=False)]
        if platform:
            df = df[df['platform'].str.contains(platform, case=False, na=False)]
        
        # Apply date filters
        if start_date:
            start_date = pd.to_datetime(start_date)
            df = df[df['date'] >= start_date]
        
        if end_date:
            end_date = pd.to_datetime(end_date)
            df = df[df['date'] <= end_date]
        
        # Sort by date and limit
        df = df.sort_values('date').head(limit)
        
        return {
            "prices": df.to_dict('records'),
            "total_count": len(df)
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
    if sample_data.empty:
        raise HTTPException(status_code=404, detail="No data available")
    
    try:
        df = sample_data.copy()
        
        # Apply filters
        if product_name:
            df = df[df['product_name'].str.contains(product_name, case=False, na=False)]
        if location:
            df = df[df['location'].str.contains(location, case=False, na=False)]
        if platform:
            df = df[df['platform'].str.contains(platform, case=False, na=False)]
        
        if df.empty:
            return {"message": "No data found for the specified criteria"}
        
        # Calculate trends
        trends = {}
        
        # Overall price trend
        price_by_date = df.groupby('date')['price'].mean().sort_index()
        if len(price_by_date) > 1:
            price_change = price_by_date.iloc[-1] - price_by_date.iloc[0]
            price_change_percent = (price_change / price_by_date.iloc[0]) * 100
            trends['overall'] = {
                'price_change': round(price_change, 2),
                'price_change_percent': round(price_change_percent, 2),
                'start_price': round(price_by_date.iloc[0], 2),
                'end_price': round(price_by_date.iloc[-1], 2)
            }
        
        # By location
        if 'location' in df.columns:
            location_avg = df.groupby('location')['price'].mean().to_dict()
            trends['by_location'] = {k: round(v, 2) for k, v in location_avg.items()}
        
        # By platform
        if 'platform' in df.columns:
            platform_avg = df.groupby('platform')['price'].mean().to_dict()
            trends['by_platform'] = {k: round(v, 2) for k, v in platform_avg.items()}
        
        # By category
        if 'category' in df.columns:
            category_avg = df.groupby('category')['price'].mean().to_dict()
            trends['by_category'] = {k: round(v, 2) for k, v in category_avg.items()}
        
        return {
            "trends": trends,
            "data_points": len(df),
            "date_range": {
                "start": df['date'].min().strftime('%Y-%m-%d'),
                "end": df['date'].max().strftime('%Y-%m-%d')
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
