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
  });
  const [previewImage, setPreviewImage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

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
        });
        setPreviewImage('');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
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
              className="textarea bg-base-200 focus:outline-none focus:ring-0 focus:border-primary h-24"
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
