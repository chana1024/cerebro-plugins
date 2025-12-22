import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highlight from 'react-highlight';
import { clipboard } from '@electron/remote';
import '!!style-loader!css-loader!../../node_modules/highlight.js/styles/solarized-dark.css';
import '../styles/preview.css';

const ITEM_SEPARATOR = /\n\n\n+/;

export default ({ highlight, content }) => {
    const items = content.split(ITEM_SEPARATOR).filter(item => item.trim());
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef(null);
    const itemRefs = useRef([]);

    const copySelectedToClipboard = useCallback((index) => {
        const selectedContent = items[index];
        if (selectedContent) {
            clipboard.writeText(selectedContent);
        }
    }, [items]);

    const handleKeyDown = useCallback((e) => {
        if (items.length <= 1) return;

        let newIndex = selectedIndex;

        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                if (e.shiftKey) {
                    newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
                } else {
                    newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
                }
                break;
            case 'ArrowDown':
            case 'j':
                e.preventDefault();
                newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
                break;
            case 'ArrowUp':
            case 'k':
                e.preventDefault();
                newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
                break;
            case 'Enter':
                e.preventDefault();
                copySelectedToClipboard(selectedIndex);
                return;
            default:
                return;
        }

        setSelectedIndex(newIndex);
        copySelectedToClipboard(newIndex);
    }, [selectedIndex, items.length, copySelectedToClipboard]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.focus();
        }
    }, []);

    useEffect(() => {
        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [selectedIndex]);

    // Single item - use original simple display
    if (items.length <= 1) {
        return (
            <Highlight className={highlight}>
                {content}
            </Highlight>
        );
    }

    // Multiple items - use selectable list
    return (
        <div
            ref={containerRef}
            className="snippet-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="snippet-hint">
                Use Tab/↑↓/j/k to select, Enter to copy
            </div>
            {items.map((item, index) => (
                <div
                    key={index}
                    ref={el => itemRefs.current[index] = el}
                    className={`snippet-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedIndex(index);
                        copySelectedToClipboard(index);
                    }}
                >
                    <div className="item-index">{index + 1}</div>
                    <Highlight className={highlight}>
                        {item}
                    </Highlight>
                </div>
            ))}
        </div>
    );
};
