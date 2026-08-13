import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Archive } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { productApi } from "../../api/productApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../../types";

export default function AdminProducts() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);

  // Form modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Input states
  const [registryId, setRegistryId] = useState("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState(1);
  const [category, setCategory] = useState<
    "Herbal Soaps" | "Essential Oils" | "Gift Boxes" | "Souvenirs"
  >("Herbal Soaps");
  const [artistryType, setArtistryType] = useState<
    "Skincare formulation" | "Keepsake Souvenir"
  >("Skincare formulation");
  const [stock, setStock] = useState(10);
  const [featured, setFeatured] = useState(false);
  const [souvenir, setSouvenir] = useState(false);
  // const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([""]);
  const [ingredients, setIngredients] = useState("");
  const [benefits, setBenefits] = useState("");
  const [skinFeel, setSkinFeel] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [soapType, setSoapType] = useState("");
  const [handcraftedIn, setHandcraftedIn] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => productApi.getProducts(),
  });

  const openAddForm = () => {
    setEditingProduct(null);
    setRegistryId(`prod-${Date.now()}`);
    setName("");
    setShortDescription("");
    setDetailedDescription("");
    setPrice(299);
    setCategory("Herbal Soaps");
    setArtistryType("Skincare formulation");
    setStock(15);
    setFeatured(false);
    setSouvenir(false);
    setIngredients("");
    setBenefits("");
    setSkinFeel("");
    setHowToUse("");
    setNetWeight("");
    setSoapType("");
    setHandcraftedIn("");
    setImages([
      "https://images.unsplash.com/photo-1607006342411-12f5a54b38bf?auto=format&fit=crop&w=500&q=80",
    ]);
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setRegistryId(prod.registryId);
    setName(prod.name);
    setShortDescription(prod.shortDescription);
    setDetailedDescription(prod.detailedDescription || "");
    setPrice(prod.price);
    setCategory(prod.category);
    setArtistryType(prod.artistryType);
    setStock(prod.stock);
    setFeatured(prod.featured || false);
    setSouvenir(prod.souvenir || false);
    setIngredients((prod.ingredients || []).join("\n"));
    setBenefits((prod.benefits || []).join("\n"));
    // setImageUrl(prod.imageUrl || "");
    setImages(prod.images?.length ? prod.images : [""]);

    setSkinFeel((prod.skinFeel || []).join("\n"));
    setHowToUse(prod.howToUse || "");

    setNetWeight(prod.productInformation?.netWeight || "");
    setSoapType(prod.productInformation?.soapType || "");
    setHandcraftedIn(prod.productInformation?.handcraftedIn || "");

    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you positive you wish to remove this exquisite curation from the registry?",
      )
    )
      return;
    try {
      const res = await productApi.deleteProduct(id);
      if (res.success) {
        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      }
    } catch (err) {
      console.error("Failed to delete admin product:", err);
      alert("Encountered error deleting product from registries.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!name || !shortDescription || !registryId || !imageUrl) {
    //   alert(
    //     "Please key in core product parameters (Name, Image, Short Description).",
    //   );
    //   return;
    // }
    if (!name || !shortDescription || !registryId || !images.some(Boolean)) {
      alert(
        "Please key in core product parameters (Name, Image, Short Description).",
      );
      return;
    }

    const payload = {
      registryId,
      name,
      shortDescription,
      detailedDescription,
      price: Number(price),
      category,
      artistryType,
      stock: Number(stock),
      featured,
      souvenir,
      // imageUrl,
      images: images.filter(Boolean),
      customMessageAvailable: souvenir,
      // ingredients: editingProduct?.ingredients || [],
      // benefits: editingProduct?.benefits || [],
      ingredients: ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      benefits: benefits
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      skinFeel: skinFeel
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      howToUse: howToUse.trim(),

      productInformation: {
        netWeight: netWeight.trim(),
        soapType: soapType.trim(),
        handcraftedIn: handcraftedIn.trim(),
      },
    };

    try {
      if (editingProduct) {
        await productApi.editProduct(editingProduct._id, payload);

        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      } else {
        await productApi.addProduct(payload);

        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Product submission failed:", err);
      alert(
        "Bespoke product registration failed. Try checking API configurations.",
      );
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
          <span className="text-xs text-brand-cream/45">
            Total: <strong>{products.length}</strong> items curated
          </span>
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
            <p className="text-xs text-brand-cream/55">
              No curated botanical items on record.
            </p>
          </div>
        ) : (
          /* Registries Table Layout */
          <div className="bg-[#141211] border border-brand-cream/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-brand-cream/5">
                <thead className="bg-[#1A1817] text-brand-gold tracking-widest uppercase text-[9px] font-sans-poppins">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Offering Details
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Curation Category
                    </th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold">Stock status</th>
                    <th className="px-6 py-4 font-semibold">
                      Curation Attributes
                    </th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/5 text-brand-cream/80">
                  {products.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-brand-cream/5 transition-colors"
                    >
                      {/* Image + Title Column */}
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <div className="w-12 aspect-square rounded-lg overflow-hidden bg-[#242221] shrink-0">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-serif-playfair text-sm text-brand-cream font-medium line-clamp-1">
                            {p.name}
                          </h4>
                          <span className="font-mono text-[9px] text-brand-cream/35">
                            {p.registryId}
                          </span>
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
                          <span className="text-emerald-400 font-sans-poppins text-[10px] font-semibold">
                            {p.stock} cured pieces
                          </span>
                        ) : (
                          <span className="text-red-400 font-sans-poppins text-[10px] font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Badges */}
                      <td className="px-6 py-4 space-x-1.5 font-sans-poppins text-[9px]">
                        {p.featured && (
                          <span className="bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-md uppercase font-semibold">
                            Bestseller
                          </span>
                        )}
                        {p.souvenir && (
                          <span className="bg-brand-cream/20 text-brand-cream px-2 py-0.5 rounded-md uppercase font-semibold">
                            Keepsake
                          </span>
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
                            onClick={() => handleDelete(p._id)}
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
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-xs"
              onClick={() => setIsFormOpen(false)}
            />

            <div className="relative bg-[#141211] border border-brand-cream/20 rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-zoom-in text-brand-cream text-left">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-cream/10 mb-6 font-sans-poppins">
                <h3 className="font-serif-playfair text-xl text-brand-gold font-semibold">
                  {editingProduct
                    ? "Revise Botanical Record"
                    : "Add Exquisite Curation"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-brand-cream/5 rounded-full text-brand-cream/50 hover:text-brand-cream transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Input fields */}
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4 text-xs font-sans-inter"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                      Registry Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. soap-marigold-absolute"
                      value={registryId}
                      onChange={(e) => setRegistryId(e.target.value)}
                      disabled={!!editingProduct}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                      Symmetrical Name *
                    </label>
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
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                      Value in INR *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 299"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                      Sandalwood Stock Units *
                    </label>
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
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold font-sans-poppins">
                      Curation Registry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Herbal Soaps">Herbal Soaps</option>
                      <option value="Essential Oils">Essential Oils</option>
                      <option value="Gift Boxes">Gift Boxes</option>
                      <option value="Souvenirs">Souvenirs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold font-sans-poppins">
                      Artistry Type Mode
                    </label>
                    <select
                      value={artistryType}
                      onChange={(e) => setArtistryType(e.target.value as any)}
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Skincare formulation">
                        Skincare formulation
                      </option>
                      <option value="Keepsake Souvenir">
                        Keepsake Souvenir
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Ingredients
                  </label>

                  <textarea
                    rows={5}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder={`Saponified Oils of Coconut, Palm, Castor, Hemp Seed & Almond Oils
Mango Butter
Distilled Water
Activated Charcoal Powder
Peppermint Essential Oil
Tea Tree Essential Oil
Bulgarian Rose Fragrance Oil
Dried Rose Petals`}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Why You'll Love It
                  </label>

                  <textarea
                    rows={5}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder={`Traditional Cold Process Soap
True Soap made by Natural Saponification
Naturally Cured for 4–6 Weeks
Rich in Naturally Produced Glycerin
Deep Cleansing Activated Charcoal
Handmade in Small Batches
Premium Plant Oils & Mango Butter
Refreshing Peppermint & Tea Tree Essential Oils
Beautifully Finished with Dried Rose Petals
Free from SLS & SLES
Free from Parabens
No Artificial Fillers
No Harsh Detergents
Cruelty-Free`}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Skin Feel
                  </label>

                  <textarea
                    rows={5}
                    value={skinFeel}
                    onChange={(e) => setSkinFeel(e.target.value)}
                    placeholder={`Clean
Fresh
Soft
Refreshed
Comfortable without feeling overly stripped`}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    How to Use
                  </label>

                  <textarea
                    rows={4}
                    value={howToUse}
                    onChange={(e) => setHowToUse(e.target.value)}
                    placeholder="Lather with water and gently massage over wet skin. Rinse thoroughly. Allow the soap to dry between uses to extend its life."
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Product Information
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={netWeight}
                      onChange={(e) => setNetWeight(e.target.value)}
                      placeholder="Net Weight: Approx. 130 g"
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none"
                    />

                    <input
                      type="text"
                      value={soapType}
                      onChange={(e) => setSoapType(e.target.value)}
                      placeholder="Cold Process Soap"
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none"
                    />

                    <input
                      type="text"
                      value={handcraftedIn}
                      onChange={(e) => setHandcraftedIn(e.target.value)}
                      placeholder="Handcrafted in Goa, India"
                      className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Exquisite Product Images *
                  </label>

                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          required={index === 0}
                          placeholder={`Image ${index + 1} URL`}
                          value={image}
                          onChange={(e) => {
                            const updated = [...images];
                            updated[index] = e.target.value;
                            setImages(updated);
                          }}
                          className="flex-1 pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none"
                        />

                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== index))
                            }
                            className="px-3 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setImages([...images, ""])}
                    className="mt-3 text-xs text-brand-gold"
                  >
                    + Add Another Image
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Short Curatorial Description *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={400}
                    placeholder="A concise, high-end description summarizing key ingredients."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 mb-1 font-bold">
                    Deep Philosophical Curation Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="A complete, beautiful paragraph about botanical weights, cedar chambers, and absolute extracts."
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-brand-cream/10 bg-[#0F0E0D] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold resize-none"
                  />
                </div>

                <div className="flex space-x-6 pt-2 font-sans-poppins text-[10px] font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-brand-gold"
                    />
                    <span>Highlight as Atelier Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={souvenir}
                      onChange={(e) => setSouvenir(e.target.checked)}
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
