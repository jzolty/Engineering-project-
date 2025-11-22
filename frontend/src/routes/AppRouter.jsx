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
import AdminProductDetails from "../pages/Admin/AdminProductDetails";
import ManagePlans from "../pages/Admin/ManagePlans";
import EditProduct from "../pages/Admin/EditProduct";
import AdminPlanDetails from "../pages/Admin/AdminPlanDetails";


import UserDashboard from "../pages/User/UserDashboard";
import SkinAnalysis from "../pages/User/SkinAnalysis";
import SkinTypeQuiz from "../pages/User/SkinTypeQuiz";
import Products from "../pages/User/Products";
import ProductDetails from "../pages/User/ProductDetails";
import Recommendations from "../pages/User/Recommendations";
import Account from "../pages/User/Account";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";
import CreatePlanManual from "../pages/User/CreatePlanManual";
import CreatePlanAuto from "../pages/User/CreatePlanAuto";


import NotFound from "../pages/NotFound";

const AppRouter = () => {
    return (
        <Router>

                <Routes>
                    {/* Strona startowa (logowanie) */}
                    <Route path="/" element={<Home />} />

                    {/* Google OAuth — przekierowanie po logowaniu */}
                    <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />



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
                        path="/admin/products/:id"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AdminProductDetails />
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
                        path="/admin/plans/:id"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AdminPlanDetails />
                            </PrivateRoute>
                        }
                    />


                    <Route
                        path="/admin/manage-plans"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <ManagePlans />
                            </PrivateRoute>
                        }
                    />

                    <Route
                    path="/admin/products/add"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <AddProduct />
                        </PrivateRoute>
                    }
                />
                    <Route
                        path="/admin/products/:id/edit"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <EditProduct />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/admin/products/:id"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <AdminProductDetails />
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
                    path="/user/products/:id"
                    element={
                        <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                            <ProductDetails />
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
                    <Route
                        path="/user/create-plan-manual"
                        element={
                            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                                <CreatePlanManual />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/user/create-plan-auto"
                        element={
                            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
                                <CreatePlanAuto />
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
