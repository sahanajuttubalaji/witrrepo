document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const entryForm = document.getElementById('entry-form');
    const journalEntry = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');
    const saveButton = document.getElementById('save-button');
    const entryStatus = document.getElementById('entry-status');
    const entriesContainer = document.getElementById('entries-container');
    const noEntries = document.getElementById('no-entries');

    // Initialize the app
    init();

    function init() {
        // Set up event listeners
        journalEntry.addEventListener('input', updateCharCount);
        entryForm.addEventListener('submit', saveEntry);

        // Check if user has already made an entry today
        checkTodayEntry();

        // Load and display past entries
        loadEntries();
    }

    function updateCharCount() {
        const count = journalEntry.value.length;
        charCount.textContent = count;
        
        // Visual feedback as user approaches the limit
        if (count >= 90) {
            charCount.style.color = '#e74c3c';
        } else if (count >= 70) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#7f8c8d';
        }
    }

    function getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }

    function checkTodayEntry() {
        const todayKey = getTodayDateString();
        const todayEntry = localStorage.getItem(todayKey);
        
        if (todayEntry) {
            // User has already made an entry today
            journalEntry.disabled = true;
            saveButton.disabled = true;
            
            showStatus('You\'ve already written your entry for today. Come back tomorrow!', 'error');
            
            // Show today's entry in the form
            journalEntry.value = todayEntry;
            updateCharCount();
        } else {
            // Reset form for a new entry
            journalEntry.disabled = false;
            saveButton.disabled = false;
            entryStatus.classList.add('hidden');
            journalEntry.value = '';
            updateCharCount();
        }
    }

    function saveEntry(e) {
        e.preventDefault();
        
        const entry = journalEntry.value.trim();
        
        // Validate entry
        if (!entry) {
            showStatus('Please write something before saving.', 'error');
            return;
        }
        
        if (entry.length > 100) {
            showStatus('Entry is too long. Maximum 100 characters allowed.', 'error');
            return;
        }
        
        // Save to localStorage
        const dateKey = getTodayDateString();
        localStorage.setItem(dateKey, entry);
        
        // Update UI
        showStatus('Entry saved successfully!', 'success');
        
        // Disable form after saving
        journalEntry.disabled = true;
        saveButton.disabled = true;
        
        // Refresh entries list
        loadEntries();
    }

    function showStatus(message, type) {
        entryStatus.textContent = message;
        entryStatus.className = ''; // Clear previous classes
        entryStatus.classList.add(type);
        entryStatus.classList.remove('hidden');
    }

    function loadEntries() {
        // Clear current entries
        entriesContainer.innerHTML = '';
        
        // Get all entries from localStorage
        const entries = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Check if the key is a date (YYYY-MM-DD format)
            if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                entries.push({
                    date: key,
                    text: localStorage.getItem(key)
                });
            }
        }
        
        // Sort entries by date (newest first)
        entries.sort((a, b) => b.date.localeCompare(a.date));
        
        // Display entries or "no entries" message
        if (entries.length === 0) {
            noEntries.classList.remove('hidden');
        } else {
            noEntries.classList.add('hidden');
            
            entries.forEach(entry => {
                const entryCard = document.createElement('div');
                entryCard.className = 'entry-card';
                
                const formattedDate = formatDate(entry.date);
                
                entryCard.innerHTML = `
                    <div class="entry-date">${formattedDate}</div>
                    <div class="entry-text">${escapeHTML(entry.text)}</div>
                `;
                
                entriesContainer.appendChild(entryCard);
            });
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function escapeHTML(str) {
        // Simple function to prevent XSS
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});