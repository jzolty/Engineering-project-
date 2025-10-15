
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserDashboard from "../pages/User/UserDashboard";
import SkinAnalysis from "../pages/User/SkinAnalysis";
import SkinTypeQuiz from "../pages/User/SkinTypeQuiz";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/skin-analysis" element={<SkinAnalysis />} />
                <Route path="/user/skin-type" element={<SkinTypeQuiz />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

        </Router>
    );
};

export default AppRouter;
