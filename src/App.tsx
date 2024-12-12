import { useState } from 'react';

import { CartesiaClient } from "@cartesia/cartesia-js";
import { VoiceMetadata } from '@cartesia/cartesia-js/api';

const client = new CartesiaClient({ apiKey: import.meta.env.VITE_CARTESIA_API_KEY });

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [cloning, setCloning] = useState(false);
  const [clone, setClone] = useState<VoiceMetadata | null>(null);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (!(files && files.length > 0)) return console.error('bleh');
    setFile(files[0]);
  };

  return (
    <div>
      <h1>Cartesia Clone Demo</h1>
      <p>api key from .env.local: <code>VITE_CARTESIA_API_KEY={import.meta.env.VITE_CARTESIA_API_KEY}</code></p>
      <input type="file" onChange={handleFileChange} />

      {file && (
        <div style={{ marginTop: '20px' }}>
          <h3>File Details:</h3>
          <p>Name: {file.name}</p>
          <p>Type: {file.type || 'Unknown'}</p>
          <p>Size: {(file.size / 1024).toFixed(1)} KB</p>
          <p>Last Modified: {new Date(file.lastModified).toLocaleDateString()}</p>
        </div>
      )}

      <button disabled={!file || cloning} onClick={async () => {
        if (!file || cloning) return;
        setCloning(true);
        const resp = await client.voices.clone(file, {
          name: `web test clone from "${file.name}" ${new Date().toISOString()}`,
          description: `using web, mode=stability`,
          mode: 'stability',
          language: "en",
          enhance: true,
        });
        setCloning(false);
        setClone(resp);
      }}
      >
        {cloning ? 'Cloning...' : 'Clone'}
      </button>

      {clone && (
        <div style={{ marginTop: '20px' }}>
          <h3>Clone Details:</h3>
          <p>ID: {clone.id}</p>
          <p>Name: {clone.name}</p>
          <p>Description: {clone.description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
