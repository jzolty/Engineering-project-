
import api from "./axiosConfig";

const getCategories = () => api.get("/api/enums/categories");
const getUseTimes = () => api.get("/api/enums/use-times");
const getSkinTypes = () => api.get("/api/enums/skin-types");
const getTargetSexes = () => api.get("/api/enums/target-sexes");
const getAgeGroups = () => api.get("/api/enums/age-groups");

export default {
    getCategories,
    getUseTimes,
    getSkinTypes,
    getTargetSexes,
    getAgeGroups,
};
