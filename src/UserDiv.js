import React from 'react';
import './UserDiv.css'; // Importar el archivo CSS aquí


function UserDiv() {
  const [finalTranscript, setFinalTranscript] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            setFinalTranscript((prevTranscript) => prevTranscript + result[0].transcript);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
      };
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const clearTranscript = () => {
    setFinalTranscript('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Transcriptor de Voz en Tiempo Real</h1>
      <p className="mb-4">Presiona el botón para empezar a grabar. Puedes detener la grabación en cualquier momento y limpiar la transcripción.</p>
      <div className="mb-4">
        <button
          onClick={toggleRecording}
          className={`font-bold py-2 px-4 rounded ${isRecording ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
        >
          {isRecording ? 'Detener grabación' : 'Empezar a grabar'}
        </button>
        <button
          onClick={clearTranscript}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Limpiar
        </button>
      </div>
      <textarea
        className="border p-4 w-full"
        rows="10"
        value={finalTranscript}
        onChange={(e) => setFinalTranscript(e.target.value)}
        placeholder="La transcripción aparecerá aquí..."
      />
    </div>
  );
}

export default UserDiv;
