import { Editor } from '@tiptap/react'

const colors = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
]

interface ColorSelectorProps {
  editor: Editor | null
}

const ColorSelector = ({ editor }: ColorSelectorProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`w-6 h-6 rounded-md border border-gray-300 transition-transform hover:scale-110 ${
            editor.isActive('textStyle', { color }) ? 'ring-2 ring-offset-2' : ''
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <button
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
      >
        Reset
      </button>
    </div>
  )
}

export default ColorSelector 