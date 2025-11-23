#  Food Wastage Reduction Platform API Documentation

Welcome to the comprehensive API documentation for the Food Wastage Reduction Platform. This guide details all available endpoints for user management, inventory tracking, logging food usage, and accessing resources.

---

##  1. Authentication & User Module (`/auth`, `/users`)

All endpoints marked with **🔐** require a **JWT (JSON Web Token)**. Pass it in the request header: `Authorization: Bearer <TOKEN>`.

### Authentication Endpoints

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/auth/register` | `POST` | Create a new user account. | Public |
| **2** | `/auth/login` | `POST` | Authenticate and receive a JWT. | Public |

#### 1. Register User
* **URL:** `POST http://localhost:3000/auth/register`
* **Body (JSON):**
    ```json
    {
      "name": "Arif Hasan",
      "email": "arif@example.com",
      "password": "123456",
      "location": "Dhaka",
      "dietaryPreference": "general"
    }
    ```
* **Response (201 Created):** `{"message": "User registered successfully"}`

#### 2. Login User
* **URL:** `POST http://localhost:3000/auth/login`
* **Body (JSON):**
    ```json
    {
      "email": "arif@example.com",
      "password": "123456"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "token": "JWT_TOKEN_HERE",
      "user": {
        "_id": "...",
        "name": "Arif Hasan",
        "email": "arif@example.com",
        "location": "Dhaka",
        "dietaryPreference": "general",
        "householdSize": 1
        // ... other user details
      }
    }
    ```

### User Profile Endpoints

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **3** | `/users/profile` | `GET` | Retrieve the logged-in user's profile. | 🔐 Private |
| **4** | `/users/profile` | `PATCH` | Update specific user profile details. | 🔐 Private |

#### 4. Update Profile
* **URL:** `PATCH http://localhost:3000/users/profile`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body (JSON) - *Include only fields to update*:**
    ```json
    {
      "name": "Md Arif",
      "location": "Chittagong",
      "dietaryPreference": "veg",
      "householdSize": 4
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "_id": "65f12c....",
      "name": "Md Arif",
      "location": "Chittagong",
      "dietaryPreference": "veg",
      "householdSize": 4
    }
    ```

---

## 🛒 2. Food Item Module (`/food-items`)

This module manages the global list of food items available for inventory tracking.

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/food-items` | `GET` | Get all food items. | Public |
| **2** | `/food-items/category` | `GET` | Filter food items by category name. | Public |
| **3** | `/food-items/:id` | `GET` | Get a single food item by ID. | Public |
| **4** | `/food-items` | `POST` | Create a new food item manually. | Public |

#### 2. Filter by Category
* **URL:** `GET http://localhost:3000/food-items/category?name=vegetable`

#### 4. Create Manually
* **URL:** `POST http://localhost:3000/food-items`
* **Body (JSON):**
    ```json
    {
      "name": "Orange",
      "category": "fruit",
      "expirationDays": 7,
      "costPerUnit": 15
    }
    ```

---

## 📝 3. Food Log Module (`/food-log`)

This module tracks historical records of food consumption or disposal (food loss/wastage events).

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/food-log` | `POST` | Create a new food log entry. | 🔐 Private |
| **2** | `/food-log` | `GET` | Get all food logs for the current user. | 🔐 Private |
| **3** | `/food-log/:id` | `DELETE` | Delete a single food log entry by ID. | 🔐 Private |

#### 1. Create Food Log
* **URL:** `POST http://localhost:3000/food-log`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body (JSON):**
    ```json
    {
      "itemName": "Milk",
      "category": "dairy",
      "quantity": 2
    }
    ```
* **Response (201 Created) Example:**
    ```json
    {
      "_id": "67a0f7ac120d9e23a51f...",
      "itemName": "Milk",
      "category": "dairy",
      "quantity": 2
      // ... other fields
    }
    ```

---

## 📦 4. Inventory Module (`/inventory`)

This module manages the user's current stock of food items and their expiry dates.

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/inventory` | `POST` | Add a new item to inventory. | 🔐 Private |
| **2** | `/inventory` | `GET` | Get all inventory items for the user. | 🔐 Private |
| **3** | `/inventory/:id` | `DELETE` | Delete a specific inventory item by ID. | 🔐 Private |

#### 1. Add Inventory Item
* **URL:** `POST http://localhost:3000/inventory`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body (JSON):**
    > 📌 **Note:** The `item` field must be the **ID of a seeded Food Item** from the `/food-items` module.
    ```json
    {
      "item": "676f91dfbcf7ad56c9484e21", 
      "quantity": 3,
      "expiryDate": "2025-12-31"
    }
    ```

#### 2. Get User Inventory (with Population)
* **URL:** `GET http://localhost:3000/inventory`
* **Response Example (200 OK) - *Note the populated 'item' object*:**
    ```json
    [
      {
        "_id": "67a10d6a1a32a012345",
        "quantity": 3,
        "expiryDate": "2025-12-31T00:00:00.000Z",
        "item": {
          "_id": "676f91dfbcf7ad56c9484e21",
          "name": "Rice",
          "category": "grain",
          "expirationDays": 180,
          "costPerUnit": 50
        }
      }
    ]
    ```

#### 3. Delete Inventory Item
* **URL:** `DELETE http://localhost:3000/inventory/67a10d6a1a32a012345`
* **Response (200 OK):** `{"message": "Inventory item removed"}`

---

## 📚 5. Resources Module (`/resources`)

This module provides helpful content for reducing food waste.

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/resources` | `POST` | Create a new resource. | Public |
| **2** | `/resources` | `GET` | Get all resources. | Public |
| **3** | `/resources/category` | `GET` | Filter resources by category. | Public |
| **4** | `/resources/seed` | `POST` | Seed initial resource data. | Public |

#### 1. Create Resource
* **URL:** `POST http://localhost:3000/resources`
* **Body (JSON):**
    ```json
    {
      "title": "Test Resource",
      "description": "Testing resource create",
      "url": "[https://test.com](https://test.com)",
      "category": "storage",
      "type": "article"
    }
    ```

#### 3. Get Resources by Category
* **URL:** `GET http://localhost:3000/resources/category?name=nutrition`

---

## 🖼️ 6. Upload Module (`/uploads`)

This module handles the uploading and retrieval of user receipts.

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/uploads/receipt` | `POST` | Upload a new receipt file. | 🔐 Private |
| **2** | `/uploads/receipt` | `GET` | Get all uploaded receipts for the user. | 🔐 Private |

#### 1. Upload Receipt (JWT Protected)
* **URL:** `POST http://localhost:3000/uploads/receipt`
* **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Body:** `form-data` with key `file` of type `File`.

#### 2. Get My Receipts (JWT Protected)
* **URL:** `GET http://localhost:3000/uploads/receipt`
* **Response Example (200 OK):**
    ```json
    {
      "message": "My receipts fetched",
      "count": 2,
      "data": [ 
        // Array of receipt objects
      ]
    }
    ```

---

## 📊 7. Dashboard Module (`/dashboard`)

This module provides a summary view of user, inventory, and activity data.

| # | Endpoint | Method | Description | Access |
| :---: | :--- | :--- | :--- | :---: |
| **1** | `/dashboard` | `GET` | Retrieve aggregated dashboard statistics. | 🔐 Private |

#### 1. GET Dashboard
* **URL:** `GET http://localhost:3000/dashboard`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response Example (200 OK):**
    ```json
    {
      "profile": {
          "_id": "691e015384b8844cbb042274",
          "name": "Md Arif",
          "email": "a@gmail.com",
          "location": "Chittagong",
          "dietaryPreference": "non-veg",
          "householdSize": 4,
          "updatedAt": "2025-11-20T09:32:42.176Z"
      },
      "inventorySummary": {
          "totalItems": 1,
          "expiringSoon": 0 
      },
      "recentLogs": [
          {
              "_id": "691e1920e2607d021e9c669b",
              "itemName": "Banana",
              "category": "fruit",
              "quantity": 2,
              "createdAt": "2025-11-19T19:23:12.458Z"
          }
      ],
      "recommendedResources": []
    }
    ```