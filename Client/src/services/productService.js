import axios from "axios";

const API_URL = "http://localhost:9999/api/product-master";

export const getProducts = () => axios.get(API_URL);
export const getProductById = (id) =>
  axios.get(`${API_URL}/${id}`);
