import { useState } from 'react';
import { filterBannedWords } from '../utils/bannedWords';
import { Language } from '../utils/promptGenerator';

interface SelectOptionProps {
  label: string;
  items: { value: string; label: string; en_value?: string }[];
  categories?: { name: string | { zh: string; en: string }; items: { value: string; label: string; en_value?: string }[] }[];
  hasCustom: boolean;
  isMultiSelect?: boolean;
  defaultItems?: string[];
  value: string | string[];
  customValue: string;
  onValueChange: (value: string | string[]) => void;
  onCustomChange: (value: string) => void;
  error?: string;
  language?: Language;
  customPlaceholder?: string;
  collapsible?: boolean;
  selectMode?: 'replace' | 'append';
}

export const SelectOption = ({
  label,
  items,
  categories,
  hasCustom,
  isMultiSelect = false,
  defaultItems = [],
  value,
  customValue,
  onValueChange,
  onCustomChange,
  error,
  language = 'zh',
  customPlaceholder,
  collapsible = false,
  selectMode = 'replace'
}: SelectOptionProps) => {
  const [showCustom, setShowCustom] = useState(!!customValue);
  const [customInput, setCustomInput] = useState(customValue);
  const [inputError, setInputError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(collapsible);

  const getItemLabel = (item: { label?: string; name?: string; en_value?: string }): string => {
    if (language === 'en' && item.en_value) {
      return item.en_value;
    }
    return item.label || item.name || '';
  };

  const getItemValue = (item: { value?: string; name?: string }): string => {
    return item.value || item.name || '';
  };

  const getCategoryName = (name: string | { zh: string; en: string }): string => {
    if (typeof name === 'object') {
      return name[language];
    }
    return name;
  };

  const handlePresetSelect = (item: { value?: string; name?: string }) => {
    const itemValue = getItemValue(item);
    
    if (selectMode === 'append') {
      onValueChange(itemValue);
      return;
    }
    
    if (isMultiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter(v => v !== itemValue)
        : [...currentValues, itemValue];
      onValueChange(newValues);
    } else {
      onValueChange(itemValue);
      onCustomChange('');
      setShowCustom(false);
      setCustomInput('');
      setInputError('');
    }
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    if (!isMultiSelect) {
      onValueChange('');
    }
  };

  const handleCustomBlur = () => {
    const result = filterBannedWords(customInput);
    if (result.hasExactMatch) {
      setInputError(language === 'zh' ? '输入内容包含不当词汇，已自动过滤' : 'Inappropriate content filtered');
      setCustomInput(result.filteredText);
      onCustomChange(result.filteredText);
    } else {
      setInputError('');
      onCustomChange(customInput);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const allItems = categories ? categories.flatMap(cat => cat.items) : items;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {collapsible && (
          <button
            onClick={toggleCollapse}
            className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            {isCollapsed ? (language === 'zh' ? '展开' : 'Expand') : (language === 'zh' ? '收起' : 'Collapse')}
            <span className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`}>▼</span>
          </button>
        )}
      </div>
      
      {!isCollapsed && (
        <>
          {categories ? (
            <div className="space-y-3">
              {categories.map(category => (
                <div key={typeof category.name === 'object' ? category.name.zh : category.name}>
                  <span className="text-xs text-gray-500 mb-1.5 block">{getCategoryName(category.name)}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map(item => {
                      const itemVal = getItemValue(item);
                      return (
                        <button
                          key={itemVal}
                          onClick={() => handlePresetSelect(item)}
                          className={`option-button ${
                            isMultiSelect
                              ? value.includes(itemVal)
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                              : value === itemVal
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {getItemLabel(item)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {allItems.map(item => {
                const itemVal = getItemValue(item);
                return (
                  <button
                    key={itemVal}
                    onClick={() => handlePresetSelect(item)}
                    className={`option-button ${
                      isMultiSelect
                        ? value.includes(itemVal)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                        : value === itemVal
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getItemLabel(item)}
                  </button>
                );
              })}
            </div>
          )}

          {hasCustom && (
            <div className="mt-2">
              <button
                onClick={handleCustomClick}
                className="option-button custom mb-2"
              >
                {language === 'zh' ? '自定义' : 'Custom'}
              </button>
              {showCustom && (
                <div>
                  <input
                    type="text"
                    value={customInput}
                    onChange={handleCustomChange}
                    onBlur={handleCustomBlur}
                    placeholder={customPlaceholder || (language === 'zh' ? `输入${label}...` : `Enter ${label}...`)}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      inputError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                    }`}
                  />
                  {inputError && (
                    <p className="text-xs text-red-500 mt-1">{inputError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      )}
    </div>
  );
};
