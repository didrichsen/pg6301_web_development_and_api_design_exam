import renderer, { act } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import ListEntryChatrooms from "../components/Application/ListEntryChatrooms";

describe("Testing list entry for rendering chatrooms", () => {
  it("should render a public room than can be entered by anyone ", async () => {
    const chatroom = {
      _id: 1234567,
      chatroomTitle: "A test-room that's open for anyone",
      description: "This is a test-room that anyone can join",
      admin: "tes@test.no",
      participants: [],
      isPrivate: false,
    };

    const user = { email: "teste@test.no", name: "Frank Franke" };

    const component = renderer.create(
      <MemoryRouter>
        <ApiContext.Provider value={{ user }}>
          <ListEntryChatrooms chatroom={chatroom} />
        </ApiContext.Provider>
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });

  it("should render a private room, but it can be joiner by user since email is whitelisted. Should render a link as heading.", async () => {
    const chatroom = {
      _id: 1234567,
      chatroomTitle:
        "A test-room thats only for invited users, so email must be whitelisted",
      description: "This is a test-room that only invited users can join",
      admin: "test@test.no",
      participants: [{ email: "ishouldbeabletojoin@gmail.com" }],
      isPrivate: true,
    };

    const user = { email: "ishouldbeabletojoin@gmail.com" };

    const component = renderer.create(
      <MemoryRouter>
        <ApiContext.Provider value={{ user }}>
          <ListEntryChatrooms chatroom={chatroom} />
        </ApiContext.Provider>
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });

  it("should render a private room with no link in header because users email are not whitelisted", async () => {
    const chatroom = {
      _id: 1234567,
      chatroomTitle:
        "A test-room thats only for invited users, so email must be whitelisted",
      description: "This is a test-room that only invited users can join",
      admin: "test@test.no",
      participants: [{ email: "ishouldbeabletojoin@gmail.com" }],
      isPrivate: true,
    };

    const user = { email: "myemail@yahoo.no" };

    const component = renderer.create(
      <MemoryRouter>
        <ApiContext.Provider value={{ user }}>
          <ListEntryChatrooms chatroom={chatroom} />
        </ApiContext.Provider>
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });
});
