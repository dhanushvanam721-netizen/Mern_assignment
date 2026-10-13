import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign, Plus, Search, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', category: 'Electronics', price: '', stock: '', sku: '' });

  // Fetch Products from Express Backend
  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?search=${search}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setProducts([json.data, ...products]);
        setForm({ title: '', category: 'Electronics', price: '', stock: '', sku: '' });
      }
    } catch (err) {
      console.error('Error adding product', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 lg:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PulseVendor Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">Next-Gen MERN Inventory & Multi-Vendor Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">
              Code0 AI Workflow Active
            </span>
          </div>
        </header>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Inventory</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-100">{products.length} Items</h3>
            </div>
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20"><Package size={22} /></div>
          </div>
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Portfolio Valuation</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-100">
                ${products.reduce((acc, item) => acc + (item.price * item.stock), 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20"><DollarSign size={22} /></div>
          </div>
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Growth Rate</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-100">+24.8%</h3>
            </div>
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl border border-cyan-500/20"><TrendingUp size={22} /></div>
          </div>
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-400">
                {products.filter(p => p.stock < 10).length}
              </h3>
            </div>
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/20"><AlertTriangle size={22} /></div>
          </div>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
              <Plus size={18} className="text-indigo-400" /> Add New Inventory Item
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Product Title</label>
                <input 
                  type="text" required 
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                  placeholder="e.g., UltraWide Gaming Monitor" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select 
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                  >
                    <option>Electronics</option>
                    <option>Apparel</option>
                    <option>Home & Kitchen</option>
                    <option>Software</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SKU Code</label>
                  <input 
                    type="text" required 
                    value={form.sku} onChange={e => setForm({...form, sku: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                    placeholder="SKU-9921" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                    placeholder="299.99" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stock Qty</label>
                  <input 
                    type="number" required min="0"
                    value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                    placeholder="45" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium py-2.5 rounded-xl shadow-lg transition-all text-sm">
                Save & Sync Item
              </button>
            </form>
          </div>

          {/* Product Data Table View */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-slate-200">Active Inventory Records</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search products or SKU..." 
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Item Details</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">Loading catalog stream...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">No matching products found.</td></tr>
                  ) : (
                    products.map(item => (
                      <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <span className="text-xs text-slate-500 font-mono">SKU: {item.sku}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">${item.price.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-300">{item.stock} units</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                            <aside><Trash2 size={16} /></aside>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}