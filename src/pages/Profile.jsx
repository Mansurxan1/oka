import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">
        {user ? (
          <>
            {user.photo_url && (
              <img
                src={user.photo_url}
                alt="Telegram avatar"
                className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500 shadow-md"
              />
            )}
            <h2 className="text-xl font-bold mt-3 text-gray-800">
              {user.first_name}
            </h2>
            {user.username && <p className="text-gray-500">@{user.username}</p>}
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition">
              Tahrirlash
            </button>
          </>
        ) : (
          <p className="text-gray-500">Foydalanuvchi ma’lumotlari yo‘q</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
