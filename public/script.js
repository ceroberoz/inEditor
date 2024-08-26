// Initialize Quill editor
var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"], // add other buttons as needed
    ],
  },
});

// Helper function to replace selected text with bold Unicode
function replaceWithBoldUnicode(text) {
  const boldUnicodeMap = {
    a: "𝗮",
    b: "𝗯",
    c: "𝗰",
    d: "𝗱",
    e: "𝗲",
    f: "𝗳",
    g: "𝗴",
    h: "𝗵",
    i: "𝗶",
    j: "𝗷",
    k: "𝗸",
    l: "𝗹",
    m: "𝗺",
    n: "𝗻",
    o: "𝗼",
    p: "𝗽",
    q: "𝗾",
    r: "𝗿",
    s: "𝘀",
    t: "𝘁",
    u: "𝘂",
    v: "𝘃",
    w: "𝘄",
    x: "𝘅",
    y: "𝘆",
    z: "𝘇",
    A: "𝗔",
    B: "𝗕",
    C: "𝗖",
    D: "𝗗",
    E: "𝗘",
    F: "𝗙",
    G: "𝗚",
    H: "𝗛",
    I: "𝗜",
    J: "𝗝",
    K: "𝗞",
    L: "𝗟",
    M: "𝗠",
    N: "𝗡",
    O: "𝗢",
    P: "𝗣",
    Q: "𝗤",
    R: "𝗥",
    S: "𝗦",
    T: "𝗧",
    U: "𝗨",
    V: "𝗩",
    W: "𝗪",
    X: "𝗫",
    Y: "𝗬",
    Z: "𝗭",
    0: "𝟬",
    1: "𝟭",
    2: "𝟮",
    3: "𝟯",
    4: "𝟰",
    5: "𝟱",
    6: "𝟲",
    7: "𝟳",
    8: "𝟴",
    9: "𝟵",
    " ": " ",
  };
  return text
    .split("")
    .map((char) => boldUnicodeMap[char] || char)
    .join("");
}

// Helper function to replace selected text with italic Unicode
function replaceWithItalicUnicode(text) {
  const italicUnicodeMap = {
    a: "𝒶",
    b: "𝒷",
    c: "𝒸",
    d: "𝒹",
    e: "𝑒",
    f: "𝒻",
    g: "𝑔",
    h: "𝒽",
    i: "𝒾",
    j: "𝒿",
    k: "𝓀",
    l: "𝓁",
    m: "𝓂",
    n: "𝓃",
    o: "𝑜",
    p: "𝓅",
    q: "𝓆",
    r: "𝓇",
    s: "𝓈",
    t: "𝓉",
    u: "𝓊",
    v: "𝓋",
    w: "𝓌",
    x: "𝓍",
    y: "𝓎",
    z: "𝓏",
    A: "𝒜",
    B: "𝐵",
    C: "𝐶",
    D: "𝐷",
    E: "𝐸",
    F: "𝐹",
    G: "𝐺",
    H: "𝐻",
    I: "𝐼",
    J: "𝐽",
    K: "𝐾",
    L: "𝐿",
    M: "𝑀",
    N: "𝑁",
    O: "𝑂",
    P: "𝑃",
    Q: "𝑄",
    R: "𝑅",
    S: "𝑆",
    T: "𝑇",
    U: "𝑈",
    V: "𝑉",
    W: "𝑊",
    X: "𝑋",
    Y: "𝑌",
    Z: "𝑍",
    0: "𝟎",
    1: "𝟏",
    2: "𝟐",
    3: "𝟑",
    4: "𝟒",
    5: "𝟓",
    6: "𝟔",
    7: "𝟕",
    8: "𝟖",
    9: "𝟗",
  };

  return text
    .split("")
    .map((char) => italicUnicodeMap[char] || char)
    .join("");
}

// Helper function to replace selected text with underline Unicode
function replaceWithUnderlineUnicode(text) {
  const underlineUnicodeMap = {
    a: "a̲",
    b: "b̲",
    c: "c̲",
    d: "d̲",
    e: "e̲",
    f: "f̲",
    g: "g̲",
    h: "h̲",
    i: "i̲",
    j: "j̲",
    k: "k̲",
    l: "l̲",
    m: "m̲",
    n: "n̲",
    o: "o̲",
    p: "p̲",
    q: "q̲",
    r: "r̲",
    s: "s̲",
    t: "t̲",
    u: "u̲",
    v: "v̲",
    w: "w̲",
    x: "x̲",
    y: "y̲",
    z: "z̲",
    A: "A̲",
    B: "B̲",
    C: "C̲",
    D: "D̲",
    E: "E̲",
    F: "F̲",
    G: "G̲",
    H: "H̲",
    I: "I̲",
    J: "J̲",
    K: "K̲",
    L: "L̲",
    M: "M̲",
    N: "N̲",
    O: "O̲",
    P: "P̲",
    Q: "Q̲",
    R: "R̲",
    S: "S̲",
    T: "T̲",
    U: "U̲",
    V: "V̲",
    W: "W̲",
    X: "X̲",
    Y: "Y̲",
    Z: "Z̲",
    0: "0̲",
    1: "1̲",
    2: "2̲",
    3: "3̲",
    4: "4̲",
    5: "5̲",
    6: "6̲",
    7: "7̲",
    8: "8̲",
    9: "9̲",
  };

  return text
    .split("")
    .map((char) => underlineUnicodeMap[char] || char + "\u0332")
    .join("");
}

// Helper function to replace selected text with strikethrough Unicode
function replaceWithStrikeTextUnicode(text) {
  const strikeThroughMap = {
    a: "a̶",
    b: "b̶",
    c: "c̶",
    d: "d̶",
    e: "e̶",
    f: "f̶",
    g: "g̶",
    h: "h̶",
    i: "i̶",
    j: "j̶",
    k: "k̶",
    l: "l̶",
    m: "m̶",
    n: "n̶",
    o: "o̶",
    p: "p̶",
    q: "q̶",
    r: "r̶",
    s: "s̶",
    t: "t̶",
    u: "u̶",
    v: "v̶",
    w: "w̶",
    x: "x̶",
    y: "y̶",
    z: "z̶",
    A: "A̶",
    B: "B̶",
    C: "C̶",
    D: "D̶",
    E: "E̶",
    F: "F̶",
    G: "G̶",
    H: "H̶",
    I: "I̶",
    J: "J̶",
    K: "K̶",
    L: "L̶",
    M: "M̶",
    N: "N̶",
    O: "O̶",
    P: "P̶",
    Q: "Q̶",
    R: "R̶",
    S: "S̶",
    T: "T̶",
    U: "U̶",
    V: "V̶",
    W: "W̶",
    X: "X̶",
    Y: "Y̶",
    Z: "Z̶",
    0: "0̶",
    1: "1̶",
    2: "2̶",
    3: "3̶",
    4: "4̶",
    5: "5̶",
    6: "6̶",
    7: "7̶",
    8: "8̶",
    9: "9̶",
  };

  return text
    .split("")
    .map((char) => strikeThroughMap[char] || char + "\u0335")
    .join("");
}

// Override the bold button behavior
const toolbar = quill.getModule("toolbar");
toolbar.addHandler("bold", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const boldText = replaceWithBoldUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, boldText, "bold");
  }
});

// Override the italic button behavior
toolbar.addHandler("italic", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const italicText = replaceWithItalicUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, italicText, "italic");
  }
});

// Override the underline button behavior
toolbar.addHandler("underline", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const underlineText = replaceWithUnderlineUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, underlineText, "underline");
  }
});

// Override the strikethrough button behavior
toolbar.addHandler("strike", function () {
  const selection = quill.getSelection();
  if (selection) {
    const selectedText = quill.getText(selection.index, selection.length);
    const strikeText = replaceWithStrikeTextUnicode(selectedText);
    quill.deleteText(selection.index, selection.length);
    quill.insertText(selection.index, strikeText, "strike");
  }
});

// Add text counter
const textCounter = document.getElementById("text-counter");

quill.on("text-change", (delta, oldDelta, source) => {
  const text = quill.getText();
  const length = text.length;

  if (length > 3000 && source === "user") {
    // Check if the change is an insertion
    if (delta.ops[0].insert) {
      // Prevent the insertion
      quill.history.undo();
    }
  }

  // Update the text counter
  if (length > 3000) {
    textCounter.style.color = "red";
    textCounter.textContent = `${length} / 3000 (Maximum reached)`;
  } else {
    textCounter.style.color = "#666";
    textCounter.textContent = `${length} / 3000`;
  }
});

// Function to copy formatted text with line breaks from Quill editor to clipboard
function copyToClipboard() {
  // Get HTML content from Quill editor
  var html = quill.root.innerHTML;

  // Create a temporary element to parse HTML
  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Convert HTML to plain text with line breaks
  var plainText = "";
  var children = tempDiv.childNodes;

  children.forEach(function (child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.nodeName === "P") {
        plainText += child.textContent + "\n\n"; // Two new lines for paragraph
      } else if (child.nodeName === "BR") {
        plainText += "\n"; // Single new line for <br> elements
      } else {
        plainText += child.textContent;
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      plainText += child.textContent;
    }
  });

  // Create a temporary textarea element to hold the plain text
  var textarea = document.createElement("textarea");
  textarea.value = plainText;
  document.body.appendChild(textarea);

  // Select and copy the content
  textarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(textarea);

  // Optionally, show a message or feedback
  alert("Text with line breaks copied to clipboard!");
}

// Add event listener to the copy button
document
  .getElementById("copy-button")
  .addEventListener("click", copyToClipboard);

// Add event listener to the copy button
document
  .getElementById("copy-button")
  .addEventListener("click", copyToClipboard);
