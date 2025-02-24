import { ArrowLeft, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import "react-datepicker/dist/react-datepicker.css";

export default function PersonalData() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);

  const storedBirthDate = localStorage.getItem("birthDate");
  const initialBirthDate = storedBirthDate
    ? new Date(storedBirthDate)
    : new Date("2001-03-17");

  const [fullName, setFullName] = useState(
    localStorage.getItem("fullName") || user?.fullName || "ISM"
  );
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [gender, setGender] = useState(
    localStorage.getItem("gender") || "male"
  );
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser && telegramUser.first_name) {
      setFullName(telegramUser.first_name);
      dispatch(
        setUser({ fullName: telegramUser.first_name, birthDate, gender })
      );
      localStorage.setItem("fullName", telegramUser.first_name);
    }
  }, [dispatch]);

  const handleDateChange = (date) => {
    setBirthDate(date);
    dispatch(setUser({ fullName, birthDate: date, gender }));
    localStorage.setItem("birthDate", date.toISOString());
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFullName(newName);
    dispatch(setUser({ fullName: newName, birthDate, gender }));
    localStorage.setItem("fullName", newName);
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    dispatch(setUser({ fullName, birthDate, gender: newGender }));
    localStorage.setItem("gender", newGender);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="mt-[80px] max-w-lg mx-auto p-4 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-6">
        <button className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">{t("Личные данные")}</h1>
      </div>

      <form className="space-y-4">
        <div className="relative bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-gray-500" />
            <div className="flex flex-col">
              <label className="text-sm text-gray-500">{t("ФИО")}</label>
              <input
                type="text"
                value={fullName}
                onChange={handleNameChange}
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
              <label className="text-sm text-gray-500">
                {t("Дата рождения")}
              </label>
              <DatePicker
                selected={birthDate}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                customInput={
                  <input
                    className="bg-transparent border-none outline-none text-lg w-full cursor-pointer"
                    value={formatDate(birthDate)}
                    readOnly
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleGenderChange("male")}
            className={`flex-1 py-3 px-6 rounded-full text-center transition-colors ${
              gender === "male"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {t("Мужчина")}
          </button>
          <button
            type="button"
            onClick={() => handleGenderChange("female")}
            className={`flex-1 py-3 px-6 rounded-full text-center transition-colors ${
              gender === "female"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {t("Женщина")}
          </button>
        </div>

        <button
          type="submit"
          className={`w-[60%] bg-black text-white py-4 rounded-full mt-auto text-lg font-medium hover:bg-gray-900 transition-colors ${
            isActive
              ? "relative -bottom-[410px] left-10 w-[60vw]"
              : "fixed bottom-4 left-4 right-4 max-w-lg mx-auto"
          }`}
        >
          {t("Сохранить")}
        </button>
      </form>
    </div>
  );
}
