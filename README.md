# inEditor: Make Your LinkedIn Posts Shine! ✨📝

Hey there! Welcome to inEditor, your new best friend for creating awesome LinkedIn posts. We've added some cool new features to make your posts even better!

![inEditor in action](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Latest Release")

**Give it a try now**: https://ineditor.deno.dev/

## What's New?

1. **Smarter AI Help**: Our AI assistant now uses multiple smart models to give you the best suggestions.
2. **Faster Results**: We've added caching, so you get AI help quicker than ever!
3. **Better Quality Check**: We now use cool math (like Jaccard and Cosine similarity) to make sure the AI suggestions are top-notch.
4. **Safer and More Accessible**: We've made the app safer with better security and easier to use for everyone.

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

Our AI helper is pretty smart now:

- It uses multiple AI models (like LLaMA 3, Mistral AI, and Google's Gemma)
- Checks which models are working best at the moment
- Falls back to another model if one isn't working
- Saves responses so it can help you faster next time
- Tells you which AI model helped with your post

We even check how good the AI suggestions are:

1. We look at how long the suggestion is
2. We compare how similar it is to what you wrote (in two different ways)
3. We combine these scores to pick the best suggestion

This helps make sure you always get great LinkedIn post ideas!

## Want to Help Make inEditor Better?

Awesome! Here are some cool things you could work on:

1. Add a new AI model to make suggestions even better
2. Create a new text styling option (maybe colorful text?)
3. Make a way for users to tell us if they liked the AI suggestion
4. Help make the caching even smarter

## Having Trouble?

No worries, we've got your back:

- Check your API keys if things aren't connecting right
- If you're getting weird errors, make sure your website address is in the allowed list
- If one AI model isn't working, try changing the order in the code
- If caching isn't working, make sure Deno KV is set up correctly

## What's Next?

We've got big plans:

- Let you log in to save your favorite posts
- Add pictures to your posts
- Keep a history of your edits so you can go back if needed
- Make sure everyone plays nice with the AI helper

## Let's Connect!

This project is open for everyone to use and improve. It's made with lots of love by [Perdana Hadi](https://github.com/ceroberoz). If you have ideas or run into problems, don't be shy - reach out and let's make inEditor even better together!
