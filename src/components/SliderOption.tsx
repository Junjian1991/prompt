import { useState, useEffect } from 'react';

interface SliderOptionProps {
  label: { zh: string; en: string };
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  value: string | undefined;
  onChange: (value: string) => void;
  language: 'zh' | 'en';
}

export const SliderOption = ({
  label,
  min,
  max,
  step,
  defaultValue,
  value,
  onChange,
  language
}: SliderOptionProps) => {
  const [localValue, setLocalValue] = useState<number>(parseFloat(value || `${defaultValue}`));

  useEffect(() => {
    setLocalValue(parseFloat(value || `${defaultValue}`));
  }, [value, defaultValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange(`${newValue}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setLocalValue(newValue);
      onChange(`${newValue}`);
    }
  };

  const handlePreset = (presetValue: number) => {
    setLocalValue(presetValue);
    onChange(`${presetValue}`);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {language === 'zh' ? label.zh : label.en}
      </label>
      
      {/* 预设按钮 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => handlePreset(0.5)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            localValue === 0.5
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {language === 'zh' ? '宽松 (0.5)' : 'Loose (0.5)'}
        </button>
        <button
          onClick={() => handlePreset(1.0)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            localValue === 1.0
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {language === 'zh' ? '平衡 (1.0)' : 'Balanced (1.0)'}
        </button>
        <button
          onClick={() => handlePreset(1.5)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            localValue === 1.5
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {language === 'zh' ? '严格 (1.5)' : 'Strict (1.5)'}
        </button>
      </div>

      {/* 滑块和输入框 */}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleInputChange}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
        />
      </div>

      {/* 范围提示 */}
      <p className="text-xs text-gray-500 mt-1">
        {language === 'zh' ? '范围：0.1~2.0' : 'Range: 0.1~2.0'}
      </p>
    </div>
  );
};
