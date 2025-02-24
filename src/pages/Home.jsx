import React, { useEffect } from "react";
import Search from "../components/Search";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Product from "../components/Product";
import Header from "../components/Header";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <Search />
      <Banner />
      <Categories />
      <Product />
    </>
  );
};

export default Home;
