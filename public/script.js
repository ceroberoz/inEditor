// Initialize Quill editor
var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']  // add other buttons as needed
    ]
  }
});

// Helper function to replace selected text with bold Unicode
function replaceWithBoldUnicode(text) {
  const boldUnicodeMap = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
    'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
    'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
    'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
    'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
    ' ': ' '
  };
  return text.split('').map(char => boldUnicodeMap[char] || char).join('');
}

// Helper function to replace selected text with italic Unicode
function replaceWithItalicUnicode(text) {
  const italicUnicodeMap = {
    'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝒺', 'f': '𝒻', 'g': '𝒼', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿',
    'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉',
    'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
    'A': '𝒜', 'B': '𝒷', 'C': '𝒸', 'D': '𝒹', 'E': '𝒺', 'F': '𝒻', 'G': '𝒼', 'H': '𝒽', 'I': '𝒾', 'J': '𝒿',
    'K': '𝒦', 'L': '𝒫', 'M': '𝒩', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': '𝒭', 'S': '𝒮', 'T': '𝒯',
    'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
    ' ': ' '
  };
  return text.split('').map(char => italicUnicodeMap[char] || char).join('');
}

// Helper function to replace selected text with underline Unicode
function replaceWithUnderlineUnicode(text) {
  // Unicode does not support direct underline mapping, so we use CSS for underlining
  return text; // Apply underline styling via CSS instead
}

// Helper function to replace selected text with strikethrough Unicode
function replaceWithStrikethroughUnicode(text) {
  // Unicode does not support direct strikethrough mapping, so we use CSS for strikethrough
  return text; // Apply strikethrough styling via CSS instead
}

// Override the bold button behavior
const toolbar = quill.getModule('toolbar');
toolbar.addHandler('bold', function() {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const boldText = replaceWithBoldUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, boldText, 'bold');
  }
});

// Override the italic button behavior
toolbar.addHandler('italic', function() {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const italicText = replaceWithItalicUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, italicText, 'italic');
  }
});

// Override the underline button behavior
toolbar.addHandler('underline', function() {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    // Apply underline styling via CSS
    quill.formatText(selection.index, selection.length, 'underline', true);
  }
});

// Override the strikethrough button behavior
toolbar.addHandler('strike', function() {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    // Apply strikethrough styling via CSS
    quill.formatText(selection.index, selection.length, 'strike', true);
  }
});




// Add text counter
const textCounter = document.getElementById('text-counter');

quill.on('text-change', (delta, oldDelta, source) => {
  const text = quill.getText();
  const length = text.length;

  if (length > 3000 && source === 'user') {
    // Check if the change is an insertion
    if (delta.ops[0].insert) {
      // Prevent the insertion
      quill.history.undo();
    }
  }

  // Update the text counter
  if (length > 3000) {
    textCounter.style.color = 'red';
    textCounter.textContent = `${length} / 3000 (Maximum reached)`;
  } else {
    textCounter.style.color = '#666';
    textCounter.textContent = `${length} / 3000`;
  }
});

// Function to copy formatted text with line breaks from Quill editor to clipboard
function copyToClipboard() {
  // Get HTML content from Quill editor
  var html = quill.root.innerHTML;

  // Create a temporary element to parse HTML
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Convert HTML to plain text with line breaks
  var plainText = '';
  var children = tempDiv.childNodes;

  children.forEach(function(child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.nodeName === 'P') {
        plainText += child.textContent + '\n\n'; // Two new lines for paragraph
      } else if (child.nodeName === 'BR') {
        plainText += '\n'; // Single new line for <br> elements
      } else {
        plainText += child.textContent;
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      plainText += child.textContent;
    }
  });

  // Create a temporary textarea element to hold the plain text
  var textarea = document.createElement('textarea');
  textarea.value = plainText;
  document.body.appendChild(textarea);

  // Select and copy the content
  textarea.select();
  document.execCommand('copy');

  // Remove the temporary textarea element
  document.body.removeChild(textarea);

  // Optionally, show a message or feedback
  alert('Text with line breaks copied to clipboard!');
}

// Add event listener to the copy button
document.getElementById('copy-button').addEventListener('click', copyToClipboard);


// Add event listener to the copy button
document.getElementById('copy-button').addEventListener('click', copyToClipboard);
