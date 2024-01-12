import renderer, { act } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import Profile from "../components/Application/components/profile/Profile";

describe("Test of profile component", () => {
  it("Should show profile for demo user", async () => {
    const user = {
      name: "Test Person",
      email: "test@test.no",
      bio: "I am a test person",
    };

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ user }}>
            <Profile />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(component).toMatchSnapshot();
  });
});
