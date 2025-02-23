import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LikesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState([]);
  const [selectedTips, setSelectedTips] = useState({});

  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!selectedBranch?.id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_FAVOURITES_PRODUCTS}/from-shop?shop_id=${
            selectedBranch.id
          }`
        );
        console.log("API dan kelgan yoqtirilgan mahsulotlar:", response.data);
        setLikedProducts(response.data);

        const initialTips = {};
        response.data.forEach((item) => {
          if (item.product && item.product.tips.length > 0) {
            initialTips[item.product.id] = item.product.tips[0];
          }
        });
        setSelectedTips(initialTips);
      } catch (error) {
        console.error(
          "❌ API xatosi (Yoqtirilgan mahsulotlarni olishda):",
          error.response?.data || error.message
        );
      }
    };

    fetchLikedProducts();
  }, [selectedBranch]);

  const handleTipChange = (productId, volume) => {
    const product = likedProducts.find(
      (item) => item.product.id === productId
    )?.product;
    if (product) {
      const newTip = product.tips.find((tip) => tip.volume === Number(volume));
      setSelectedTips((prev) => ({ ...prev, [productId]: newTip }));
    }
  };

  const handleRemoveLike = async (id) => {
    console.log(`🗑 Mahsulot o‘chirilmoqda: ${id}`);

    setLikedProducts((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_FAVOURITES_PRODUCTS}?favourites_id=${id}`
      );

      console.log("✅ API javobi (Mahsulot o‘chirildi):", response.data);
    } catch (error) {
      console.error(
        "❌ API xatosi (Mahsulotni o‘chirishda):",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-[450px] mt-[80px] mx-auto p-2">
      <h2 className="text-lg font-semibold capitalize mb-4">
        {t("favorites")}
      </h2>

      {likedProducts.length > 0 ? (
        likedProducts.map((item) => {
          const product = item.product;
          const selectedTip = selectedTips[product.id] || product.tips[0];

          return (
            <div
              key={product.id}
              className="flex items-center border rounded-lg shadow-md mb-3 p-2 bg-white"
            >
              <div onClick={() => navigate(`/product/${product.id}`)}>
                <img
                  src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                  alt={
                    currentLanguage === "uz" ? product.name_uz : product.name_ru
                  }
                  className="w-[80px] h-[80px] object-cover rounded-md"
                />
              </div>

              <div className="ml-3 flex-1">
                <h3
                  className="text-sm font-medium cursor-pointer text-blue-600"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {currentLanguage === "uz" ? product.name_uz : product.name_ru}
                </h3>

                <p
                  className="text-sm font-bold pb-1 bg-white cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {selectedTip.price.toLocaleString("ru-RU")} {t("UZS")}
                </p>

                <select
                  className={`border-none font-semibold outline-none text-xs px-2 py-1 rounded-md ${
                    selectedTip
                      ? "bg-blue-600 text-white"
                      : "bg-white text-black"
                  }`}
                  value={selectedTip?.volume || ""}
                  onChange={(e) => handleTipChange(product.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.tips.map((tip, index) => (
                    <option
                      key={index}
                      value={tip.volume}
                      className="text-xs font-medium bg-white text-black"
                    >
                      {`${tip.volume} ${tip.unit} — ${tip.price.toLocaleString(
                        "ru-RU"
                      )} uzs`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center h-[70px] justify-between">
                <button
                  className="text-red-500 text-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLike(item.id);
                  }}
                >
                  <FcLike />
                </button>

                <button
                  className="text-blue-600 text-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaCartPlus />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">{t("no_liked_products")}</p>
      )}
    </div>
  );
};

export default LikesPage;
