import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useReducer
} from 'react';
import './app.css';

interface MessageCtxModel<T> {
    message: T;
    setMessage: React.Dispatch<React.SetStateAction<T>> | any;
}

const MessageContext = createContext<MessageCtxModel<string>>({
    message: '',
    setMessage: () => null
});

const NestedSubApp = () => {
    const { message, setMessage } = useContext(MessageContext);
    return (
        <div>
            <h1>
                <p>{message}</p>
            </h1>
            <button onClick={() => setMessage(Math.random().toString())}>
                set new value
            </button>
        </div>
    );
};

const SubApp = () => {
    return (
        <div>
            <NestedSubApp />
        </div>
    );
};

function reducer(
    state: { message: string },
    { type, message }: { type: string; message: string }
) {
    switch (type) {
        case '[set] message':
            return {
                message
            };
        default:
            throw new Error('invalid action');
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, {
        message: 'default works '
    });
    // const [message, setMessage] = useState<string>('Message');
    const messageProvider = useMemo(
        () => ({
            message: state.message,
            setMessage: (message: string) =>
                dispatch({ type: '[set] message', message })
        }),
        [state.message]
    );

    return (
        <MessageContext.Provider value={messageProvider}>
            <SubApp />
        </MessageContext.Provider>
    );
}

export default App;
