import api from "./axiosConfig";

const getAllGoals = () => api.get("/goals");
const addGoal = (data) => api.post("/goals", data);

const goalService = {
    getAllGoals,
    addGoal,
};

export default goalService;
