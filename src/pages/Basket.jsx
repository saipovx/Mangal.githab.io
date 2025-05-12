import React, { useEffect, useState } from "react";
import axios from "axios";
import '../scss/Basket.scss';
import { IMaskInput } from 'react-imask';


export default function Basket() {
  const [cartItems, setCartItems] = useState([]);

  const [formErrors, setFormErrors] = useState({});


  const initialFormData = {
    name: "",
    surname: "",
    address: "",
    phone: "",
    paymentMethod: "Наличные",
    comments: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const stored = localStorage.getItem("basket");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const updateLocalStorage = (items) => {
    setCartItems(items);
    localStorage.setItem("basket", JSON.stringify(items));
  };

  const handleRemoveFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    updateLocalStorage(updatedCart);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) - 1;
    if (updatedCart[index].quantity < 1) updatedCart[index].quantity = 1;
    updateLocalStorage(updatedCart);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + item.price * quantity;
  }, 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  
  const sendOrderToTelegram = async (formData, cartItems, totalAmount) => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
    const message = 
    `🛒 Новый заказ!
    
  👤 Имя: ${formData.name}
  👤 Фамилия: ${formData.surname}
  🏡 Адрес: ${formData.address}
  📞 Телефон: ${formData.phone}
  💳 Оплата: ${formData.paymentMethod}
  📝 Комментарий: ${formData.comments || "—"}
    
  🧾 Товары:
  ${cartItems
  .map(
  (item, i) =>
  `${i + 1}. ${item.emoji || "🍽️"} ${item.title} — x${item.quantity || 1} = ${
  item.price * (item.quantity || 1)
  } сом`
  )
  .join('\n')}
    
💰 Общая сумма: ${totalAmount.toFixed(2)} сом`;
    
    
  
    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
      alert("✅ Заказ отправлен в Telegram!");
    } catch (error) {
      console.error("Ошибка отправки заказа:", error.response?.data || error.message);
      alert("❌ Ошибка при отправке заказа.");
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    await sendOrderToTelegram(formData, cartItems, totalAmount);
    setCartItems([]);
    localStorage.removeItem("basket");
    setFormData(initialFormData);
    setFormErrors({});
  };
  

  const validateForm = () => {
    const errors = {};
  
    if (!formData.name.trim()) errors.name = "Введите имя";
    if (!formData.surname.trim()) errors.surname = "Введите фамилию";
    if (!formData.address.trim()) errors.address = "Введите адрес";
    if (!formData.phone.trim()) errors.phone = "Введите номер телефона";
    if (!formData.paymentMethod) errors.paymentMethod = "Выберите способ оплаты";
  
    setFormErrors(errors);
  
    return Object.keys(errors).length === 0;
  };
  


  return (
    <div className="container">
      <section className="Basket">
        <h1 className="title">Корзинка</h1>

        <div className="cart-itemss">
          {cartItems.length === 0 ? (
            <p className="cart__subtitle">Вы еще не добавили товар ...</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="product-cardd">
                <div className="product-cardd__Tp1">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="product-cardd__image"
                    />
                  )}
                  <h2 className="product-cardd__title">{item.title}</h2>
                  <p className="product-cardd__price">
                    {item.price} сом x {item.quantity || 1} ={" "}
                    {(item.price * (item.quantity || 1)).toFixed(2)} сом
                  </p>
                </div>
                <div className="product-cardd__Tp2">
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    className="btn-remove"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="basket-total">
            <h2>Общая сумма: {totalAmount.toFixed(2)} сом</h2>
          </div>
        )}

        <h2 className="title">Данные для доставки</h2>

        <div className="delivery-form">
          <form onSubmit={handleSubmit}>
            <label className="delivery-form__label">
              Имя:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
              {formErrors.name && <p className="error-text">{formErrors.name}</p>}
            </label>

            <label className="delivery-form__label">
              Фамилия:
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleFormChange}
                required
              />
              {formErrors.surname && <p className="error-text">{formErrors.surname}</p>}
            </label>

            <label className="delivery-form__label">
              Адрес доставки:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
              />
              {formErrors.address && <p className="error-text">{formErrors.address}</p>}
            </label>

<label className="delivery-form__label">
  Телефон:
  <IMaskInput
  mask="+996 000 000 000"
  lazy={false}
  unmask={false}
  value={formData.phone}
  onAccept={(value) =>
    setFormData((prev) => ({ ...prev, phone: value }))
  }
  className="your-input-class"
/>
  {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
</label>

            <label className="delivery-form__label">
              Способ оплаты:
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleFormChange}
                required
              >
                <option value="Наличные">Наличные</option>
                <option value="Переводом">Переводом</option>
              </select>
              {formErrors.paymentMethod && <p className="error-text">{formErrors.paymentMethod}</p>}
            </label>

            <label className="delivery-form__label">
              Комментарии:
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleFormChange}
              ></textarea>
            </label>

            {cartItems.length > 0 && (
              <div className="basket-total">
                <h2>Общая сумма: {totalAmount.toFixed(2)} сом</h2>
                <button type="submit" className="basket-total__btn">
                  Заказать
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
