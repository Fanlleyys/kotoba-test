import React from 'react';

interface RubyTextProps {
    text: string;        // The full text (may include kanji and kana)
    reading?: string;    // The furigana reading
    className?: string;  // Additional styling
    rubyClassName?: string; // Styling for the ruby (furigana) text
    showReading?: boolean;  // Whether to show the reading
}

/**
 * RubyText Component
 * Displays Japanese text with furigana (reading) above kanji characters
 * Uses HTML <ruby> element for proper semantic markup
 */
export const RubyText: React.FC<RubyTextProps> = ({
    text,
    reading,
    className = '',
    rubyClassName = '',
    showReading = true,
}) => {
    // Check if the text contains kanji
    const containsKanji = /[\u4e00-\u9faf\u3400-\u4dbf]/.test(text);

    // If no reading provided or shouldn't show, just return plain text
    if (!reading || !showReading || !containsKanji) {
        return <span className={className}>{text}</span>;
    }

    return (
        <ruby className={`ruby-text ${className}`}>
            {text}
            <rp>(</rp>
            <rt className={`text-pink-300 font-normal ${rubyClassName}`}>
                {reading}
            </rt>
            <rp>)</rp>
        </ruby>
    );
};

/**
 * Utility function to check if text contains kanji
 */
export const hasKanji = (text: string): boolean => {
    return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
};

export default RubyText;
