import axios from "axios";

export async function getRegNo() {
    try {
        const response = await axios.get('/api/get-regno');
        const data = await response.data;
        
        return data.data;
    } catch (error) {
        console.error('Error fetching registration numbers:', error);
        return [];
    }
}