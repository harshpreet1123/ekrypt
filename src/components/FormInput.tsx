interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  showForgotPassword?: boolean;
}

export function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  showForgotPassword = false,
}: FormInputProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        {showForgotPassword && (
          <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Forgot password?
          </a>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-900 bg-opacity-70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
        required={required}
      />
    </div>
  );
}