import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <tr key={item._id}>
    <td>
      <div className="flex items-center space-x-3">
        <div className="avatar">
          <div className="w-12 h-12">
            <img src={item.images[0]} alt={item.name} width={512} height={512} />
          </div>
        </div>
        <div>
          <div className="font-bold">{item.name}</div>
          {item.selectedVariations && (
            <div className="text-sm text-gray-600">
              {item.selectedVariations.map((variation, index) => (
                <div key={index}>
                  {variation.name}: {variation.option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </td>
    <td>${item.price.toFixed(2)}</td>
    <td>
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
        className="input input-bordered w-20"
      />
    </td>
    <td>${(item.price * item.quantity).toFixed(2)}</td>
    <td>
      <button onClick={() => removeFromCart(item._id)} className="btn btn-ghost btn-sm">
        <FaTrash />
      </button>
    </td>
  </tr>
);

export default CartItem;
