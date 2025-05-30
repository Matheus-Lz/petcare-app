import { RegisterRequest } from "../../user/type/RegisterRequest";

export type CreateEmployeeRequest = {
  user: RegisterRequest;
  serviceIds: string[];
};