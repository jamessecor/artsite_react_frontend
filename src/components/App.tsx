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
import BackgroundColorProvider from './BackgroundColorProvider';
import Nomophobia from './Nomophobia';

const App = () => {
    return (
        <React.StrictMode>
            <BackgroundColorProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={'/'} element={<HomePage />} />
                        <Route element={<Navigation />}>
                            <Route path={'/artworks/current'} element={<Artworks current={true} />} />
                            <Route path={'/artworks/sold'} element={<SoldArtworks />} />
                            <Route path={'/artworks'} element={<Artworks />} />
                            <Route path={'/cv'} element={<Cv />} />
                            <Route path={'/nomophobia'} element={<Nomophobia />} />
                            <Route path={'/colors'} element={<Colors />} />
                            <Route path={'/contact'} element={<ContactForm />} />
                            <Route path={'/store'} element={<Store />}>
                                <Route path={'postcards'} element={<Store />} />
                            </Route>
                        </Route>
                        <Route path={'*'} element={<HomePage />} />
                    </Routes>
                </BrowserRouter>
            </BackgroundColorProvider>
        </React.StrictMode>
    );
};

export default App;