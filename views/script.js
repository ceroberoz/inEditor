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

// script.js
document.getElementById('copy-button').addEventListener('click', function() {
  // Get the content of the editor
  var editorContent = document.getElementById('editor').innerHTML;

  // Create a temporary element to hold the HTML content
  var tempElement = document.createElement('div');
  tempElement.innerHTML = editorContent;

  // Append the temporary element to the body (off-screen)
  document.body.appendChild(tempElement);

  // Select and copy the content
  var range = document.createRange();
  range.selectNode(tempElement);
  window.getSelection().removeAllRanges(); // Clear previous selections
  window.getSelection().addRange(range);
  document.execCommand('copy');

  // Remove the temporary element
  document.body.removeChild(tempElement);

  // Optional: Notify the user
  alert('Content copied to clipboard!');
});
