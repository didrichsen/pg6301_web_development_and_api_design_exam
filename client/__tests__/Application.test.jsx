import renderer, { act } from "react-test-renderer";
import Application from "../components/Application/Application";
import { MemoryRouter } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";

// Import fetchUser explicitly
import { fetchUser } from "../context/ApiContext";

jest.mock("../utils/webSocket");

jest.mock("../context/ApiContext", () => ({
  ...jest.requireActual("../context/ApiContext"),
  fetchUser: jest.fn(() =>
    Promise.resolve({
      data: { name: undefined },
      error: null,
    }),
  ),
}));

describe("Test of application component", () => {
  it('should show "loading..." if user is undefined', async () => {
    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchUser }}>
            <Application />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(component).toMatchSnapshot();
  });
});
