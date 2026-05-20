import { checkBannedWords } from '../utils/bannedWords';

interface PreviewPanelProps {
  content: string;
}

export const PreviewPanel = ({ content }: PreviewPanelProps) => {
  const { hasExact, hasFuzzy } = checkBannedWords(content);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">预览</h2>
        {hasExact && (
          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
            包含不当词汇
          </span>
        )}
        {hasFuzzy && !hasExact && (
          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            包含敏感词汇
          </span>
        )}
      </div>
      <div className={`flex-1 overflow-auto p-4 ${
        hasExact ? 'bg-red-50' : hasFuzzy ? 'bg-yellow-50' : 'bg-gray-50'
      }`}>
        <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
          {content || '请在左侧选择选项，预览将在这里显示...'}
        </pre>
      </div>
    </div>
  );
};
