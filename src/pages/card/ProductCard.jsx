import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCart } from "../../slices/cartSlice";
import './ProductCard.scss';

export default function ProductCard({ product, onAddToCart }) {
  const cart = useSelector(selectCart);

  const hasOptions = product.hasOwnProperty('options') && Array.isArray(product.options);
  const [selectedOption, setSelectedOption] = useState(hasOptions ? product.options[0] : null);

  const productInCart = cart.some(item => {
    return item.id === product.id &&
           (!hasOptions || item.variant === selectedOption.variant);
  });

  const handleAddToCart = () => {
    if (!productInCart) {
      const finalProduct = {
        ...product,
        price: hasOptions ? selectedOption.price : product.price,
        variant: hasOptions ? selectedOption.variant : undefined
      };
      onAddToCart(finalProduct);
    }
  };

  return (
    <div className="product-card">
      {product.img && (
        <img
          src={product.img}
          alt={product.title}
          className="product-card__image"
        />
      )}

      <h2 className="product-card__title">{product.title}</h2>
      <p className="product-card__subtitle">{product.subtitle}</p>

      {hasOptions && (
        <select
          className="product-card__select"
          value={selectedOption?.variant}
          onChange={(e) =>
            setSelectedOption(product.options.find(opt => opt.variant === e.target.value))
          }
        >
          {product.options.map((option, index) => (
            <option key={`${product.id}-${option.variant}`} value={option.variant}>
              {option.variant} — {option.price} сом
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleAddToCart}
        className={`product-card__btn ${productInCart ? 'in-cart' : ''}`}
        disabled={productInCart}
      >
        {productInCart ? 'В корзине' : `${hasOptions ? selectedOption?.price : product.price} сом`}
      </button>
    </div>
  );
}
