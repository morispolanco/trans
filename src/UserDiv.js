import React from 'react';

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
            setFinalTranscript((prevTranscript) => prevTranscript + result[0].transcript + ' '); // Añadir un espacio después de cada transcripción final
          } else {
            interimTranscript += result[0].transcript + ' '; // Añadir un espacio después de cada transcripción intermedia
          }
        }
        setFinalTranscript((prevTranscript) => prevTranscript + interimTranscript); // Concatenar transcripciones intermedias con finales
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
    <div style={styles.container}>
      <h1 style={styles.title}>Transcriptor sincrónico de habla</h1>
      <p style={styles.description}>Presiona el botón para empezar a grabar. Puedes detener la grabación en cualquier momento y limpiar la transcripción.</p>
      <div style={styles.buttonContainer}>
        <button
          onClick={toggleRecording}
          style={isRecording ? styles.recordingButton : styles.startButton}
        >
          {isRecording ? 'Detener grabación' : 'Empezar a grabar'}
        </button>
        <button
          onClick={clearTranscript}
          style={styles.clearButton}
        >
          Limpiar
        </button>
      </div>
      <textarea
        style={styles.textarea}
        rows="10"
        value={finalTranscript}
        onChange={(e) => setFinalTranscript(e.target.value)}
        placeholder="La transcripción aparecerá aquí..."
      />
    </div>
  );
}

// Estilos en línea
const styles = {
  container: {
    padding: '20px',
    margin: '0 auto', // Alinea el contenedor al centro horizontalmente
    maxWidth: '600px', // Limita el ancho del contenedor
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
    fontFamily: 'Verdana, sans-serif',
  },
  buttonContainer: {
    marginBottom: '16px',
  },
  startButton: {
    padding: '8px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    color: '#fff',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  recordingButton: {
    padding: '8px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#ff6f61',
    color: '#fff',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#ff6f61',
    color: '#fff',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  },
};

export default UserDiv;
