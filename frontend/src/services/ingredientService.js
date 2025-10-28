import api from "./axiosConfig";

const getAllIngredients = () => api.get("/ingredients");
const addIngredient = (data) => api.post("/ingredients", data);

const ingredientService = {
    getAllIngredients,
    addIngredient,
};

export default ingredientService;
