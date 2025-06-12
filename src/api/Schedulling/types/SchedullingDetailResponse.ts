import { EmployeeResponse } from "../../Employee/type/EmployeeResponse";
import { PetServiceResponse } from "../../PetService/types/PetServiceResponse";
import { SchedullingStatus } from "./SchedullingStatus";

export interface SchedullingDetailResponse {
  id: string;
  employee: EmployeeResponse | null;
  petService: PetServiceResponse;
  schedullingHour: string;
  status: SchedullingStatus;
}
