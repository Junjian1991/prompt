import { useState } from 'react';
import { Language } from '../utils/promptGenerator';

interface SelectWithInputProps {
  label: string;
  items: { value: string; label: string; en_value?: string }[];
  value: string;
  customValue: string;
  onValueChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  language?: Language;
  placeholder?: string;
}

export const SelectWithInput = ({
  label,
  items,
  value,
  customValue,
  onValueChange,
  onCustomChange,
  language = 'zh',
  placeholder
}: SelectWithInputProps) => {
  const [inputValue, setInputValue] = useState(customValue || '');

  const handleSelectChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    const item = items.find(i => i.value === selectedValue);
    const displayValue = item ? (language === 'en' && item.en_value ? item.en_value : item.label) : selectedValue;
    setInputValue(displayValue);
    onCustomChange(displayValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onCustomChange(newValue);
    if (value) {
      onValueChange('');
    }
  };

  const getItemLabel = (item: { label: string; en_value?: string }): string => {
    if (language === 'en' && item.en_value) {
      return item.en_value;
    }
    return item.label;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <select
        value={value || ''}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
      >
        <option value="">{language === 'zh' ? '请选择资产' : 'Select asset'}</option>
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {getItemLabel(item)}
          </option>
        ))}
      </select>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || (language === 'zh' ? '或手动输入名称' : 'Or enter name manually')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mt-2"
      />
    </div>
  );
};