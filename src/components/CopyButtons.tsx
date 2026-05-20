import { useState } from 'react';
import { checkBannedWords } from '../utils/bannedWords';
import { Language } from '../utils/promptGenerator';

interface CopyButtonsProps {
  fullPrompt: string;
  plainText: string;
  englishVersion: string;
  language: Language;
}

const buttonLabels: Record<Language, Record<string, string>> = {
  zh: {
    full: '复制完整提示词',
    plain: '复制纯文本',
    english: '复制英文版',
    copied: '已复制'
  },
  en: {
    full: 'Copy Full Prompt',
    plain: 'Copy Plain Text',
    english: 'Copy English Version',
    copied: 'Copied'
  }
};

export const CopyButtons = ({ fullPrompt, plainText, englishVersion, language }: CopyButtonsProps) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const { hasExact } = checkBannedWords(fullPrompt);

  const labels = buttonLabels[language];

  const handleCopy = async (text: string, type: string) => {
    if (hasExact) {
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleCopy(fullPrompt, 'full')}
        disabled={hasExact}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          hasExact
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : copiedType === 'full'
              ? 'bg-green-500 text-white'
              : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copiedType === 'full' ? labels.copied : labels.full}
      </button>
      
      <button
        onClick={() => handleCopy(plainText, 'plain')}
        disabled={hasExact}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          hasExact
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : copiedType === 'plain'
              ? 'bg-green-500 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {copiedType === 'plain' ? labels.copied : labels.plain}
      </button>
      
      <button
        onClick={() => handleCopy(englishVersion, 'english')}
        disabled={hasExact}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          hasExact
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : copiedType === 'english'
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-800'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {copiedType === 'english' ? labels.copied : labels.english}
      </button>
    </div>
  );
};
