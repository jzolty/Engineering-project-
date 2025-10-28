import api from "./axiosConfig";

const getCategories = () => api.get("/enums/categories");
const getSkinTypes = () => api.get("/enums/skin-types");
const getTargetSexes = () => api.get("/enums/target-sexes");
const getAgeGroups = () => api.get("/enums/age-groups");
const getUseTimes = () => api.get("/enums/use-times");

const enumService = {
    getCategories,
    getSkinTypes,
    getTargetSexes,
    getAgeGroups,
    getUseTimes,
};

export default enumService;
