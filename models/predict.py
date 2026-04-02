import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta
import json

class PricePredictor:
    def __init__(self, model_path='models/price_prediction_model.pkl'):
        """Initialize the price predictor with a trained model"""
        self.model_data = joblib.load(model_path)
        self.model = self.model_data['model']
        self.feature_columns = self.model_data['feature_columns']
        self.target_column = self.model_data['target_column']
        
        # Create mappings for categorical variables
        self.create_mappings()
    
    def create_mappings(self):
        """Create mappings for categorical variables"""
        # These mappings should match the training data encoding
        self.location_mapping = {
            'Dar es Salaam': 0,
            'Dodoma': 1,
            'Mwanza': 2
        }
        
        self.platform_mapping = {
            'Jumia': 0,
            'ZoomTanzania': 1
        }
        
        self.category_mapping = {
            'Food': 0
        }
        
        # Sample product mappings (should be expanded based on actual products)
        self.product_mapping = {
            'Rice 5kg': 0,
            'Cooking Oil 1L': 1,
            'Sugar 2kg': 2,
            'Maize Flour 2kg': 3,
            'Salt 1kg': 4
        }
    
    def prepare_features(self, product_name, location, platform, quantity, date):
        """Prepare features for prediction"""
        try:
            # Convert date to datetime
            if isinstance(date, str):
                date = pd.to_datetime(date)
            
            # Extract date features
            day_of_week = date.dayofweek
            month = date.month
            day_of_month = date.day
            
            # Encode categorical variables
            location_encoded = self.location_mapping.get(location, 0)
            platform_encoded = self.platform_mapping.get(platform, 0)
            category_encoded = self.category_mapping.get('Food', 0)
            product_encoded = self.product_mapping.get(product_name, 0)
            
            features = {
                'quantity': quantity,
                'day_of_week': day_of_week,
                'month': month,
                'day_of_month': day_of_month,
                'location_encoded': location_encoded,
                'platform_encoded': platform_encoded,
                'category_encoded': category_encoded,
                'product_encoded': product_encoded
            }
            
            return features
            
        except Exception as e:
            raise ValueError(f"Error preparing features: {str(e)}")
    
    def predict_price(self, product_name, location, platform, quantity, date):
        """Predict price for a single product"""
        features = self.prepare_features(product_name, location, platform, quantity, date)
        
        # Ensure features are in the correct order
        features_ordered = [features[col] for col in self.feature_columns]
        
        prediction = self.model.predict([features_ordered])
        return prediction[0]
    
    def predict_prices_batch(self, predictions_list):
        """Predict prices for multiple products"""
        results = []
        
        for pred in predictions_list:
            try:
                predicted_price = self.predict_price(
                    pred['product_name'],
                    pred['location'],
                    pred['platform'],
                    pred['quantity'],
                    pred['date']
                )
                
                result = {
                    'product_name': pred['product_name'],
                    'location': pred['location'],
                    'platform': pred['platform'],
                    'quantity': pred['quantity'],
                    'date': pred['date'],
                    'predicted_price': round(predicted_price, 2)
                }
                results.append(result)
                
            except Exception as e:
                error_result = {
                    'product_name': pred['product_name'],
                    'error': str(e)
                }
                results.append(error_result)
        
        return results
    
    def predict_future_prices(self, product_name, location, platform, quantity, days_ahead=7):
        """Predict prices for future dates"""
        predictions = []
        base_date = datetime.now()
        
        for i in range(days_ahead):
            future_date = base_date + timedelta(days=i+1)
            
            try:
                predicted_price = self.predict_price(
                    product_name, location, platform, quantity, future_date
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
                
            except Exception as e:
                error_prediction = {
                    'date': future_date.strftime('%Y-%m-%d'),
                    'error': str(e),
                    'product_name': product_name
                }
                predictions.append(error_prediction)
        
        return predictions
    
    def compare_prices_across_platforms(self, product_name, location, quantity, date):
        """Compare predicted prices across different platforms"""
        platforms = list(self.platform_mapping.keys())
        comparisons = []
        
        for platform in platforms:
            try:
                predicted_price = self.predict_price(
                    product_name, location, platform, quantity, date
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
                
            except Exception as e:
                error_comparison = {
                    'platform': platform,
                    'error': str(e),
                    'product_name': product_name
                }
                comparisons.append(error_comparison)
        
        return comparisons
    
    def compare_prices_across_locations(self, product_name, platform, quantity, date):
        """Compare predicted prices across different locations"""
        locations = list(self.location_mapping.keys())
        comparisons = []
        
        for location in locations:
            try:
                predicted_price = self.predict_price(
                    product_name, location, platform, quantity, date
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
                
            except Exception as e:
                error_comparison = {
                    'location': location,
                    'error': str(e),
                    'product_name': product_name
                }
                comparisons.append(error_comparison)
        
        return comparisons

def main():
    """Example usage of the price predictor"""
    # Initialize predictor
    predictor = PricePredictor()
    
    print("🔮 Tanzania E-commerce Price Predictor")
    print("=" * 50)
    
    # Example 1: Single prediction
    print("\n1. Single Price Prediction:")
    predicted_price = predictor.predict_price(
        product_name="Rice 5kg",
        location="Dar es Salaam",
        platform="Jumia",
        quantity=5,
        date="2026-01-15"
    )
    print(f"Predicted price for Rice 5kg in Dar es Salaam: TZS {predicted_price:.2f}")
    
    # Example 2: Future predictions
    print("\n2. Future Price Predictions (7 days):")
    future_predictions = predictor.predict_future_prices(
        product_name="Rice 5kg",
        location="Dar es Salaam",
        platform="Jumia",
        quantity=5,
        days_ahead=7
    )
    
    for pred in future_predictions[:3]:  # Show first 3 predictions
        print(f"{pred['date']}: TZS {pred['predicted_price']:.2f}")
    
    # Example 3: Platform comparison
    print("\n3. Platform Price Comparison:")
    platform_comparison = predictor.compare_prices_across_platforms(
        product_name="Rice 5kg",
        location="Dar es Salaam",
        quantity=5,
        date="2026-01-15"
    )
    
    for comp in platform_comparison:
        if 'predicted_price' in comp:
            print(f"{comp['platform']}: TZS {comp['predicted_price']:.2f}")
    
    # Example 4: Location comparison
    print("\n4. Location Price Comparison:")
    location_comparison = predictor.compare_prices_across_locations(
        product_name="Rice 5kg",
        platform="Jumia",
        quantity=5,
        date="2026-01-15"
    )
    
    for comp in location_comparison:
        if 'predicted_price' in comp:
            print(f"{comp['location']}: TZS {comp['predicted_price']:.2f}")
    
    # Example 5: Batch predictions
    print("\n5. Batch Predictions:")
    batch_predictions = [
        {
            'product_name': 'Rice 5kg',
            'location': 'Dar es Salaam',
            'platform': 'Jumia',
            'quantity': 5,
            'date': '2026-01-15'
        },
        {
            'product_name': 'Cooking Oil 1L',
            'location': 'Dodoma',
            'platform': 'ZoomTanzania',
            'quantity': 1,
            'date': '2026-01-15'
        }
    ]
    
    results = predictor.predict_prices_batch(batch_predictions)
    for result in results:
        if 'predicted_price' in result:
            print(f"{result['product_name']}: TZS {result['predicted_price']:.2f}")

if __name__ == "__main__":
    main()
