import { EmployeeResponse } from "../../Employee/type/EmployeeResponse";
import { PetServiceResponse } from "../../PetService/types/PetServiceResponse";
import { SchedulingStatus } from "./SchedulingStatus";

export interface SchedulingDetailResponse {
  id: string;
  employee: EmployeeResponse | null;
  petService: PetServiceResponse;
  schedulingHour: string;
  status: SchedulingStatus;
}
