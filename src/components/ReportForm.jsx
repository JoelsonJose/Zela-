import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, MapPin } from 'lucide-react';
import axios from 'axios';

export default function ReportForm({ image, onCancel, onSuccess }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    categoria: '',
    gravidade: '',
    descricao: ''
  });

  // Setup preview URL and get location
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
    }
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Location error:", err);
          setError("Não foi possível obter a localização. O mapa assumirá o padrão.");
          // Fallback to Recife center
          setLocation({ lat: -8.05428, lng: -34.8813 });
        }
      );
    } else {
      setLocation({ lat: -8.05428, lng: -34.8813 });
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [image]);

  // Analyze image on mount
  useEffect(() => {
    const analyzeImage = async () => {
      if (!image) return;
      try {
        const data = new FormData();
        data.append('foto', image, 'denuncia.jpg');
        
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await axios.post(`${apiUrl}/api/denuncias/analise`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data) {
          setFormData({
            categoria: response.data.categoria || response.data.categoria_ia || '',
            gravidade: response.data.gravidade || response.data.gravidade_ia || '',
            descricao: response.data.descricao || response.data.descricao_ia || ''
          });
        }
      } catch (err) {
        console.error("Error analyzing image:", err);
        // We do not block the user, just let them fill it manually
      } finally {
        setLoadingAnalysis(false);
      }
    };
    
    analyzeImage();
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        categoria_ia: formData.categoria,
        gravidade_ia: formData.gravidade,
        descricao_ia: formData.descricao,
        latitude: location ? location.lat.toString() : null,
        longitude: location ? location.lng.toString() : null
      };

      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.post(`${apiUrl}/api/denuncias`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Erro ao enviar denúncia. Tente novamente.");
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-white relative z-50 overflow-y-auto pb-10">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold ml-2 text-zela-text">Nova Denúncia</h2>
      </div>

      <div className="p-4 flex-1">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Image Preview */}
        <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative bg-gray-100 aspect-video flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400">Sem imagem</div>
          )}
          
          {loadingAnalysis && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm font-medium">Analisando imagem com IA...</span>
            </div>
          )}
        </div>

        {/* Location Indicator */}
        <div className="flex items-center text-sm text-gray-600 mb-6 bg-zela-light p-3 rounded-xl border border-green-100">
          <MapPin size={18} className="text-zela-green mr-2 shrink-0" />
          <span className="truncate font-medium">
            {location ? 'Localização: Capturada' : 'Obtendo localização...'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <input 
              type="text" 
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-zela-green focus:ring-2 focus:ring-zela-light transition outline-none bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grau de Risco</label>
            <input 
              type="text"
              name="gravidade"
              value={formData.gravidade}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-zela-green focus:ring-2 focus:ring-zela-light transition outline-none bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
            <textarea 
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-zela-green focus:ring-2 focus:ring-zela-light transition outline-none resize-none bg-gray-50"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || loadingAnalysis}
            className="w-full bg-zela-green text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-zela-green/30 hover:bg-zela-dark active:scale-[0.98] transition-all disabled:opacity-70 mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Confirmar Denúncia
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
