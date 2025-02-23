import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FcHome, FcLike } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { LuPhoneCall, LuShoppingBasket } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import i18n from "../i18n/i18n";
import Logo from "../assets/images/logo.jpg";

const Menu = ({ onClose }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("uz");

  useEffect(() => {
    const savedLogo = localStorage.getItem("userLogo");
    const savedLang = localStorage.getItem("language");

    if (savedLogo) setSelectedLogo(savedLogo);
    if (savedLang) {
      setSelectedLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setSelectedLanguage(lang);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedLogo(event.target.result);
        localStorage.setItem("userLogo", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed top-0 z-[9999] w-full max-w-[450px] bg-white min-h-screen overflow-y-auto p-4 scrollbar-hide"
      >
        <div className="relative flex flex-col items-center mb-6">
          <Link to={"/"} onClick={onClose}>
            <img
              src={Logo}
              alt="User Logo"
              className="w-24 h-24 rounded-full m-2 mt-10 border-[1px] border-blue-950 object-cover"
            />
          </Link>
          <button onClick={onClose} className="absolute -top-2 right-0 p-2">
            <IoCloseCircle className="w-9 h-9" />
          </button>
        </div>

        <nav className="flex flex-col items-start font-semibold">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center text-lg gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <FcHome className="text-xl" />
            <span>{t("home")}</span>
          </Link>
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center text-lg gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <FaUser className="text-blue-600 text-xl" />
            <span>{t("profile")}</span>
          </Link>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center gap-3 px-2 text-lg py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <FiShoppingCart className="text-blue-600 text-xl" />
            <span>{t("cart")}</span>
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 text-lg px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <LuShoppingBasket className="text-blue-600 text-xl" />
            <span>{t("orders")}</span>
          </Link>
          <Link
            to="/likes"
            onClick={onClose}
            className="flex items-center text-lg gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <FcLike className="text-xl" />
            <span>{t("favorites")}</span>
          </Link>
          <Link
            to="/locations"
            onClick={onClose}
            className="flex items-center text-lg gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <FaMapLocationDot className="text-blue-500 text-xl" />
            <span>{t("locations")}</span>
          </Link>
          <a
            href="tel:+998901234567"
            onClick={onClose}
            className="flex items-center gap-3 text-lg px-2 py-1 hover:bg-gray-100 rounded-lg w-full"
          >
            <LuPhoneCall className="text-blue-600 text-xl" />
            <span>{t("contact")}</span>
          </a>
        </nav>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => changeLanguage("uz")}
            className={`px-4 py-1 rounded-xl shadow-2xl ${
              selectedLanguage === "uz" ? "bg-blue-600 text-white" : "border-2"
            }`}
          >
            UZB
          </button>
          <button
            onClick={() => changeLanguage("ru")}
            className={`px-4 py-1 rounded-lg shadow-2xl ${
              selectedLanguage === "ru" ? "bg-blue-600 text-white" : "border-2"
            }`}
          >
            РУС
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Menu;
