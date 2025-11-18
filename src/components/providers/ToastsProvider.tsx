import { createContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface IToast {
    text: string;
    variant: string;
}

interface IToastContext {
    responseToasts: Array<IToast>;
    setResponseToasts: React.Dispatch<React.SetStateAction<Array<IToast>>>;
}

export const ToastsContext = createContext<IToastContext>({
    responseToasts: [] as Array<IToast>,
    setResponseToasts: () => { }
});

const ToastsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [responseToasts, setResponseToasts] = useState<Array<IToast>>([]);
    return (
        <ToastsContext.Provider value={{ responseToasts, setResponseToasts }}>
            <ToastContainer
                position="bottom-end"
                className="p-3 position-fixed"
                style={{ zIndex: 10000 }}
            >
                {responseToasts.map((toast) => (
                    <Toast
                        key={`${toast.text}-${toast.variant}`}
                        bg={toast.variant ?? ''}
                        autohide={true}
                        delay={3000}
                        onClose={() => setResponseToasts((prev) => {
                            if (prev.length <= 1) {
                                return [];
                            }
                            const [_, ...rest] = prev;
                            return rest;
                        })}
                    >
                        <Toast.Header>
                            <strong className='me-auto'>
                                {'Update Message'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body>
                            {toast.text}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
            {children}
        </ToastsContext.Provider>
    );
};

export default ToastsProvider;