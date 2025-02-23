"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categoriesSlice";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CategoryButton from "./CategoryButton";
import axios from "axios";

const Product = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);

  const [favorites, setFavorites] = useState({});
  const [cartItems, setCartItems] = useState({});

  const fetchCartData = useCallback(async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_CARTS);
      const cartData = Array.isArray(response.data) ? response.data : [];

      const cartMap = cartData.reduce((acc, item) => {
        acc[item.product_id] = {
          cartId: item.id,
          count: item.count,
          tip: item.tip,
        };
        return acc;
      }, {});

      setCartItems(cartMap);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, []);

  const fetchData = useCallback(() => {
    if (selectedBranch?.id) {
      dispatch(fetchProducts(selectedBranch.id));
      dispatch(fetchCategories(selectedBranch.id));
      fetchCartData();
    }
  }, [selectedBranch, dispatch, fetchCartData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.shop_id === selectedBranch?.id && product.is_active
    );
  }, [products, selectedBranch]);

  const groupedByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = categories.find((cat) => cat.id === product.category_id);
      const categoryName = category
        ? category[`name_${i18n.language}`]
        : t("unknown");

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          products: [],
        };
      }

      acc[categoryName].products.push(product);
      return acc;
    }, {});
  }, [filteredProducts, categories, i18n.language, t]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === "uz" ? "uz-UZ" : "en-US", {
      style: "currency",
      currency: "UZS",
    }).format(price);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateCartQuantity = async (productId, newCount) => {
    const cartItem = cartItems[productId];
    if (!cartItem) return;

    try {
      if (newCount < 1) {
        await axios.delete(
          `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartItem.cartId}`
        );
        setCartItems((prev) => {
          const newItems = { ...prev };
          delete newItems[productId];
          return newItems;
        });
      } else {
        await axios.patch(
          `${import.meta.env.VITE_CARTS}?cart_id=${
            cartItem.cartId
          }&count=${newCount}&tip_id=${cartItem.tip.id}`
        );
        setCartItems((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            count: newCount,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      fetchCartData();
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_CARTS}`, {
        product_id: productId,
        count: 1,
      });
      fetchCartData();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="max-w-[450px] mx-auto p-2">
      {Object.values(groupedByCategory).map(({ name, products }) => (
        <div key={name} className="mb-8">
          <h2 className="text-lg font-semibold capitalize mb-2">{name}</h2>

          <Swiper
            slidesPerView={4.2}
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            breakpoints={{
              320: { slidesPerView: 1.9, spaceBetween: 6 },
              350: { slidesPerView: 2.2, spaceBetween: 6 },
              400: { slidesPerView: 2.3, spaceBetween: 6 },
              440: { slidesPerView: 2.5, spaceBetween: 8 },
            }}
          >
            {products.map((product) => {
              const cartItem = cartItems[product.id];

              return (
                <SwiperSlide key={product.id}>
                  <div
                    className="cursor-pointer mb-2 flex flex-col border rounded-md shadow-lg text-center relative"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                        alt={product[`name_${i18n.language}`]}
                        className="w-full h-[120px] rounded-t-md object-cover"
                      />
                      <span
                        className="absolute top-1 right-1 bg-white px-1 border rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        {favorites[product.id] ? (
                          <FavoriteIcon className="!text-red-500 !text-[20px] mb-[2px]" />
                        ) : (
                          <FavoriteBorderIcon className="!text-[20px] mb-[2px]" />
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm px-2 font-medium capitalize truncate mt-2">
                      {product[`name_${i18n.language}`]}
                    </h3>

                    <p className="flex items-center justify-between font-medium text-xs py-1 mx-2">
                      <span>
                        {cartItem ? cartItem.tip.volume : product.volume}{" "}
                        {cartItem ? cartItem.tip.unit : product.unit}
                      </span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(
                          cartItem ? cartItem.tip.price : product.price
                        )}
                      </span>
                    </p>

                    <div
                      className="flex items-center justify-between mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cartItem ? (
                        <div
                          className="px-2 py-1 rounded-lg flex items-center justify-between w-full bg-white shadow-xl"
                          style={{
                            boxShadow:
                              "4px 4px 8px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <button
                            className="w-7 h-7 rounded-full bg-white text-red-500 hover:text-red-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                            onClick={() =>
                              updateCartQuantity(product.id, cartItem.count - 1)
                            }
                            style={{
                              boxShadow:
                                "inset -2px -2px 6px rgba(255, 255, 255, 0.6), inset 2px 2px 6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <AiOutlineMinus size={14} />
                          </button>
                          <span className="text-xl font-bold px-4 min-w-[30px] text-gray-800 select-none">
                            {cartItem.count}
                          </span>
                          <button
                            className="w-7 h-7 rounded-full bg-white text-green-500 hover:text-green-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                            onClick={() =>
                              updateCartQuantity(product.id, cartItem.count + 1)
                            }
                            style={{
                              boxShadow:
                                "inset -2px -2px 6px rgba(255, 255, 255, 0.6), inset 2px 2px 6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <AiOutlinePlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="w-full py-2 bg-blue-600 text-white rounded-md flex  text-sm items-center justify-center"
                          onClick={() => addToCart(product.id)}
                        >
                          <FaCartPlus className="mr-2" />
                          {t("add_to_cart")}
                        </button>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <CategoryButton />
        </div>
      ))}
    </div>
  );
};

export default Product;
