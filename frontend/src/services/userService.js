import api from "./axiosConfig";

const API_URL = "/auth/users";

// Pobierz wszystkich użytkowników (USER)
export const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await api.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
        throw error;
    }
};

// Usuń użytkownika po ID
export const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
        await api.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Błąd usuwania użytkownika:", error);
        throw error;
    }
};
