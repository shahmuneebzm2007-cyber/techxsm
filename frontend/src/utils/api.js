import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// MOCK DATA
const mockCategories = [
  { _id: '1', name: 'Smartphones', slug: 'smartphones', icon: '📱', productCount: 24 },
  { _id: '2', name: 'Laptops', slug: 'laptops', icon: '💻', productCount: 15 },
  { _id: '3', name: 'Audio', slug: 'audio', icon: '🎧', productCount: 32 },
  { _id: '4', name: 'Wearables', slug: 'wearables', icon: '⌚', productCount: 18 },
  { _id: '5', name: 'Accessories', slug: 'accessories', icon: '🔌', productCount: 45 },
  { _id: '6', name: 'Gaming', slug: 'gaming', icon: '🎮', productCount: 20 },
];

const mockProducts = [
  {
    _id: 'p1',
    name: 'Quantum Pro Max 5G',
    category: 'Smartphones',
    subcategory: 'Premium',
    price: 297000,
    originalPrice: 330000,
    description: 'The ultimate flagship with quantum processing, 120Hz LTPO display, and 200MP camera system.',
    specifications: { Screen: '6.8" OLED', Processor: 'Quantum G9', RAM: '16GB', Storage: '512GB' },
    images: ['https://picsum.photos/seed/p1/500/500', 'https://picsum.photos/seed/p1b/500/500'],
    stock: 45,
    sku: 'SP-QPM5G-512',
    rating: 4.8,
    reviewCount: 342,
    featured: true,
    tags: ['new', '5g', 'flagship']
  },
  {
    _id: 'p2',
    name: 'AeroBook Pro 14"',
    category: 'Laptops',
    subcategory: 'Ultrabook',
    price: 412500,
    originalPrice: 445500,
    description: 'Ultra-thin, ultra-light. Powered by the M2 silicon, 18 hours of battery life.',
    specifications: { Screen: '14" Mini-LED', Processor: 'Aero M2', RAM: '16GB', Storage: '1TB SSD' },
    images: ['https://picsum.photos/seed/p2/500/500'],
    stock: 12,
    sku: 'LP-ABP14-1TB',
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    tags: ['laptop', 'ultrabook']
  },
  {
    _id: 'p3',
    name: 'SonicWave ANC Headphones',
    category: 'Audio',
    subcategory: 'Over-Ear',
    price: 82500,
    originalPrice: 99000,
    description: 'Industry-leading noise cancellation, hi-res audio certification, 40h battery.',
    specifications: { Type: 'Over-Ear', ANC: 'Active', Battery: '40 hours', Bluetooth: '5.3' },
    images: ['https://picsum.photos/seed/p3/500/500'],
    stock: 85,
    sku: 'AU-SWANC-B',
    rating: 4.7,
    reviewCount: 564,
    featured: true,
    tags: ['anc', 'headphones']
  },
  {
    _id: 'p4',
    name: 'Nexus Watch Series 8',
    category: 'Wearables',
    subcategory: 'Smartwatch',
    price: 108900,
    originalPrice: 115500,
    description: 'Advanced health tracking, ECG, blood oxygen, and always-on display.',
    specifications: { Screen: '1.9" OLED', WaterResistance: '50m', Battery: '18 hours' },
    images: ['https://picsum.photos/seed/p4/500/500'],
    stock: 120,
    sku: 'WR-NWS8-45',
    rating: 4.6,
    reviewCount: 890,
    featured: false,
    tags: ['smartwatch', 'fitness']
  },
  {
    _id: 'p5',
    name: 'Titanium Gaming Mouse',
    category: 'Accessories',
    subcategory: 'Peripherals',
    price: 26400,
    originalPrice: null,
    description: 'Ultralight 55g shell, 26K DPI sensor, PTFE feet, 80h battery.',
    specifications: { Weight: '55g', DPI: '26000', Connection: '2.4GHz Wireless' },
    images: ['https://picsum.photos/seed/p5/500/500'],
    stock: 200,
    sku: 'AC-TGM-W',
    rating: 4.5,
    reviewCount: 211,
    featured: false,
    tags: ['gaming', 'wireless']
  },
  {
    _id: 'p6',
    name: 'Elite Mechanical Keyboard',
    category: 'Accessories',
    subcategory: 'Peripherals',
    price: 49500,
    originalPrice: 56100,
    description: 'Hot-swappable switches, PBT keycaps, RGB backlighting, gasket mount.',
    specifications: { Switch: 'Linear Red', Layout: '75%', Keycaps: 'PBT Double-shot' },
    images: ['https://picsum.photos/seed/p6/500/500'],
    stock: 5,
    sku: 'AC-EMK-75',
    rating: 4.9,
    reviewCount: 432,
    featured: true,
    tags: ['mechanical', 'rgb']
  },
  {
    _id: 'p7',
    name: 'HyperDrive 2TB NVMe SSD',
    category: 'Accessories',
    subcategory: 'Storage',
    price: 62700,
    originalPrice: 72600,
    description: 'PCIe Gen4 speeds up to 7300MB/s read. Perfect for PS5 and PC.',
    specifications: { Capacity: '2TB', Interface: 'PCIe Gen4 x4', ReadSpeed: '7300MB/s' },
    images: ['https://picsum.photos/seed/p7/500/500'],
    stock: 50,
    sku: 'AC-HD2T-M2',
    rating: 4.8,
    reviewCount: 156,
    featured: false,
    tags: ['storage', 'ssd']
  },
  {
    _id: 'p8',
    name: 'Vision 4K Web Camera',
    category: 'Accessories',
    subcategory: 'Peripherals',
    price: 42900,
    originalPrice: 49500,
    description: 'Ultra HD 4K sensor, AI framing, dual microphones, privacy cover.',
    specifications: { Resolution: '4K@30fps', FoV: '90°', Microphones: 'Dual omni-directional' },
    images: ['https://picsum.photos/seed/p8/500/500'],
    stock: 0,
    sku: 'AC-V4K-WC',
    rating: 4.4,
    reviewCount: 89,
    featured: false,
    tags: ['webcam', '4k']
  },
  {
    _id: 'p9',
    name: 'Eco Charge 100W GaN',
    category: 'Accessories',
    subcategory: 'Power',
    price: 16500,
    originalPrice: 19800,
    description: 'Compact 4-port charger, powers your laptop, phone, and watch simultaneously.',
    specifications: { Output: '100W Max', Ports: '3x USB-C, 1x USB-A', Technology: 'GaN II' },
    images: ['https://picsum.photos/seed/p9/500/500'],
    stock: 300,
    sku: 'AC-EC100-G',
    rating: 4.7,
    reviewCount: 654,
    featured: false,
    tags: ['charger', 'gan']
  },
  {
    _id: 'p10',
    name: 'Zenith Console X',
    category: 'Gaming',
    subcategory: 'Consoles',
    price: 165000,
    originalPrice: null,
    description: 'Next-gen gaming at 4K 120fps. Custom SSD for lightning-fast loads.',
    specifications: { Resolution: '4K', Storage: '1TB Custom NVMe', Controller: 'Haptic Feedback' },
    images: ['https://picsum.photos/seed/p10/500/500'],
    stock: 25,
    sku: 'GM-ZCX-1TB',
    rating: 4.9,
    reviewCount: 1205,
    featured: true,
    tags: ['console', 'gaming']
  },
  {
    _id: 'p11',
    name: 'SoundPod Mini',
    category: 'Audio',
    subcategory: 'Speakers',
    price: 29700,
    originalPrice: 36300,
    description: '360° sound, deep bass, waterproof design, 12h playtime.',
    specifications: { Waterproof: 'IP67', Battery: '12 hours', Connectivity: 'Bluetooth 5.2' },
    images: ['https://picsum.photos/seed/p11/500/500'],
    stock: 150,
    sku: 'AU-SPM-W',
    rating: 4.5,
    reviewCount: 312,
    featured: false,
    tags: ['speaker', 'portable']
  },
  {
    _id: 'p12',
    name: 'Astro VR Headset',
    category: 'Gaming',
    subcategory: 'VR',
    price: 132000,
    originalPrice: 148500,
    description: 'Standalone VR with 4K per eye, passthrough AR, lightweight design.',
    specifications: { Display: '4K per eye LCD', FoV: '110°', Tracking: '6DoF Inside-out' },
    images: ['https://picsum.photos/seed/p12/500/500'],
    stock: 18,
    sku: 'GM-AVR-128',
    rating: 4.6,
    reviewCount: 278,
    featured: true,
    tags: ['vr', 'metaverse']
  }
];

// API FUNCTIONS
export const getProducts = async (params = {}) => {
  try {
    const { data } = await API.get('/products', { params });
    return data;
  } catch {
    // Fallback logic for mock data
    let filtered = [...mockProducts];
    if (params.category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    }
    return { success: true, data: { products: filtered, total: filtered.length, page: 1, pages: 1 } };
  }
};

export const getProduct = async (id) => {
  try {
    const { data } = await API.get(`/products/${id}`);
    return data;
  } catch {
    const product = mockProducts.find(p => p._id === id);
    if (!product) return { success: false, message: 'Product not found' };
    return { success: true, data: product };
  }
};

export const getCategories = async () => {
  try {
    const { data } = await API.get('/categories');
    return data;
  } catch {
    return { success: true, data: mockCategories };
  }
};

export const getFeaturedProducts = async () => {
  try {
    const { data } = await API.get('/products/featured');
    return data;
  } catch {
    const featured = mockProducts.filter(p => p.featured);
    return { success: true, data: featured };
  }
};

export const createOrder = async (orderData) => {
  try {
    const { data } = await API.post('/orders', orderData);
    return data;
  } catch {
    return { success: true, data: { _id: 'ORD-' + Math.floor(Math.random() * 1000000), ...orderData } };
  }
};

export const getTracking = async (trackingId) => {
  try {
    const { data } = await API.get(`/orders/track/${trackingId}`);
    return data;
  } catch {
    // Mock tracking data
    if (trackingId.length < 5) return { success: false, message: 'Invalid tracking ID' };
    return {
      success: true,
      data: {
        _id: trackingId,
        orderId: trackingId,
        status: 'In Transit',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
        courier: 'TCS Express',
        currentLocation: 'Karachi Sorting Center',
        timeline: [
          { status: 'Order Placed', message: 'Your order has been received.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), completed: true },
          { status: 'Confirmed', message: 'Order confirmed by seller.', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), completed: true },
          { status: 'Shipped', message: 'Package handed over to courier.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), completed: true },
          { status: 'In Transit', message: 'Package arrived at regional facility.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), completed: false },
          { status: 'Delivered', message: 'Package will be delivered soon.', timestamp: null, completed: false }
        ]
      }
    };
  }
};

export const login = async (credentials) => {
  try {
    const { data } = await API.post('/auth/login', credentials);
    return data;
  } catch {
    return { success: true, data: { token: 'mock-jwt-token', user: { _id: 'u1', name: 'Demo User', email: credentials.email } } };
  }
};

export const register = async (userData) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    return data;
  } catch {
    return { success: true, data: { token: 'mock-jwt-token', user: { _id: 'u1', name: userData.name, email: userData.email } } };
  }
};

export const getUserOrders = async () => {
  try {
    const { data } = await API.get('/orders/myorders');
    return data;
  } catch {
    return { success: true, data: [] };
  }
};

export default {
  getProducts,
  getProduct,
  getCategories,
  getFeaturedProducts,
  createOrder,
  getTracking,
  login,
  register,
  getUserOrders
};
