// ... другие импорты
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../scss/Basket.scss';
import { IMaskInput } from 'react-imask';

export default function Basket() {
  const [cartItems, setCartItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState(null); // 👈 добавим состояние для файла

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
    if (stored) setCartItems(JSON.parse(stored));
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
    updatedCart[index].quantity = Math.max(1, (updatedCart[index].quantity || 1) - 1);
    updateLocalStorage(updatedCart);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + item.price * quantity;
  }, 0);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Введите имя";
    if (!formData.surname.trim()) errors.surname = "Введите фамилию";
    if (!formData.address.trim()) errors.address = "Введите адрес";
    if (!formData.phone.trim()) errors.phone = "Введите номер телефона";
    if (!formData.paymentMethod) errors.paymentMethod = "Выберите способ оплаты";

    // 👇 обязательность файла если переводом
    if (formData.paymentMethod === "Переводом" && !file) {
      errors.file = "Загрузите чек или скрин оплаты";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendOrderToTelegram = async () => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    const textMessage =
`🛒 Новый заказ!

👤 Имя: ${formData.name}
👤 Фамилия: ${formData.surname}
🏡 Адрес: ${formData.address}
📞 Телефон: ${formData.phone}
💳 Оплата: ${formData.paymentMethod}
📝 От кого отправлен перевод: ${formData.comments || "—"}

🧾 Товары:
${cartItems
  .map((item, i) =>
    `${i + 1}. ${item.emoji || "🍽️"} ${item.title} — x${item.quantity || 1} = ${
      item.price * (item.quantity || 1)
    } сом`
  )
  .join("\n")}

💰 Общая сумма: ${totalAmount.toFixed(2)} сом`;

    // Сначала отправляем текстовое сообщение
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: textMessage,
    });

    // Если выбрана оплата "Переводом" и файл прикреплён — отправим его
    if (formData.paymentMethod === "Переводом" && file) {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", "💳 Чек об оплате");
      form.append("document", file);

      await axios.post(`https://api.telegram.org/bot${botToken}/sendDocument`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await sendOrderToTelegram();
      alert("✅ Заказ успешно отправлен!");
      setCartItems([]);
      localStorage.removeItem("basket");
      setFormData(initialFormData);
      setFormErrors({});
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Ошибка при отправке заказа.");
    }
  };

  return (
    <div className="container">
      <section className="Basket">
        <h1 className="title">Корзинка</h1>

        {/* CART LIST */}
        <div className="cart-itemss">
          {cartItems.length === 0 ? (
            <p className="cart__subtitle">Вы еще не добавили товар ...</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="product-cardd">
                <div className="product-cardd__Tp1">
                  {item.img && <img src={item.img} alt={item.title} className="product-cardd__image" />}
                  <h2 className="product-cardd__title">{item.title}</h2>
                  <p className="product-cardd__price">
                    {item.price} сом x {item.quantity || 1} = {(item.price * (item.quantity || 1)).toFixed(2)} сом
                  </p>
                </div>
                <div className="product-cardd__Tp2">
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                  <button onClick={() => handleRemoveFromCart(index)} className="btn-remove">Удалить</button>
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

        {/* FORM */}
        <h2 className="title">Данные для доставки</h2>
        <div className="delivery-form">
          <form onSubmit={handleSubmit}>
            {/* name */}
            <label className="delivery-form__label">
              Имя:
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
              {formErrors.name && <p className="error-text">{formErrors.name}</p>}
            </label>

            {/* surname */}
            <label className="delivery-form__label">
              Фамилия:
              <input type="text" name="surname" value={formData.surname} onChange={handleFormChange} required />
              {formErrors.surname && <p className="error-text">{formErrors.surname}</p>}
            </label>

            {/* address */}
            <label className="delivery-form__label">
              Адрес доставки:
              <input type="text" name="address" value={formData.address} onChange={handleFormChange} required />
              {formErrors.address && <p className="error-text">{formErrors.address}</p>}
            </label>

            {/* phone */}
            <label className="delivery-form__label">
              Телефон:
              <IMaskInput
                mask="+996 000 000 000"
                lazy={false}
                unmask={false}
                value={formData.phone}
                onAccept={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                className="your-input-class"
              />
              {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
            </label>

            {/* payment method */}
            <label className="delivery-form__label">
              Способ оплаты:
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleFormChange} required>
                <option value="Наличные">Наличные</option>
                <option value="Переводом">Переводом</option>
              </select>
              {formErrors.paymentMethod && <p className="error-text">{formErrors.paymentMethod}</p>}
            </label>

             {formData.paymentMethod === "Переводом" && (


              <p className="delivery-form__mbank">MBANK +996 554 00 00 06</p> 


              )}

            {/* 👇 upload block */}
            {formData.paymentMethod === "Переводом" && (
              <label className="delivery-form__label">
                Загрузите чек / скрин перевода:
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                {formErrors.file && <p className="error-text">{formErrors.file}</p>}
              </label>
            )}

            {/* comments */}

            {formData.paymentMethod === "Переводом" && (

            <label className="delivery-form__label">
              От кого отправлен перевод:
              <textarea name="comments" value={formData.comments} onChange={handleFormChange} />
            </label>
            
            )}

            {/* submit */}
            {cartItems.length > 0 && (
              <div className="basket-total">
                <h2>Общая сумма: {totalAmount.toFixed(2)} сом</h2>
                <button type="submit" className="basket-total__btn">Заказать</button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
