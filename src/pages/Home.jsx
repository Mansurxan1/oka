import React, { useEffect } from "react";
import Search from "../components/Search";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Product from "../components/Product";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Search />
      <Banner />
      <Categories />
      <Product />
    </>
  );
};

export default Home;
