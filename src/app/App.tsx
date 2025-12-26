import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Clients } from './components/Clients';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="size-full">
      <Navigation />
      <Hero />
      <Portfolio />
      <Clients />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}