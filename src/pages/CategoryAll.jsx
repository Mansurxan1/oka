import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categoriesSlice";
import Search from "../components/Search";
import { FaAngleDown } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const CategoryAll = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { error, status } = useSelector((state) => state.categories);
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);

  const [localCategories, setLocalCategories] = useState(
    JSON.parse(localStorage.getItem("categories")) || []
  );

  const prevCategoriesRef = useRef(localCategories);

  const fetchData = useCallback(async () => {
    if (!selectedBranch?.id) return;

    try {
      const result = await dispatch(fetchCategories(selectedBranch.id));

      if (fetchCategories.fulfilled.match(result)) {
        const newCategories = result.payload;
        const prevCategories = prevCategoriesRef.current;

        if (JSON.stringify(newCategories) !== JSON.stringify(prevCategories)) {
          console.log(
            "API ma'lumotlari o'zgardi. localStorage va UI yangilanmoqda..."
          );
          localStorage.setItem("categories", JSON.stringify(newCategories));
          setLocalCategories(newCategories);
          prevCategoriesRef.current = newCategories;
        } else {
          console.log(
            "API ma'lumotlari o'zgarmadi. Hech narsa o'zgartirilmaydi."
          );
        }
      }
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }
  }, [selectedBranch, dispatch]);

  useEffect(() => {
    AOS.init();
    if (!localCategories.length) {
      fetchData();
    }
  }, [fetchData, localCategories.length]);

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredCategories = localCategories.filter(
    (cat) => cat.shop_id === selectedBranch?.id && cat.is_active
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-[450px] mx-auto mb-40">
      <Search />
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
        <h2
          className="text-2xl w-full mx-auto capitalize font-semibold max-w-[300px]"
          data-aos=""
        >
          {t("all_categories")}
        </h2>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 px-4 gap-4">
          {filteredCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="group cursor-pointer flex flex-col items-center text-center bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
              onClick={() => navigate(`/category/${cat.id}`)}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"} // Left for odd, right for even
              data-aos-duration="1000"
            >
              <div className="relative w-full h-[120px] overflow-hidden border border-b-0 rounded-t-xl">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${cat.photo}`}
                  alt={cat[`name_${i18n.language}`]}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg py-2 font-semibold capitalize text-gray-800 transition-colors duration-300 group-hover:text-blue-500">
                {cat[`name_${i18n.language}`]}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {t("no_categories_found")}
        </div>
      )}
    </div>
  );
};

export default CategoryAll;
