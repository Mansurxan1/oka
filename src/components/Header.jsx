import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { FaLocationDot, FaAngleDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import { AnimatePresence } from "framer-motion";

function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const selectedBranch = useSelector((state) => state.shops.selectedBranch);
  const branchName = selectedBranch
    ? i18n.language === "uz"
      ? selectedBranch.name_uz
      : selectedBranch.name_ru
    : t("noBranchSelected");

  return (
    <div className="max-w-[450px]">
      <div className="flex mx-auto fixed top-0 right-0 left-0 z-[999] justify-center items-center bg-white rounded-b-lg">
        <div className="max-w-[450px] w-full mx-auto flex items-center p-4 rounded-b-lg gap-2">
          <button
            className="p-2 rounded-md border border-gray-300"
            onClick={() => setIsMenuOpen(true)}
          >
            <IoMdMenu className="w-[30px] h-[30px]" />
          </button>

          <div
            onClick={() => navigate("/locations")}
            className="flex-1 flex items-center !max-w-[255px] gap-2 border border-gray-300 p-1 rounded-lg overflow-hidden"
          >
            <FaLocationDot className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">{t("city")}</p>
              <p className="font-medium text-[14px] capitalize truncate">
                {t("noBranchSelected")}
              </p>
            </div>
            <FaAngleDown className="w-3 h-3 flex-shrink-0" />
          </div>

          <Link
            to={"/branches"}
            className="flex items-center max-w-[100px] w-full gap-2 border border-gray-300 p-1 rounded-lg overflow-hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">{t("branch")}</p>
              <p className="font-medium text-[14px] capitalize truncate">
                {branchName}
              </p>
            </div>
            <FaAngleDown className="w-3 h-3 flex-shrink-0" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default Header;
