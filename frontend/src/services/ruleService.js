import api from "./axiosConfig";

const API_URL = "/rules";

//  Pobierz wszystkie reguły
export const getAllRules = async () => {
    const token = localStorage.getItem("token");
    const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

//  Pobierz wszystkie składniki (do dropdowna)
export const getAllIngredients = async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/ingredients", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

//  Dodaj nową regułę
export const addRule = async (rule) => {
    const token = localStorage.getItem("token");
    const response = await api.post(API_URL, rule, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Edytuj regułę (np. punkty / typ)
export const updateRule = async (id, rule) => {
    const token = localStorage.getItem("token");
    const response = await api.put(`${API_URL}/${id}`, rule, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Usuń regułę
export const deleteRule = async (id) => {
    const token = localStorage.getItem("token");
    await api.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
