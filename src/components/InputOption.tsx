import { filterBannedWords } from '../utils/bannedWords';

interface InputOptionProps {
  label: string;
  type?: 'input' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputOption = ({
  label,
  type = 'input',
  placeholder = '',
  value,
  onChange
}: InputOptionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const result = filterBannedWords(e.target.value);
    onChange(result.filteredText);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      )}
    </div>
  );
};
