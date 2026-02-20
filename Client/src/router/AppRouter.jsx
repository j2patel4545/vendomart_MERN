import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";
import ProductGrid from "../pages/ProductGrid";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyCart from "../pages/MyCart";
import Profile from "../pages/Profile"; // ✅ ADD THIS
import Footer from "../components/Footer";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />

        <Route
          path="/product/:productTypeName"
          element={<Layout><ProductPage /></Layout>}
        />

        <Route path="/shop" element={<Layout><ProductGrid /></Layout>} />

        {/* Product Details */}
        <Route
          path="/product-detail/:id/:slug"
          element={<Layout><ProductDetails /></Layout>}
        />

        <Route path="/checkout/:id" element={<Layout><Checkout /></Layout>} />
        <Route path="/cart" element={<Layout><MyCart /></Layout>} />

        {/* ✅ PROFILE ROUTE */}
        <Route
          path="/profile"
          element={<Layout><Profile /></Layout>}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
