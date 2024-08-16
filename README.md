# inEditor

![Alt text](https://github.com/ceroberoz/inEditor/blob/meong/capture.png "inEditor - Alpha Release")

Simple text editor for LinkedIn posts.

Made possible by Node & Quill + ChatGPT <3

**Live Demo** : https://ineditor.deno.dev/

## How to run
1. Clone this repo
2. Go to cloned-repo folder
3. Run ```node install``` to install node_modules dependancy
4. Run ```node index.js``` to run the service
5. Open ```http://localhost:3000``` to open 

---

## Why & how its works
LinkedIn does not have built-in text editor on Post section. (Fact)

Therefore for basic styling such as bold, italics, underline & strike text must be done by 3rd party app and I am not feeling OK by sharing my article without gods know what my article will be use for. (My worries) Is it for another AI feeds for same service? 

Eww I only want text formatting bro. At least I can put **BOLD** or _ITALIC_ into my LinkedIn Posts. (Fact)

---

### Alpha release ####
Good news! As of now only Bold, **Italic**, **Underline**, **Strike** & Copy function that working.

Other function are either WIP or will be remove in the future.

---

**Known issue:**
Anything beside mentioned above does not work yet. 

**TODO:**
- Font selection : Progress
- Size selection : To be remove since Unicode does not support font size 
- Header selection : To be remove, can be subtitute by bold
- List (Ordered & Bullet) : TODO
- Indent : to be remove
- Align : to be remove, default by left-align
- Link & image : to be remove, you can use LinkedIn Link & Image attach feature
- Clean : to be remove, cannot undo replaced texts