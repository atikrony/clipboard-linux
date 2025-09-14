const { ipcRenderer } = require('electron');

class ClipboardManager {
    constructor() {
        this.clipboardHistory = [];
        this.filteredHistory = [];
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadClipboardHistory();
    }

    initializeElements() {
        this.emptyState = document.getElementById('emptyState');
        this.pinnedSection = document.getElementById('pinnedSection');
        this.recentSection = document.getElementById('recentSection');
        this.pinnedItems = document.getElementById('pinnedItems');
        this.recentItems = document.getElementById('recentItems');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.closeBtn = document.getElementById('closeBtn');
    }

    bindEvents() {
        // Header controls
        this.clearAllBtn.addEventListener('click', () => {
            this.clearAllHistory();
        });

        this.closeBtn.addEventListener('click', () => {
            ipcRenderer.invoke('hide-window');
        });

        // IPC listeners
        ipcRenderer.on('clipboard-updated', (event, history) => {
            this.clipboardHistory = history;
            this.filterAndRender();
        });

        ipcRenderer.on('history-cleared', () => {
            this.clipboardHistory = [];
            this.filterAndRender();
        });

        ipcRenderer.on('refresh-history', () => {
            this.loadClipboardHistory();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ipcRenderer.invoke('hide-window');
            }
        });
    }

    async loadClipboardHistory() {
        this.clipboardHistory = await ipcRenderer.invoke('get-clipboard-history');
        this.filterAndRender();
    }

    filterAndRender() {
        this.filteredHistory = this.clipboardHistory;
        this.render();
    }

    render() {
        const pinnedItems = this.filteredHistory.filter(item => item.pinned);
        const recentItems = this.filteredHistory.filter(item => !item.pinned);

        // Show/hide empty state
        if (this.filteredHistory.length === 0) {
            this.emptyState.style.display = 'flex';
            this.pinnedSection.style.display = 'none';
            this.recentSection.style.display = 'none';
            return;
        }

        this.emptyState.style.display = 'none';

        // Render pinned items
        if (pinnedItems.length > 0) {
            this.pinnedSection.style.display = 'block';
            this.renderItems(this.pinnedItems, pinnedItems);
        } else {
            this.pinnedSection.style.display = 'none';
        }

        // Render recent items
        if (recentItems.length > 0) {
            this.recentSection.style.display = 'block';
            this.renderItems(this.recentItems, recentItems);
        } else {
            this.recentSection.style.display = 'none';
        }
    }

    renderItems(container, items) {
        container.innerHTML = '';

        items.forEach(item => {
            const itemElement = this.createItemElement(item);
            container.appendChild(itemElement);
        });
    }

    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `clipboard-item ${item.pinned ? 'pinned' : ''} ${item.type}`;
        itemDiv.setAttribute('data-id', item.id);

        let contentHtml = '';
        
        if (item.type === 'image') {
            // For images, show a thumbnail
            const displayContent = `<img src="${item.content}" class="image-preview" alt="Clipboard image">`;
            contentHtml = displayContent;
        } else {
            // For text, truncate for display
            const displayContent = item.content.length > 150 
                ? item.content.substring(0, 150) + '...' 
                : item.content;
            contentHtml = this.escapeHtml(displayContent);
        }

        itemDiv.innerHTML = `
            <div class="item-content">${contentHtml}</div>
            <div class="item-actions">
                <button class="action-btn pin-btn ${item.pinned ? 'pinned' : ''}" title="${item.pinned ? 'Unpin' : 'Pin'}">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M9.828 1.172a.5.5 0 00-.707 0L8 2.293 6.879 1.172a.5.5 0 00-.707.707L7.293 3 6.5 3.793a1 1 0 000 1.414L8.793 7.5 7.5 8.793a1 1 0 001.414 1.414L10.207 8.914a1 1 0 000-1.414L8.914 6.207l.793-.793a1 1 0 00-1.414-1.414L7.5 4.793 6.207 3.5a.5.5 0 000-.707z"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" title="Delete">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6v7a2 2 0 002 2h6a2 2 0 002-2V6M8 3v1m-4 0h8M6.5 3V2.5A1.5 1.5 0 018 1h0a1.5 1.5 0 011.5 1.5V3"/>
                    </svg>
                </button>
            </div>
        `;

        // Add click handlers
        itemDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.item-actions')) {
                this.copyToClipboard(item.content, item.type);
            }
        });

        // Pin/unpin functionality
        const pinBtn = itemDiv.querySelector('.pin-btn');
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePin(item.id);
        });

        // Delete functionality
        const deleteBtn = itemDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteItem(item.id);
        });

        return itemDiv;
    }

    async copyToClipboard(content, type = 'text') {
        try {
            await ipcRenderer.invoke('copy-to-clipboard', content, type);
            this.showCopyFeedback(type);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showErrorFeedback();
        }
    }

    showCopyFeedback(type = 'text') {
        // Create temporary feedback message
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        const message = type === 'image' ? 'Image pasted!' : 'Text pasted!';
        const subMessage = type === 'image' ? 'Image automatically pasted to focused area' : 'Text automatically pasted to input field';
        
        feedback.innerHTML = `
            <div>✓ ${message}</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">${subMessage}</div>
        `;
        document.body.appendChild(feedback);

        // Remove after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    showErrorFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback error';
        feedback.textContent = 'Failed to copy!';
        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    async togglePin(id) {
        this.clipboardHistory = await ipcRenderer.invoke('toggle-pin', id);
        this.filterAndRender();
    }

    async deleteItem(id) {
        this.clipboardHistory = await ipcRenderer.invoke('delete-clipboard-item', id);
        this.filterAndRender();
    }

    async clearAllHistory() {
        this.clipboardHistory = await ipcRenderer.invoke('clear-all');
        this.filterAndRender();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the clipboard manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ClipboardManager();
});
