import Axios from "axios";

const axios = Axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchNotes = async () => {
    try {
        const response = await axios.get('/notes');
        return response.data;
    } catch (error) {
        console.log("Error service/fetchNotes: ", error);
        throw error;
    }
};

export const editNote = async (id: number, completed: boolean) => {
 try {
    const response = await axios.patch('/note/edit/' + id, {
        completed,
    });
    return response.data;
 } catch (error) {
    console.log("Error service/editNote: ", error);
    throw error;
 }
};