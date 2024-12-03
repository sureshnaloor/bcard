'use client';

interface ColorPaletteProps {
  onSelect: (colors: string | string[]) => void;
  type: 'solid' | 'gradient';
  label: string;
}

export default function ColorPaletteSelector({ onSelect, type, label }: ColorPaletteProps) {
  const solidColors = [
    '#2563eb', '#16a34a', '#dc2626', '#9333ea', 
    '#ea580c', '#0891b2', '#4f46e5', '#0f172a'
  ];

  const gradients = [
    ['from-blue-500 to-cyan-500'],
    ['from-purple-500 to-pink-500'],
    ['from-cyan-500 to-blue-500'],
    ['from-emerald-500 to-teal-500'],
    ['from-rose-500 to-orange-500'],
    ['from-violet-500 to-purple-500'],
    ['from-indigo-500 to-blue-500'],
    ['from-slate-500 to-gray-500'],
  ];

  const renderSolidColorButton = (color: string) => (
    <button
      key={color}
      onClick={() => onSelect(color)}
      className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 
        transition-transform duration-200 hover:shadow-md"
      style={{ backgroundColor: color }}
      aria-label={`Select ${color} color`}
    />
  );

  const renderGradientButton = (gradientClasses: string[]) => (
    <button
      key={gradientClasses[0]}
      onClick={() => onSelect(gradientClasses)}
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