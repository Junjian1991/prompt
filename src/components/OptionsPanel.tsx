import React, { useState, useRef, useEffect } from 'react';
import options from '../data/options.json';
import templates from '../data/templates.json';
import { InputOption } from './InputOption';
import { SelectOption } from './SelectOption';
import { SliderOption } from './SliderOption';
import { Language } from '../utils/promptGenerator';

const ASSET_FIELDS = ['subject', 'scene', 'prop'];

interface OptionsPanelProps {
  templateId: string;
  state: { [key: string]: string | string[] };
  customValues: { [key: string]: string };
  onStateChange: (key: string, value: string | string[]) => void;
  onCustomChange: (key: string, value: string) => void;
  language: Language;
}

const MOTION_FIELDS = ['action', 'facial_expression', 'emotion'];

const OUTERWEAR_TYPES = [
  '校服外套', '运动外套', '连帽卫衣', '开襟卫衣', '西装外套', '牛仔夹克',
  '风衣', '羽绒服', '针织开衫', '棒球夹克', '马甲'
];

const T1_BASE_OPTIONS = [
  'character_name', 'gender', 'age', 'face_shape',
  'eye_size', 'eye_lid', 'eye_corner', 'eye_expression', 'eye_color',
  'eyebrow_density', 'eyebrow_shape', 'eyebrow_color',
  'nose', 'lip_thickness', 'lip_color', 'lip_corner',
  'skin_color',
  'hair_length', 'hair_color', 'hair_bangs', 'hair_texture', 'hair_style',
  'body_type', 'height',
  'top_type',
  'bottom_type', 'bottom_color',
  'shoe_type', 'shoe_color',
  'accessories', 'temperament', 'special_features',
  'style_base', 'style_advanced', 'aspect_ratio', 'image_weight', 'negative_prompts'
];

export const OptionsPanel = ({
  templateId,
  state,
  customValues,
  onStateChange,
  onCustomChange,
  language
}: OptionsPanelProps) => {
  const templateOptions = options[templateId as keyof typeof options] as { [key: string]: any };
  const template = templates[templateId as keyof typeof templates];
  
  if (!templateOptions) return null;

  const [motionDescription, setMotionDescription] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const existingDesc = state.motion_description as string || customValues.motion_description || '';
    setMotionDescription(existingDesc);
  }, []);

  const handleMotionAppend = (value: string) => {
    setMotionDescription(prev => {
      const newValue = prev + value + ' ';
      onStateChange('motion_description', newValue);
      return newValue;
    });
  };

  const handleMotionInputChange = (value: string) => {
    setMotionDescription(value);
    onStateChange('motion_description', value);
  };

  const getLabel = (label: string | { zh: string; en: string }): string => {
    if (typeof label === 'object') {
      return label[language];
    }
    return label;
  };

  const getOptionsToRender = () => {
    if (templateId === 'T1') {
      const speciesValue = state.species as string || customValues.species;
      const t1Template = template as { speciesOptions?: { [key: string]: string[] } };
      const additionalOptions = t1Template?.speciesOptions?.[speciesValue] || [];
      const baseOptions = [...T1_BASE_OPTIONS, ...additionalOptions];
      
      const topTypeValue = state.top_type as string || customValues.top_type;
      const isOuterwear = OUTERWEAR_TYPES.includes(topTypeValue);
      
      if (isOuterwear) {
        return [
          ...baseOptions.filter(opt => opt !== 'top_type'),
          'top_type',
          'top_inner_type',
          'top_inner_color',
          'top_outer_color'
        ];
      } else if (topTypeValue) {
        return [
          ...baseOptions.filter(opt => opt !== 'top_type'),
          'top_type',
          'top_color',
          'top_pattern'
        ];
      }
      
      return baseOptions;
    }
    return Object.keys(templateOptions);
  };

  const optionsToRender = getOptionsToRender();

  const renderAssetInput = (key: string) => {
    const option = templateOptions[key];
    const value = state[key] as string || customValues[key] || '';
    
    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{getLabel(option.label)}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onStateChange(key, e.target.value);
            onCustomChange(key, e.target.value);
          }}
          placeholder={getLabel(option.placeholder) || (language === 'zh' ? '输入名称...' : 'Enter name...')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
    );
  };

  const renderSliderOption = (key: string) => {
    const option = templateOptions[key];
    const value = state[key] as string || '';
    
    return (
      <SliderOption
        key={key}
        label={option.label}
        min={option.min}
        max={option.max}
        step={option.step}
        defaultValue={option.default}
        value={value}
        onChange={(val) => onStateChange(key, val)}
        language={language}
      />
    );
  };

  const renderInputOption = (key: string) => {
    const option = templateOptions[key];
    const value = state[key] as string || '';
    
    return (
      <InputOption
        key={key}
        label={getLabel(option.label)}
        type={option.type}
        placeholder={getLabel(option.placeholder)}
        value={value}
        onChange={(val) => onStateChange(key, val)}
      />
    );
  };

  const renderSelectOption = (key: string) => {
    const option = templateOptions[key];
    const value = state[key] || (option.defaultSelected || []);
    const customValue = customValues[key] || '';
    const isMotionField = (templateId === 'T4' || templateId === 'T5') && MOTION_FIELDS.includes(key);
    
    return (
      <SelectOption
        key={key}
        label={getLabel(option.label)}
        items={option.items || []}
        categories={option.categories}
        hasCustom={isMotionField ? false : option.hasCustom}
        isMultiSelect={option.multiple}
        defaultItems={option.defaultSelected}
        value={value}
        customValue={customValue}
        onValueChange={isMotionField ? (val) => handleMotionAppend(val as string) : (val) => onStateChange(key, val)}
        onCustomChange={(val) => onCustomChange(key, val)}
        language={language}
        customPlaceholder={option.customPlaceholder ? getLabel(option.customPlaceholder) : undefined}
        collapsible={option.collapsible}
        selectMode={isMotionField ? 'append' : 'replace'}
      />
    );
  };

  const renderAssetFields = () => {
    return ASSET_FIELDS.map(key => {
      if (templateOptions[key]) {
        return renderAssetInput(key);
      }
      return null;
    });
  };

  const renderDynamicDescription = () => {
    if (templateId !== 'T4' && templateId !== 'T5') return null;
    
    return (
      <div className="mb-6 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'zh' ? '动态描述' : 'Motion Description'}
        </label>
        <textarea
          ref={textareaRef}
          value={motionDescription}
          onChange={(e) => handleMotionInputChange(e.target.value)}
          placeholder={language === 'zh' ? '请输入动态描述，或点击下方选项快速填入…' : 'Enter motion description, or click options below to append...'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          rows={4}
        />
      </div>
    );
  };

  const renderRemainingOptions = () => {
    const excludeFields = [...ASSET_FIELDS, 'motion_description', 'image_weight', 'aspect_ratio'];
    
    return optionsToRender.map(key => {
      if (excludeFields.includes(key)) return null;
      
      const option = templateOptions[key];
      if (!option) return null;
      if (templateId === 'T1' && key === 'species') return null;

      if (option.type === 'input' || option.type === 'textarea') {
        return renderInputOption(key);
      }

      if (option.type === 'select') {
        return renderSelectOption(key);
      }

      if (option.type === 'slider') {
        return renderSliderOption(key);
      }

      return null;
    });
  };

  return (
    <div className="overflow-auto">
      {templateId === 'T1' && (
        <div className="mb-6">
          <SelectOption
            label={getLabel((templateOptions as any).species.label)}
            items={(templateOptions as any).species.items}
            hasCustom={(templateOptions as any).species.hasCustom}
            value={state.species as string || ''}
            customValue={customValues.species || ''}
            onValueChange={(value) => {
              onStateChange('species', value);
              if (typeof value === 'string') {
                const t1Template = template as { speciesOptions?: { [key: string]: string[] } };
                const speciesOpts = t1Template?.speciesOptions?.[value] || [];
                speciesOpts.forEach(opt => {
                  onStateChange(opt, '');
                  onCustomChange(opt, '');
                });
              }
            }}
            onCustomChange={(value) => onCustomChange('species', value)}
            language={language}
          />
        </div>
      )}

      {renderRemainingOptions()}

      {templateOptions.image_weight && renderSliderOption('image_weight')}
      
      {templateOptions.aspect_ratio && renderSelectOption('aspect_ratio')}

      {(templateId === 'T4' || templateId === 'T5') && (
        <>
          {renderAssetFields()}
          {renderDynamicDescription()}
        </>
      )}

      {templateOptions.negative_prompts && renderInputOption('negative_prompts')}
    </div>
  );
};