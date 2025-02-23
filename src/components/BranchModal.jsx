import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedBranch } from "../redux/shopSlice";

function BranchModal() {
  const dispatch = useDispatch();
  const { shops, selectedBranch, warning } = useSelector(
    (state) => state.shops
  );

  useEffect(() => {
    if (!selectedBranch && shops.length > 0) {
      const firstOpenBranch = shops.find(
        (shop) => shop.is_active && shop.work_status === "ochiq"
      );

      if (firstOpenBranch) {
        dispatch(setSelectedBranch(firstOpenBranch));
      }
    }
  }, [selectedBranch, shops, dispatch]); 

  if (!warning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">Ogohlantirish</h3>
        <p className="text-gray-600 mb-4">
          Siz tanlagan filial hozirda mavjud emas. Sizga boshqa filial tanlab
          berildi.
        </p>
        <button
          onClick={() => dispatch({ type: "shops/clearWarning" })}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Ok
        </button>
      </div>
    </div>
  );
}

export default BranchModal;
