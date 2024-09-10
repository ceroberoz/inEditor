# inEditor: LinkedIn Post Enhancer 📝✨

![inEditor in action](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Beta2 Release")

inEditor is a powerful tool that helps you create better-looking LinkedIn posts with text styling options and AI-powered suggestions. Now with improved AI functionality and multiple model support!

**Try it now**: https://ineditor.deno.dev/

## Features
- Text styling: **Bold**, *Italic*, Underline, ~~Strikethrough~~
- One-click copy button
- Numbered and bullet point lists
- AI-powered post improvement suggestions 🤖
- Multiple AI models with automatic fallback
- Character count with limit warnings
- Responsive design

## Tech Stack
- Deno
- Oak (web framework for Deno)
- OpenAI API (via OpenRouter)
- Quill.js (rich text editor)
- Tailwind CSS

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

## Quick Start for Development
1. Clone this repo
2. Navigate to the project directory
3. Copy `.env.example` to `.env` and add your API keys
4. Run `deno task start` to start the development server
5. Open `http://localhost:3000` in your browser

## Environment Variables
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `YOUR_SITE_URL`: Your site's URL (for OpenRouter rankings)
- `YOUR_SITE_NAME`: Your site's name (for OpenRouter rankings)

## Project Structure
- `main.ts`: Main application file
- `aiAssist.ts`: AI service for post improvements
- `public/`: Static files (CSS, JavaScript, images)
- `views/`: EJS templates

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Perdana Hadi](https://github.com/ceroberoz)