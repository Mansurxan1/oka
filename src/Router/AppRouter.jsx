import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Branches from "../pages/Branches";
import CategoryProducts from "../pages/CategoryProducts";
import CategoryAll from "../pages/CategoryAll";
import ProductDetails from "../pages/ProductDetails";
import LocationPage from "../pages/Location";
import SearchResults from "../pages/SearchResults";
import LikesPage from "../pages/LikePage";
import Orders from "../pages/Orders";
import CartPage from "../pages/CartPage";
import Order from "../pages/Order";

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/locations" element={<LocationPage />} />
        <Route path="/category-all" element={<CategoryAll />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
