import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import './App.css';
import SpaceScene from './components/SpaceScene';
import ColorControls from './components/ColorControls';

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  stars: string;
}

function App() {
  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    background: '#000011',
    stars: '#ffffff',
  });

  const [shapeType, setShapeType] = useState<string>('sphere');

  return (
    <div className="App">
      <div className="controls-panel">
        <h1>Futuristic Space Graphics</h1>
        <ColorControls
          colorSettings={colorSettings}
          onColorChange={setColorSettings}
          shapeType={shapeType}
          onShapeChange={setShapeType}
        />
      </div>
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: colorSettings.background }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <SpaceScene colorSettings={colorSettings} shapeType={shapeType} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
