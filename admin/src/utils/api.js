import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Auth
export const adminLogin = async (email, password) => {
  // Mock login for now if no backend
  if (email === 'admin@techxsm.com' && password === 'admin123') {
    return { token: 'mock-admin-token' };
  }
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

// Dashboard Stats
export const getStats = async () => {
  // Mock data
  return {
    totalOrders: 156,
    revenue: 450000,
    pending: 12,
    shipped: 45,
    delivered: 99
  };
  // const response = await api.get('/admin/stats');
  // return response.data;
};

// Orders
export const getOrders = async () => {
  // Mock data
  return [
    { _id: 'ORD-1001', customerName: 'John Doe', customerEmail: 'john@example.com', createdAt: new Date().toISOString(), totalAmount: 4999, status: 'pending', items: [{name: 'Earbuds', quantity: 1}] },
    { _id: 'ORD-1002', customerName: 'Jane Smith', customerEmail: 'jane@example.com', createdAt: new Date().toISOString(), totalAmount: 8999, status: 'shipped', items: [{name: 'Keyboard', quantity: 1}] }
  ];
  // const response = await api.get('/admin/orders');
  // return response.data;
};

export const getOrder = async (id) => {
  // Mock data
  return {
    _id: id,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '9876543210',
    shippingAddress: '123 Main St, City, State, 12345',
    createdAt: new Date().toISOString(),
    totalAmount: 4999,
    status: 'pending',
    items: [
      { productId: 'P1', name: 'Wireless Earbuds Pro', quantity: 1, price: 16500, image: 'https://via.placeholder.com/50' }
    ],
    timeline: [
      { status: 'pending', message: 'Order placed successfully', date: new Date().toISOString() }
    ]
  };
  // const response = await api.get(`/admin/orders/${id}`);
  // return response.data;
};

export const updateOrderStatus = async (id, status) => {
  // const response = await api.put(`/admin/orders/${id}/status`, { status });
  // return response.data;
  return { success: true };
};

export const shipOrder = async (id, shippingDetails) => {
  // const response = await api.put(`/admin/orders/${id}/ship`, shippingDetails);
  // return response.data;
  return { success: true };
};

// Products
export const getProducts = async () => {
  // Mock data
  return [
    { _id: 'P1', name: 'Wireless Earbuds Pro', category: 'Audio', price: 16500, stock: 50, featured: true, images: [''] }
  ];
  // const response = await api.get('/admin/products');
  // return response.data;
};

export const addProduct = async (productData) => {
  // const response = await api.post('/admin/products', productData);
  // return response.data;
  return { success: true };
};

export const updateProduct = async (id, productData) => {
  // const response = await api.put(`/admin/products/${id}`, productData);
  // return response.data;
  return { success: true };
};

export const deleteProduct = async (id) => {
  // const response = await api.delete(`/admin/products/${id}`);
  // return response.data;
  return { success: true };
};

export default api;
