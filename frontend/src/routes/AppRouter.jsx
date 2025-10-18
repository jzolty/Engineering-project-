
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserDashboard from "../pages/User/UserDashboard";
import SkinAnalysis from "../pages/User/SkinAnalysis";
import SkinTypeQuiz from "../pages/User/SkinTypeQuiz";
import Products from "../pages/User/Products";
import ProductDetails from "../pages/User/ProductDetails";
import Recommendations from "../pages/User/Recommendations";
import Account from "../pages/User/Account";
import AdminAccount from "../pages/Admin/Account";
import UserList from "../pages/Admin/UserList";
import AddProduct from "../pages/Admin/AddProduct";
import ManageProducts from "../pages/Admin/ManageProducts";
import ManageRules from "../pages/Admin/ManageRules";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/account" element={<AdminAccount />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/manage-products" element={<ManageProducts />} />
                <Route path="/admin/manage-rules" element={<ManageRules />} />
                <Route path="/admin/add-product" element={<AddProduct />} />


                {/* Użytkownik */}
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/skin-analysis" element={<SkinAnalysis />} />
                <Route path="/user/skin-type" element={<SkinTypeQuiz />} />
                <Route path="/user/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/user/recommendations" element={<Recommendations />} />
                <Route path="/user/account" element={<Account />} /> {/* ✅ poprawione */}

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>


        </Router>
    );
};

export default AppRouter;
