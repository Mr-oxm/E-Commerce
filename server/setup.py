import os

# Define the directory structure
structure = {
    "config": ["db.js"],
    "controllers": [
        "authController.js", "buyerController.js", "sellerController.js",
        "productController.js", "orderController.js", "searchController.js"
    ],
    "models": ["User.js", "Product.js", "Order.js", "Review.js"],
    "routes": [
        "authRoutes.js", "buyerRoutes.js", "sellerRoutes.js",
        "productRoutes.js", "orderRoutes.js", "searchRoutes.js"
    ],
    "middleware": ["auth.js", "errorHandler.js"],
    "utils": ["emailService.js", "validators.js"],
    ".": ["app.js", "server.js"]  # The root directory for app.js and server.js
}

# Function to create files and directories
def create_structure(base_dir=""):
    for folder, files in structure.items():
        folder_path = os.path.join(base_dir, folder)
        if folder != ".":  # Skip the root directory
            os.makedirs(folder_path, exist_ok=True)
        for file in files:
            file_path = os.path.join(base_dir if folder == "." else folder_path, file)
            with open(file_path, 'w') as f:
                pass  # Create an empty file

# Run the function
create_structure()
print("Project structure created!")
