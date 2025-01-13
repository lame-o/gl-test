import { EnvironmentViewer } from './components/EnvironmentViewer';
import { GundamViewer } from './components/GundamViewer';
import './App.css';

function App() {
  return (
    <div className="App">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to My Portfolio</h1>
          <p>Scroll down to explore my work</p>
        </div>
        <div className="gundam-section">
          <GundamViewer />
        </div>
      </section>

      <section className="content-section">
        <h2>My Work</h2>
        <div style={{ height: '1000px' }}>
          {/* Add your portfolio content here */}
          <p>Portfolio content goes here...</p>
        </div>
      </section>

      <section className="environment-section">
        <div className="environment-container">
          <EnvironmentViewer />
        </div>
      </section>
    </div>
  );
}

export default App;