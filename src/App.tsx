import React, { useEffect, useState } from 'react';
import CreatorMode from './pages/CreatorMode';
import RecipientMode from './pages/RecipientMode';

export default function App() {
  const [encodedData, setEncodedData] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      setEncodedData(data);
    }
  }, []);

  if (encodedData) {
    return <RecipientMode encodedData={encodedData} />;
  }

  return <CreatorMode />;
}
