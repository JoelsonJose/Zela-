import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function CameraView({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // intentionally empty deps to only run on mount

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        onCapture(blob);
      }, 'image/jpeg', 0.8);
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <h2 className="text-white font-semibold text-lg">Registrar Foco</h2>
        <button onClick={handleClose} className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition">
          <X size={24} />
        </button>
      </div>

      {/* Camera Feed */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="p-6 bg-white/10 rounded-xl text-center">
            <p className="text-white mb-4">{error}</p>
            <button onClick={handleClose} className="px-4 py-2 bg-zela-green text-white rounded-lg">Voltar</button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="h-full w-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 w-full pb-10 pt-6 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
        <button 
          onClick={takePhoto}
          disabled={!!error}
          className="h-20 w-20 bg-white rounded-full border-4 border-zela-gray shadow-lg flex items-center justify-center active:scale-95 transition disabled:opacity-50"
        >
          <div className="h-16 w-16 bg-zela-green rounded-full flex items-center justify-center shadow-inner">
            <Camera size={32} className="text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
