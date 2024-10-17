import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import routes from '../../constants/routes';
import { Link } from 'react-router-dom';

const ProductList = ({ products, onProductUpdate }) => {
    const handleRemoveProduct = async (productId) => {
      try {
        await axios.delete(routes.seller.removeProduct(productId));
        onProductUpdate();
      } catch (error) {
        console.error('Error removing product:', error);
      }
    };
  
    return (
      <div className="overflow-x-auto bg-base-100 p-4 card h-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className='hover:bg-base-200 transition-all'>
                <td><img src={product.images[0]} alt="preview" className='h-20 max-w-20'/></td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <Link to={`edit-product/${product._id}`} className="btn btn-accent btn-sm mr-4">
                    <FaEdit />
                  </Link>
                  <button className="btn btn-error btn-sm" onClick={() => handleRemoveProduct(product._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default ProductList;