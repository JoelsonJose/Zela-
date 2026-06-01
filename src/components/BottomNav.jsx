import { Map, Camera, User } from 'lucide-react';

export default function BottomNav({ onCameraClick, onMapClick }) {
  return (
    <div className="fixed bottom-0 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-40 pb-safe">
      
      {/* Map Tab */}
      <button 
        onClick={onMapClick}
        className="flex flex-col items-center justify-center w-16 h-full text-zela-green transition-colors"
      >
        <Map size={24} />
        <span className="text-xs font-medium mt-1">Mapa</span>
      </button>

      {/* Floating Camera Button */}
      <div className="relative -top-6">
        <button 
          onClick={onCameraClick}
          className="bg-zela-green hover:bg-zela-dark text-white rounded-full p-4 shadow-[0_8px_16px_rgba(46,125,50,0.3)] transition-transform active:scale-95 flex items-center justify-center"
        >
          <Camera size={28} />
        </button>
      </div>

      {/* Profile Tab */}
      <button 
        className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-zela-green transition-colors"
      >
        <User size={24} />
        <span className="text-xs font-medium mt-1">Perfil</span>
      </button>

    </div>
  );
}
