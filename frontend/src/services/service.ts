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

export const fetchCategory = async () => {
    try {
        const response = await axios.get('/category');
        return response.data;
    } catch (error) {
        console.log("Error service/fetchCategory: ", error);
        throw error;
    }
};

export const fetchCategories = async () => {
    const response = await axios.get('/categories');
    return response.data;
};

export const fetchUnits = async () => {
    const response = await axios.get('/units');
    return response.data;
};

export const createProduct = async (payload: {name: string, price: number, units: string[], categoryId: string}) => {
// export const createProduct = async (payload: {name: string, price: number, unit: string, categoryId: string}) => {
    try {
        const response = await axios.post('/product/create', payload);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error service/createNote", error.response.data ||  error.message);
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