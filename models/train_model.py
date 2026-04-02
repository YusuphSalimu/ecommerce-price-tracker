import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns

class PricePredictionModel:
    def __init__(self):
        self.model = None
        self.feature_columns = []
        self.target_column = 'price'
        
    def load_data(self, file_path):
        """Load and preprocess the price data"""
        df = pd.read_csv(file_path)
        
        # Convert date to datetime
        df['date'] = pd.to_datetime(df['date'])
        
        # Extract features from date
        df['day_of_week'] = df['date'].dt.dayofweek
        df['month'] = df['date'].dt.month
        df['day_of_month'] = df['date'].dt.day
        
        # Create numerical encodings for categorical variables
        df['location_encoded'] = df['location'].astype('category').cat.codes
        df['platform_encoded'] = df['platform'].astype('category').cat.codes
        df['category_encoded'] = df['category'].astype('category').cat.codes
        df['product_encoded'] = df['product_name'].astype('category').cat.codes
        
        return df
    
    def prepare_features(self, df):
        """Prepare features for training"""
        feature_columns = [
            'quantity',
            'day_of_week',
            'month',
            'day_of_month',
            'location_encoded',
            'platform_encoded',
            'category_encoded',
            'product_encoded'
        ]
        
        # Ensure all feature columns exist
        for col in feature_columns:
            if col not in df.columns:
                raise ValueError(f"Feature column '{col}' not found in dataframe")
        
        X = df[feature_columns]
        y = df[self.target_column]
        
        self.feature_columns = feature_columns
        return X, y
    
    def train_linear_regression(self, X, y):
        """Train Linear Regression model"""
        self.model = LinearRegression()
        self.model.fit(X, y)
        return self.model
    
    def train_random_forest(self, X, y):
        """Train Random Forest model"""
        self.model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=10
        )
        self.model.fit(X, y)
        return self.model
    
    def evaluate_model(self, X_test, y_test):
        """Evaluate the trained model"""
        predictions = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, predictions)
        mse = mean_squared_error(y_test, predictions)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, predictions)
        
        metrics = {
            'MAE': mae,
            'MSE': mse,
            'RMSE': rmse,
            'R2': r2
        }
        
        return metrics, predictions
    
    def save_model(self, model_path):
        """Save the trained model"""
        joblib.dump({
            'model': self.model,
            'feature_columns': self.feature_columns,
            'target_column': self.target_column
        }, model_path)
        print(f"Model saved to {model_path}")
    
    def load_model(self, model_path):
        """Load a saved model"""
        model_data = joblib.load(model_path)
        self.model = model_data['model']
        self.feature_columns = model_data['feature_columns']
        self.target_column = model_data['target_column']
        print(f"Model loaded from {model_path}")
    
    def predict_price(self, features):
        """Make price predictions"""
        if self.model is None:
            raise ValueError("Model not trained or loaded")
        
        # Ensure features are in the correct order
        features_ordered = [features[col] for col in self.feature_columns]
        
        prediction = self.model.predict([features_ordered])
        return prediction[0]
    
    def plot_feature_importance(self, X):
        """Plot feature importance for Random Forest"""
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            plt.figure(figsize=(10, 6))
            plt.title("Feature Importances")
            plt.bar(range(X.shape[1]), importances[indices])
            plt.xticks(range(X.shape[1]), [X.columns[i] for i in indices], rotation=45)
            plt.tight_layout()
            plt.savefig('models/feature_importance.png')
            plt.show()
    
    def plot_predictions(self, y_test, predictions):
        """Plot actual vs predicted prices"""
        plt.figure(figsize=(10, 6))
        plt.scatter(y_test, predictions, alpha=0.5)
        plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
        plt.xlabel('Actual Price')
        plt.ylabel('Predicted Price')
        plt.title('Actual vs Predicted Prices')
        plt.tight_layout()
        plt.savefig('models/predictions.png')
        plt.show()

def main():
    # Initialize the model
    price_model = PricePredictionModel()
    
    # Load data
    data_path = '../sample_data/sample_prices.csv'
    df = price_model.load_data(data_path)
    
    print("Data loaded successfully!")
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Prepare features
    X, y = price_model.prepare_features(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train Random Forest model
    print("\nTraining Random Forest model...")
    price_model.train_random_forest(X_train, y_train)
    
    # Evaluate model
    metrics, predictions = price_model.evaluate_model(X_test, y_test)
    
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    price_model.plot_feature_importance(X)
    price_model.plot_predictions(y_test, predictions)
    
    # Save model
    model_path = 'models/price_prediction_model.pkl'
    price_model.save_model(model_path)
    
    # Test prediction
    sample_features = {
        'quantity': 5,
        'day_of_week': 0,
        'month': 1,
        'day_of_month': 15,
        'location_encoded': 0,  # Dar es Salaam
        'platform_encoded': 0,  # Jumia
        'category_encoded': 0,  # Food
        'product_encoded': 0    # Rice
    }
    
    predicted_price = price_model.predict_price(sample_features)
    print(f"\nSample prediction: TZS {predicted_price:.2f}")

if __name__ == "__main__":
    main()
