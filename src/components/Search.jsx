import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const selectedBranch = useSelector((state) => state.shops.selectedBranch);

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
      once: true,
      offset: 200,
      delay: 300,
    });
  }, []);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length > 2 && selectedBranch?.id) {
      navigate(
        `/search-results?search=${query}&branch_id=${selectedBranch.id}`
      );
    }
  };

  return (
    <section className="w-full mt-[80px] min-w-[200px] max-w-md mx-auto">
      <div className="p-4 pt-0">
        <form
          onSubmit={handleSubmit}
          className="relative"
          data-aos="fade-right"
          data-aos-delay="500"
          data-aos-duration="1200"
        >
          <input
            type="search"
            value={query}
            onChange={handleSearch}
            placeholder={t("search")}
            className="w-full px-4 py-3 pl-12 bg-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
          />
          <CiSearch className="absolute top-[32%] left-5 w-[20px] h-[20px]" />
        </form>
      </div>
    </section>
  );
}

export default Search;
