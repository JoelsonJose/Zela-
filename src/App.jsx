import { useState } from 'react'
import MapView from './components/Map'
import CameraView from './components/Camera'
import ReportForm from './components/ReportForm'
import BottomNav from './components/BottomNav'

function App() {
  const [activeScreen, setActiveScreen] = useState('map'); // 'map', 'camera', 'form'
  const [capturedImage, setCapturedImage] = useState(null);

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
