import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Archive } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productApi } from '../../api/productApi';
import { Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Input states
  const [idInput, setIdInput] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState(1);
  const [category, setCategory] = useState('Face Curio');
  const [typeInput, setTypeInput] = useState<'skincare' | 'souvenir'>('skincare');
  const [stock, setStock] = useState(10);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isCollectible, setIsCollectible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setIdInput(`prod-${Date.now()}`);
    setName('');
    setDescription('');
    setDetails('');
    setPrice(15.00);
    setCategory('Herbal Soaps');
    setTypeInput('skincare');
    setStock(15);
    setIsBestSeller(false);
    setIsCollectible(false);
    setImageUrl('https://images.unsplash.com/photo-1607006342411-12f5a54b38bf?auto=format&fit=crop&w=500&q=80');
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIdInput(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setDetails(prod.details || '');
    setPrice(prod.price);
    setCategory(prod.category);
    setTypeInput(prod.type);
    setStock(prod.stock);
    setIsBestSeller(prod.isBestSeller || false);
    setIsCollectible(prod.isCollectible || false);
    setImageUrl(prod.images[0] || '');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you positive you wish to remove this exquisite curation from the registry?")) return;
    try {
      const res = await productApi.deleteProduct(id);
      if (res.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete admin product:", err);
      alert("Encountered error deleting product from registries.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !idInput || !imageUrl) {
      alert("Please key in core product parameters (Name, Image, Details).");
      return;
    }

    const payload: any = {
      id: idInput,
      name,
      description,
      details,
      price: Number(price),
      category,
      type: typeInput,
      stock: Number(stock),
      isBestSeller,
      isCollectible,
      images: [imageUrl]
    };

    try {
      if (editingProduct) {
        await productApi.editProduct(idInput, payload);
      } else {
        await productApi.addProduct(payload);
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Product submission failed:", err);
      alert("Bespoke product registration failed. Try checking types.");
    }
  };

  return (
    <AdminLayout
      title="Atelier Product Registries Curation"
      subtitle="Exquisite additions, updates, or removals of our 6-week cold saponification bath blocks, face distillations, and customizable wax-sealed souvenir items."
    >
      <div className="space-y-6 font-sans-inter text-left">
        
        {/* Actions head bar */}
        <div className="flex justify-between items-center font-sans-poppins">
          <span className="text-xs text-brand-cream/45">Total: <strong>{products.length}</strong> items curated</span>
          <button
            onClick={openAddForm}
            className="py-3 px-6 bg-brand-gold hover:bg-brand-cream text-brand-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center space-x-2 cursor-pointer shadow-md"
            id="curate-add-product"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Cured Formula</span>
          </button>
        </div>

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="py-20 flex text-center justify-center text-xs uppercase tracking-widest text-brand-gold font-sans-poppins">
             Opening Cedarwood Chamber Files...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#141211] border border-brand-cream/10 rounded-3xl space-y-4">
            <Archive className="h-10 w-10 text-brand-cream/20 mx-auto" />
            <p className="text-xs text-brand-cream/55">No curated botanical items on record.</p>
          </div>
        ) : (
          /* Desktop & Table layouts of registries list */
          <div className="bg-[#141211] border border-brand-cream/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-brand-cream/5">
                <thead className="bg-[#1A1817] text-brand-gold tracking-widest uppercase text-[9px] font-sans-poppins">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Offering Details</th>
                    <th className="px-6 py-4 font-semibold">Curation Category</th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold">Stock status</th>
                    <th className="px-6 py-4 font-semibold">Curation Attributes</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/5 text-brand-cream/80">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-cream/5 transition-colors">
                      
                      {/* Image + Title Column */}
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <div className="w-12 aspect-square rounded-lg overflow-hidden bg-[#242221] shrink-0">
                          <img src={p.images[0] || ''} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-serif-playfair text-sm text-brand-cream font-medium line-clamp-1">{p.name}</h4>
                          <span className="font-mono text-[9px] text-brand-cream/35">{p.id}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 font-sans-poppins text-[10px] uppercase tracking-wider text-brand-gold">
                        {p.category}
                      </td>

                      {/* Price value */}
                      <td className="px-6 py-4 font-serif-cormorant text-[14px] font-bold">
                        ₹{p.price}
                      </td>

                      {/* Units count */}
                      <td className="px-6 py-4">
                        {p.stock > 0 ? (
                          <span className="text-emerald-400 font-sans-poppins text-[10px] font-semibold">{p.stock} cured pieces</span>
                        ) : (
                          <span className="text-red-400 font-sans-poppins text-[10px] font-semibold">Out of Stock</span>
                        )}
                      </td>

                      {/* Badges isBestSeller, isCollectible */}
                      <td className="px-6 py-4 space-x-1.5 font-sans-poppins text-[9px]">
                        {p.isBestSeller && (
                          <span className="bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-md uppercase font-semibold">Bestseller</span>
                        )}
                        {p.isCollectible && (
                          <span className="bg-brand-cream/20 text-brand-cream px-2 py-0.5 rounded-md uppercase font-semibold">Keepsake</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openEditForm(p)}
                            className="p-2 bg-[#211F1E] hover:bg-[#2F2C2A] text-brand-gold rounded-lg transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 bg-red-950/20 hover:bg-red-950/60 text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL FORM FOR ADDING / EDITING DESIGNS */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
            
            <div className="relative bg-[#141211] border border-brand-cream/20 rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-zoom-in text-brand-cream text-left">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-cream/10 mb-6 font-sans-poppins">
                <h3 className="font-serif-playfair text-xl text-brand-gold font-semibold">
                  {editingProduct ? "Revise Botanical Record" : "Add Exquisite Curation"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-brand-cream/5 rounded-full text-brand-cream/50 hover:text-brand-cream transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans-inter">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Registry Reference ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. soap-marigold-absolute"
                      value={idInput}
                      onChange={(e) => setIdInput(e.target.value)}
                      disabled={!!editingProduct}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Symmetrical Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Marigold Absolute Block"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Value in INR *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 19.50"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Sandalwood Stock Units *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="e.g. 10"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold font-sans-poppins">Curation Registry Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Herbal Soaps">Herbal Soaps</option>
                      <option value="Essential Oils">Essential Oils</option>
                      <option value="Gift Boxes">Gift Boxes</option>
                      <option value="Souvenirs">Souvenirs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold font-sans-poppins">Artistry Type Mode</label>
                    <select
                      value={typeInput}
                      onChange={(e: any) => setTypeInput(e.target.value)}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream focus:border-brand-gold focus:outline-none"
                    >
                      <option value="skincare">Skincare formulation</option>
                      <option value="souvenir">Keepsake Souvenir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Exquisite Thumbnail URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Short Curatorial Description *</label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    placeholder="A concise, high-end description summarizing key ingredients."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">Deep Philosophical Curation Details</label>
                  <textarea
                    rows={3}
                    placeholder="A complete, beautiful paragraph about botanical weights, cedar chambers, and absolute extracts."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div className="flex space-x-6 pt-2 font-sans-poppins text-[10px] font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="accent-brand-gold"
                    />
                    <span>Highlight as Atelier Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCollectible}
                      onChange={(e) => setIsCollectible(e.target.checked)}
                      className="accent-brand-gold"
                    />
                    <span>Flag as Premium Keepsake Souvenir</span>
                  </label>
                </div>

                {/* Submit action */}
                <div className="pt-4 flex justify-end space-x-3 border-t border-brand-cream/10 font-sans-poppins text-[10px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-3 border border-brand-cream/20 hover:border-red-400 text-brand-cream hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-gold hover:bg-brand-cream text-brand-black rounded-xl transition-all cursor-pointer"
                  >
                     Commit Curation Change
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
