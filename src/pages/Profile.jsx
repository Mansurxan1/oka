import { ArrowLeft, Calendar, User } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PersonalData() {
  const [gender, setGender] = useState("male");
  const [birthDate, setBirthDate] = useState(new Date("2001-03-17"));
  const [fullName, setFullName] = useState("ISM");
  const [isActive, setIsActive] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("ru", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-[80px] max-w-lg mx-auto p-4 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-6">
        <button className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Личные данные</h1>
      </div>

      <form className="space-y-4">
        <div className="relative bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-gray-500" />
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">ФИО</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                className="bg-transparent border-none outline-none text-lg"
              />
            </div>
          </div>
        </div>

        <div className="relative bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-gray-500" />
            <div className="flex flex-col flex-1">
              <label className="text-sm text-gray-500">Дата рождения</label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                customInput={
                  <input
                    className="bg-transparent border-none outline-none text-lg w-full z-[999] cursor-pointer"
                    value={formatDate(birthDate)}
                    readOnly
                  />
                }
                className="react-datepicker-custom"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`flex-1 py-3 px-6 rounded-full text-center transition-colors ${
              gender === "male"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Мужчина
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={`flex-1 py-3 px-6 rounded-full text-center transition-colors ${
              gender === "female"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Женщина
          </button>
        </div>

        <button
          type="submit"
          className={`w-[60%] bg-black text-white py-4 rounded-full mt-auto text-lg font-medium hover:bg-gray-900 transition-colors ${
            isActive
              ? "relative -bottom-44"
              : "fixed bottom-4 left-4 right-4 max-w-lg mx-auto"
          }`}
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
