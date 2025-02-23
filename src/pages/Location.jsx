import { useEffect, useState } from "react";
import { FaAngleDown, FaMapMarkerAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { CiSearch } from "react-icons/ci";
import { MdAddLocation } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

const LocationPage = () => {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([
    { id: 1, district: "Mirobod Tumani", address: "Amir Temur Ko‘chasi 24" },
    { id: 2, district: "Yunusobod Tumani", address: "Yunusobod 4-mavze" },
    { id: 3, district: "Chilonzor Tumani", address: "Bunyodkor Ko‘chasi 12" },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
      once: true,
      offset: 200,
      delay: 300,
    });
  }, []);

  const handleDeleteClick = (location) => {
    setSelectedLocation(location);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedLocation) {
      setLocations(locations.filter((loc) => loc.id !== selectedLocation.id));
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
  };

  return (
    <div className="max-w-[450px] min-w-[320px] mt-[80px] mx-auto bg-white min-h-screen pt-0 relative">
      <section className="w-full min-w-[200px] max-w-md mx-auto">
        <div className="p-4 pt-0">
          <div
            data-aos="fade-right"
            data-aos-delay="500"
            data-aos-duration="1200"
          >
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full px-4 py-3 pl-12 bg-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            />
            <CiSearch className="absolute top-[32%] left-5 w-[20px] h-[20px]" />
          </div>
        </div>
      </section>

      <div className="flex items-center text-center gap-3 mb-4 rounded-bl-[20px] rounded-br-[20px] border-b-[2px] border-b-[#00000050] px-3 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.3)] border-[1px]"
        >
          <FaAngleDown className="text-2xl rotate-90" />
        </button>
        <h2 className="text-2xl w-full font-semibold">{t("myLocations")}</h2>
      </div>

      <div className="space-y-3 px-3">
        {locations.length > 0 ? (
          locations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 border-[1px] bg-white shadow-md shadow-[#00000040] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-xl text-blue-600" />
                <div>
                  <h3 className="font-semibold">{location.district}</h3>
                  <p className="text-sm text-gray-500">{location.address}</p>
                </div>
              </div>
              <button
                className="text-red-500"
                onClick={() => handleDeleteClick(location)}
              >
                <FaTrashAlt className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">{t("notFound")}</p>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[450px] px-4">
        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg">
          <MdAddLocation className="text-xl" />
          {t("addLocation")}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-96 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gray-100 rounded-full border-2">
              <IoMdInformationCircle className="text-6xl text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold mt-3">
              {t("deleteConfirm")}
            </h3>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white py-2 font-medium rounded-lg hover:bg-red-700 transition"
              >
                {t("confirm")}
              </button>
              <button
                className="w-full bg-blue-600 text-white py-2 font-medium rounded-lg hover:bg-blue-700 transition"
                onClick={closeModal}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
