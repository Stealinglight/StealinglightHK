import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Clients } from './components/Clients';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { heroVideo } from './config/videos';

export default function App() {
  return (
    <div className="size-full bg-cinematic-black">
      <Navigation />
      <Hero videoSrc={heroVideo.src} />
      <Portfolio />
      <Clients />
      <About />
      <Services />
      <Contact />
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141414',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fafafa',
          },
        }}
      />
    </div>
  );
}
