import * as React from 'react';
import HomePage from "./HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Artworks from './Artworks';
import SoldArtworks from './SoldArtworks';
import Cv from './Cv';
import Colors from './Colors';
import Navigation from './Navigation';
import Store from './store/Store';
import ContactForm from './ContactForm';
import BackgroundColorProvider from './providers/BackgroundColorProvider';
import Nomophobia from './nomophobia/Nomophobia';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LoginForm from './LoginForm';
import AuthenticationProvider from './providers/AuthenticationProvider';

const fourHoursInMs = 1000 * 60 * 60 * 4;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: fourHoursInMs
        }
    }
});

const App = () => {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <BackgroundColorProvider>
                    <AuthenticationProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path={'/'} element={<HomePage />} />
                                <Route element={<Navigation />}>
                                    <Route path={'/artworks/current'} element={<Artworks current={true} />} />
                                    <Route path={'/artworks/sold'} element={<SoldArtworks />} />
                                    <Route path={'/artworks'} element={<Artworks />} />
                                    <Route path={'/cv'} element={<Cv />} />
                                    <Route path={'/nomophobia/*'} element={<Nomophobia />} />
                                    <Route path={'/colors'} element={<Colors />} />
                                    <Route path={'/contact'} element={<ContactForm />} />
                                    <Route path={'/store'} element={<Store />}>
                                        <Route path={'postcards'} element={<Store />} />
                                    </Route>
                                    <Route path={'/login'} element={<LoginForm />} />
                                </Route>
                                <Route path={'*'} element={<HomePage />} />
                            </Routes>
                        </BrowserRouter>
                    </AuthenticationProvider>
                </BackgroundColorProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </React.StrictMode>
    );
};

export default App;