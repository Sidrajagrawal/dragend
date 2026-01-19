import axios from 'axios';

const BASE_API = "http://localhost:8080/api";

// --- SAVE (PUT) ---
export const saveWorkflowData = async (projectId, payload) => {
    try {
        const response = await axios.put(
            `${BASE_API}/project/${projectId}/workflow`,
            payload,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Save Workflow Error:", error.response?.data || error.message);
        throw error;
    }
};

// --- GET (READ) ---
export const getProjectData = async (projectId) => {
    try {
        const response = await axios.get(
            `${BASE_API}/project/${projectId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Get Project Error:", error.response?.data || error.message);
        throw error;
    }
};

// --- DELETE ---
export const deleteProjectAPI = async (projectId) => {
    try {
        const response = await axios.delete(
            `${BASE_API}/project/${projectId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Delete Project Error:", error.response?.data || error.message);
        throw error;
    }
};