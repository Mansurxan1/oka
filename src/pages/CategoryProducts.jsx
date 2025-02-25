import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import AOS from "aos";
import "aos/dist/aos.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { Loader } from "lucide-react";

const CategoryProducts = () => {
  const { t, i18n } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { products, loading, error, status } = useSelector(
    (state) => state.products
  );
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);

  const [favorites, setFavorites] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [cartLoading, setCartLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Birinchi yuklanishni nazorat qilish uchun

  // AOS ni faqat bir marta ishga tushirish
  useEffect(() => {
    AOS.init();
    window.scrollTo(0, 0);
  }, []); // Bo'sh dependency array bilan faqat bir marta ishlaydi

  // Savat ma'lumotlarini olish
  const fetchCartData = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_CARTS}`);
      const cartData = Array.isArray(response.data) ? response.data : [];
      const cartItemsMap = cartData.reduce((acc, item) => {
        acc[item.product_id] = {
          cartId: item.id,
          count: item.count,
          tip: item.tip,
        };
        return acc;
      }, {});
      setCartItems(cartItemsMap);
      console.log("Savat ma'lumotlari yuklandi:", cartItemsMap);
    } catch (error) {
      console.error("Savat ma'lumotlarini olishda xato:", error);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Mahsulotlarni va savatni birinchi marta yuklash
  useEffect(() => {
    if (selectedBranch?.id && initialLoad) {
      dispatch(fetchProducts(selectedBranch.id));
      fetchCartData();
      setInitialLoad(false); // Birinchi yuklanish tugadi
    }
  }, [dispatch, selectedBranch, fetchCartData, initialLoad]);

  // CategoryId o'zgarganda qayta yuklash
  useEffect(() => {
    if (selectedBranch?.id && !initialLoad) {
      dispatch(fetchProducts(selectedBranch.id));
    }
  }, [categoryId, selectedBranch, dispatch]);

  // Savatdagi mahsulot miqdorini yangilash (avval UI, keyin API)
  const updateCartQuantity = async (productId, newCount) => {
    const cartItem = cartItems[productId];
    if (!cartItem) return;

    // Avval UI’da yangilaymiz
    if (newCount < 1) {
      setCartItems((prev) => {
        const newItems = { ...prev };
        delete newItems[productId];
        return newItems;
      });
      console.log("UI’da savatdan o'chirildi, ID:", productId);
    } else {
      setCartItems((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], count: newCount },
      }));
      console.log("UI’da savat miqdori yangilandi, ID:", productId);
    }

    // Keyin API’ga so'rov yuboramiz
    try {
      if (newCount < 1) {
        console.log("Savatdan o'chirish uchun DELETE so'rov:", cartItem.cartId);
        await axios.delete(
          `${import.meta.env.VITE_CARTS}/delete?cart_id=${cartItem.cartId}`
        );
        console.log("API’dan savatdan o'chirildi, ID:", productId);
      } else {
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
        console.log("API’da savat miqdori yangilandi, ID:", productId);
      }
    } catch (error) {
      console.error("Savatni yangilashda xato:", error);
      fetchCartData(); // Xato bo'lsa serverdan qayta yuklaymiz
    }
  };

  // Savatga mahsulot qo'shish (avval UI, keyin API)
  const addToCart = async (productId) => {
    if (!selectedBranch?.id) {
      console.error("Xato: Filial tanlanmagan!");
      return;
    }

    const product = products.find((p) => p.id === productId);
    const selectedTip =
      product.tips && product.tips.length > 0 ? product.tips[0] : null;
    const tipIdToSend = selectedTip ? selectedTip.id : null;

    // Avval UI’da qo‘shamiz
    setCartItems((prev) => ({
      ...prev,
      [productId]: {
        cartId: null, // API’dan keladi
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
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          cartId: response.data.id, // API’dan kelgan ID
        },
      }));
      console.log("API’da savatga qo'shildi, ID:", productId);
    } catch (error) {
      console.error("Savatga qo'shishda xato:", error);
      fetchCartData(); // Xato bo'lsa qayta yuklaymiz
    }
  };

  // Sevimlilar holatini o'zgartirish
  const toggleFavorite = async (productId) => {
    const isFavorite = favorites[productId];
    const params = {
      product_id: productId,
      shop_id: selectedBranch?.id,
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
    }
  };

  // Narxni formatlash
  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === "uz" ? "uz-UZ" : "en-US", {
      style: "currency",
      currency: "UZS",
    }).format(price);
  };

  if (loading || cartLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) return <p>{t("error_loading_products")}</p>;

  const selectedCategory = categories.find(
    (cat) => cat.id === Number.parseInt(categoryId)
  );

  const filteredProducts = products.filter(
    (product) => product.category_id === Number.parseInt(categoryId)
  );

  return (
    <div className="max-w-[450px] mt-7 mx-auto">
      <div
        className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4"
        data-aos="fade-down"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border-[1px] z-10 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h2 className="text-2xl w-full mx-auto capitalize font-semibold max-w-[300px]">
          {selectedCategory?.[`name_${i18n.language}`] || t("category")}
        </h2>
      </div>

      <div className="grid grid-cols-2 px-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cartItem = cartItems[product.id];
            const displayPrice = cartItem
              ? cartItem.tip?.price
              : product.tips && product.tips.length > 0
              ? product.tips[0].price
              : product.price;

            return (
              <div
                key={product.id}
                className="cursor-pointer mb-2 flex flex-col border rounded-md shadow-lg text-center relative"
                data-aos="fade-up"
                data-aos-duration="1000"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative p-2">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${product.photo}`}
                    alt={product[`name_${i18n.language}`]}
                    className="w-full h-[120px] rounded-t-md object-cover"
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

                <h3 className="text-sm px-2 font-medium capitalize truncate mt-2">
                  {product[`name_${i18n.language}`]}
                </h3>

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
                      className="font-bold mx-auto p-1 px-2 rounded-lg shadow-lg border border-t-0 mb-2 text-blue-600 flex items-center gap-2"
                      onClick={() => addToCart(product.id)}
                    >
                      {formatPrice(displayPrice)}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center col-span-2 items-center w-full h-80 rounded-lg shadow-lg mt-4">
            <p className="text-gray-500 text-center">
              {t("no_products_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
