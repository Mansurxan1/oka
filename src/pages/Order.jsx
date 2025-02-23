import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaAngleDown,
  FaUser,
  FaPhone,
  FaTelegram,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

const Order = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [formData, setFormData] = useState({
    payment: "",
    long: 69.240562, // Default longitude for Tashkent
    lat: 41.311081, // Default latitude for Tashkent
    contact: "",
    address: "",
    first_last_name: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(10000);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get cart items from localStorage or state management
    const exampleCartItems = [
      { tip: { price: 50000, volume: 1, unit: "pc" }, count: 2 },
      { tip: { price: 75000, volume: 1, unit: "pc" }, count: 1 },
    ];
    setCartItems(exampleCartItems);

    const total = exampleCartItems.reduce(
      (sum, item) => sum + item.tip.price * item.count,
      0
    );
    setTotalAmount(total);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.first_last_name.trim()) {
      setError("Ism-familiya kiritilishi shart");
      return false;
    }
    if (!formData.contact.trim()) {
      setError("Telefon raqam kiritilishi shart");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Manzil kiritilishi shart");
      return false;
    }
    if (!formData.payment) {
      setError("To'lov turini tanlang");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Create FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("payment", formData.payment);
    formDataToSend.append("long", formData.long.toString());
    formDataToSend.append("lat", formData.lat.toString());
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("first_last_name", formData.first_last_name);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order?client_id=5283151626&shop_id=1`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.ok) {
        setSuccess("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(response.data.message || "Buyurtma yuborishda xatolik");
      }
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Buyurtma yuborishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white w-full max-w-[450px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <FaAngleDown className="text-2xl rotate-90 text-blue-600" />
        </button>
        <h1 className="text-3xl font-bold text-blue-800">Buyurtma</h1>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Sizning ma'lumotlaringiz
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FaUser className="text-blue-500" />
              <input
                type="text"
                name="first_last_name"
                placeholder="Ismingiz"
                value={formData.first_last_name}
                onChange={handleInputChange}
                className="w-full outline-none text-lg"
                required
              />
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FaPhone className="text-blue-500" />
              <input
                type="tel"
                name="contact"
                placeholder="+998 77 777 77 77"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full outline-none text-lg"
                required
              />
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FaTelegram className="text-blue-500" />
              <input
                type="text"
                placeholder="Telegram username"
                className="w-full outline-none text-lg"
              />
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <input
                type="text"
                name="address"
                placeholder="Manzil"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full outline-none text-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            To'lov turi
          </h2>
          <div className="relative">
            <select
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg appearance-none bg-white text-lg"
              required
            >
              <option value="">To'lov turini tanlang</option>
              <option value="CASH">Naqd pul</option>
              <option value="TERMINAL">Terminal</option>
              <option value="karta">Karta</option>
              <option value="naqt">Naqd</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaAngleDown className="fill-current h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Buyurtma haqida
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Umumiy narx:</span>
              <span className="font-semibold">
                {totalAmount.toLocaleString()} uzs
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Yetkazib berish:</span>
              <span className="font-semibold">
                {deliveryFee.toLocaleString()} uzs
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-blue-800 mt-4">
              <span>Jami:</span>
              <span>{(totalAmount + deliveryFee).toLocaleString()} uzs</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo kod"
                className="flex-1 p-3 border rounded-lg text-lg"
              />
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Qo'llash
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-xl hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <FaSpinner className="animate-spin" />}
          {loading ? "Yuklanmoqda..." : "Sotib olish"}
        </button>
      </form>
    </div>
  );
};

export default Order;
