import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedBranch } from "../redux/shopSlice";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaLocationDot } from "react-icons/fa6";

function Branches() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shops, selectedBranch } = useSelector((state) => state.shops);
  const { t, i18n } = useTranslation();

  const handleBranchSelect = (branch) => {
    if (branch.work_status === "yopiq" || !branch.is_active) {
      const firstOpenBranch = shops.find(
        (shop) => shop.is_active && shop.work_status === "ochiq"
      );

      if (firstOpenBranch) {
        dispatch(setSelectedBranch(firstOpenBranch));
      }
      return;
    }

    dispatch(setSelectedBranch(branch));
    navigate("/");
  };

  return (
    <div className="mt-[80px]">
      <div className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border-[1px] z-10 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h2 className="text-2xl w-full mx-auto capitalize font-semibold max-w-[300px]">
          {t("branches")}
        </h2>
      </div>
      <div className="space-y-2 p-4">
        {[...shops]
          .filter((branch) => branch.is_active)
          .sort((a, b) => (a.work_status === "ochiq" ? -1 : 1))
          .map((branch) => (
            <div
              key={branch.id}
              onClick={() => handleBranchSelect(branch)}
              className={`flex items-center justify-between p-2 border-[1px] bg-white shadow-md shadow-[#00000040] rounded-lg cursor-pointer ${
                branch.work_status === "yopiq"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-blue-500"
              } ${
                selectedBranch?.id === branch.id
                  ? "border-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center w-full justify-between px-2 gap-4">
                <div className="flex items-center gap-5">
                  {branch.photo ? (
                    <img
                      src={new URL(branch.photo, import.meta.env.VITE_API_URL)}
                      alt={branch.name_uz}
                      className="w-10 h-10 rounded-full border border-blue-900 object-cover"
                    />
                  ) : (
                    <FaLocationDot className="w-6 h-6 text-blue-600" />
                  )}
                  <div>
                    <h3 className="font-medium capitalize">
                      {i18n.language === "uz" ? branch.name_uz : branch.name_ru}
                    </h3>
                    <p className="text-sm capitalize text-gray-500">
                      {i18n.language === "uz"
                        ? branch.address_uz
                        : branch.address_ru}
                    </p>
                  </div>
                </div>
                {branch.work_status !== "ochiq" && (
                  <p className="text-sm font-semibold text-red-500">
                    {t("closed")}
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Branches;
