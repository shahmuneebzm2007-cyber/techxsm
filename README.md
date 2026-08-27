# 🚀 TechXSM - Premium Tech Accessories Store

A complete ecommerce platform for tech accessories with premium animations, real-time order tracking, and an admin dashboard.

## 📁 Project Structure

```
techxsm/
├── frontend/   → Customer-facing website (React + Vite)
├── admin/      → Admin dashboard (React + Vite)
├── backend/    → API server (Node.js + Express + MongoDB)
└── README.md
```

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env          # Edit with your MongoDB URI, email settings, etc.
npm install
node scripts/seed.js          # Seed database with products
npm run dev                   # Starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env          # Edit API URL if needed
npm install
npm run dev                   # Starts on http://localhost:5173
```

### 3. Admin Dashboard
```bash
cd admin
cp .env.example .env          # Edit API URL if needed
npm install
npm run dev                   # Starts on http://localhost:5174
```

---

## 🛍️ How to Add Products (EASY!)

### Step 1: Edit `backend/data/products.js`

Just add a new object to the array:

```js
{
  name: "Your Product Name",
  category: "audio",              // Use existing or new category slug
  subcategory: "Earbuds",         // Any subcategory string
  price: 9900,                     // Price in PKR (whole rupees, no paisa/decimals needed)
  originalPrice: 4999,            // Original price for discount display
  description: "Product description here...",
  specifications: {
    "Key1": "Value1",
    "Key2": "Value2"
  },
  images: [
    "https://your-image-url.com/image1.jpg",
    "https://your-image-url.com/image2.jpg"
  ],
  stock: 100,
  sku: "UNIQUE-SKU-001",
  featured: true,                 // Show on homepage
  tags: ["tag1", "tag2"]
}
```

### Step 2: Add New Categories (Optional)

Edit `backend/data/categories.js`:

```js
{
  name: "Your Category",
  slug: "your-category",
  icon: "📱",
  subcategories: ["Sub1", "Sub2", "Sub3"]
}
```

### Step 3: Seed the Database

```bash
cd backend
node scripts/seed.js
```

That's it! Your products are now live. 🎉

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
ADMIN_EMAIL=admin@techxsm.com
ADMIN_PASSWORD=your-admin-password
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

### Admin (`admin/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Deployment

### Frontend & Admin → Vercel
1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy!

### Backend → Railway/Render
1. Push to GitHub
2. Connect Railway/Render
3. Set environment variables
4. Deploy!

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com
2. Get connection string
3. Add to backend .env

---

## 💰 Cost: $0 (All Free Tiers)

| Service | Plan |
|---------|------|
| Vercel | Free |
| Railway/Render | Free |
| MongoDB Atlas | Free 512MB |

---

## 🇵🇰 Pakistan Localization

This build is localized for the Pakistani market:
- All prices in **PKR** (`Rs`), formatted with `en-PK` locale
- **Cash on Delivery (COD)** as the sole checkout flow — no payment gateway required to go live
- Courier list matches local providers: TCS, Leopards Courier, M&P Express, Trax, PostEx, Call Courier
- Checkout validates Pakistani mobile numbers (`03xx-xxxxxxx` / `+92`)
- Footer contact details use a Pakistani address and +92 phone number

If you later want online payments, both **JazzCash** and **Easypaisa** offer merchant APIs that could be added the same way Razorpay is typically wired into a MERN app — this build ships COD-only to keep setup at zero cost and zero merchant-account friction.

---

## 📱 Features

- ✅ Premium animations (Framer Motion)
- ✅ Real-time order tracking
- ✅ Cash on Delivery checkout
- ✅ Admin dashboard
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Email notifications
- ✅ PDF receipts
- ✅ Easy product management
- ✅ Gzip response compression + lean Mongoose queries for faster loads on mobile networks
