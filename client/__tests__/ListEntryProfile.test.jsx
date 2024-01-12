import renderer, { act } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import ListEntryProfile from "../components/Application/components/list/ListEntryProfile";

describe("Test for List Entry for profile", () => {
  it("should render a profile correctly", async () => {
    const profile = {
      name: "Test Person",
      email: "test@test.no",
      bio: "I am a test person",
    };

    const component = renderer.create(
      <MemoryRouter>
        <ListEntryProfile profile={profile} />
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });
});
