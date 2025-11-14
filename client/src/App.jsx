import Aurora from './Aurora.jsx'
import './styling/page-layout.css'
import './App.css'

function App() {
  return (
    <>
    <div className='w-full h-screen relative bg-black flex justify-center items-center'>
      <div style={{width: '100%', height: '600px'}}>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}

          blend={0.9}

          amplitude={.5}

          speed={0.55}
        />
      </div>
        <div class="top-container" style={{position:"absolute"}}>
          <h1>beatbuds</h1>
          <ul>
            <li>
              <h2>for music-lovers, by music lovers</h2>
            </li>
          </ul>
        </div>
    </div>
    </>
  );
}

export default App;
