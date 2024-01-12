import renderer, { act } from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import ViewChatrooms from "../components/Application/components/chatroom/ViewChatrooms";
import { ApiContext } from "../context/ApiContext";
import ListEntryChatrooms from "../components/Application/components/list/ListEntryChatrooms";
import { configureWebSocket } from "../utils/webSocket";

jest.mock("../utils/webSocket");

describe("Tests for list component", () => {
  it("should list a chatroom and a link using id as param", () => {
    const chatroom = {
      _id: 13843535275430425,
      chatroomTitle: "Lets talk about tests",
      description: "We talk about tests. A lot.",
      admin: "test@test.no",
      participants: [],
      isPrivate: false,
      comments: [],
    };

    const component = renderer.create(
      <MemoryRouter>
        <ListEntryChatrooms chatroom={chatroom} />
      </MemoryRouter>,
    );

    expect(component).toMatchSnapshot();
  });

  it("should call for a websocket on mount", async () => {
    const fetchChatrooms = () => ({
      data: [
        {
          _id: 1,
          chatroomTitle: "Lets talk about tests",
          description: "We talk about tests. A lot.",
          admin: "test@test.no",
          participants: [],
          isPrivate: false,
          comments: [],
        },
      ],
      error: null,
    });

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchChatrooms }}>
            <ViewChatrooms />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(configureWebSocket).toHaveBeenCalled();
  });

  it("should list a chatroom", async () => {
    const fetchChatrooms = () => ({
      data: [
        {
          _id: 1,
          chatroomTitle: "Lets talk about tests",
          description: "We talk about tests. A lot.",
          admin: "test@test.no",
          participants: [],
          isPrivate: false,
          comments: [],
        },
      ],
      error: null,
    });

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchChatrooms }}>
            <ViewChatrooms />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(component).toMatchSnapshot();
  });

  it("should list that an error has occurred", async () => {
    const error = {
      message: "Something went wrong",
    };
    const fetchChatrooms = () => ({
      data: null,
      error: error,
    });

    let component;

    await act(async () => {
      component = renderer.create(
        <MemoryRouter>
          <ApiContext.Provider value={{ fetchChatrooms }}>
            <ViewChatrooms />
          </ApiContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(component).toMatchSnapshot();
  });
});
