import {
  createContext,
  FunctionComponent,
  useContext,
  useMemo,
  useReducer,
} from "react";

interface StateModifiers {
  openModal: (content: JSX.Element) => void;
  closeModal: () => void;

  openSidebar: () => void;
  closeSidebar: () => void;
}

interface StateValues {
  isModalOpen: boolean;
  modalContent: JSX.Element;

  isSidebarOpen: boolean;
}

const stateModifiers: StateModifiers = {
  openModal: (content: JSX.Element) => {},
  closeModal: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
};

const initialState: StateValues = {
  isModalOpen: false,
  modalContent: <></>,

  isSidebarOpen: false,
};

type State = StateModifiers & StateValues;

const UIContext = createContext<State>({ ...initialState, ...stateModifiers });

type Action = {
  type: "OPEN_MODAL" | "CLOSE_MODAL" | "OPEN_SIDEBAR" | "CLOSE_SIDEBAR";
  payload?: JSX.Element;
};

function uiReducer(state: StateValues, action: Action): StateValues {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        modalContent: action.payload ? action.payload : <></>,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        modalContent: <></>,
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: true,
      };
    case "CLOSE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: false,
      };
    default:
      return state;
  }
}

export const UIProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  const openModal = (content: JSX.Element) =>
    dispatch({ type: "OPEN_MODAL", payload: content });
  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });

  const openSidebar = () => dispatch({ type: "OPEN_SIDEBAR" });
  const closeSidebar = () => dispatch({ type: "CLOSE_SIDEBAR" });

  const value = useMemo(() => {
    return {
      openModal,
      closeModal,
      openSidebar,
      closeSidebar,
      ...state,
    };
  }, [state.isModalOpen, state.isSidebarOpen, state.modalContent]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  return useContext(UIContext);
};
