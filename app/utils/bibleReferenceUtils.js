import { bookAbbreviations, bookNames } from './bibleBooks';

export const books = [
  ...bookNames,
  ...Object.keys(bookAbbreviations),
  ...bookNames.map(book => book.toLowerCase()),
  ...Object.keys(bookAbbreviations).map(abbr => abbr.toLowerCase()),
  ...Object.keys(bookAbbreviations).map(abbr => abbr + '\\.'), // Add abbreviations with periods
  ...Object.keys(bookAbbreviations).map(abbr => abbr.toLowerCase() + '\\.') // Add lowercase abbreviations with periods
];

export const scriptureRegex = new RegExp(`\\b(${books.join("|")})\\s?\\d{1,3}(?::\\d{1,3}(?:-\\d{1,3})?)?\\b`, "gi");

export function extractScriptureReferences(text) {
  const bookMap = new Map();
  bookNames.forEach(book => bookMap.set(book.toLowerCase(), book));
  Object.entries(bookAbbreviations).forEach(([abbr, book]) => {
    bookMap.set(abbr.toLowerCase(), book);
    bookMap.set(abbr.toLowerCase() + '.', book); // Add abbreviations with periods
  });

  const references = [];
  // Updated regex to handle multiple references separated by semicolons
  const regex = /\b(\d?\s?[a-z]+\.?)?\s?(\d+)(?::(\d+)(?:-(\d+))?)?/gi;
  let match;

  // Split the input text by semicolons and process each part
  const parts = text.split(';');
  parts.forEach(part => {
    while ((match = regex.exec(part)) !== null) {
      const [, bookName, chapter, startVerse, endVerse] = match;
      const standardizedBookName = bookMap.get(bookName?.trim().toLowerCase());

      if (standardizedBookName) {
        let reference = `${standardizedBookName} ${chapter}`;
        if (startVerse) {
          reference += `:${startVerse}`;
          if (endVerse) {
            reference += `-${endVerse}`;
          }
        }
        references.push(reference);
      }
    }
  });

  return [...new Set(references)];
}

export const convertToScriptureLinks = (text) => {
  return text.replace(scriptureRegex, (match) => `<a href="#" class="scripture-link">${match.trim()}</a>`);
};