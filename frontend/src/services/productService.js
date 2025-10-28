// src/services/productService.js
import api from "./axiosConfig";

const getAllProducts = () => api.get("/products");
const getProductById = (id) => api.get(`/products/${id}`);
const addProduct = (data) => api.post("/products", data);
const updateProduct = (id, data) => api.put(`/products/${id}`, data);
const deleteProduct = (id) => api.delete(`/products/${id}`);


const productService = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};

export default productService;

