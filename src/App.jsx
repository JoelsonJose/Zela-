import { useState, useEffect } from 'react'
import MapView from './components/Map'
import CameraView from './components/Camera'
import ReportForm from './components/ReportForm'
import BottomNav from './components/BottomNav'
import logoSrc from './assets/logo.png'

function App() {
  const [activeScreen, setActiveScreen] = useState('map'); // 'map', 'camera', 'form'
  const [capturedImage, setCapturedImage] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = (imageBlob) => {
    setCapturedImage(imageBlob);
    setActiveScreen('form');
  };

  const handleCancelReport = () => {
    setCapturedImage(null);
    setActiveScreen('map');
  };

  const handleSubmitSuccess = () => {
    setCapturedImage(null);
    setActiveScreen('map');
    // Optionally trigger a refresh in the Map component
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zela-gray">
      
      {/* Splash Screen */}
      {showSplash && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards" style={{ animationDelay: '1.5s' }}>
          <img src={logoSrc} alt="Zelar Logo" className="w-48 h-auto animate-pulse" />
        </div>
      )}

      {/* Top Header Logo */}
      {!showSplash && activeScreen === 'map' && (
        <div className="absolute top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 p-3 flex justify-center shadow-sm">
          <img src={logoSrc} alt="Zelar Logo" className="h-10 w-auto object-contain" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="h-full w-full pb-16">
        {activeScreen === 'map' && <MapView />}
        {activeScreen === 'camera' && <CameraView onCapture={handleCapture} onCancel={() => setActiveScreen('map')} />}
        {activeScreen === 'form' && (
          <ReportForm 
            image={capturedImage} 
            onCancel={handleCancelReport}
            onSuccess={handleSubmitSuccess}
          />
        )}
      </div>

      {/* Bottom Navigation - Only show on map screen */}
      {activeScreen === 'map' && (
        <BottomNav 
          onCameraClick={() => setActiveScreen('camera')}
          onMapClick={() => setActiveScreen('map')}
        />
      )}
    </div>
  )
}

export default App
