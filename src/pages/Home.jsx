import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './card/ProductCard';
import productsJson from '../pages/card/ProductJson';
import { setProducts, setSelectedType, selectProducts, selectSelectedType } from '../slices/productsSlice';
import {
  addToCart,
  selectCart,
  setCart
} from '../slices/cartSlice';

import '../scss/styles.scss';
import '../scss/Basket.scss';

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const selectedType = useSelector(selectSelectedType);
  const cart = useSelector(selectCart);

  // Сразу грузим данные и обновляем localStorage
  useEffect(() => {
    const allProducts = Object.values(productsJson).flat().sort((a, b) => a.id - b.id);
    dispatch(setProducts(allProducts));
    localStorage.setItem('products', JSON.stringify(allProducts));
  
    const savedType = localStorage.getItem('selectedType');
    dispatch(setSelectedType(savedType || 'All'));
  
    const savedCart = JSON.parse(localStorage.getItem('basket')) || [];
    dispatch(setCart(savedCart));
  }, [dispatch]);
  

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    localStorage.setItem('basket', JSON.stringify([...cart, product]));
  };

  const handleFilterChange = (type) => {
    dispatch(setSelectedType(type));
    localStorage.setItem('selectedType', type);
  };

  const filteredProducts = selectedType === 'All'
    ? products
    : products.filter((item) => item.type === selectedType);

  return (
    
    <section className='section__home'>

    <div className="container">
      <h1 className="title">Меню</h1>

      <div className="filter-buttons">
        {['All', 'Shoverma', 'Burger', 'Salat', 'Ramen', 'Pizza', 'Wok', 'holod', 'Zap', 'Tem','Slad','Des'].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={selectedType === type ? 'active' : ''}
          >
            {type === 'All' ? 'Все' :
             type === 'Shoverma' ? 'Шаурма' :
             type === 'Burger' ? 'Бургеры' :
             type === 'Salat' ? 'Салаты' :
             type === 'Ramen' ? 'Рамен и супы' :
             type === 'Pizza' ? 'Пицца' :
             type === 'Wok' ? 'Лапша Wok и горячие блюда' :
             type === 'holod' ? 'Холодные роллы' :
             type === 'Zap' ? 'Запечённые роллы' :
             type === 'Tem' ? 'Темпура роллы' :
             type === 'Slad' ? 'Сладкие роллы' :
             type === 'Des' ? 'Десерты' :
             type }

          </button>
        ))}
      </div>

      <div className="cart-items">
        {filteredProducts.map((item) => (
          <ProductCard
            key={`${item.id}-${item.title}`}
            product={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>


    </section>

  );
}
