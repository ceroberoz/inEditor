# inEditor: LinkedIn Post Enhancer 📝✨

![inEditor in action](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Beta2 Release")

inEditor is a powerful tool that helps you create better-looking LinkedIn posts by adding text styling options and AI-powered suggestions.

**Try it now**: https://ineditor.deno.dev/

## Features
- Text styling: **Bold**, *Italic*, Underline, ~~Strikethrough~~
- One-click copy button
- Numbered and bullet point lists
- AI-powered post improvement suggestions 🤖
- Character count with limit warnings
- Responsive design

## Tech Stack
- Deno
- Oak (web framework for Deno)
- OpenAI API (via OpenRouter)
- Quill.js (rich text editor)
- Tailwind CSS

## Quick Start for Development
1. Clone this repo
2. Navigate to the project directory
3. Copy `.env.example` to `.env` and add your API keys
4. Run `deno task start` to start the development server
5. Open `http://localhost:8000` in your browser

## Environment Variables
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `YOUR_SITE_URL`: Your site's URL (for OpenRouter rankings)
- `YOUR_SITE_NAME`: Your site's name (for OpenRouter rankings)

## Project Structure
- `main.ts`: Main application file & AI service for post improvements
- `public/`: Static files (CSS, JavaScript, images)
- `views/`: EJS templates

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Perdana Hadi](https://github.com/ceroberoz)