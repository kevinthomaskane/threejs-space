import React from 'react';
import { ColorSettings } from '../App';

interface ColorControlsProps {
  colorSettings: ColorSettings;
  onColorChange: (settings: ColorSettings) => void;
  shapeType: string;
  onShapeChange: (shape: string) => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  colorSettings,
  onColorChange,
  shapeType,
  onShapeChange,
}) => {
  const handleColorChange = (key: keyof ColorSettings, value: string) => {
    onColorChange({
      ...colorSettings,
      [key]: value,
    });
  };

  const shapeOptions = [
    { value: 'sphere', label: 'Sphere' },
    { value: 'cube', label: 'Cube' },
    { value: 'torus', label: 'Torus' },
    { value: 'cylinder', label: 'Cylinder' },
    { value: 'pyramid', label: 'Pyramid' },
    { value: 'galaxy', label: 'Galaxy' },
  ];

  return (
    <div className="color-controls">
      <h2>Color Controls</h2>

      <div className="control-group">
        <label>
          Primary Color:
          <input
            type="color"
            value={colorSettings.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Secondary Color:
          <input
            type="color"
            value={colorSettings.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Accent Color:
          <input
            type="color"
            value={colorSettings.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Background Color:
          <input
            type="color"
            value={colorSettings.background}
            onChange={(e) => handleColorChange('background', e.target.value)}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Stars Color:
          <input
            type="color"
            value={colorSettings.stars}
            onChange={(e) => handleColorChange('stars', e.target.value)}
          />
        </label>
      </div>

      <div className="shape-controls">
        <h3>Shape Controls</h3>
        <div className="shape-buttons">
          {shapeOptions.map((option) => (
            <button
              key={option.value}
              className={shapeType === option.value ? 'active' : ''}
              onClick={() => onShapeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="preset-buttons">
        <h3>Preset Themes</h3>
        <button
          onClick={() =>
            onColorChange({
              primary: '#00ffff',
              secondary: '#ff00ff',
              accent: '#ffff00',
              background: '#000011',
              stars: '#ffffff',
            })
          }
        >
          Cyberpunk
        </button>

        <button
          onClick={() =>
            onColorChange({
              primary: '#ff6b6b',
              secondary: '#4ecdc4',
              accent: '#45b7d1',
              background: '#2c3e50',
              stars: '#ecf0f1',
            })
          }
        >
          Ocean
        </button>

        <button
          onClick={() =>
            onColorChange({
              primary: '#e74c3c',
              secondary: '#f39c12',
              accent: '#f1c40f',
              background: '#2c1810',
              stars: '#ffffff',
            })
          }
        >
          Sunset
        </button>

        <button
          onClick={() =>
            onColorChange({
              primary: '#9b59b6',
              secondary: '#3498db',
              accent: '#2ecc71',
              background: '#1a1a2e',
              stars: '#ffffff',
            })
          }
        >
          Neon
        </button>
      </div>
    </div>
  );
};

export default ColorControls;
