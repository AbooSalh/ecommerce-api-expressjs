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

- **Database**: MongoDB with `mongoose` ODM for data modeling and interaction.
- **Products, Categories, Brands, Subcategories**:
    - Full CRUD operations.
    - Image uploads handled by `multer` with image processing (e.g., resizing, optimization) via `sharp`.
    - SEO-friendly URLs using `slugify`.
    - Advanced features like filtering, sorting, and pagination.
    - Detailed product stock management including sizes and colors.
- **Cart**: Add, update, remove items, clear cart, apply coupons.
- **Orders**:
    - Place orders (cash on delivery or online payment via Stripe).
    - View order history.
    - Admin order management (e.g., update payment/delivery status).
    - Reliable payment processing via Stripe, including a dedicated webhook endpoint (`/api/stripe/webhook-checkout` using `express.raw`) for event handling.
- **Coupons**: Admin can create/manage coupons (with expiry and quantity limits), users can apply them to carts.
- **Reviews**: Users can review products (one review per product per user), update/delete their reviews.

### Security & Performance

- **Helmet** for securing HTTP headers.
- **`express-mongo-sanitize`** to prevent NoSQL injection attacks.
- **`hpp`** (HTTP Parameter Pollution) to protect against parameter pollution attacks.
- **Sensitive fields** (passwords, codes, etc.) are never exposed in API responses.
- **All user input validated and sanitized** using `express-validator`.
- **Session invalidation** after critical actions like password change.
- **CORS (Cross-Origin Resource Sharing)** enabled with configurable origin.
- **`compression`** (e.g., Gzip) for smaller response sizes and faster performance.
- **`express-async-handler`** for cleaner error handling in asynchronous route handlers.

### Developer Experience

- **TypeScript** throughout for robust type safety and improved maintainability in a large codebase.
- **Modular Architecture**:
    - Clear separation of concerns with dedicated modules (User, Product, Order, Category, etc.).
    - Features a `baseController` pattern (see `src/common/controllers/handlers`) providing generic CRUD operations, significantly reducing boilerplate code and accelerating the development of new modules.
- **Comprehensive Validation**: All API endpoints are equipped with thorough input validation using `express-validator`.
- **Code Quality & Consistency**: Enforced using `ESLint` and `typescript-eslint` configurations.
- **Development Workflow**:
    - `nodemon` for automatic server restarts during development, speeding up the feedback loop.
    - Detailed database seeder script (`src/scripts/seeder.ts`) utilizing `@faker-js/faker` to populate the database with realistic and extensive test/development data.
- **Testing**: Unit and integration tests written with `Jest` and `Supertest`.
- **Environment Configuration**: Flexible environment variable support via `dotenv` and `dotenv-expand`.

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

## Core Technologies / Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose (ODM)
- **Authentication:** JWT (JSON Web Tokens), bcrypt
- **File Handling:** Multer (for uploads), Sharp (for image processing)
- **Payment Integration:** Stripe API (including Webhooks)
- **API Security:** Helmet, CORS, HPP, express-mongo-sanitize
- **Validation:** express-validator
- **Testing:** Jest, Supertest
- **Development Tools:** ESLint, Nodemon
- **Other Key Libraries:** `express-async-handler`, `slugify`, `@faker-js/faker`, `nodemailer`

---

## What I Learned

This project was a significant learning experience, covering various aspects of backend development:

- **Building Scalable & Modular REST APIs:**
    - Designing a modular architecture with Express.js, separating concerns into distinct modules (Users, Products, Orders, etc.) for better organization and scalability.
    - Implementing a reusable `baseController` pattern to handle common CRUD operations, promoting DRY principles and speeding up development.
- **Secure Authentication & Authorization:**
    - Implementing JWT-based authentication with `bcrypt` for password hashing.
    - Developing comprehensive user flows: email verification (code-based, with expiry and resend logic), password reset, and secure multi-factor account deletion.
    - Applying role-based access control (admin/user) to protect routes.
    - Utilizing rate limiting on sensitive endpoints to prevent abuse.
- **Data Validation & Sanitization:**
    - Leveraging `express-validator` for robust input validation on all API requests.
    - Protecting against NoSQL injection (`express-mongo-sanitize`) and HTTP Parameter Pollution (`hpp`).
- **Advanced Feature Implementation:**
    - **Image Handling:** Managing file uploads with `multer` and performing server-side image processing (e.g., resizing, formatting) with `sharp`.
    - **Payment Gateway Integration:** Integrating Stripe for payment processing, including handling webhooks (`express.raw` for Stripe's signature verification) for asynchronous events like successful payments.
    - **Database Seeding:** Creating complex and realistic dummy data using `@faker-js/faker` to facilitate development and testing.
    - **SEO-friendly Design:** Generating slugs for resources using `slugify`.
- **Robust Error Handling:**
    - Implementing a global error handling middleware.
    - Creating custom `ApiError` classes for consistent error responses.
    - Using `express-async-handler` to simplify error propagation in asynchronous Express route handlers.
- **API Security Best Practices:**
    - Employing `helmet` to set crucial security headers.
    - Configuring CORS for controlled cross-origin access.
    - Ensuring sensitive data is never exposed in API responses.
    - Invalidating sessions/tokens after critical actions like password changes.
- **Development Workflow & Tooling:**
    - Utilizing TypeScript across the project for type safety and improved code quality.
    - Setting up a development environment with `nodemon` for auto-reloading.
    - Managing environment variables effectively with `dotenv` and `dotenv-expand`.
    - Writing unit and integration tests with Jest and Supertest.
- **Database Management with Mongoose:**
    - Defining schemas, models, and performing complex queries with Mongoose ODM.
    - Implementing TTL indexes for automatic data expiration (e.g., unverified users).

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

## Postman Collection & API Testing

A Postman collection is available to help you explore and test the API endpoints. The collection includes pre-configured requests for all major operations and basic test scripts to verify responses.

**1. Accessing the Collection:**

*   You can find the Postman collection JSON file (`project_postman_collection.json`) in the root of this repository.
    *   **OR**
*   Access the published Postman documentation and collection [here](https://documenter.getpostman.com/view/39432797/2sB34bLPf5).

**2. Importing into Postman:**

*   Open your Postman application.
*   Click on `File` > `Import...` (or the `Import` button, usually in the top-left).
*   If you downloaded the `project_postman_collection.json` file, either drag and drop it into the import window or select it using the file browser.
*   The collection will be imported, typically named "Ecommerce API Collection".

**3. Configuration:**

The collection uses variables for easier management:

*   **`{{baseUrl}}`**:
    *   **Purpose:** Specifies the base URL for all API requests.
    *   **Default:** `http://localhost:5000` (as defined in the collection variables).
    *   **Action:** If your local server runs on a different port or you are testing a deployed API, navigate to the collection in Postman, click on its name, go to the `Variables` tab, and update the `CURRENT VALUE` of `baseUrl` accordingly.

*   **`{{authToken}}`**:
    *   **Purpose:** Stores the JWT authentication token required for protected endpoints.
    *   **Setup:** This variable is **automatically populated** by a test script in the "Authentication" > "Login User" request. After a successful login, the script extracts the token from the response and sets this collection variable.
    *   **Usage:** Authenticated requests in the collection are pre-configured to use `Bearer {{authToken}}` in their Authorization header.

*   **Other Path Variables (e.g., `:id`, `:categoryId`):**
    *   Requests for specific resources (e.g., `GET /api/products/:id`) use path variables.
    *   When you run such a request, Postman will allow you to set the value for these variables directly in the URL or via a dedicated "Path Variables" section if you've defined them in the request's variable settings.
    *   **Workflow:** Typically, you would first create a resource (e.g., a new product using a `POST` request), copy its `_id` from the response, and then paste this ID into the path variable for requests that operate on that specific resource (like `GET`, `PUT`, `DELETE` for that product). The collection includes some illustrative placeholders like `productId_here` or collection variables like `{{categoryId}}` that you'll need to manage.

**4. Running Requests and Tests:**

*   **Start Your API Server:** Ensure your backend application is running.
*   **Login First:**
    *   Navigate to the "Authentication" folder within the collection.
    *   Open the "Login User" request.
    *   Go to the `Body` tab, select `raw`, and ensure it's set to `JSON`. Update the example email and password with valid credentials for an existing user in your database.
    *   Click `Send`.
    *   Upon successful login, the `{{authToken}}` variable will be set.
*   **Execute Other Requests:**
    *   Select any other request you wish to test.
    *   If it's an authenticated route, the `{{authToken}}` will be automatically included in the headers.
    *   For `POST` or `PUT` requests, modify the example JSON in the `Body` tab as needed.
    *   Click `Send`.
*   **Check Test Results:**
    *   After a response is received, Postman displays several tabs below the request section: `Body`, `Cookies`, `Headers`, and `Test Results`.
    *   Click on the `Test Results` tab to see the outcome of the automated tests (e.g., status code checks, basic response validation). This will indicate if the API responded as expected for that request.

**5. Folder/Collection Runs:**

*   You can run all requests within a specific folder or the entire collection by clicking the three dots (`...`) next to the folder/collection name and choosing `Run folder` or `Run collection`.
*   The Collection Runner window will open, allowing you to configure iterations, delays, and view a summary of all test results.

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes.

---

## License

MIT
