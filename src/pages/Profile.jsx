import { useSelector, useDispatch } from "react-redux";
import { Calendar, User } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setUser } from "../redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [birthday, setBirthday] = useState(user?.birthday || new Date());

  const handleDateChange = (date) => {
    setBirthday(date);
    dispatch(setUser({ ...user, birthday: date.toISOString().split("T")[0] }));
  };

  return (
    <div className="flex mt-[80px] items-center justify-center bg-white">
      <div className="relative rounded-2xl min-h-screen p-6 w-full max-w-md bg-white shadow-lg">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Личные данные
        </h2>

        <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-3">
          <User size={20} className="text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">ФИО</span>
            <span className="text-lg font-medium">
              {user?.first_name || "Имя"}
            </span>
          </div>
        </div>

        {/* Kalendar */}
        <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-3 mt-3">
          <Calendar size={20} className="text-gray-500" />
          <div className="flex flex-col w-full">
            <span className="text-sm text-gray-500">Дата рождения</span>
            <DatePicker
              selected={new Date(birthday)}
              onChange={handleDateChange}
              className="text-lg font-medium bg-transparent focus:outline-none"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            className={`w-full p-2 rounded-lg text-lg font-medium transition ${
              user?.gender === "male"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Мужчина
          </button>
          <button
            className={`w-full p-2 rounded-lg text-lg font-medium transition ${
              user?.gender === "female"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Женщина
          </button>
        </div>

        <button className="absolute bottom-5 left-0 right-0 mx-auto w-11/12 bg-black text-white py-3 rounded-xl flex items-center justify-center text-lg font-medium shadow-lg transition hover:bg-gray-900">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default Profile;
