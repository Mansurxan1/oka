import { useState } from "react";
import { useNavigate } from "react-router-dom"; // navigate uchun import
import ActiveOrder from "../components/ActiveOrder";
import AllOrder from "../components/AllOrder";
import Search from "../components/Search";
import { FaAngleDown } from "react-icons/fa6";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate(); // navigate ishlatish

  return (
    <div className="p-4">
      <Search />

      {/* Header */}
      <div
        className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4"
        data-aos="fade-down"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white border z-10 rounded-lg shadow-md"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h2 className="text-2xl w-full mx-auto capitalize font-semibold max-w-[300px]">
          Buyurtmalar
        </h2>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-full shadow-md flex">
        <button
          className={`px-6 py-2 flex-1 rounded-full text-lg transition-all ${
            activeTab === "active"
              ? "bg-white shadow-md font-bold text-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Aktiv
        </button>
        <button
          className={`px-6 py-2 flex-1 rounded-full text-lg transition-all ${
            activeTab === "all"
              ? "bg-white shadow-md font-bold text-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Barchasi
        </button>
      </div>

      {/* Faoliyatga qarab komponent chiqarish */}
      <div className="p-4">
        {activeTab === "active" ? <ActiveOrder /> : <AllOrder />}
      </div>
    </div>
  );
};

export default Orders;
