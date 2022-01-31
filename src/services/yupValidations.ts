import * as yup from "yup";

export const createAssetsFormSchema = yup.object().shape({
  name: yup.string().required("Asset name is required"),
  model: yup.string().required("Asset model is required"),
  companyId: yup.string().required("Asset company is required"),
  unitId: yup.string().required("Asset unit is required"),
  image: yup.string().required("Asset image is required"),
});

export const updateAssetsFormSchema = yup.object().shape({
  name: yup.string().required("Asset name is required"),
  model: yup.string().required("Asset model is required"),
  companyId: yup.string().required("Asset company is required"),
  unitId: yup.string().required("Asset unit is required"),
  image: yup.string().required("Asset image is required"),
  status: yup.string().required("Asset status is required"),
});

export const createCompaniesFormSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
});

export const updateCompaniesFormSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
});

export const createUnitsFormSchema = yup.object().shape({
  name: yup.string().required("Unit name is required"),
  companyId: yup.string().required("Unit company is required"),
});

export const updateUnitsFormSchema = yup.object().shape({
  name: yup.string().required("Unit name is required"),
  companyId: yup.string().required("Unit company is required"),
});

export const createUsersFormSchema = yup.object().shape({
  name: yup.string().required("User name is required"),
  email: yup.string().required("User email is required"),
  companyId: yup.string().required("User company is required"),
  unitId: yup.string().required("User unit is required"),
});

export const updateUsersFormSchema = yup.object().shape({
  name: yup.string().required("User name is required"),
  email: yup.string().required("User email is required"),
  companyId: yup.string().required("User company is required"),
  unitId: yup.string().required("User unit is required"),
});
