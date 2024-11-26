import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiX } from 'react-icons/fi';
import routes from '../../constants/routes';
import { categories } from '../../constants/categories';
import { useParams } from 'react-router-dom';

const AddEditProduct = ({ onProductSaved }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: [],
    stock: '',
    images: [],
    hasVariations: false,
    variations: [],
    basePrice: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVariation, setNewVariation] = useState({ name: '', options: [] });
  const [newOption, setNewOption] = useState({ name: '', price: '', stock: '' });
  const [editingVariation, setEditingVariation] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProductById();
    }
  }, [id]);

  const fetchProductById = async () => {
    try {
      const response = await axios.get(routes.product.getProductById(id));
      const productToEdit = response.data.data;
      setProductData(productToEdit);
      setPreviewImage(productToEdit.images[0] || '');
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setProductData(prevData => ({
      ...prevData,
      category: prevData.category.includes(category)
        ? prevData.category.filter(c => c !== category)
        : [...prevData.category, category]
    }));
  };

  const handleImageAdd = () => {
    if (newImageUrl && !productData.images.includes(newImageUrl)) {
      setProductData(prevData => ({
        ...prevData,
        images: [...prevData.images, newImageUrl]
      }));
      if (!previewImage) setPreviewImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  const handleImageRemove = (imageToRemove) => {
    setProductData(prevData => ({
      ...prevData,
      images: prevData.images.filter(img => img !== imageToRemove)
    }));
    if (previewImage === imageToRemove) {
      setPreviewImage(productData.images[0] || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        response = await axios.put(routes.product.edit(id), productData);
      } else {
        response = await axios.post(routes.product.create, productData);
      }
      onProductSaved(response.data.data);
      if (!id) {
        setProductData({
          name: '',
          description: '',
          price: '',
          category: [],
          stock: '',
          images: [],
          hasVariations: false,
          variations: [],
          basePrice: ''
        });
        setPreviewImage('');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditVariation = (variation, index) => {
    setEditingVariation({ ...variation, index });
    setNewVariation({ ...variation });
  };

  const handleOptionUpdate = (optionIndex, field, value) => {
    setNewVariation(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === optionIndex 
          ? { 
              ...opt, 
              [field]: value,
              ...(field === 'price' && value 
                ? { priceNote: `+$${value} from base price` } 
                : {})
            } 
          : opt
      )
    }));
  };

  const handleRemoveOption = (optionIndex) => {
    setNewVariation(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== optionIndex)
    }));
  };

  const handleAddVariation = () => {
    if (newVariation.name && newVariation.options.length > 0) {
      setProductData(prev => ({
        ...prev,
        variations: editingVariation
          ? prev.variations.map((v, i) => 
              i === editingVariation.index ? { ...newVariation } : v
            )
          : [...prev.variations, { ...newVariation }]
      }));
      setNewVariation({ name: '', options: [] });
      setEditingVariation(null);
    }
  };

  const handleAddOption = () => {
    if (newOption.name && newOption.stock) {
      setNewVariation(prev => ({
        ...prev,
        options: [...prev.options, { 
          ...newOption,
          ...(newOption.price ? { priceNote: `+$${newOption.price} from base price` } : {})
        }]
      }));
      setNewOption({ name: '', price: '', stock: '' });
    }
  };

  const handleRemoveVariation = (index) => {
    setProductData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleVariationsToggle = (e) => {
    const hasVariations = e.target.checked;
    setProductData(prev => ({
      ...prev,
      hasVariations,
      basePrice: hasVariations ? prev.price : '',
      variations: []
    }));
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{id ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="input bg-base-200   focus:outline-none focus:ring-0 focus:border-primary"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="input bg-base-200 focus:outline-none focus:ring-0 focus:border-primary"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock</span>
            </label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
                placeholder="Stock"
                className="input bg-base-200 focus:outline-none focus:ring-0 focus:border-primary"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Categories</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <label key={category} className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={productData.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="label-text ml-2">{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Images</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Add image URL"
                className="input bg-base-200 focus:outline-none focus:ring-0 focus:border-primary flex-grow"
              />
              <button type="button" onClick={handleImageAdd} className="btn btn-primary">
                <FiPlus />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {productData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setPreviewImage(img)}
                    className={`w-full h-24 object-cover cursor-pointer ${previewImage === img ? 'border-4 border-primary' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(img)}
                    className="btn btn-circle btn-xs absolute top-1 right-1"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {previewImage && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Preview</span>
              </label>
              <img src={previewImage} alt="Preview" className="w-full h-64 object-contain" />
            </div>
          )}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Enable Product Variations</span>
              <input
                type="checkbox"
                checked={productData.hasVariations}
                onChange={handleVariationsToggle}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
          {productData.hasVariations && (
            <div className="form-control space-y-4">
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Product Variations</h3>
                
                {productData.variations.map((variation, index) => (
                  <div key={index} className="card bg-base-200 mb-4">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{variation.name}</h4>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditVariation(variation, index)}
                            className="btn btn-sm btn-ghost"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(index)}
                            className="btn btn-sm btn-error"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                      
                      {editingVariation?.index === index ? (
                        <div className="space-y-4 mt-4">
                          <input
                            type="text"
                            value={newVariation.name}
                            onChange={(e) => setNewVariation(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Variation Name"
                            className="input input-bordered w-full"
                          />
                          
                          {newVariation.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => handleOptionUpdate(optIndex, 'name', e.target.value)}
                                placeholder="Option Name"
                                className="input input-bordered flex-1"
                              />
                              <div className="relative w-32">
                                <input
                                  type="number"
                                  value={option.price}
                                  onChange={(e) => handleOptionUpdate(optIndex, 'price', e.target.value)}
                                  placeholder="Extra Price"
                                  className="input input-bordered w-full"
                                />
                              </div>
                              <input
                                type="number"
                                value={option.stock}
                                onChange={(e) => handleOptionUpdate(optIndex, 'stock', e.target.value)}
                                placeholder="Stock"
                                className="input input-bordered w-32"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(optIndex)}
                                className="btn btn-error btn-square"
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                          
                          {/* Option adding form */}
                          <div className="flex gap-2 mb-4">
                            <input
                              type="text"
                              value={newOption.name}
                              onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Option (e.g., XL, Red)"
                              className="input input-bordered flex-1"
                            />
                            <div className="relative w-32">
                              <input
                                type="number"
                                value={newOption.price}
                                onChange={(e) => setNewOption(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="Extra Price"
                                className="input input-bordered w-full"
                              />
                              <span className="absolute text-xs text-gray-500 -bottom-5 left-0">
                                {newOption.price 
                                  ? `Total: $${Number(productData.basePrice) + Number(newOption.price)}`
                                  : ''}
                              </span>
                            </div>
                            <input
                              type="number"
                              value={newOption.stock}
                              onChange={(e) => setNewOption(prev => ({ ...prev, stock: e.target.value }))}
                              placeholder="Stock"
                              className="input input-bordered w-32"
                            />
                            <button
                              type="button"
                              onClick={handleAddOption}
                              className="btn btn-primary"
                            >
                              Add Option
                            </button>
                          </div>
                          
                          <div className="flex gap-2 justify-end mt-4">
                            <button
                              type="button"
                              onClick={() => setEditingVariation(null)}
                              className="btn btn-ghost"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddVariation}
                              className="btn btn-primary"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="table table-compact w-full">
                            <thead>
                              <tr>
                                <th>Option</th>
                                <th>Price</th>
                                <th>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variation.options.map((option, optIndex) => (
                                <tr key={optIndex}>
                                  <td>{option.name}</td>
                                  <td>
                                    {option.price 
                                      ? `+$${option.price} (Total: $${Number(productData.basePrice) + Number(option.price)})`
                                      : `$${productData.basePrice}`}
                                  </td>
                                  <td>{option.stock}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-medium mb-4">
                      {editingVariation ? 'Edit Variation' : 'Add New Variation'}
                    </h4>
                    <input
                      type="text"
                      value={newVariation.name}
                      onChange={(e) => setNewVariation(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Variation Name (e.g., Size, Color)"
                      className="input input-bordered w-full mb-4"
                    />

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newOption.name}
                        onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Option (e.g., XL, Red)"
                        className="input input-bordered flex-1"
                      />
                      <div className="relative w-32">
                        <input
                          type="number"
                          value={newOption.price}
                          onChange={(e) => setNewOption(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="Extra Price"
                          className="input input-bordered w-full"
                        />
                        <span className="absolute text-xs text-gray-500 -bottom-5 left-0">
                          {newOption.price 
                            ? `Total: $${Number(productData.basePrice) + Number(newOption.price)}`
                            : ''}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={newOption.stock}
                        onChange={(e) => setNewOption(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="Stock"
                        className="input input-bordered w-32"
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="btn btn-primary"
                      >
                        Add Option
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariation}
                      className="btn btn-secondary w-full"
                      disabled={!newVariation.name || newVariation.options.length === 0}
                    >
                      {editingVariation ? 'Update Variation' : 'Add Variation'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
