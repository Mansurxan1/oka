// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setShops } from "./redux/shopSlice";
// import AppRouter from "./Router/AppRouter";
// import BranchModal from "./components/BranchModal";
// import axios from "axios";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/shop`
//         );
//         dispatch(setShops(response.data));
//       } catch (error) {
//         console.error("Xatolik:", error);
//       }
//     };

//     fetchBranches();
//     const interval = setInterval(fetchBranches, 5000);

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   return (
//     <>
//       <AppRouter />
//       <BranchModal />
//     </>
//   );
// }

// export default App;

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setShops } from "./redux/shopSlice";
// import AppRouter from "./Router/AppRouter";
// import BranchModal from "./components/BranchModal";
// import axios from "axios";
// import i18n from "./i18n/i18n";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const storedLang = localStorage.getItem("language");
//     if (storedLang) {
//       i18n.changeLanguage(storedLang);
//     }

//     const fetchBranches = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/shop`
//         );
//         dispatch(setShops(response.data));
//       } catch (error) {
//         console.error("Xatolik:", error);
//       }
//     };

//     fetchBranches();
//     const interval = setInterval(fetchBranches, 5000);

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   return (
//     <>
//       <AppRouter />
//       <BranchModal />
//     </>
//   );
// }

// export default App;



import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setShops } from "./redux/shopSlice";
import AppRouter from "./Router/AppRouter";
import BranchModal from "./components/BranchModal";
import axios from "axios";
import i18n from "./i18n/i18n";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }

    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/shop`
        );
        dispatch(setShops(response.data));
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchBranches();
    const interval = setInterval(fetchBranches, 5000);

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.setBackgroundColor("#ffffff"); // Oq fon
      tg.setHeaderColor("bg_color"); // Header ham oq rangda bo‘lishi uchun

      // Telegram interfeysiga mos matn rangini olish
      document.body.style.color = tg.themeParams.text_color || "#000000";
    }

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <BranchModal />
    </>
  );
}

export default App;
