# Coupon Management API

A Node.js/Express backend API for managing and recommending coupons based on user eligibility and cart details. The API intelligently filters and selects the best applicable coupon for users with support for multiple discount types, geographic restrictions, and category-based eligibility.

## Live Demo

The project is deployed on Vercel and accessible at:
**https://coupon-intern.vercel.app/**

## Features

- **Authentication**: Demo login endpoint with predefined credentials
- **Best Coupon Recommendation**: Intelligent algorithm that filters eligible coupons and recommends the best one based on discount value and expiration date
- **Coupon Management**: Create and manage coupons with configurable parameters
- **Eligibility Filtering**: 
  - Date-based validity checks
  - Per-user usage limits
  - Geographic restrictions (country-based)
  - Category-based inclusion/exclusion
  - Cart value constraints
- **Discount Calculation**: Supports both flat and percentage-based discounts with caps

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel
- **Package Manager**: npm

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database connection (Supabase recommended)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The `.env` file is provided in the repository with the database configuration. The database is pre-configured to connect to the existing PostgreSQL instance. No additional setup is required—just install dependencies and run.

### 4. Database

The database is pre-configured and ready to use. If you need to set up a fresh database, ensure your PostgreSQL database has a `coupons` table with the following schema:

```sql
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discountType VARCHAR(20) NOT NULL, -- 'FLAT' or 'PERCENT'
  maxDiscountAmount DECIMAL(10, 2) NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  usageLimitPerUser INT NOT NULL,
  allowedcountries TEXT[], -- Array of country codes
  applicablecategories TEXT[], -- Array of categories
  excludedcategories TEXT[], -- Array of categories
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running Locally

### Start the Server

```bash
npm start
```

Or use Node directly:

```bash
node server.js
```

The server will start on **http://localhost:3001**

### Development Mode

For development with auto-reload, you can use `nodemon`:

```bash
npm install --save-dev nodemon
npx nodemon server.js
```

## API Endpoints

### 1. Login (Demo)

**Endpoint**: `POST /login`

**Description**: Demo login endpoint with predefined credentials.

**Request Body**:
```json
{
  "email": "hire-me@anshumat.org",
  "password": "HireMe@2025!"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "userId": "u_demo",
    "email": "hire-me@anshumat.org",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 1200,
    "ordersPlaced": 2
  }
}
```

---

### 2. Get Best Coupon

**Endpoint**: `GET /bestcoupon`

**Description**: Recommends the best eligible coupon for a user's cart based on eligibility criteria and maximum discount value.

**Request Body**:
```json
{
  "user": {
    "userId": "u_demo",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 1200,
    "ordersPlaced": 2
  },
  "cart": {
    "items": [
      {
        "productId": "prod_123",
        "category": "electronics",
        "unitPrice": 100,
        "quantity": 2
      },
      {
        "productId": "prod_456",
        "category": "clothing",
        "unitPrice": 50,
        "quantity": 1
      }
    ]
  }
}
```

**Response**:
```json
{
  "success": true,
  "bestCoupon": {
    "id": 1,
    "code": "SAVE20",
    "discountType": "PERCENT",
    "maxDiscountAmount": 100,
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "usageLimitPerUser": 5,
    "allowedcountries": ["IN", "US"],
    "applicablecategories": ["electronics"],
    "excludedcategories": [],
    "discount": 50
  }
}
```

---

### 3. Create Coupon

**Endpoint**: `POST /createcoupon`

**Description**: Creates a new coupon in the database.

**Request Body**:
```json
{
  "code": "SUMMER25",
  "discountType": "PERCENT",
  "maxDiscountAmount": 500,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "usageLimitPerUser": 3,
  "allowedcountries": ["IN", "US", "UK"],
  "applicablecategories": ["electronics", "fashion"],
  "excludedcategories": ["luxury"]
}
```

---

## Project Structure

```
project/
├── api/
│   └── index.js              # Express app setup and middleware configuration
├── controller/
│   ├── login.js              # Demo login controller
│   ├── bestcoupon.js         # Best coupon recommendation logic
│   └── createcoupon.js       # Coupon creation logic
├── database/
│   └── database.js           # PostgreSQL pool configuration
├── router/
│   ├── loginrouter.js        # Login route
│   ├── bestcouponrouter.js   # Best coupon route
│   └── createcouponrouter.js # Create coupon route
├── server.js                 # Entry point, starts Express server
├── vercel.json               # Vercel deployment configuration
├── package.json              # Dependencies and project metadata
└── README.md                 # This file
```

## Deployment on Vercel

The project is already configured for Vercel deployment using `vercel.json`.

### Deploy Steps

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel at https://vercel.com
3. Set environment variables in Vercel dashboard:
   - `DB_USER`
   - `DB_HOST`
   - `DB_NAME`
   - `DB_PASSWORD`
   - `DB_PORT`
4. Vercel will automatically deploy on every push to main branch

### View Deployed Project

Access the live deployment at: **https://coupon-intern.vercel.app/**

## Testing the API

Use any API testing tool (Postman, Insomnia, cURL, etc.) or VS Code's REST Client extension.

### Example cURL Commands

**Login**:
```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hire-me@anshumat.org","password":"HireMe@2025!"}'
```

**Get Best Coupon**:
```bash
curl -X GET http://localhost:3001/bestcoupon \
  -H "Content-Type: application/json" \
  -d '{"user":{"userId":"u_demo","userTier":"NEW","country":"IN","lifetimeSpend":1200,"ordersPlaced":2},"cart":{"items":[{"productId":"prod_123","category":"electronics","unitPrice":100,"quantity":2}]}}'
```

**Create Coupon**:
```bash
curl -X POST http://localhost:3001/createcoupon \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","discountType":"FLAT","maxDiscountAmount":500,"startDate":"2025-01-01T00:00:00Z","endDate":"2025-12-31T23:59:59Z","usageLimitPerUser":5,"allowedcountries":["IN"],"applicablecategories":["electronics"],"excludedcategories":[]}'
```

## Important Security Notes

⚠️ **Never commit database credentials to version control.** Currently, the database credentials are hardcoded in `database/database.js`. Before deploying to production:

1. Move credentials to environment variables
2. Use `.env` file locally (add to `.gitignore`)
3. Configure secrets in your deployment platform (Vercel, etc.)
4. Rotate credentials after exposure

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3001 already in use | Change port in `server.js` or kill process using `lsof -i :3001` |
| Database connection failed | Verify PostgreSQL is running and credentials in `database/database.js` are correct |
| CORS errors | CORS is enabled in `api/index.js`, check if origin is allowed |
| Module not found errors | Run `npm install` to install dependencies |

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
