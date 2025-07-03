# Ecommerce API (Express.js + TypeScript)

A robust, production-ready RESTful API for ecommerce platforms, built with Express.js and TypeScript.  
It features secure authentication, user management, product/catalog management, order processing, and more.

---

> **Note:** This project needs to be thoroughly tested. After learning more about testing, I will add comprehensive tests for all modules and flows.

---

## Features

### Authentication & User Management

- **JWT-based authentication** with secure password hashing (bcrypt).
- **Email verification** on registration (with code, expiry, and resend logic).
- **Password reset** flow (request, verify code, reset, resend code).
- **Account deletion** with multi-factor verification (code, email, password required).
- **Rate limiting** on all sensitive endpoints to prevent brute-force attacks.
- **Automatic cleanup** of unverified users (TTL index).
- **Role-based access control** (admin/user) for protected routes.
- **Profile management**: update profile, change password, view orders, manage addresses and wishlist.

### Catalog & Order Management

- **Products, Categories, Brands, Subcategories**: CRUD operations, image upload, filtering, sorting, pagination.
- **Cart**: Add, update, remove items, clear cart, apply coupons.
- **Orders**: Place orders (cash/card), view order history, admin order management.
- **Coupons**: Admin can create/manage coupons, users can apply them to carts.
- **Reviews**: Users can review products (one review per product), update/delete their reviews.

### Security

- **Helmet** for HTTP headers, **mongo-sanitize** and **hpp** for injection protection.
- **Sensitive fields** (passwords, codes) are never exposed in API responses.
- **All user input validated and sanitized** (express-validator).
- **Session invalidation** after password change.
- **NoSQL injection and HTTP parameter pollution protection**.
- **CORS** and **compression** enabled.

### Developer Experience

- **TypeScript** throughout for type safety.
- **Modular structure**: clear separation of concerns (modules for User, Product, Order, etc.).
- **Comprehensive validation** for all endpoints.
- **Seeder scripts** for test data.
- **Jest** for testing (with example tests for categories, etc.).
- **Environment variable support** via dotenv.

---

## API Endpoints (Highlights)

### Auth

- `POST /api/auth/register` — Register new user (email verification required)
- `POST /api/auth/login` — Login
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/verify-reset-code` — Verify password reset code
- `PUT /api/auth/reset-password` — Reset password
- `POST /api/auth/verify-email` — Verify email with code
- `POST /api/auth/resend-email-verification-code` — Resend email verification code
- `POST /api/auth/resend-password-reset-code` — Resend password reset code

### User

- `POST /api/users/send-delete-account-code` — Request code for account deletion
- `DELETE /api/users/delete-account` — Delete account (requires code, email, password)
- `PATCH /api/users/change-password` — Change password
- `PUT /api/users/update` — Update profile
- `GET /api/users/profile` — Get profile
- `GET /api/users/orders` — Get user orders
- `POST/DELETE/GET /api/users/wishlist` — Manage wishlist
- `GET/POST/DELETE /api/users/addresses` — Manage addresses

### Catalog

- `GET/POST/PUT/DELETE /api/products` — Product management (admin/user)
- `GET/POST/PUT/DELETE /api/categories` — Category management (admin/user)
- `GET/POST/PUT/DELETE /api/brands` — Brand management (admin/user)
- `GET/POST/PUT/DELETE /api/sub-categories` — Subcategory management (admin/user)
- `GET/POST/PUT/DELETE /api/reviews` — Product reviews

### Cart & Orders

- `GET/POST/PUT/DELETE /api/users/cart` — Cart management
- `POST /api/order/cod` — Place cash order
- `POST /api/order/checkout-session` — Stripe checkout
- `PATCH /api/order/:id/pay` — Mark order as paid (admin)
- `PATCH /api/order/:id/deliver` — Mark order as delivered (admin)

### Coupons

- `GET/POST/PUT/DELETE /api/coupons` — Coupon management (admin)

---

## Security & Best Practices

- **All sensitive actions require authentication and, where needed, code verification.**
- **No sensitive data is ever leaked in responses.**
- **All user input is validated and sanitized.**
- **Rate limiting and brute-force protection on all auth endpoints.**
- **Automatic cleanup of unverified users.**
- **Admin-only endpoints are protected by role checks.**

---

## What I Learned

- How to build a secure, modular REST API with Express.js and TypeScript.
- Implementing robust authentication and authorization flows.
- Best practices for user data protection and input validation.
- How to structure a scalable codebase for real-world ecommerce.
- The importance of rate limiting, error handling, and security middleware.
- How to write maintainable, testable code with clear separation of concerns.

---

## Getting Started

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Set up your `.env` file** (see `.env.example`)
4. **Seed the database**: `npm run seed`
5. **Start the server**: `npm run dev`
6. **Run tests**: `npm test`

---

## Environment Variables & .env Setup

This project uses environment variables for configuration. **Never commit your real `.env` file to version control.**

1. Copy `.env.example` to `.env`:

   ```sh
   cp .env.example .env
   ```

   (On Windows, you can use `copy .env.example .env` in PowerShell or Command Prompt.)

2. Fill in the required values in your `.env` file:

   - Database connection string and name
   - JWT secret key (use a strong, unique value)
   - Email credentials (for sending verification and reset emails)
   - Stripe keys (for payment processing)
   - Any other configuration as needed

3. The app will automatically load variables from `.env` at startup.

**See `.env.example` for all required variables and descriptions.**

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes.

---

## License

MIT

---

Let me know if you want to add usage examples, diagrams, or more details!
