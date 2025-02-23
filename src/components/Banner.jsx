import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

function Banner() {
  const [banners, setBanners] = useState([]);
  const { i18n } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/banners`)
      .then((response) => {
        setBanners(response.data.photos);
      })
      .catch((error) => console.error("Bannerlarni yuklashda xatolik:", error));
  }, [apiUrl, i18n.language]); // Til o‘zgarsa, bannerlar qayta yuklanadi

  const filteredBanners = banners.filter(
    (banner) => banner.language === i18n.language
  );

  return (
    <section className="max-w-[450px] h-[300px] w-full mx-auto relative">
      {filteredBanners.length > 0 && (
        <Swiper
          key={i18n.language} // Har safar til o‘zgarsa, Swiper qayta render bo‘ladi
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          speed={2000}
          fadeEffect={{ crossFade: true }}
          autoplay={
            filteredBanners.length > 1
              ? { delay: 3000, disableOnInteraction: false }
              : false
          }
          pagination={
            filteredBanners.length > 1
              ? { clickable: true, dynamicBullets: false }
              : false
          }
          loop={filteredBanners.length > 1}
          className="w-full h-[300px]"
        >
          {filteredBanners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative">
              <img
                src={`${apiUrl}/${banner.photo}`}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default Banner;
