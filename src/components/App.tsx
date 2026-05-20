import { useState, useMemo } from 'react';
import { TemplateSelector } from './TemplateSelector';
import { OptionsPanel } from './OptionsPanel';
import { PreviewPanel } from './PreviewPanel';
import { CopyButtons } from './CopyButtons';
import { generatePrompt, generatePlainText, Language } from '../utils/promptGenerator';
import options from '../data/options.json';

interface State {
  [key: string]: string | string[];
}

interface CustomValues {
  [key: string]: string;
}

const initialState: State = {};
const initialCustomValues: CustomValues = {};

export const App = () => {
  const [activeTemplate, setActiveTemplate] = useState('T1');
  const [state, setState] = useState<State>(initialState);
  const [customValues, setCustomValues] = useState<CustomValues>(initialCustomValues);
  const [language, setLanguage] = useState<Language>('zh');

  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
    setState(initialState);
    setCustomValues(initialCustomValues);
  };

  const handleStateChange = (key: string, value: string | string[]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomChange = (key: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [key]: value }));
  };

  const mergedState = useMemo(() => {
    const merged: State = { ...state };
    
    Object.keys(customValues).forEach(key => {
      if (customValues[key]) {
        merged[key] = customValues[key];
      }
    });

    const templateOptions = options[activeTemplate as keyof typeof options] as { [key: string]: any };
    Object.keys(templateOptions || {}).forEach((key) => {
      const option = templateOptions?.[key];
      if (option && option.defaultSelected && !state[key] && !customValues[key]) {
        merged[key] = option.defaultSelected;
      }
    });

    return merged;
  }, [state, customValues, activeTemplate]);

  const fullPrompt = useMemo(() => {
    return generatePrompt(activeTemplate, mergedState, language);
  }, [activeTemplate, mergedState, language]);

  const plainText = useMemo(() => {
    return generatePlainText(fullPrompt);
  }, [fullPrompt]);

  const englishVersion = useMemo(() => {
    return generatePrompt(activeTemplate, mergedState, 'en');
  }, [activeTemplate, mergedState]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">AI提示词生成器</h1>
          <p className="text-sm text-primary-200 mt-0.5">辅助AI短剧创作 - 资产 → 合成 → 成片</p>
        </div>
        <button
          onClick={toggleLanguage}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {language === 'zh' ? 'English' : '中文'}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          <TemplateSelector
            activeTemplate={activeTemplate}
            onSelect={handleTemplateChange}
            language={language}
          />
          <div className="flex-1 overflow-auto p-4">
            <OptionsPanel
              templateId={activeTemplate}
              state={state}
              customValues={customValues}
              onStateChange={handleStateChange}
              onCustomChange={handleCustomChange}
              language={language}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1 border-b border-gray-200">
            <PreviewPanel content={fullPrompt} />
          </div>
          <div className="p-4 bg-gray-50">
            <CopyButtons
              fullPrompt={fullPrompt}
              plainText={plainText}
              englishVersion={englishVersion}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
