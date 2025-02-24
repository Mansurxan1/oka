import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/slices/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogin = () => {
    // Example user data
    const userData = {
      id: 1,
      first_name: "John",
      username: "john_doe",
      photo_url: "https://example.com/photo.jpg",
    };

    dispatch(setUser(userData));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        {user ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user.first_name}!
            </h2>
            <p className="text-gray-600">@{user.username}</p>
            <button
              onClick={() => dispatch(setUser(null))}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Please Login</h2>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
