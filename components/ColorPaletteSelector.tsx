'use client';

interface ColorPaletteSelectorProps {
  onSelect: (color: string | string[], e?: React.MouseEvent) => void;
  type: 'solid' | 'gradient';
  label?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  currentColor?: string | string[];
}

const colors = {
  backgrounds: [
    '#e2e8f0', // slate-200
    '#fecaca', // red-200
    '#fed7aa', // orange-200
    '#fef08a', // yellow-200
    '#d9f99d', // lime-200
    '#bbf7d0', // green-200
    '#a5f3fc', // cyan-200
    '#bae6fd', // sky-200
    '#bfdbfe', // blue-200
    '#e9d5ff', // purple-200
    '#f5d0fe', // fuchsia-200
    '#fecdd3', // rose-200
  ],
  logos: [
    '#94a3b8', // slate-400
    '#f87171', // red-400
    '#fb923c', // orange-400
    '#facc15', // yellow-400
    '#a3e635', // lime-400
    '#4ade80', // green-400
    '#22d3ee', // cyan-400
    '#38bdf8', // sky-400
    '#60a5fa', // blue-400
    '#c084fc', // purple-400
    '#e879f9', // fuchsia-400
    '#fb7185', // rose-400
  ]
};

export default function ColorPaletteSelector({ 
  onSelect, 
  type, 
  label,
  buttonType = 'button',
  currentColor
}: ColorPaletteSelectorProps) {
  const colorArray = type === 'solid' ? colors.logos : colors.backgrounds;

  const renderColorButton = (color: string) => (
    <button
      key={color}
      type={buttonType}
      onClick={(e) => onSelect(color, e)}
      className={`w-6 h-6 rounded-full border hover:scale-110 
        transition-transform duration-200 hover:shadow-md
        ${currentColor === color ? 'border-2 border-blue-500' : 'border-white shadow-sm'}`}
      style={{ backgroundColor: color }}
      aria-label={`Select ${color} color`}
    />
  );

  return (
    <div className="space-y-1">
      <label className="block text-xs italic font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {colorArray.map(renderColorButton)}
      </div>
    </div>
  );
} 