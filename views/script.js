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
  const text = quill.getText();
  const textArea = document.createElement('textarea');
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.setSelectionRange(0, text.length);
  document.execCommand('copy');
  document.body.removeChild(textArea);

  alert('Text copied to clipboard!');
});