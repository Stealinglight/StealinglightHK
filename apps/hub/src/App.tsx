import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav, Footer } from '@stealinglight/ui';
import { Home } from './pages/Home';

/**
 * Hub App - Main landing page for stealinglight.hk
 * Routes users to creative or security modes
 */
export function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Nav currentMode="hub" showModeSwitch={false} />
                <main className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
                <Footer currentMode="hub" />
            </div>
        </BrowserRouter>
    );
}
