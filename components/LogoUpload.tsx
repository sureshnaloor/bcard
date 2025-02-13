interface LogoUploadProps {
  value: string | null | undefined;
  onChange: (base64: string | null) => void;
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10KB = 10 * 1024 bytes)
    if (file.size > 10 * 1024) {
      alert('Logo must be less than 10KB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Choose Logo
        </label>
        {value && (
          <button
            onClick={() => onChange(null)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Logo preview"
            className="w-16 h-16 object-contain border rounded"
          />
        </div>
      )}
    </div>
  );
} 