# inEditor: Make Your LinkedIn Posts Shine! ✨📝

Hey there! Welcome to inEditor, your new best friend for creating awesome LinkedIn posts. We've added some exciting new features to make your posts even better!

![inEditor in action](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Latest Release")

**Give it a try now**: https://ineditor.deno.dev/

## What's New?

1. **Multi-Model AI Collaboration**: Our AI assistant now uses multiple smart models to generate and combine the best suggestions.
2. **Enhanced AI Response Quality**: We've implemented a new process where the best-performing model refines the combined output from all models.
3. **Smarter Evaluation**: We use advanced metrics (Jaccard and Cosine similarity) to evaluate and rank AI suggestions.
4. **Detailed Logging**: Added comprehensive logging for better debugging and transparency in the AI suggestion process.
5. **Improved Error Handling**: More robust error management for a smoother user experience.

## Important Note

**HTTP Streaming Temporarily Disabled**: We've temporarily turned off HTTP streaming while we conduct further research and development to improve its implementation. We plan to bring this feature back soon with enhanced performance and reliability.

## Cool Features

- Make your text **bold**, *italic*, underlined, or ~~crossed out~~
- Add numbered and bullet point lists with ease
- One-click copy button to grab your post
- AI-powered suggestions to make your post even better 🤖
- Character count to keep your post the right length
- Works great on your phone or computer

## How It Works

We use some fancy tech to make the magic happen:

- Deno: A super-fast and secure way to run the app
- Oak: Helps manage all the behind-the-scenes stuff
- OpenAI API (through OpenRouter): Powers our smart AI suggestions
- Quill.js: Makes editing text a breeze
- Tailwind CSS: Makes everything look pretty
- Deno KV: Helps remember things to make the app faster

## The AI Magic

Our AI helper is smarter than ever:

- It uses multiple AI models (like LLaMA 3, Mistral AI, and Google's Gemma)
- Checks which models are working best at the moment
- Combines responses from all models for a comprehensive suggestion
- Uses the highest-scoring model to refine and improve the combined response
- Falls back to another model if one isn't working
- Saves responses so it can help you faster next time
- Tells you which AI model helped with your post

We've enhanced how we check the quality of AI suggestions:

1. We look at how long the suggestion is
2. We compare how similar it is to what you wrote (using Jaccard and Cosine similarity)
3. We combine these scores to pick the best suggestion
4. We use the best-performing model to create a final, refined version

This process ensures you get the most creative and relevant LinkedIn post ideas!

## Want to Help Make inEditor Better?

Awesome! Here are some cool things you could work on:

1. Add a new AI model to make suggestions even better
2. Create a new text styling option (maybe colorful text?)
3. Make a way for users to tell us if they liked the AI suggestion
4. Help make the caching even smarter
5. Assist in bringing back HTTP streaming with improved performance

## Having Trouble?

No worries, we've got your back:

- Check your API keys if things aren't connecting right
- If you're getting weird errors, make sure your website address is in the allowed list
- If one AI model isn't working, try changing the order in the code
- If caching isn't working, make sure Deno KV is set up correctly
- Check the detailed logs for insights into the AI suggestion process

## What's Next?

We've got big plans:

- Reimplement HTTP streaming for real-time AI suggestions
- Let you log in to save your favorite posts
- Add pictures to your posts
- Keep a history of your edits so you can go back if needed
- Make sure everyone plays nice with the AI helper
- Implement user feedback on AI suggestions to improve the system

## Let's Connect!

This project is open for everyone to use and improve. It's made with lots of love by [Perdana Hadi](https://github.com/ceroberoz). If you have ideas or run into problems, don't be shy - reach out and let's make inEditor even better together!
