import React, { useEffect, useRef, useState } from 'react';

function UserDiv() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('La API de reconocimiento de voz no está soportada en este navegador.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => setError(event.error);
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (isMountedRef.current) {
        setTranscript((prevTranscript) => prevTranscript + finalTranscript);
      }
    };

    return () => {
      recognition.stop();
      isMountedRef.current = false;
    };
  }, []);

  const toggleListening = () => {
    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      alert('Texto copiado al portapapeles');
    }).catch(err => {
      setError('Error al copiar el texto: ' + err);
    });
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <div style={{ padding: '1rem', margin: '2rem', backgroundColor: '#f0f0f0' }}>
      <h2>Reconocimiento de Voz</h2>
      <p>Presiona el botón "Comenzar" para iniciar el reconocimiento de voz. Puedes detenerlo en cualquier momento presionando "Detener". El texto reconocido se mostrará a continuación.</p>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={toggleListening}
          style={{ display: listening ? 'none' : 'block', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'green', color: 'white' }}
        >
          Comenzar
        </button>
        <button
          onClick={toggleListening}
          style={{ display: listening ? 'block' : 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'red', color: 'white' }}
        >
          Detener
        </button>
        <button
          onClick={copyToClipboard}
          style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'blue', color: 'white' }}
        >
          Copiar
        </button>
        <button
          onClick={clearTranscript}
          style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'gray', color: 'white' }}
        >
          Limpiar
        </button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div style={{ border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
        <p>{transcript}</p>
      </div>
    </div>
  );
}

export default UserDiv;
