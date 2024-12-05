'use client';

interface ColorPaletteSelectorProps {
  onSelect: (color: string | string[], e?: React.MouseEvent) => void;
  type: 'solid' | 'gradient';
  label?: string;
  buttonType?: 'button' | 'submit' | 'reset';
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
  buttonType = 'button'
}: ColorPaletteSelectorProps) {
  const solidColors = colors.backgrounds;

  const gradients = [
    ['from-blue-200 to-cyan-200'],
    ['from-purple-200 to-pink-200'],
    ['from-cyan-200 to-blue-200'],
    ['from-emerald-200 to-teal-200'],
    ['from-rose-200 to-orange-200'],
    ['from-violet-200 to-purple-200'],
    ['from-indigo-200 to-blue-200'],
    ['from-slate-200 to-gray-200'],
  ];

  const renderSolidColorButton = (color: string) => (
    <button
      key={color}
      type={buttonType}
      onClick={(e) => onSelect(color, e)}
      className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 
        transition-transform duration-200 hover:shadow-md"
      style={{ backgroundColor: color }}
      aria-label={`Select ${color} color`}
    />
  );

  const renderGradientButton = (gradientClasses: string[]) => (
    <button
      key={gradientClasses[0]}
      type={buttonType}
      onClick={(e) => onSelect(gradientClasses, e)}
      className={`w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 
        transition-transform duration-200 hover:shadow-md bg-gradient-to-r ${gradientClasses[0]}`}
      aria-label={`Select gradient ${gradientClasses[0]}`}
    />
  );

  return (
    <div className="space-y-1">
      <label className="block text-xs italic font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {type === 'solid' 
          ? solidColors.map(renderSolidColorButton)
          : gradients.map(renderGradientButton)
        }
      </div>
    </div>
  );
} 