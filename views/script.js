const quill = new Quill(editor, {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['clean']
    ]
  },
  placeholder: 'Type here...',
  theme: 'snow'
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
