import api from "./axiosConfig";

const API_URL = "/skin-analysis";

const createAnalysis = async (userId, data) => {
    const res = await api.post(`${API_URL}/user/${userId}`, data);
    return res.data;
};

const skinAnalysisService = {
    createAnalysis,
};

export default skinAnalysisService;
