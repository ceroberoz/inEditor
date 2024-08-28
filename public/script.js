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
  alert("Failed to initialize the text editor. Please refresh the page.");
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
  if (textCounter.textContent !== newText) {
    textCounter.textContent = newText;
    textCounter.style.color = length > MAX_TEXT_LENGTH ? "red" : "#666";
    if (length > MAX_TEXT_LENGTH) {
      textCounter.textContent += " (Maximum reached)";
    }
  }
});

// Copy to clipboard function
async function copyToClipboard() {
  try {
    const plainText = quill.getText();
    await navigator.clipboard.writeText(plainText);
    alert("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
    alert("Failed to copy text. Please try again.");
  }
}

// Add event listener to the copy button
document.getElementById("copy-button").addEventListener("click", () => {
  copyToClipboard().catch(console.error);
});
