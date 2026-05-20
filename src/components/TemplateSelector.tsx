import templates from '../data/templates.json';
import { Language } from '../utils/promptGenerator';

interface TemplateSelectorProps {
  activeTemplate: string;
  onSelect: (templateId: string) => void;
  language: Language;
}

const templateOrder = ['T1', 'T2', 'T3', 'T4', 'T5'];

const templateNames: Record<string, Record<Language, string>> = {
  T1: { zh: '人物/生物', en: 'Character/Creature' },
  T2: { zh: '场景', en: 'Scene' },
  T3: { zh: '道具', en: 'Prop' },
  T4: { zh: '合成', en: 'Composition' },
  T5: { zh: '图生视频', en: 'Image to Video' },
};

export const TemplateSelector = ({ activeTemplate, onSelect, language }: TemplateSelectorProps) => {
  return (
    <div className="flex border-b border-gray-200">
      {templateOrder.map(templateId => {
        const template = templates[templateId as keyof typeof templates];
        if (!template) return null;
        
        return (
          <button
            key={templateId}
            onClick={() => onSelect(templateId)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTemplate === templateId
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1.5">{template.icon}</span>
            <span>{templateId} {templateNames[templateId][language]}</span>
          </button>
        );
      })}
    </div>
  );
};
