import { useEffect, useMemo, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categoriesSlice";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CategoryButton from "./CategoryButton";
import axios from "axios";
import { motion } from "framer-motion";

const Product = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);

  const [favorites, setFavorites] = useState({}); // Sevimlilar holati
  const [cartItems, setCartItems] = useState({}); // Savat holati

  // Savat ma'lumotlarini olish
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
      console.log("Savat ma'lumotlari yuklandi:", cartMap);
    } catch (error) {
      console.error("Savat ma'lumotlarini olishda xato:", error);
    }
  }, []);

  // Sevimlilar ma'lumotlarini olish
  const fetchFavoritesData = useCallback(async () => {
    if (!selectedBranch?.id) return; // Filial tanlanmagan bo'lsa to'xtatamiz
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/favourites-products`,
        {
          params: {
            shop_id: selectedBranch.id,
            bot_user_id: 5283151626,
          },
        }
      );
      const favoritesData = Array.isArray(response.data) ? response.data : [];
      const favoritesMap = favoritesData.reduce((acc, item) => {
        acc[item.product_id] = true;
        return acc;
      }, {});
      setFavorites(favoritesMap);
      console.log("Sevimlilar yuklandi:", favoritesMap);
    } catch (error) {
      console.error("Sevimlilar ma'lumotlarini olishda xato:", error);
    }
  }, [selectedBranch]);

  // Barcha ma'lumotlarni yangilash
  const fetchData = useCallback(() => {
    if (selectedBranch?.id) {
      dispatch(fetchProducts(selectedBranch.id));
      dispatch(fetchCategories(selectedBranch.id));
      fetchCartData();
      fetchFavoritesData();
      console.log("Ma'lumotlar yangilandi, filial ID:", selectedBranch.id);
    }
  }, [selectedBranch, dispatch, fetchCartData, fetchFavoritesData]);

  // Dastlabki ma'lumotlarni olish
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Har 10 soniyada ma'lumotlarni yangilash
  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Faol mahsulotlarni filtrlab olish
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.shop_id === selectedBranch?.id && product.is_active
    );
  }, [products, selectedBranch]);

  // Mahsulotlarni kategoriyalar bo'yicha guruhlash
  const groupedByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = categories.find((cat) => cat.id === product.category_id);
      const categoryName = category
        ? category[`name_${i18n.language}`]
        : t("noma'lum");
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

  // Narxni formatlash
  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === "uz" ? "uz-UZ" : "en-US", {
      style: "currency",
      currency: "UZS",
    }).format(price);
  };

  // Sevimlilar holatini o'zgartirish (qo'shish yoki o'chirish)
  const toggleFavorite = async (productId) => {
    const isFavorite = favorites[productId];
    const params = {
      product_id: productId,
      shop_id: selectedBranch.id,
      bot_user_id: 5283151626,
    };

    try {
      if (isFavorite) {
        console.log("Sevimlidan o'chirish uchun DELETE so'rov:", params);
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/favourites-products`,
          {
            params,
          }
        );
        setFavorites((prev) => {
          const newFavorites = { ...prev };
          delete newFavorites[productId];
          return newFavorites;
        });
        console.log("Sevimli o'chirildi, ID:", productId);
      } else {
        console.log("Sevimliga qo'shish uchun POST so'rov:", params);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/favourites-products`,
          null,
          { params }
        );
        setFavorites((prev) => ({
          ...prev,
          [productId]: true,
        }));
        console.log("Sevimli qo'shildi, ID:", productId);
      }
    } catch (error) {
      console.error(
        "Sevimlilar bilan ishlashda xato:",
        error.response || error
      );
      fetchFavoritesData(); // Xato bo'lsa qayta yuklash
    }
  };

  // Savatdagi mahsulot miqdorini yangilash (avval UI, keyin API)
  const updateCartQuantity = async (productId, newCount) => {
    const cartItem = cartItems[productId];
    if (!cartItem) return;

    try {
      if (newCount < 1) {
        await axios.delete(
          `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartItem.cartId}`
        );

        // UI’dan ham o‘chiramiz
        setCartItems((prev) => {
          const newItems = { ...prev };
          delete newItems[productId];
          return newItems;
        });

        console.log("API’dan va UI’dan savatdan o‘chirildi, ID:", productId);
      } else {
        // 1 yoki undan katta qiymatlar uchun PATCH so‘rov
        const updateData = {
          cart_id: cartItem.cartId,
          count: newCount,
          tip_id: cartItem.tip.id,
        };
        console.log("Savatni yangilash uchun PATCH so'rov:", updateData);

        await axios.patch(
          `${import.meta.env.VITE_CARTS}?cart_id=${
            cartItem.cartId
          }&count=${newCount}&tip_id=${cartItem.tip.id}`
        );

        // UI’da miqdorni yangilaymiz
        setCartItems((prev) => {
          const newItems = { ...prev };
          delete newItems[productId];
          return newItems;
        });

        console.log("API’da va UI’da savat miqdori yangilandi, ID:", productId);
      }
    } catch (error) {
      console.error("Savatni yangilashda xato:", error);
      fetchCartData(); // Xato bo‘lsa, API’dan qayta yuklash
    }
  };

  // Savatga mahsulot qo'shish (avval UI, keyin API)
  const addToCart = async (productId, tipId) => {
    if (!selectedBranch?.id) {
      console.error("Xato: Filial tanlanmagan!");
      return;
    }

    const product = filteredProducts.find((p) => p.id === productId);
    const selectedTip = product.tips.length > 0 ? product.tips[0] : null;
    const tipIdToSend = selectedTip ? selectedTip.id : tipId;

    // Avval UI’da qo‘shamiz
    setCartItems((prev) => ({
      ...prev,
      [productId]: {
        cartId: null, // Bu keyin API’dan keladi
        count: 1,
        tip: selectedTip,
      },
    }));
    console.log("UI’da savatga qo'shildi, ID:", productId);

    // Keyin API’ga so'rov yuboramiz
    const cartData = new URLSearchParams();
    cartData.append("product_id", productId);
    cartData.append("tip_id", tipIdToSend);
    cartData.append("shop_id", selectedBranch.id);
    cartData.append("count", 1);

    console.log("Savatga qo'shish uchun POST so'rov:", cartData.toString());

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CARTS}?client_id=5283151626`,
        cartData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // API’dan kelgan cartId’ni yangilaymiz
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          cartId: response.data.id, // Agar API id qaytarsa
        },
      }));
      console.log("API’da savatga qo'shildi, ID:", productId);
    } catch (error) {
      console.error("Savatga qo'shishda xato:", error);
      fetchCartData(); // Xato bo'lsa, serverdan qayta yuklaymiz
    }
  };

  return (
    <div className="max-w-[450px] relative mx-auto p-2">
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
              const displayPrice =
                product.tips.length > 0 ? product.tips[0].price : product.price;

              return (
                <SwiperSlide key={product.id}>
                  <div
                    className="cursor-pointer bg-gray-100 mb-2 flex flex-col border rounded-md text-center relative"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative p-2  ">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                        alt={product[`name_${i18n.language}`]}
                        className="w-full h-[110px] rounded-md object-cover"
                      />
                      <span
                        className="absolute top-3 right-3 bg-white px-1 border rounded-full cursor-pointer"
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
                    <h3 className="text-sm px-2 font-medium capitalize truncate">
                      {product[`name_${i18n.language}`]}
                    </h3>
                    <div
                      className="flex items-center justify-between mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cartItem ? (
                        <div className="px-2 my-1 rounded-lg flex items-center justify-between w-full">
                          {/* Minus Button (chapdan kiradi) */}
                          <motion.button
                            className="py-2 px-3 border-2 rounded-md text-gray-600 transition-transform flex items-center justify-center"
                            onClick={() =>
                              updateCartQuantity(product.id, cartItem.count - 1)
                            }
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <AiOutlineMinus size={16} />
                          </motion.button>

                          {/* Count */}
                          <span className="px-6 text-gray-800 select-none">
                            {cartItem.count}
                          </span>

                          {/* Plus Button (o‘ngdan kiradi) */}
                          <motion.button
                            className="py-2 px-3 border-2 rounded-md text-gray-600 transition-transform flex items-center justify-center"
                            onClick={() =>
                              updateCartQuantity(product.id, cartItem.count + 1)
                            }
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <AiOutlinePlus size={16} />
                          </motion.button>
                        </div>
                      ) : (
                        <button
                          className="font-bold mx-auto py-[6px] px-2 mb-2 rounded-lg shadow-md border-gray-300 text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(
                              product.id,
                              product.tips.length > 0
                                ? product.tips[0].id
                                : null
                            );
                          }}
                        >
                          {formatPrice(displayPrice)}
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
