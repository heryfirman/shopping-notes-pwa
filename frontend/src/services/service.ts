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

export const createNote = async (payload: {body: string, priority: number}) => {
    try {
        const response = await axios.post('/note/create', payload);
        return response.data;
    } catch (error) {
        console.log("Error service/createNote", error);
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


export const fetchProducts = async () => {
    try {
        const response = await axios.get('/products');
        return response.data;
    } catch (error) {
        console.log("Error service/fetchProducts: ", error);
        throw error;
    }
};

export const createProduct = async (payload: {name: string, price: number, unit: string, categoryId: string}) => {
    try {
        const response = await axios.post('/product/create', payload);
        return response.data;
    } catch (error) {
        console.log("Error service/createNote", error);
        throw error;
    }
};

export const editProduct = async (id: string, name: string, price: number, unit: string, categoryId: string) => {
    try {
        const response = await axios.patch('/product/edit' + id, {
            name,
            price,
            unit,
            categoryId
        });
        return response.data;
    } catch (error) {
        console.log("Error service/editProduct", error);
        throw error;
    }
}