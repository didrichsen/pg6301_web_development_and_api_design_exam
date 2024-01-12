import renderer, { act } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import UserProfile from "../components/Application/components/profile/UserProfile";

describe("Test of profile component", () => {
  it("Should show the profile of another registered user", async () => {
    const mockUsers = [
      {
        name: "Demo User",
        email: "demo@example.com",
        bio: "This is a demo user.",
      },
    ];

    const fetchAllUsers = jest.fn(() =>
      Promise.resolve({ data: mockUsers, error: null }),
    );

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchAllUsers }}>
            <UserProfile />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(component).toMatchSnapshot();
  });

  it("Should show the profile of next user when clicking the next user button", async () => {
    const mockUsers = [
      {
        name: "First Demo User",
        email: "demo@example.com",
        bio: "This is a demo user.",
      },
      {
        name: "Second Demo User",
        email: "another@example.com",
        bio: "This is another user.",
      },
    ];

    const fetchAllUsers = jest.fn(() =>
      Promise.resolve({ data: mockUsers, error: null }),
    );

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchAllUsers }}>
            <UserProfile />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    //Here we check that the first demo user is shown
    expect(component).toMatchSnapshot();

    await act(async () => {
      component.root.findByProps({ children: "Next User" }).props.onClick();
    });
    //Here we check that the second user is shown after clicking the button to show the next user
    expect(component).toMatchSnapshot();
  });
});
