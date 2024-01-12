import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Application/components/nav/NavBar";

describe("Navbar Component", () => {
  it("renders navigation links correctly", () => {
    const component = renderer.create(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });

  it("should show correct number of links", () => {
    const component = renderer.create(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const links = component.root.findAllByType("a");
    expect(links.length).toEqual(6);
  });
});
