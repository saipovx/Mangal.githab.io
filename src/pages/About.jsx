import React, { useState } from "react";
import '../scss/about.scss'
// Импортируем изображения с помощью Vite
import menu1 from "../assets/1.jpg";
import menu2 from "../assets/2.jpg";
import menu3 from "../assets/3.jpg";
import menu4 from "../assets/4.jpg";
import menu5 from "../assets/5.jpg";
import menu6 from "../assets/6.jpg";
import menu7 from "../assets/7.jpg";
import menu8 from "../assets/8.jpg";
import menu9 from "../assets/9.jpg";
import menu10 from "../assets/10.jpg";
import menu11 from "../assets/11.jpg";
import menu12 from "../assets/12.jpg";
import menu13 from "../assets/13.jpg";
import menu14 from "../assets/14.jpg";
import menu15 from "../assets/15.jpg";
import menu16 from "../assets/16.jpg";
import menu17 from "../assets/17.jpg";
import menu18 from "../assets/18.jpg";
import menu19 from "../assets/19.jpg";
import menu20 from "../assets/20.jpg";
import menu21 from "../assets/21.jpg";
import menu22 from "../assets/22.jpg";
import menu23 from "../assets/23.jpg";
import menu24 from "../assets/24.jpg";
import menu25 from "../assets/25.jpg";
import menu26 from "../assets/26.jpg";
import menu27 from "../assets/27.jpg";
// import menu28 from "../assets/28.jpg";
import menu29 from "../assets/29.jpg";
import menu30 from "../assets/30.jpg";
import menu31 from "../assets/31.jpg";
import menu32 from "../assets/32.jpg";
import menu33 from "../assets/33.jpg";
import menu34 from "../assets/34.jpg";
import menu35 from "../assets/35.jpg";
import menu36 from "../assets/36.jpg";
import menu37 from "../assets/37.jpg";
import menu38 from "../assets/38.jpg";
import menu40 from "../assets/40.jpg";
import menu41 from "../assets/41.jpg";
import menu42 from "../assets/42.jpg";
import menu43 from "../assets/43.jpg";
import menu44 from "../assets/44.jpg";
import menu45 from "../assets/45.jpg";
import menu46 from "../assets/46.jpg";
import menu47 from "../assets/47.jpg";
import menu48 from "../assets/48.jpg";

const images = [
  menu1,
  menu2,
  menu3,
  menu4,
  menu5,
  menu6,
  menu7,
  menu8,
  menu9,
  menu10,
  menu11,
  menu12,
  menu13,
  menu14,
  menu15,
  menu16,
  menu17,
  menu18,
  menu19,
  menu20,
  menu21,
  menu22,
  menu23,
  menu24,
  menu25,
  menu26,
  menu27,
//   menu28,
  menu29,
  menu30,
  menu31,
  menu32,
  menu33,
  menu34,
  menu35,
  menu36,
  menu37,
  menu38,
  menu40,
  menu41,
  menu42,
  menu43,
  menu44,
  menu45,
  menu46,
  menu47,
  menu48,
];

export default function About() {
  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (

    <div className="container">

      <section className="Basket">

    <h1 className="title" >Электронное меню</h1>

        
    <div className="gallery">
      <div className="image-grid">
        {images.map((image, i) => (
          <div key={i} className="image-item">
            <img
              src={image}
              alt={`menu ${i + 1}`}
              className="gallery-image"
               loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>

      </section>


    </div>
  );
}
