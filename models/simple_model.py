import json
import pickle
from datetime import datetime

# Create a simple mock model for demonstration
class SimplePriceModel:
    def __init__(self):
        self.trained = False
        
    def train(self):
        # Create a simple mock model
        self.model_data = {
            'base_prices': {
                'Rice 5kg': 12000,
                'Cooking Oil 1L': 8500,
                'Sugar 2kg': 6500,
                'Maize Flour 2kg': 4800,
                'Salt 1kg': 2500
            },
            'location_multipliers': {
                'Dar es Salaam': 1.0,
                'Dodoma': 1.08,
                'Mwanza': 1.12
            },
            'platform_multipliers': {
                'Jumia': 1.0,
                'ZoomTanzania': 0.98
            }
        }
        self.trained = True
        print("Simple model trained successfully!")
        
    def predict(self, product_name, location, platform, quantity=1):
        if not self.trained:
            self.train()
            
        base_price = self.model_data['base_prices'].get(product_name, 5000)
        location_mult = self.model_data['location_multipliers'].get(location, 1.0)
        platform_mult = self.model_data['platform_multipliers'].get(platform, 1.0)
        
        predicted_price = base_price * location_mult * platform_mult * quantity
        
        # Add some randomness for realism
        import random
        predicted_price *= (0.95 + random.random() * 0.1)
        
        return round(predicted_price, 2)
    
    def save(self, filepath):
        model_info = {
            'model': self,
            'feature_columns': ['quantity', 'location', 'platform', 'product'],
            'target_column': 'price'
        }
        with open(filepath, 'wb') as f:
            pickle.dump(model_info, f)
        print(f"Model saved to {filepath}")

# Train and save the model
if __name__ == "__main__":
    model = SimplePriceModel()
    model.train()
    model.save('price_prediction_model.pkl')
    
    # Test prediction
    test_price = model.predict('Rice 5kg', 'Dar es Salaam', 'Jumia', 1)
    print(f"Test prediction: TZS {test_price}")
