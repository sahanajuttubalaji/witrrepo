// Simple test suite for Writr journal app
// Run this in the browser console after loading the app

function runTests() {
    console.log('Running Writr app tests...');
    
    // Clear localStorage for testing
    clearLocalStorageForTesting();
    
    // Run individual tests
    testCharacterCounter();
    testEntrySubmission();
    testDailyEntryLimit();
    testEntryRetrieval();
    
    console.log('All tests completed!');
}

function clearLocalStorageForTesting() {
    // Clear only date-formatted keys (YYYY-MM-DD)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('Cleared localStorage for testing');
    
    // Reload the app state
    location.reload();
}

function testCharacterCounter() {
    console.log('Testing character counter...');
    
    const journalEntry = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');
    
    // Test initial state
    if (charCount.textContent !== '0') {
        console.error('Character counter should start at 0');
    } else {
        console.log('✓ Character counter starts at 0');
    }
    
    // Test character counting
    journalEntry.value = 'Hello, world!';
    
    // Manually trigger the input event
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    journalEntry.dispatchEvent(inputEvent);
    
    if (charCount.textContent !== '13') {
        console.error(`Character counter should be 13, but got ${charCount.textContent}`);
    } else {
        console.log('✓ Character counter updates correctly');
    }
    
    // Clear for next test
    journalEntry.value = '';
    journalEntry.dispatchEvent(inputEvent);
}

function testEntrySubmission() {
    console.log('Testing entry submission...');
    
    const journalEntry = document.getElementById('journal-entry');
    const entryForm = document.getElementById('entry-form');
    const todayKey = new Date().toISOString().split('T')[0];
    
    // Set a test entry
    journalEntry.value = 'Test journal entry for today';
    
    // Manually trigger the input event to update char counter
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    journalEntry.dispatchEvent(inputEvent);
    
    // Submit the form
    const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
    });
    entryForm.dispatchEvent(submitEvent);
    
    // Check if entry was saved to localStorage
    const savedEntry = localStorage.getItem(todayKey);
    if (savedEntry !== 'Test journal entry for today') {
        console.error(`Entry not saved correctly. Expected "Test journal entry for today", got "${savedEntry}"`);
    } else {
        console.log('✓ Entry saved to localStorage correctly');
    }
    
    // Check if form is disabled after submission
    if (!journalEntry.disabled) {
        console.error('Journal entry field should be disabled after submission');
    } else {
        console.log('✓ Form disabled after submission');
    }
}

function testDailyEntryLimit() {
    console.log('Testing daily entry limit...');
    
    // We need to reload the page to test this properly
    // This is a manual test instruction
    console.log('To test daily entry limit:');
    console.log('1. Reload the page');
    console.log('2. Verify that the text area is disabled');
    console.log('3. Verify that a message indicates you\'ve already written today');
}

function testEntryRetrieval() {
    console.log('Testing entry retrieval and display...');
    
    const entriesContainer = document.getElementById('entries-container');
    const todayKey = new Date().toISOString().split('T')[0];
    
    // Check if today's entry is displayed in the entries list
    const entryCards = entriesContainer.querySelectorAll('.entry-card');
    
    if (entryCards.length === 0) {
        console.error('No entry cards found in the entries container');
        return;
    }
    
    // The first card should be today's entry
    const firstCardText = entryCards[0].querySelector('.entry-text').textContent;
    if (firstCardText !== 'Test journal entry for today') {
        console.error(`First entry card should contain today's entry, but got "${firstCardText}"`);
    } else {
        console.log('✓ Today\'s entry is displayed in the entries list');
    }
}

// Instructions for running tests
console.log('To run Writr app tests, call the runTests() function in the console');