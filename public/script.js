import {
  boldUnicodeMap,
  italicUnicodeMap,
  underlineUnicodeMap,
  strikeThroughMap,
  orderedListUnicodeMap,
} from "./unicodeMaps.js";

// Configuration
const MAX_TEXT_LENGTH = 3000;

// Initialize Quill editor
let quill;
try {
  quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
      ],
    },
  });
} catch (error) {
  console.error("Failed to initialize Quill:", error);
  const editorElement = document.getElementById("editor");
  if (editorElement) {
    editorElement.innerHTML = '<p class="text-red-500">Failed to initialize the text editor. Please refresh the page or check your internet connection.</p>';
  }
}

// Text formatting functions
const formatText = (text, unicodeMap) =>
  text
    .split("")
    .map((char) => unicodeMap[char] || char)
    .join("");

const replaceWithBoldUnicode = (text) => formatText(text, boldUnicodeMap);
const replaceWithItalicUnicode = (text) => formatText(text, italicUnicodeMap);
const replaceWithUnderlineUnicode = (text) =>
  formatText(text, underlineUnicodeMap);
const replaceWithStrikeTextUnicode = (text) =>
  formatText(text, strikeThroughMap);
const replaceWithOrderedListUnicode = (text) =>
  formatText(text, orderedListUnicodeMap);
const replaceWithBulletListUnicode = (text) => "• " + text;

// Toolbar handlers
const toolbarHandlers = {
  bold: () => applyFormatting(replaceWithBoldUnicode, "bold"),
  italic: () => applyFormatting(replaceWithItalicUnicode, "italic"),
  underline: () => applyFormatting(replaceWithUnderlineUnicode, "underline"),
  strike: () => applyFormatting(replaceWithStrikeTextUnicode, "strike"),
  list: (value) => {
    if (value === "ordered") {
      applyListFormatting(replaceWithOrderedListUnicode);
    } else if (value === "bullet") {
      applyListFormatting(replaceWithBulletListUnicode);
    }
  },
};

// Apply formatting to selected text
function applyFormatting(formatFunction, formatType) {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const formattedText = formatFunction(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, formattedText, formatType);
  }
}

// Apply list formatting
function applyListFormatting(formatFunction) {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const lines = selectedText.split("\n");
    const formattedText = lines
      .map((line, index) => formatFunction(`${index + 1}. ${line}`))
      .join("\n");
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, formattedText);
  }
}

// Set up toolbar handlers
const toolbar = quill.getModule("toolbar");
Object.entries(toolbarHandlers).forEach(([format, handler]) => {
  toolbar.addHandler(format, handler);
});

// Text counter
const textCounter = document.getElementById("text-counter");
quill.on("text-change", (delta, oldDelta, source) => {
  const text = quill.getText();
  const length = text.length - 1; // Subtract 1 to account for the newline character Quill adds

  if (length > MAX_TEXT_LENGTH && source === "user") {
    if (delta.ops[0].insert) {
      quill.history.undo();
    }
  }

  const newText = `${length} / ${MAX_TEXT_LENGTH}`;
  textCounter.textContent = newText;
  
  if (length > MAX_TEXT_LENGTH) {
    textCounter.classList.add("text-red-500");
    textCounter.textContent += " (Maximum reached)";
  } else if (length > MAX_TEXT_LENGTH * 0.9) {
    textCounter.classList.add("text-yellow-500");
    textCounter.textContent += " (Approaching limit)";
  } else {
    textCounter.classList.remove("text-red-500", "text-yellow-500");
  }
});

// Copy to clipboard function
async function copyToClipboard() {
  try {
    const plainText = quill.getText();
    await navigator.clipboard.writeText(plainText);
    const copyButton = document.getElementById("copy-button");
    copyButton.textContent = "Copied!";
    copyButton.classList.add("bg-green-500");
    setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("bg-green-500");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy: ", err);
    alert("Failed to copy text. Please try again or copy manually.");
  }
}

// Add event listener to the copy button
document.getElementById("copy-button").addEventListener("click", () => {
  copyToClipboard().catch(console.error);
});

// Info tooltip functionality
const infoButton = document.getElementById('info-button');
const infoTooltip = document.getElementById('info-tooltip');

infoButton.addEventListener('click', () => {
  infoTooltip.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!infoButton.contains(event.target) && !infoTooltip.contains(event.target)) {
    infoTooltip.classList.add('hidden');
  }
});

// AI Assist functionality
async function getAIAssistance() {
  const aiAssistButton = document.getElementById('ai-assist-button');
  const aiAssistText = document.getElementById('ai-assist-text');
  const aiLoading = document.getElementById('ai-loading');
  const copyButton = document.getElementById('copy-button');
  const currentText = quill.getText();
  const prompt = "Improve the following LinkedIn post:\n\n" + currentText;
  let aiAssistSuccessful = false;

  try {
    // Show loading indicator and disable button
    aiLoading.classList.remove('opacity-0');
    aiAssistText.classList.add('opacity-0');
    aiAssistButton.disabled = true;
    copyButton.style.width = '60%';

    const response = await fetch('/ai-assist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    let improvedText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      improvedText += new TextDecoder().decode(value);
      
      // Update the editor content in real-time
      quill.setText('');
      quill.clipboard.dangerouslyPasteHTML(0, improvedText.replace(/\n/g, '<br>'));
    }

    aiAssistSuccessful = true;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
  } finally {
    // Hide loading indicator and re-enable button
    aiLoading.classList.add('opacity-0');
    aiAssistText.classList.remove('opacity-0');
    aiAssistButton.disabled = false;
    copyButton.style.width = '70%';

    // Show appropriate notification and update character count
    if (aiAssistSuccessful) {
      showNotification('Your post has been improved by AI!', 'success');
      updateCharacterCount();
    } else {
      showNotification('Failed to get AI assistance. Please try again.', 'error');
    }
  }
}

// Add event listener to the AI Assist button
document.getElementById('ai-assist-button').addEventListener('click', getAIAssistance);

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.remove('bg-green-500', 'bg-red-500');
  notification.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');
  notification.classList.remove('translate-y-full');
  setTimeout(() => {
    notification.classList.add('translate-y-full');
  }, 3000);
}
