import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home/Home";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminAccount from "../pages/Admin/Account";
import ManageProducts from "../pages/Admin/ManageProducts";
import ManageRules from "../pages/Admin/ManageRules";
import AddProduct from "../pages/Admin/AddProduct";
import UserList from "../pages/Admin/UserList";

import UserDashboard from "../pages/User/UserDashboard";
import SkinAnalysis from "../pages/User/SkinAnalysis";
import SkinTypeQuiz from "../pages/User/SkinTypeQuiz";
import Products from "../pages/User/Products";
import ProductDetails from "../pages/User/ProductDetails";
import Recommendations from "../pages/User/Recommendations";
import Account from "../pages/User/Account";

import NotFound from "../pages/NotFound";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Strona startowa (logowanie) */}
                <Route path="/" element={<Home />} />

                {/* ADMIN — tylko ADMIN */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/account"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <AdminAccount />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <UserList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/manage-products"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <ManageProducts />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/manage-rules"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <ManageRules />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/add-product"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <AddProduct />
                        </PrivateRoute>
                    }
                />

                {/* USER — dla USER i ADMIN */}
                <Route
                    path="/user"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <UserDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/skin-analysis"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <SkinAnalysis />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/skin-type"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <SkinTypeQuiz />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/products"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <Products />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/products/:id"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <ProductDetails />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/recommendations"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <Recommendations />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user/account"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <Account />
                        </PrivateRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
