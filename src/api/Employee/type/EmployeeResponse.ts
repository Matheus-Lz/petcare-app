import { UserResponse } from "../../user/type/UserResponse";

export type EmployeeResponse = {
  id: string;
  user: UserResponse;
  petServiceList: PetServiceEmployeeResponse[];
};

export type PetServiceEmployeeResponse  = {
  id: string;
  name: string;
}