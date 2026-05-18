import React, { useMemo, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useAppContext } from "../../context/AppContext";

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Drinks",
  "Instant food",
  "Dairy Products",
  "Bakery & Breads",
  "Grains & cereals",
  "Toys",
];

export const AddProduct = () => {
  const { axios, currency } = useAppContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragCounterRef = useRef(0);

  const discountPercent = useMemo(() => {
    if (
      !price ||
      !offerPrice ||
      Number(price) <= 0 ||
      Number(offerPrice) >= Number(price)
    ) {
      return null;
    }
    return Math.round((1 - Number(offerPrice) / Number(price)) * 100);
  }, [price, offerPrice]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5 MB`);
        return false;
      }
      return true;
    });
    if (valid.length) setImages((prev) => [...prev, ...valid]);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setOfferPrice("");
    setInStock(true);
    setImages([]);
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Product name is required");
    if (!category) return toast.error("Please select a category");
    if (!price) return toast.error("Enter a price");
    if (!offerPrice) return toast.error("Enter an offer price");
    if (images.length === 0) return toast.error("Upload at least one image");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "productData",
        JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          offerPrice: Number(offerPrice),
          inStock,
        })
      );

      images.forEach((img) => formData.append("images", img));

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "Product added successfully");
        resetForm();
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition";

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to list a new product
        </p>
      </div>

      <form onSubmit={onSubmitHandler}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Basic Info
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fresh"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product in a few lines…"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Pricing
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price ({currency})
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400 text-sm pointer-events-none">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition appearance-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price ({currency})
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400 text-sm pointer-events-none">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition appearance-none"
                    />
                  </div>
                </div>
              </div>
              {discountPercent !== null && (
                <p className="mt-3 text-xs font-medium text-green-600">
                  {discountPercent}% discount will be applied
                </p>
              )}
            </div>

            {/* Product Images */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Product Images
              </p>

              {/* Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 transition-colors duration-200 ${
                  isDragging
                    ? "border-gray-500 bg-gray-100"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer w-full"
                >
                  {isDragging ? (
                    <>
                      <svg
                        className="w-9 h-9 text-gray-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m-4-4l4 4 4-4"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">
                        Drop images here
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-300 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 8l-4-4-4 4M12 4v12"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">
                        Drag & drop or{" "}
                        <span className="text-gray-700 font-medium underline underline-offset-2">
                          click to upload
                        </span>
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP up to 5MB each
                      </span>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group w-20 h-20">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <label
                    htmlFor="image-upload-more"
                    className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition text-gray-300 hover:text-gray-400"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-xs mt-1">Add</span>
                    <input
                      id="image-upload-more"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6">

            {/* Availability */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Availability
              </p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {inStock ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {inStock ? "Visible to buyers" : "Hidden from buyers"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`relative inline-flex w-11 h-6 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
                    inStock ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      inStock ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    inStock
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {inStock ? "Available" : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Summary
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Name</span>
                  <span className="font-medium text-gray-800 max-w-[140px] truncate text-right">
                    {name || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Category</span>
                  <span className="font-medium text-gray-800 text-right">
                    {category || "—"}
                  </span>
                </div>
                <hr className="border-gray-100 my-1" />
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Price</span>
                  <span className="font-medium text-gray-800 text-right">
                    {price ? `${currency}${Number(price).toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Offer price</span>
                  <span className="font-medium text-green-600 text-right">
                    {offerPrice
                      ? `${currency}${Number(offerPrice).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
                <hr className="border-gray-100 my-1" />
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Images</span>
                  <span className="font-medium text-gray-800 text-right">
                    {images.length} uploaded
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Stock</span>
                  <span className="font-medium text-gray-800 text-right">
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? "Adding product…" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;