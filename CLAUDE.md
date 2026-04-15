# SolaraKH — Project Documentation

## Project Overview
SolaraKH is a Cambodian solar energy e-commerce platform built with Laravel 13 + Inertia.js + React.
It sells solar panels, inverters, batteries, and kits, and offers professional installation services across Cambodia.
Payments are processed via ABA PAY (KHQR) — Cambodia's dominant mobile payment platform.

## Tech Stack
- **Backend**: Laravel 13 (PHP 8.3+), MySQL
- **Frontend**: React 18 + Inertia.js v2 (via Laravel Breeze)
- **Styling**: Tailwind CSS v3 with custom solar/dark color palette
- **Admin Panel**: Filament v3.3
- **Fonts**: Outfit (headings) + DM Sans (body) from Google Fonts
- **QR Code**: `qrcode` npm package for ABA PAY KHQR rendering
- **Notifications**: `react-hot-toast`

## Database Schema (7 tables)

| Table | Key Columns |
|-------|-------------|
| `users` | id, name, email, password |
| `categories` | id, name, slug, is_active, sort_order |
| `products` | id, category_id, name, slug, sku, brand, wattage, price, sale_price, stock_qty, warranty_years, images (JSON), specifications (JSON), is_featured |
| `services` | id, name, slug, base_price, price_unit (flat/per_kw), duration, features (JSON) |
| `orders` | id, order_number, customer_*, province, subtotal, shipping, total, payment_method, payment_status, order_status, aba_qr_string |
| `order_items` | id, order_id, product_id, product_name, unit_price, quantity, subtotal |
| `service_bookings` | id, booking_reference, service_id, customer_*, preferred_date, time_slot, system_size_kw, estimated_price, status |

## Cart System
- **Session-based cart** stored in `CartService` (`app/Services/CartService.php`)
- Cart key: `session('cart')` — array of items with id, product_id, name, sku, price, quantity, image
- `CartService::getCount()` is injected into every Inertia response via `HandleInertiaRequests`
- Cart count shown in Navbar automatically

## Checkout Flow
1. Customer fills 3-step form (React state — no page reloads)
   - Step 1: Customer info (name, email, phone, address, province)
   - Step 2: Payment method selection (ABA PAY / Bank Transfer / COD)
   - Step 3: Order review + Place Order button
2. `CheckoutController::store()` creates Order + OrderItems in DB
3. If ABA PAY: `AbaPayService::generateQR()` creates KHQR string, stored in `orders.aba_qr_string`
4. Redirect to `/orders/{orderNumber}/confirmation`
5. Frontend renders QR from `qrString` prop using `qrcode` library
6. Payment status polls via `GET /api/orders/{orderNumber}/payment-status` every 10s
7. ABA PAY webhook at `POST /webhooks/aba-pay` updates order on payment confirmation

## ABA PAY Integration

### Config (config/services.php → .env)
```
ABA_MERCHANT_ID=SOLARAKH001
ABA_MERCHANT_NAME=SolaraKH
ABA_API_KEY=...
ABA_SECRET_KEY=...
ABA_PAYWAY_URL=https://payway.ababank.com/api/
```

### Service: `app/Services/AbaPayService.php`
- `getPaymentFormData(Order $order)` — builds signed form fields for ABA PayWay JS popup checkout
- `checkPaymentStatus(string $tranId)` — calls check-transaction-2 API to poll payment status
- `verifyWebhookSignature(Request $request)` — validates X_PAYWAY_HMAC_SHA512 header (HMAC-SHA512)
- Webhook CSRF exempt via `bootstrap/app.php` → `except: ['webhooks/*']`
- **Empty params filtered**: return array uses `array_filter` to strip `''`/`null` fields — ABA rejects null params (Error: "Please remove null params from your request")
- **No `payout` field**: removed entirely from both hash and request — ABA returns "payout service is not available on your profile" if sent (Error Code: payout not enabled)

### Payment Flow
1. Order created → `getPaymentFormData()` builds signed fields → passed to frontend as Inertia props
2. Frontend renders hidden form fields and triggers ABA PayWay JS popup
3. Customer completes payment in popup
4. ABA redirects to `return_url` / `cancel_url`
5. ABA sends webhook → `POST /webhooks/aba-pay`
6. `OrderPaidMail` queued → order status updated

### ABA PayWay Domain Whitelist (Error Code 6)
If you see **"Unable to process — Requested Domain is not in whitelist"**:
1. Log in to ABA PayWay merchant portal (sandbox: https://merchant-sandbox.payway.com.kh)
2. Go to **Settings → Integration**
3. Add your domain to the whitelist (e.g. `localhost`, `localhost:8000`, or your production domain)
4. For production, whitelist your actual server domain before going live

## Laravel 13 Patterns
- **No Kernel.php** — all middleware in `bootstrap/app.php`
- **No `Route::controller()`** — explicit controller closures used
- **No `Model::unguard()`** — `$fillable` used on all models
- API routes registered via `api:` prefix in `bootstrap/app.php`
- CSRF exempt: `$middleware->validateCsrfTokens(except: ['webhooks/*'])`

## Local Development Setup

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env: set DB_DATABASE=solarakh, DB_USERNAME, DB_PASSWORD

# 2. Create MySQL database
mysql -u root -e "CREATE DATABASE solarakh;"

# 3. Install dependencies
composer install
npm install

# 4. Generate app key and run migrations
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link

# 5. Start development servers (3 terminals)
php artisan serve          # Backend: http://localhost:8000
npm run dev               # Vite dev server
php artisan queue:work    # Queue worker for emails
```

## Admin Panel
- **URL**: http://localhost:8000/admin
- **Login**: admin@solarakh.com / admin123456
- **Resources**: Products, Categories, Services, Orders, ServiceBookings
- **Dashboard Widgets**: Total Revenue, Today's Orders, Pending Bookings, Low Stock Alert

## Filament Resources
| Resource | CRUD | Notes |
|----------|------|-------|
| ProductResource | List/Create/Edit | Image upload, KeyValue specs |
| CategoryResource | List/Create/Edit | Auto-slug from name |
| OrderResource | List/Edit | Mark as Paid action, sends OrderPaidMail |
| ServiceResource | List/Create/Edit | TagsInput for features |
| ServiceBookingResource | List/Edit | Status update action |

## React Pages (9 pages)
| Page | Route | Component |
|------|-------|-----------|
| Home | / | Pages/Home.jsx |
| Shop | /shop | Pages/Shop/Index.jsx |
| Product Detail | /shop/{slug} | Pages/Shop/ProductDetail.jsx |
| Cart | /cart | Pages/Shop/Cart.jsx |
| Checkout | /checkout | Pages/Shop/Checkout.jsx |
| Order Confirmation | /orders/{n}/confirmation | Pages/Shop/OrderConfirmation.jsx |
| Services | /services | Pages/Services/Index.jsx |
| Service Booking | /services/{slug} | Pages/Services/Booking.jsx |
| My Orders | /account/orders | Pages/Account/Orders.jsx |

## Shared Inertia Props (HandleInertiaRequests)
Every page receives:
- `auth.user` — current user object or null
- `cartCount` — integer for cart badge in Navbar
- `flash.success/error/warning` — shown via react-hot-toast
- `appName` — "SolaraKH"

## Mail Classes
- `OrderConfirmationMail` — sent on order creation (queued)
- `OrderPaidMail` — sent when ABA PAY webhook confirms payment (queued)
- `ServiceBookingConfirmationMail` — sent on booking submission (queued)

## Environment Variables (all required for production)
```
APP_KEY             — Generate with: php artisan key:generate
DB_*                — MySQL connection
MAIL_*              — SMTP for transactional emails
ABA_MERCHANT_ID     — ABA PayWay merchant ID
ABA_SECRET_KEY      — For webhook signature verification
QUEUE_CONNECTION    — Set to "database" (uses jobs table)
```

## aaPanel Deployment Notes
1. PHP 8.3+ required — ensure PHP 8.3 is selected for the site
2. Set document root to `/public`
3. Run: `php artisan queue:work --daemon` as a supervisor process
4. Run: `php artisan storage:link` after deployment
5. Set `APP_ENV=production`, `APP_DEBUG=false` in .env
6. Run: `php artisan config:cache && php artisan route:cache && php artisan view:cache`
7. Nginx config: standard Laravel nginx config with `try_files $uri $uri/ /index.php`

## Common Artisan Commands
```bash
php artisan migrate:fresh --seed    # Reset and reseed database
php artisan queue:work              # Process queued jobs (emails)
php artisan storage:link            # Link public storage
php artisan route:list              # List all routes
php artisan tinker                  # Interactive PHP shell
php artisan filament:make-user      # Create additional admin user
```
