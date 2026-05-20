import templates from '../data/templates.json';
import options from '../data/options.json';

export interface PromptState {
  [key: string]: string | string[];
}

export type Language = 'zh' | 'en';

export const generatePrompt = (templateId: string, state: PromptState, lang: Language = 'zh'): string => {
  const template = templates[templateId as keyof typeof templates];
  if (!template) return '';

  const format = template.outputFormat as Record<Language, string>;
  let prompt = format[lang] || format.zh;

  const processedState = processStateForLanguage(state, templateId, lang);

  // 处理风格合并
  const mergedStyle = mergeStyle(state, templateId, lang);
  const mergedStyleEn = mergeStyle(state, templateId, 'en');
  processedState['style'] = mergedStyle;
  processedState['style_en'] = mergedStyleEn;

  // 处理组合字段
  if (templateId === 'T1') {
    processT1CombinedFields(state, processedState, lang);
  }
  if (templateId === 'T4') {
    processT4CombinedFields(state, processedState, lang);
  }
  if (templateId === 'T5') {
    processT5CombinedFields(state, processedState, lang);
  }

  if (state.prop && typeof state.prop === 'string' && state.prop.trim()) {
    processedState[`prop_line${lang === 'en' ? '_en' : ''}`] = lang === 'zh' 
      ? `- ${state.prop}：@上传${state.prop}的道具图` 
      : `- ${state.prop}: @upload ${state.prop} prop image`;
  } else {
    processedState[`prop_line${lang === 'en' ? '_en' : ''}`] = '';
  }

  // 设置默认值
  const suffix = lang === 'en' ? '_en' : '';
  processedState[`aspect_ratio${suffix}`] = (processedState[`aspect_ratio${suffix}`] as string) || '16:9';
  processedState[`image_weight${suffix}`] = (processedState[`image_weight${suffix}`] as string) || '1.0';

  Object.keys(processedState).forEach(key => {
    const value = processedState[key];
    let replacement = '';
    
    if (Array.isArray(value) && value.length > 0) {
      replacement = value.join(', ');
    } else if (typeof value === 'string' && value.trim()) {
      replacement = value;
    }

    const placeholder = `{{${key}}}`;
    prompt = prompt.split(placeholder).join(replacement);
  });

  return prompt.trim();
};

const OUTERWEAR_TYPES = [
  '校服外套', '运动外套', '连帽卫衣', '开襟卫衣', '西装外套', '牛仔夹克',
  '风衣', '羽绒服', '针织开衫', '棒球夹克', '马甲'
];

const processT1CombinedFields = (state: PromptState, processedState: PromptState, lang: Language) => {
  const suffix = lang === 'en' ? '_en' : '';
  const templateOptions = options['T1'] || {};
  
  // 面部特征
  const faceParts: string[] = [];
  if (state.eye_size) faceParts.push(`${lang === 'zh' ? '眼睛' : 'Eyes'}${processedState[`eye_size${suffix}`]}`);
  if (state.eye_lid) faceParts.push(`${processedState[`eye_lid${suffix}`]}${lang === 'zh' ? '眼皮' : ' eyelids'}`);
  if (state.eye_corner) faceParts.push(`${lang === 'zh' ? '眼尾' : 'eye corners'}${processedState[`eye_corner${suffix}`]}`);
  if (state.eye_expression) faceParts.push(`${lang === 'zh' ? '眼神' : 'eyes'}${processedState[`eye_expression${suffix}`]}`);
  if (state.eye_color) faceParts.push(`${lang === 'zh' ? '瞳色' : 'eyes'}${processedState[`eye_color${suffix}`]}`);
  if (state.eyebrow_density) faceParts.push(`${lang === 'zh' ? '眉毛' : 'eyebrows'}${processedState[`eyebrow_density${suffix}`]}`);
  if (state.eyebrow_shape) faceParts.push(processedState[`eyebrow_shape${suffix}`] as string);
  if (state.eyebrow_color) faceParts.push(processedState[`eyebrow_color${suffix}`] as string);
  if (state.nose) faceParts.push(`${lang === 'zh' ? '鼻子' : 'nose'}${processedState[`nose${suffix}`]}`);
  if (state.lip_thickness) faceParts.push(`${lang === 'zh' ? '嘴唇' : 'lips'}${processedState[`lip_thickness${suffix}`]}`);
  if (state.lip_color) faceParts.push(`${lang === 'zh' ? '唇色' : ''}${processedState[`lip_color${suffix}`]}`);
  if (state.skin_color) faceParts.push(`${lang === 'zh' ? '肤色' : 'skin'}${processedState[`skin_color${suffix}`]}`);
  
  processedState[`face_features${suffix}`] = faceParts.join(lang === 'zh' ? '，' : ', ');

  // 发型 - 新格式：{{颜色}}头发（{{长度描述}}），{{刘海}}刘海，{{发质}}，{{造型}}
  if (state.hair_color || state.hair_length || state.hair_bangs || state.hair_texture || state.hair_style) {
    const hairStrParts: string[] = [];
    if (state.hair_color) hairStrParts.push(`${processedState[`hair_color${suffix}`]}${lang === 'zh' ? '头发' : ' hair'}`);
    if (state.hair_length) hairStrParts.push(`${lang === 'zh' ? '（' : '('}${processedState[`hair_length${suffix}`]}${lang === 'zh' ? '）' : ')'}`);
    let hairLine1 = hairStrParts.join('');
    const hairLine2Parts: string[] = [];
    if (state.hair_bangs) hairLine2Parts.push(`${processedState[`hair_bangs${suffix}`]}${lang === 'zh' ? '刘海' : ' bangs'}`);
    if (state.hair_texture) hairLine2Parts.push(processedState[`hair_texture${suffix}`] as string);
    if (state.hair_style) hairLine2Parts.push(processedState[`hair_style${suffix}`] as string);
    const finalHairParts: string[] = [];
    if (hairLine1) finalHairParts.push(hairLine1);
    if (hairLine2Parts.length > 0) finalHairParts.push(hairLine2Parts.join(lang === 'zh' ? '，' : ', '));
    processedState[`hair${suffix}`] = finalHairParts.join(lang === 'zh' ? '，' : ', ');
  } else {
    processedState[`hair${suffix}`] = '';
  }

  // 身体特征
  const bodyParts: string[] = [];
  if (state.body_type) bodyParts.push(`${lang === 'zh' ? '身材' : 'build'}${processedState[`body_type${suffix}`]}`);
  if (state.height) bodyParts.push(`${lang === 'zh' ? '身高' : 'height'}${processedState[`height${suffix}`]}`);
  
  processedState[`body${suffix}`] = bodyParts.join(lang === 'zh' ? '，' : ', ');

  // 服饰搭配 - 根据用户要求的新格式
  const clothingParts: string[] = [];
  const topTypeValue = state.top_type as string;
  const isOuterwear = OUTERWEAR_TYPES.includes(topTypeValue);
  
  if (isOuterwear) {
    // 有外套时
    const hasInnerTop = state.top_inner_type && state.top_inner_type !== '无内搭';
    
    if (hasInnerTop && state.top_inner_color) {
      // 内搭{{内搭颜色}}{{内搭款式}}
      clothingParts.push(lang === 'zh' 
        ? `内搭${processedState[`top_inner_color${suffix}`]}${processedState[`top_inner_type${suffix}`]}`
        : `Inner: ${processedState[`top_inner_color${suffix}`]} ${processedState[`top_inner_type${suffix}`]}`);
    }
    
    if (state.top_outer_color) {
      // 外穿{{外套颜色}}{{外套款式}}
      clothingParts.push(lang === 'zh' 
        ? `外穿${processedState[`top_outer_color${suffix}`]}${topTypeValue}`
        : `Outer: ${processedState[`top_outer_color${suffix}`]} ${topTypeValue}`);
    } else if (!hasInnerTop) {
      // 只有外套没有内搭时：{{外套颜色}}{{外套款式}}
      clothingParts.push(topTypeValue);
    }
  } else if (state.top_type) {
    // 无外套时：{{款式}}（{{颜色}}{{图案}}）
    const topType = processedState[`top_type${suffix}`] as string;
    const topColor = processedState[`top_color${suffix}`] as string;
    const topPattern = processedState[`top_pattern${suffix}`] as string;
    
    if (lang === 'zh') {
      if (topColor || topPattern) {
        const details: string[] = [];
        if (topColor) details.push(topColor);
        if (topPattern) details.push(topPattern);
        clothingParts.push(`${topType}（${details.join('，')}）`);
      } else {
        clothingParts.push(topType);
      }
    } else {
      const parts: string[] = [topType];
      if (topColor) parts.push(`(${topColor}`);
      if (topPattern) parts.push(topPattern);
      if (topColor || topPattern) parts.push(')');
      clothingParts.push(parts.join(' '));
    }
  }

  // 下装 - {{款式}}（{{颜色}}{{条纹}}）
  if (state.bottom_type) {
    const bottomParts: string[] = [];
    if (state.bottom_color) bottomParts.push(processedState[`bottom_color${suffix}`] as string);
    if (state.bottom_stripe) bottomParts.push(processedState[`bottom_stripe${suffix}`] as string);
    if (bottomParts.length > 0) {
      clothingParts.push(lang === 'zh' 
        ? `下穿${processedState[`bottom_type${suffix}`]}（${bottomParts.join('，')}）`
        : `Wearing ${processedState[`bottom_type${suffix}`]} (${bottomParts.join(', ')})`);
    } else {
      clothingParts.push(lang === 'zh' 
        ? `下穿${processedState[`bottom_type${suffix}`]}`
        : `Wearing ${processedState[`bottom_type${suffix}`]}`);
    }
  }

  if (state.shoe_color && state.shoe_type) {
    clothingParts.push(lang === 'zh' 
      ? `脚穿${processedState[`shoe_color${suffix}`]}${processedState[`shoe_type${suffix}`]}`
      : `${processedState[`shoe_color${suffix}`]} ${processedState[`shoe_type${suffix}`]}`);
  }
  
  processedState[`clothing${suffix}`] = clothingParts.join(lang === 'zh' ? '，' : ', ');
};

const processT4CombinedFields = (state: PromptState, processedState: PromptState, lang: Language) => {
  const suffix = lang === 'en' ? '_en' : '';
  
  if (state.motion_description) {
    processedState[`composition_description${suffix}`] = state.motion_description as string;
  } else {
    const parts: string[] = [];
    if (state.scene) parts.push(processedState[`scene${suffix}`] as string);
    if (state.subject) parts.push(processedState[`subject${suffix}`] as string);
    if (state.action) parts.push(processedState[`action${suffix}`] as string);
    if (state.facial_expression) parts.push(processedState[`facial_expression${suffix}`] as string);
    if (state.emotion) parts.push(`${lang === 'zh' ? '情绪' : 'emotion'}${processedState[`emotion${suffix}`]}`);
    
    const prefix = lang === 'zh' ? '在' : 'In ';
    const separator = lang === 'zh' ? '，' : ', ';
    const suffixText = lang === 'zh' ? '。' : '.';
    
    processedState[`composition_description${suffix}`] = parts.length > 0 
      ? `${prefix}${parts.join(separator)}${suffixText}` 
      : '';
  }
};

const processT5CombinedFields = (state: PromptState, processedState: PromptState, lang: Language) => {
  const suffix = lang === 'en' ? '_en' : '';
  
  if (state.motion_description) {
    processedState[`motion_description${suffix}`] = state.motion_description as string;
  } else {
    const parts: string[] = [];
    if (state.subject) parts.push(processedState[`subject${suffix}`] as string);
    if (state.action_description) parts.push(processedState[`action_description${suffix}`] as string);
    
    const suffixText = lang === 'zh' ? '。' : '.';
    processedState[`motion_description${suffix}`] = parts.length > 0 
      ? `${parts.join('')}${suffixText}` 
      : '';
  }

  if (state.action_description_2) {
    const parts2: string[] = [];
    if (state.subject) parts2.push(processedState[`subject${suffix}`] as string);
    if (state.action_description_2) parts2.push(processedState[`action_description_2${suffix}`] as string);
    processedState[`motion_description_2${suffix}`] = parts2.length > 0 
      ? `${parts2.join('')}${suffixText}` 
      : '';
  } else {
    processedState[`motion_description_2${suffix}`] = '';
  }
};

const mergeStyle = (state: PromptState, templateId: string, lang: Language): string => {
  const templateOptions = options[templateId as keyof typeof options] || {};
  const parts: string[] = [];

  if (state.style_base) {
    const baseStyleValue = getOptionValue(templateOptions.style_base, state.style_base as string, lang);
    parts.push(baseStyleValue);
  }

  if (state.style_advanced && Array.isArray(state.style_advanced) && state.style_advanced.length > 0) {
    const advancedParts = state.style_advanced.map(v => 
      getOptionValue(templateOptions.style_advanced, v, lang)
    );
    parts.push(...advancedParts);
  }

  return parts.join(lang === 'zh' ? '，' : ', ');
};

const processStateForLanguage = (state: PromptState, templateId: string, lang: Language): PromptState => {
  const templateOptions = options[templateId as keyof typeof options] || {};
  const processed: PromptState = {};

  Object.keys(state).forEach(key => {
    const value = state[key];
    const optionConfig = templateOptions[key as keyof typeof templateOptions];
    
    if (optionConfig && typeof optionConfig === 'object') {
      const suffix = lang === 'en' ? '_en' : '';
      
      if (optionConfig.type === 'slider') {
        const sliderConfig = optionConfig as { default?: number };
        processed[`${key}${suffix}`] = typeof value === 'string' ? value : String(sliderConfig.default || '1.0');
      } else if (Array.isArray(value)) {
        processed[`${key}${suffix}`] = value.map(v => {
          return getOptionValue(optionConfig, v, lang);
        }).filter(v => v && v.trim());
      } else if (typeof value === 'string') {
        const newValue = getOptionValue(optionConfig, value, lang);
        processed[`${key}${suffix}`] = newValue;
      } else {
        processed[`${key}${suffix}`] = value;
      }
    } else {
      const suffix = lang === 'en' ? '_en' : '';
      processed[`${key}${suffix}`] = value;
    }
  });

  return processed;
};

const getOptionValue = (optionConfig: any, value: string, lang: Language): string => {
  if (!optionConfig) return value;
  if (!optionConfig.items && !optionConfig.categories) {
    return value;
  }

  let foundItem: { value?: string; name?: string; label?: string; description?: string; en_value?: string; zh_desc?: string; short_label?: string } | null = null;

  if (optionConfig.items) {
    foundItem = optionConfig.items.find((item: any) => item.value === value || item.name === value);
  } else if (optionConfig.categories) {
    for (const category of optionConfig.categories) {
      foundItem = category.items.find((item: any) => item.value === value || item.name === value);
      if (foundItem) break;
    }
  }

  if (foundItem) {
    if (optionConfig.useShortLabel) {
      return lang === 'en' ? (foundItem.en_value || foundItem.label || foundItem.name) : (foundItem.short_label || foundItem.label || foundItem.name);
    }
    if (optionConfig.useDesc) {
      return lang === 'en' ? (foundItem.en_value || foundItem.label || foundItem.name) : (foundItem.zh_desc || foundItem.label || foundItem.name);
    }
    if (foundItem.description) {
      return lang === 'en' ? (foundItem.en_value || foundItem.label || foundItem.name) : (foundItem.description || foundItem.label || foundItem.name);
    }
    return lang === 'en' ? (foundItem.en_value || foundItem.label || foundItem.name) : (foundItem.label || foundItem.name || foundItem.value);
  }

  return value;
};

export const generatePlainText = (prompt: string): string => {
  return prompt.replace(/【[^】]+】/g, '').replace(/\[([^\]]+)\]/g, '').replace(/{{[^}]+}}/g, '').trim();
};

export const generateEnglishVersion = (prompt: string): string => {
  return prompt;
};