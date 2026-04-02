import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from datetime import datetime
import json
import os

class JumiaScraper:
    def __init__(self):
        self.base_url = "https://www.jumia.co.tz"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
    def get_page(self, url, retries=3):
        """Get page content with retries"""
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                if attempt < retries - 1:
                    time.sleep(random.uniform(2, 5))
                else:
                    raise
    
    def search_products(self, query, page=1):
        """Search for products on Jumia"""
        search_url = f"{self.base_url}/catalog/?q={query.replace(' ', '+')}&page={page}"
        
        try:
            response = self.get_page(search_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = []
            product_cards = soup.find_all('article', class_='prd _fb col c-prd')
            
            for card in product_cards:
                try:
                    product = self.extract_product_info(card)
                    if product:
                        products.append(product)
                except Exception as e:
                    print(f"Error extracting product: {e}")
                    continue
            
            return products
            
        except Exception as e:
            print(f"Error searching products: {e}")
            return []
    
    def extract_product_info(self, product_card):
        """Extract product information from a product card"""
        try:
            # Product name
            name_elem = product_card.find('h3', class_='name')
            name = name_elem.text.strip() if name_elem else "Unknown"
            
            # Price
            price_elem = product_card.find('div', class_='prc')
            price_text = price_elem.text.strip() if price_elem else "0"
            
            # Clean price text and convert to number
            price = self.clean_price(price_text)
            
            # Product URL
            link_elem = product_card.find('a', class_='core')
            product_url = link_elem.get('href') if link_elem else ""
            if product_url and not product_url.startswith('http'):
                product_url = self.base_url + product_url
            
            # Image URL
            img_elem = product_card.find('img')
            image_url = img_elem.get('data-src') or img_elem.get('src') if img_elem else ""
            
            # Discount percentage
            discount_elem = product_card.find('div', class_='bdg _dsct _sm')
            discount = discount_elem.text.strip() if discount_elem else "0%"
            
            # Rating
            rating_elem = product_card.find('div', class_='stars')
            rating = rating_elem.text.strip() if rating_elem else "0"
            
            # Reviews count
            reviews_elem = product_card.find('div', class_='rev')
            reviews = reviews_elem.text.strip() if reviews_elem else "0"
            
            # Seller information (if available)
            seller_elem = product_card.find('div', class_='s-h')
            seller = seller_elem.text.strip() if seller_elem else "Jumia"
            
            product = {
                'product_name': name,
                'price': price,
                'original_price': price,  # Will be updated if discount info is available
                'discount': discount,
                'rating': rating,
                'reviews_count': reviews,
                'seller': seller,
                'product_url': product_url,
                'image_url': image_url,
                'platform': 'Jumia',
                'location': 'Dar es Salaam',  # Default location
                'category': self.extract_category(name),
                'date': datetime.now().strftime('%Y-%m-%d'),
                'quantity': self.extract_quantity(name),
                'unit': self.extract_unit(name)
            }
            
            return product
            
        except Exception as e:
            print(f"Error extracting product info: {e}")
            return None
    
    def clean_price(self, price_text):
        """Clean price text and convert to integer"""
        try:
            # Remove currency symbols, commas, and whitespace
            cleaned = price_text.replace('TSh', '').replace('TZS', '').replace(',', '').strip()
            # Remove any remaining non-numeric characters except for decimal point
            cleaned = ''.join(c for c in cleaned if c.isdigit() or c == '.')
            
            if cleaned:
                return int(float(cleaned))
            else:
                return 0
        except:
            return 0
    
    def extract_category(self, product_name):
        """Extract category from product name"""
        name_lower = product_name.lower()
        
        if any(keyword in name_lower for keyword in ['rice', 'food', 'cooking', 'oil', 'sugar', 'salt', 'flour', 'maize']):
            return 'Food'
        elif any(keyword in name_lower for keyword in ['phone', 'laptop', 'computer', 'tablet']):
            return 'Electronics'
        elif any(keyword in name_lower for keyword in ['shirt', 'dress', 'shoes', 'clothing']):
            return 'Fashion'
        elif any(keyword in name_lower for keyword in ['soap', 'cream', 'lotion', 'shampoo']):
            return 'Beauty'
        else:
            return 'General'
    
    def extract_quantity(self, product_name):
        """Extract quantity from product name"""
        import re
        
        # Look for numbers followed by unit indicators
        patterns = [
            r'(\d+)\s*(?:kg|kg\.|kilogram|kilograms)',
            r'(\d+)\s*(?:l|l\.|liter|liters)',
            r'(\d+)\s*(?:pcs|pc|pieces)',
            r'(\d+)\s*(?:g|g\.|gram|grams)',
            r'(\d+)\s*(?:ml|ml\.|milliliter|milliliters)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, product_name.lower())
            if match:
                return int(match.group(1))
        
        return 1  # Default quantity
    
    def extract_unit(self, product_name):
        """Extract unit from product name"""
        name_lower = product_name.lower()
        
        if 'kg' in name_lower or 'kilogram' in name_lower:
            return 'kg'
        elif 'l' in name_lower or 'liter' in name_lower:
            return 'l'
        elif 'g' in name_lower or 'gram' in name_lower:
            return 'g'
        elif 'ml' in name_lower or 'milliliter' in name_lower:
            return 'ml'
        elif 'pcs' in name_lower or 'pieces' in name_lower:
            return 'pcs'
        else:
            return 'unit'
    
    def scrape_category(self, category_url, max_pages=5):
        """Scrape all products from a category page"""
        all_products = []
        
        for page in range(1, max_pages + 1):
            print(f"Scraping page {page} of {category_url}")
            
            if page == 1:
                url = category_url
            else:
                url = f"{category_url}?page={page}"
            
            try:
                response = self.get_page(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                product_cards = soup.find_all('article', class_='prd _fb col c-prd')
                
                if not product_cards:
                    print(f"No products found on page {page}")
                    break
                
                for card in product_cards:
                    try:
                        product = self.extract_product_info(card)
                        if product:
                            all_products.append(product)
                    except Exception as e:
                        print(f"Error extracting product: {e}")
                        continue
                
                # Random delay to avoid being blocked
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {e}")
                continue
        
        return all_products
    
    def save_to_csv(self, products, filename=None):
        """Save products to CSV file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"../data/raw/jumia_products_{timestamp}.csv"
        
        df = pd.DataFrame(products)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        df.to_csv(filename, index=False)
        print(f"Saved {len(products)} products to {filename}")
        return filename
    
    def save_to_json(self, products, filename=None):
        """Save products to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"../data/raw/jumia_products_{timestamp}.json"
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"Saved {len(products)} products to {filename}")
        return filename

def main():
    """Main function to demonstrate scraping"""
    scraper = JumiaScraper()
    
    print("🛍️ Jumia Tanzania Scraper")
    print("=" * 40)
    
    # Example searches for common Tanzanian products
    search_queries = [
        "rice",
        "cooking oil",
        "sugar",
        "maize flour",
        "salt"
    ]
    
    all_products = []
    
    for query in search_queries:
        print(f"\n🔍 Searching for: {query}")
        
        try:
            products = scraper.search_products(query, page=1)
            print(f"Found {len(products)} products")
            
            all_products.extend(products)
            
            # Add delay between searches
            time.sleep(random.uniform(3, 6))
            
        except Exception as e:
            print(f"Error searching for {query}: {e}")
            continue
    
    # Save results
    if all_products:
        csv_file = scraper.save_to_csv(all_products)
        json_file = scraper.save_to_json(all_products)
        
        print(f"\n✅ Scraping completed!")
        print(f"Total products scraped: {len(all_products)}")
        print(f"CSV saved to: {csv_file}")
        print(f"JSON saved to: {json_file}")
        
        # Display sample products
        print(f"\n📋 Sample Products:")
        for i, product in enumerate(all_products[:5]):
            print(f"{i+1}. {product['product_name']} - TZS {product['price']}")
    else:
        print("❌ No products were scraped")

if __name__ == "__main__":
    main()
