import { useSelector } from "react-redux";
import { Edit2, MessageCircle, Phone } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-96 text-center relative overflow-hidden">
        {user ? (
          <>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="relative z-10">
              {user.photo_url ? (
                <img
                  src={user.photo_url || "/placeholder.svg"}
                  alt="Telegram avatar"
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user.first_name[0]}
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4 text-gray-800">
                {user.first_name}
              </h2>
              {user.username && (
                <p className="text-gray-500 mt-1">@{user.username}</p>
              )}
              <div className="mt-6 flex justify-center space-x-4">
                <button className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition">
                  <MessageCircle size={20} />
                </button>
                <button className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition">
                  <Phone size={20} />
                </button>
              </div>
              <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 flex items-center justify-center">
                <Edit2 size={18} className="mr-2" />
                Tahrirlash
              </button>
            </div>
          </>
        ) : (
          <div className="py-16">
            <p className="text-gray-500">Foydalanuvchi ma'lumotlari yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
