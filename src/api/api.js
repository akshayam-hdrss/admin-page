import axios from "axios";

const BASE_URL = "https://medbook-backend-1.onrender.com/api";

// Image upload to cloudinary
export const uploadImage = (formData) => {
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Hospital Types
export const getHospitalTypes = () => {
  return axios.get(`${BASE_URL}/hospitalType`);
};

export const createHospitalType = (payload) => {
  return axios.post(`${BASE_URL}/hospitalType`, payload);
};

export const updateHospitalType = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/hospitalType/${id}`, data);
};

export const deleteHospitalType = (payload) => {
  return axios.delete(`${BASE_URL}/hospitalType/${payload.id}`);
};

// Hospitals

export const getAllHospitals = () => {
  return axios.get(`${BASE_URL}/hospital`);
};

export const getHospitalsByType = (hospitalTypeId) => {
  return axios.get(`${BASE_URL}/hospital/${hospitalTypeId}`);
};

export const createHospital = (payload) => {
  return axios.post(`${BASE_URL}/hospital`, payload);
};

export const updateHospital = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/hospital/${id}`, data);
};

export const deleteHospital = (id) => {
  return axios.delete(`${BASE_URL}/hospital/${id}`);
};



// GET all doctor types
export const getDoctorTypes = () => {
  return axios.get(`${BASE_URL}/doctorType`);
};

// POST a new doctor type
export const createDoctorType = (payload) => {
  return axios.post(`${BASE_URL}/doctorType`, payload);
};

// PUT (update) a doctor type by ID
export const updateDoctorType = (id, payload) => {
  return axios.put(`${BASE_URL}/doctorType/${id}`, payload);
};

// DELETE a doctor type by ID
export const deleteDoctorType = (id) => {
  return axios.delete(`${BASE_URL}/doctorType/${id}`);
};

export const getDoctors = ({ hospitalId, doctorTypeId }) => {
  const params = {};

  if (doctorTypeId) params.doctorTypeId = doctorTypeId;
  else if (hospitalId) params.hospitalId = hospitalId;
  console.log(params);

  return axios.get(`${BASE_URL}/doctor`, { params });
};


// ✅ Get single doctor by ID
export const getDoctorById = (id) => {
  return axios.get(`${BASE_URL}/doctor/${id}`);
};

// ✅ Add new doctor
export const createDoctor = (payload) => {
  return axios.post(`${BASE_URL}/doctor`, payload);
};

// ✅ Update doctor
export const updateDoctor = (id, payload) => {
  return axios.put(`${BASE_URL}/doctor/${id}`, payload);
};

// ✅ Delete doctor
export const deleteDoctor = (id) => {
  return axios.delete(`${BASE_URL}/doctor/${id}`);
};

export const getAllCategories = () =>{return axios.get(`${BASE_URL}/category`);};
export const createCategory = (payload) => {return axios.post(`${BASE_URL}/category`, payload);};
export const updateCategory = (id, payload) =>{return axios.put(`${BASE_URL}/category/${id}`, payload);};
export const deleteCategory = (id) => {return axios.delete(`${BASE_URL}/category/${id}`);};




// --- Product APIs ---
export const getAvailableProducts = () => {
  return axios.get(`${BASE_URL}/products/availableProduct`);
};

export const createAvailableProduct = (payload) => {
  return axios.post(`${BASE_URL}/products/availableProduct`, payload);
};

export const updateAvailableProduct = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/products/availableProduct/${id}`, data);
};

export const deleteAvailableProduct = (id) => {
  return axios.delete(`${BASE_URL}/products/availableProduct/${id}`);
};

export const deleteAllAvailableProducts = (productList) => {
  return Promise.all(
    productList.map((item) =>
      axios.delete(`${BASE_URL}/products/availableProduct/${item.id}`)
    )
  );
};


// Product Types
export const getProductTypes = () => {
  return axios.get(`${BASE_URL}/products/productType`);
};

export const createProductType = (payload) => {
  return axios.post(`${BASE_URL}/products/productType`, payload);
};

export const updateProductType = ({ id, ...data }) => {
  return axios.put(`${BASE_URL}/products/productType/${id}`, data);
};

export const deleteProductType = (id) => {
  return axios.delete(`${BASE_URL}/products/productType/${id}`);
};

export const getProductTypesByAvailableProduct = (availableProductId) => {
  return axios.get(`${BASE_URL}/products/productType/byAvailableProduct/${availableProductId}`);
};

// product
export const getProductsByProductType = (productTypeId) => {
  return axios.get(`${BASE_URL}/products/product/byProductType/${productTypeId}`);
};

export const getProductById = (id) => {
  return axios.get(`${BASE_URL}/products/product/${id}`);
};

export const createProduct = (payload) => {
  return axios.post(`${BASE_URL}/products/product`, payload);
};

export const updateProduct = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/products/product/${id}`, data);
};

export const deleteProduct = (id) => {
  return axios.delete(`${BASE_URL}/products/product/${id}`);
};


