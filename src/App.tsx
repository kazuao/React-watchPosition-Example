import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const ErrorText = () => {
  return <p className="App-error-text">geolocation IS NOT available</p>;
};

interface WatchStatus {
  isWatching: boolean;
  watchId: number | null;
}

interface Position {
  latitude: number | null;
  longitude: number | null;
}

function App() {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState<Position>({
    latitude: null,
    longitude: null,
  });
  const [watchStatus, setWatchStatus] = useState<WatchStatus>({
    isWatching: false,
    watchId: null,
  });

  const isFirstRef = useRef(true);

  useEffect(() => {
    isFirstRef.current = false;
    if ("geolocation" in navigator) {
      setAvailable(true);
    }
  }, [isAvailable]);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
  };

  const startWatchPosition = () => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });

    setWatchStatus({ isWatching: true, watchId: watchId });
  };

  const stopWatchPosition = (watchStatus: WatchStatus) => {
    navigator.geolocation.clearWatch(watchStatus.watchId!!);
    setWatchStatus({ isWatching: false, watchId: null });
  };

  if (isFirstRef.current) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <h2>Geolocation API Sample</h2>
      {!isFirstRef && !isAvailable && <ErrorText />}
      {isAvailable && (
        <div>
          <button onClick={getCurrentPosition}>Get Current Position</button>
          {watchStatus.isWatching ? (
            <button onClick={() => stopWatchPosition(watchStatus)}>
              Stop Watch Position
            </button>
          ) : (
            <button onClick={startWatchPosition}>Start Watch Position</button>
          )}
          <div>
            <h3>Position</h3>
            <div>
              latitude: {position.latitude}
              <br />
              longitude: {position.longitude}
            </div>
          </div>
          <div>
            <h3>Watch Mode</h3>
            <p>
              Watch Status:{" "}
              {watchStatus.isWatching ? "Watching" : "Not Watching"}
            </p>
            <p>Watch ID: {watchStatus.watchId}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
