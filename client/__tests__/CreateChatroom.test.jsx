import renderer, { act } from "react-test-renderer";
import { ApiContext } from "../context/ApiContext";
import CreateChatroom from "../components/Application/components/chatroom/CreateChatroom";
import { MemoryRouter } from "react-router-dom";
import { configureWebSocket } from "../utils/webSocket";

jest.mock("../utils/webSocket");

describe("Testing component for creating chatroom", () => {
  it("form submission should be called with expected values", async () => {
    const createChatroom = jest.fn(() => Promise.resolve({ error: null }));
    const fetchAllUsers = jest.fn(() =>
      Promise.resolve({ data: [], error: null }),
    );
    const fetchChatrooms = jest.fn(() =>
      Promise.resolve({ data: [], error: null }),
    );

    const user = { email: "test@test.no" };

    const mockWebSocket = {
      send: jest.fn(),
    };

    configureWebSocket.mockReturnValue(mockWebSocket);

    const component = renderer.create(
      <MemoryRouter>
        <ApiContext.Provider
          value={{ createChatroom, fetchAllUsers, fetchChatrooms, user }}
        >
          <CreateChatroom />
        </ApiContext.Provider>
      </MemoryRouter>,
    );

    let chatroomTitleInput;
    let chatroomDescription;
    let isPrivateCheckbox;

    await act(async () => {
      chatroomTitleInput = component.root
        .findByProps({ name: "title" })
        .props.onChange({
          target: { value: "Lets talk about simulation tests!" },
        });
      chatroomDescription = component.root
        .findByProps({ name: "chatroomDescription" })
        .props.onChange({
          target: { value: "Here we talk about simulation tests" },
        });
      isPrivateCheckbox = component.root
        .findByProps({ name: "isPrivate" })
        .props.onChange({
          target: {
            checked: false,
          },
        });
    });

    const expectedChatroom = {
      admin: "test@test.no",
      chatroomTitle: "Lets talk about simulation tests!",
      description: "Here we talk about simulation tests",
      isPrivate: false,
      participants: [{ email: "test@test.no" }],
    };

    await act(async () => {
      component.root.findByType("form").props.onSubmit({
        preventDefault() {},
      });
    });

    expect(createChatroom).toBeCalledWith(expectedChatroom);
    expect(mockWebSocket.send).toHaveBeenCalled();
  });

  it("should call the websocket with expected values", async () => {
    const createChatroom = jest.fn(() => Promise.resolve({ error: null }));
    const fetchAllUsers = jest.fn(() =>
      Promise.resolve({ data: [], error: null }),
    );
    const fetchChatrooms = jest.fn(() =>
      Promise.resolve({ data: [], error: null }),
    );

    const user = { email: "test@test.no" };

    const mockWebSocket = {
      send: jest.fn(),
    };

    configureWebSocket.mockReturnValue(mockWebSocket);

    const component = renderer.create(
      <MemoryRouter>
        <ApiContext.Provider
          value={{ createChatroom, fetchAllUsers, fetchChatrooms, user }}
        >
          <CreateChatroom />
        </ApiContext.Provider>
      </MemoryRouter>,
    );

    let chatroomTitleInput;
    let chatroomDescription;

    await act(async () => {
      chatroomTitleInput = component.root
        .findByProps({ name: "title" })
        .props.onChange({
          target: { value: "Lets talk about simulation tests!" },
        });
      chatroomDescription = component.root
        .findByProps({ name: "chatroomDescription" })
        .props.onChange({
          target: { value: "Here we talk about simulation tests" },
        });
    });

    const expectedWebSocketValues = {
      type: "chatroomCreated",
      chatroomTitle: "Lets talk about simulation tests!",
      description: "Here we talk about simulation tests",
    };

    await act(async () => {
      component.root.findByType("form").props.onSubmit({
        preventDefault() {},
      });
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(expectedWebSocketValues),
    );
  });
});
