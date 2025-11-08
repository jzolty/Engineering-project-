import api from "./axiosConfig";

const API_URL = "/skincare-plans";

const createManualPlan = async (userId, planData) => {
    const res = await api.post(`${API_URL}/user/${userId}`, planData);
    return res.data;
};

const createAutoPlan = async (userId, analysisId) => {
    const res = await api.post(`${API_URL}/user/${userId}/analysis/${analysisId}/auto`);
    return res.data;
};


const getPlansByUser = async (userId, source) => {
    const url = source
        ? `${API_URL}/user/${userId}?source=${source}`
        : `${API_URL}/user/${userId}`;
    const res = await api.get(url);
    return res.data;
};

const deletePlan = async (planId) => {
    const res = await api.delete(`${API_URL}/${planId}`);
    return res.data;
};

const updatePlan = async (planId, data) => {
    const res = await api.put(`${API_URL}/${planId}`, data);
    return res.data;
};

const getPlanById = async (planId) => {
    const res = await api.get(`/skincare-plans/${planId}`);
    return res.data;
};

const skincarePlanService = {
    createManualPlan,
    createAutoPlan,
    getPlansByUser,
    getPlanById,
    deletePlan,
    updatePlan,
};

export default skincarePlanService;
