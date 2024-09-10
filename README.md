# inEditor: LinkedIn Post Enhancer 📝✨

inEditor is a powerful tool that helps you create better-looking LinkedIn posts with text styling options and AI-powered suggestions. Now with improved AI functionality and multiple model support!

![inEditor in action](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Beta2 Release")

**Try it now**: https://ineditor.deno.dev/

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/inEditor.git
   cd inEditor
   ```
2. Install Deno if you haven't already: [Deno Installation Guide](https://deno.land/#installation)
3. Set up your environment variables:
   ```
   cp .env.example .env
   ```
   Then edit `.env` with your actual API keys and settings.
4. Run the development server:
   ```
   deno task start
   ```
5. Open `http://localhost:8000` in your browser.

## Features

- Text styling: **Bold**, *Italic*, Underline, ~~Strikethrough~~
- One-click copy button
- Numbered and bullet point lists
- AI-powered post improvement suggestions 🤖
- Multiple AI models with automatic fallback
- Character count with limit warnings
- Responsive design

## Tech Stack

- [Deno](https://deno.land/): A secure runtime for JavaScript and TypeScript
- [Oak](https://oakserver.github.io/oak/): A middleware framework for Deno's http server
- [OpenAI API](https://platform.openai.com/docs/api-reference) (via [OpenRouter](https://openrouter.ai/docs)): For AI-powered suggestions
- [Quill.js](https://quilljs.com/): Rich text editor
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework

## AI Functionality

We've separated the AI functionality into its own module (`aiAssist.ts`) for better organization and maintainability. Key improvements include:

- Multiple AI models with prioritization
- Health checks to ensure model availability
- Automatic fallback if a model fails
- Inclusion of the AI model name and original prompt in the generated post

Our AI models include:
1. Google's Gemini Pro 1.5 (Experimental)
2. Meta's LLaMA 3 8B
3. Mistral AI's 7B Instruct
4. Anthropic's Claude 2
5. Google's Gemma 2 9B
... and more!

Each model has its strengths, ensuring high-quality post suggestions across various topics and styles.

## Project Structure

- `main.ts`: Main application file
- `aiAssist.ts`: AI service for post improvements
- `public/`: Static files (CSS, JavaScript, images)
- `views/`: EJS templates

## Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `YOUR_SITE_URL`: Your site's URL (for OpenRouter rankings)
- `YOUR_SITE_NAME`: Your site's name (for OpenRouter rankings)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Exercises

1. Add a new AI model to the `models` array in `aiAssist.ts`.
2. Implement a new text styling option in the Quill editor.
3. Create a new API endpoint for user feedback on AI suggestions.

## Troubleshooting

- If you're having issues with API keys, make sure they're correctly set in your `.env` file.
- For CORS errors, check that your `ALLOWED_ORIGINS` in the `.env` file includes your frontend URL.
- If an AI model is consistently failing, try adjusting the order in the `models` array in `aiAssist.ts`.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Perdana Hadi](https://github.com/ceroberoz)