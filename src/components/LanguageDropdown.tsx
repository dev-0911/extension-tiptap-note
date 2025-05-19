// src/components/LanguageDropdown.tsx
import React from 'react';

// Language options
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt-PT', name: 'Português (PT)', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh-TW', name: '中文 (繁體)', flag: '🇹🇼' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

interface LanguageDropdownProps {
  isOpen: boolean;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
  onToggle: () => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  isOpen, 
  currentLanguage, 
  onSelectLanguage,
  onToggle
}) => {
  const getCurrentLanguageFlag = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.flag : '🇺🇸';
  };

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
        title="Change language"
        aria-label="Change language"
      >
        <span>{getCurrentLanguageFlag()}</span>
        <span className="text-xs">{currentLanguage.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <div 
              key={lang.code} 
              className={`language-option ${lang.code === currentLanguage ? 'active' : ''}`}
              onClick={() => onSelectLanguage(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;