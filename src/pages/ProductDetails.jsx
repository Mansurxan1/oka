"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Search from "../components/Search";
import { FaAngleDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showQuantity, setShowQuantity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);

  // Reset all states
  const resetAllStates = useCallback(() => {
    setProduct(null);
    setSelectedSize(null);
    setQuantity(0);
    setShowQuantity(false);
    setCartId(null);
    setError(null);
  }, []);

  // Fetch product details
  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/shop-products/detail?product_id=${id}`
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(t("notFound"));
    }
  }, [id, t]);

  // Check cart data
  const checkCartData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_CARTS}?product_id=${id}`
      );
      const cartData = response.data;

      // Cart bo'sh bo'lmasa va massiv bo'lsa
      if (Array.isArray(cartData) && cartData.length > 0) {
        // Joriy mahsulot ID si bilan cart dagi mahsulotlarni tekshirish
        const currentProductInCart = cartData.find(
          (item) => item.product_id === Number(id)
        );

        if (currentProductInCart) {
          // Agar joriy mahsulot cartda bo'lsa
          setCartId(currentProductInCart.id);
          setSelectedSize(currentProductInCart.tip);
          setQuantity(currentProductInCart.count);
          setShowQuantity(true);
        } else {
          // Agar joriy mahsulot cartda bo'lmasa
          setCartId(null);
          setSelectedSize(null);
          setQuantity(0);
          setShowQuantity(false);
        }
      } else {
        // Cart bo'sh bo'lsa
        setCartId(null);
        setSelectedSize(null);
        setQuantity(0);
        setShowQuantity(false);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      // Xatolik bo'lsa ham state'larni tozalash
      setCartId(null);
      setSelectedSize(null);
      setQuantity(0);
      setShowQuantity(false);
    }
  }, [id]);

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      setCartLoading(true);

      // Reset all states when navigating to new product
      resetAllStates();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Fetch product details
      await fetchProductDetails();

      // Check cart data
      await checkCartData();

      setLoading(false);
      setCartLoading(false);
    };

    initializeComponent();
  }, [resetAllStates, fetchProductDetails, checkCartData]);

  // Delete item from cart
  const deleteFromCart = async (cartItemId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartItemId}`
      );
      return true;
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return false;
    }
  };

  // Update cart in API
  const updateCartInApi = async (newQuantity, tipId = selectedSize?.id) => {
    if (!tipId) return false;
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_CARTS
        }?cart_id=${cartId}&count=${newQuantity}&tip_id=${tipId}`
      );
      return true;
    } catch (error) {
      console.error("Error updating cart:", error);
      return false;
    }
  };

  // Update cart
  const updateCart = async (newQuantity) => {
    if (newQuantity < 1) {
      if (cartId) {
        const success = await deleteFromCart(cartId);
        if (success) {
          setShowQuantity(false);
          setSelectedSize(null);
          setQuantity(0);
          setCartId(null);
          // Cart ma'lumotlarini qayta yuklash
          await checkCartData();
        }
      }
      return;
    }

    if (selectedSize) {
      const success = await updateCartInApi(newQuantity, selectedSize.id);
      if (success) {
        setQuantity(newQuantity);
        // Cart ma'lumotlarini qayta yuklash
        await checkCartData();
      }
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold mt-10">{error}</div>
    );
  }

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(product.id)
        ? prev.filter((favId) => favId !== product.id)
        : [...prev, product.id]
    );
  };

  const totalPrice = (selectedSize?.price || 0) * quantity;
  const currentLang = i18n.language;

  return (
    <div className="bg-white">
      <Search />
      <div className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border-[1px] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h1 className="text-2xl w-full font-semibold capitalize">
          {product[`name_${currentLang}`]}
        </h1>
      </div>

      <div className="sticky top-0">
        <img
          src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
          alt={product[`name_${currentLang}`]}
          className="w-full h-96 object-cover"
        />
        <button
          className="absolute top-2 right-2 bg-white px-2 py-1 border rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          {favorites.includes(product.id) ? (
            <FavoriteIcon className="!text-red-500 text-[25px]" />
          ) : (
            <FavoriteBorderIcon className="text-[25px]" />
          )}
        </button>
      </div>

      <div className="px-4 pt-2 rounded-[30px] z-2 relative -top-5 bg-white relative">
        <div className="">
          <h2 className="text-xl text-center font-bold">{t("description")}</h2>
          <p className="flex items-center gap-5 font-bold font-medium text-base py-1">
            {product.volume} {product.unit}
            <span className="text-lg font-medium">
              {Number(40000).toLocaleString("ru-RU")} {t("UZS")}
            </span>
          </p>
        </div>
        <p className="text-gray-700">{product[`description_${currentLang}`]}</p>
        <h3 className="text-xl text-center font-bold mt-3">
          {t("productSize")}:
        </h3>

        {cartLoading ? (
          <div className="text-center py-4">{t("loading")}</div>
        ) : (
          <>
            <div className="mt-2 space-y-2">
              {product.tips.map((size) => (
                <label
                  key={size.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition hover:bg-blue-200 hover:border-blue-500 ${
                    selectedSize?.id === size.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="size"
                      className="w-5 h-5 accent-blue-600"
                      checked={selectedSize?.id === size.id}
                      onChange={async () => {
                        setSelectedSize(size);
                        // Agar cartda bo'lsa
                        if (cartId) {
                          const success = await updateCartInApi(1, size.id);
                          if (success) {
                            setQuantity(1);
                            setShowQuantity(true);
                          }
                        } else {
                          // Yangi tanlov uchun
                          setQuantity(1);
                          setShowQuantity(true);
                        }
                      }}
                    />
                    <span className="text-lg font-medium">
                      {size.volume} {size.unit}
                    </span>
                  </div>
                  <span className="text-lg font-medium">
                    {size.price.toLocaleString("ru-RU")} {t("UZS")}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
        {selectedSize && (
          <>
            {showQuantity && (
              <>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateCart(quantity - 1)}
                      className="w-10 h-10 rounded-full bg-white text-red-500 hover:text-red-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                    >
                      <AiOutlineMinus size={20} />
                    </button>
                    <span className="text-lg font-medium w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCart(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-white text-green-500 hover:text-green-600 hover:scale-105 transition-transform shadow-md flex items-center justify-center"
                    >
                      <AiOutlinePlus size={20} />
                    </button>
                  </div>
                  <p className="text-lg font-semibold">
                    {t("price")}: {totalPrice.toLocaleString()} so'm
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link
                    to={"/cart"}
                    className="w-full mt-4 text-center bg-blue-600 text-white p-3 rounded-md"
                  >
                    {t("addToCart")}
                  </Link>
                  <Link
                    to={"/purchase"}
                    className="w-full mt-4 text-center bg-blue-600 text-white p-3 rounded-md"
                  >
                    {t("purchase")}
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
