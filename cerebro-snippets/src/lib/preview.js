import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clipboard } from '@electron/remote';

const ITEM_SEPARATOR = /\n\n\n+/;
const codeStyle = { margin: 0, padding: '10px' };

// Inline styles (CSS import doesn't work in Cerebro environment)
const styles = {
    container: {
        outline: 'none',
        position: 'absolute', 
        top: '10px',
        paddingBottom: '10px',
    },
    hint: {
        padding: '8px 12px',
        fontSize: '12px',
        color: '#888',
        borderBottom: '1px solid #333',
        top: 0,
        background: '#1e1e1e',
        zIndex: 1,
    },
    copyToast: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(74, 158, 255, 0.95)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        animation: 'fadeIn 0.2s ease',
    },
    item: {
        padding: '8px',
        margin: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '2px solid transparent',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        transition: 'all 0.15s ease',
    },
    itemSelected: {
        borderColor: '#4a9eff',
        background: '#1a3a5c',
        boxShadow: '0 0 0 2px rgba(74, 158, 255, 0.5), 0 4px 12px rgba(74, 158, 255, 0.4)',
    },
    itemIndex: {
        minWidth: '24px',
        height: '24px',
        borderRadius: '4px',
        background: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#888',
        flexShrink: 0,
    },
    itemContent: {
        flex: 1,
        overflow: 'hidden',
    },
    copyButton: {
        padding: '6px 12px',
        background: '#4a9eff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        flexShrink: 0,
        transition: 'background 0.15s ease',
    },
    copyButtonHover: {
        background: '#3a8eef',
    },
    single: {
        outline: 'none',
        position: 'absoulte',
        top: '10px',
        paddingBottom: '10px',
    },
    singleCopyButton: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        padding: '6px 12px',
        background: '#4a9eff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 10,
        transition: 'background 0.15s ease',
    },
};

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 0, showCopyToast: false };
        this.containerRef = React.createRef();
        this.itemRefs = [];
        this.toastTimer = null;
    }

    componentDidMount() {
        if (this.containerRef.current) {
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedIndex !== this.state.selectedIndex) {
            const ref = this.itemRefs[this.state.selectedIndex];
            if (ref) {
                ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    componentWillUnmount() {
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }
    }

    getItems() {
        return this.props.content.split(ITEM_SEPARATOR).filter(item => item.trim());
    }

    showToast = () => {
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }
        this.setState({ showCopyToast: true });
        this.toastTimer = setTimeout(() => {
            this.setState({ showCopyToast: false });
        }, 1000);
    };

    copyToClipboard = (index) => {
        const items = this.getItems();
        const content = items[index];
        if (content) {
            clipboard.writeText(content);
            this.showToast();
        }
    };

    handleKeyDown = (e) => {
        const items = this.getItems();
        const { selectedIndex } = this.state;
        let newIndex = selectedIndex;

        if (items.length <= 1) {
            // Single item: Enter to copy
            if (e.key === 'Enter') {
                e.preventDefault();
                this.copyToClipboard(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                    e.preventDefault();
                    newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
                break;
            case 'ArrowUp':
                    e.preventDefault();
                    newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
                break;
            case 'j':
                if (e.ctrlKey) {
                    e.preventDefault();
                    newIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
                }
                break;
            case 'k':
                if (e.ctrlKey) {
                    e.preventDefault();
                    newIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
                }
                break;
            case 'Enter':
                e.preventDefault();
                this.copyToClipboard(selectedIndex);
                return;
            default:
                return;
        }

        this.setState({ selectedIndex: newIndex });
    };

    handleItemClick = (index) => {
        this.setState({ selectedIndex: index });
    };

    handleCopyClick = (e, index) => {
        e.stopPropagation();
        this.copyToClipboard(index);
    };

    render() {
        const { highlight, content } = this.props;
        const { selectedIndex, showCopyToast } = this.state;
        const items = this.getItems();

        const copyToast = showCopyToast && (
            <div style={styles.copyToast}>✓ Copied!</div>
        );

        // Single item - use original simple display
        if (items.length <= 1) {
            return (
                <div
                    ref={this.containerRef}
                    tabIndex={0}
                    onKeyDown={this.handleKeyDown}
                    style={styles.single}
                >
                    {copyToast}
                    <button
                        style={styles.singleCopyButton}
                        onClick={() => this.copyToClipboard(0)}
                    >
                        Copy
                    </button>
                    <SyntaxHighlighter language={highlight === 'nohighlight' ? 'text' : highlight} style={tomorrow} customStyle={codeStyle}>
                        {content}
                    </SyntaxHighlighter>
                </div>
            );
        }

        // Multiple items - use selectable list
        return (
            <div
                ref={this.containerRef}
                style={styles.container}
                tabIndex={0}
                onKeyDown={this.handleKeyDown}
            >
                {copyToast}
                <div style={styles.hint}>
                    Use Ctrl+j/k to select, Enter to copy
                </div>
                {items.map((item, index) => (
                    <div
                        key={index}
                        ref={el => this.itemRefs[index] = el}
                        style={{
                            ...styles.item,
                            ...(index === selectedIndex ? styles.itemSelected : {})
                        }}
                        onClick={() => this.handleItemClick(index)}
                    >
                        <div style={styles.itemIndex}>{index + 1}</div>
                        <div style={styles.itemContent}>
                            <SyntaxHighlighter language={highlight === 'nohighlight' ? 'text' : highlight} style={tomorrow} customStyle={codeStyle}>
                                {item}
                            </SyntaxHighlighter>
                        </div>
                        <button
                            style={styles.copyButton}
                            onClick={(e) => this.handleCopyClick(e, index)}
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}

export default Preview;
