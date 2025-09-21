import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CustomerPetServiceList from "./CustomerPetServiceList";

const mockGetAll = jest.fn();

jest.mock("../../../../../api/PetService/PetService", () => ({
  getAllPetServices: (...a: any[]) => mockGetAll(...a),
}));

jest.mock(
  "../CustomerPetServiceCard/CustomerPerServiceCard",
  () => ({
    __esModule: true,
    default: ({ service }: any) => (
      <div data-testid="service-card">{service.name}</div>
    ),
  })
);

describe("CustomerPetServiceList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("estado vazio mostra Empty", async () => {
    mockGetAll.mockResolvedValueOnce({ content: [], totalElements: 0 });

    render(<CustomerPetServiceList />);

    await waitFor(() =>
      expect(screen.getByText("Nenhum serviço cadastrado")).toBeInTheDocument()
    );
    expect(mockGetAll).toHaveBeenCalledWith(0, 8);
  });

  test("renderiza serviços retornados", async () => {
    mockGetAll.mockResolvedValueOnce({
      content: [
        { id: "s1", name: "Banho" },
        { id: "s2", name: "Tosa" },
      ],
      totalElements: 2,
    });

    render(<CustomerPetServiceList />);

    await waitFor(() =>
      expect(screen.getAllByTestId("service-card")).toHaveLength(2)
    );
    expect(screen.getByText("Banho")).toBeInTheDocument();
    expect(screen.getByText("Tosa")).toBeInTheDocument();
  });
});
