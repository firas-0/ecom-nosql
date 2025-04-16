from cassandra.cluster import Cluster
from cassandra.query import SimpleStatement
import uuid
from datetime import datetime, timedelta
import random

# Connect to the Cassandra cluster
cluster = Cluster(['localhost'])  # Use the IP address of your Cassandra container if it's not localhost
session = cluster.connect('ecommerce')  # Connect to the 'ecommerce' keyspace

# Prepare an insert statement
insert_query = """
    INSERT INTO products (
        id, availability_status, brand, category, color, created_at, description, dimensions, discount,
        image_url, last_updated, manufacturer, material, name, origin_country, price, product_code, ratings,
        release_date, reviews_count, stock_quantity, supplier, updated_at, warranty_period, weight
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
"""

# Function to generate random data for the product
def generate_random_product():
    availability_status = random.choice(['Available', 'Out of Stock', 'Pre-order'])
    brand = random.choice(['BrandX', 'BrandY', 'BrandZ'])
    category = random.choice(['Electronics', 'Clothing', 'Home Appliances', 'Books'])
    color = random.choice(['Red', 'Black', 'White', 'Blue', 'Green'])
    description = 'A high-quality product.'
    dimensions = f'{random.randint(10, 50)}x{random.randint(10, 50)}x{random.randint(10, 50)} cm'
    discount = round(random.uniform(0, 20), 2)
    image_url = f'http://example.com/{uuid.uuid4()}.jpg'
    manufacturer = random.choice(['BrandX Inc.', 'BrandY Ltd.', 'BrandZ Co.'])
    material = random.choice(['Plastic', 'Metal', 'Wood', 'Glass'])
    name = f'Product-{uuid.uuid4().hex[:6]}'
    origin_country = random.choice(['USA', 'China', 'Germany', 'India', 'Japan'])
    price = round(random.uniform(10, 500), 2)
    product_code = f'PC-{uuid.uuid4().hex[:6]}'
    ratings = random.randint(1, 5)
    release_date = (datetime.now() - timedelta(days=random.randint(0, 365))).date()
    reviews_count = random.randint(0, 1000)
    stock_quantity = random.randint(0, 100)
    supplier = random.choice(['SupplierX', 'SupplierY', 'SupplierZ'])
    updated_at = datetime.now()
    warranty_period = random.randint(6, 24)  # in months
    weight = round(random.uniform(0.1, 5.0), 2)  # in kg

    # Returning the product data with a newly generated UUID as the 'id'
    return (
        uuid.uuid4(),  # Generating a new UUID for 'id'
        availability_status, 
        brand, 
        category, 
        color, 
        datetime.now(), 
        description, 
        dimensions, 
        discount,
        image_url, 
        datetime.now(), 
        manufacturer, 
        material, 
        name, 
        origin_country, 
        price, 
        product_code, 
        ratings,
        release_date, 
        reviews_count, 
        stock_quantity, 
        supplier, 
        datetime.now(), 
        warranty_period, 
        weight
    )

# Prepare the statement for execution
prepared_statement = session.prepare(insert_query)

# Insert a large number of products (e.g., 1000 products)
for _ in range(1000):  # You can change the range to any large number for more records
    product_data = generate_random_product()
    session.execute(prepared_statement, product_data)

print("Inserted 1000 products into the 'products' table successfully!")

# Close the session and cluster connection
session.shutdown()
cluster.shutdown()

