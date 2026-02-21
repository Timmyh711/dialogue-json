In this project, please create a website that generates a json based on a user input.
This is an example json
------
[
	{"speaker": "player", "text": "W-what just happened?\n[i]Press Space Bar or -> button to Continue[/i]"},
	{"pause": 1},
	{"speaker": "player", "text": "[b][color=red]SHOULDN'T I BE IN EGYPT?[/color][/b]", "shake": 10},
	{"speaker": "ai", "text": "Wrrr... [i]powers up[/i]"},
	{"speaker": "player", "text": "Where am I?"},
	{"speaker": "ai", "text": "It seems we are in [color=purple]ancient-day China[/color]. [color=red]ERROR: I can't locate the specific geographic location[/color]"},
	{"speaker": "player", "text": "Whoa, why do you look like a [color=purple]panda[/color]?"},
	{"speaker": "ai", "text": "I have reconfigured my appearance to better fit in to this time and place"},
	{"speaker": "ai", "text": "Do you want me to climb up the tree for a [color=purple]better scan of the place[/color]?"},
	{"speaker": "player", "text": "Yes please!"},
	{"signal": "ai_climb_tree"},
	{"pause": 1},
	{"speaker": "ai", "text": "It seems like we are in a [color=purple]forest[/color] near the border of a village"},
	{"speaker": "player", "text": "Why did we ended up here?"},
	{"speaker": "ai", "text": "Our time machine doesn't have enough energy level, we need [color=orange]Chronium[/color] to charge it"},
	{"speaker": "ai", "text": "We can collect the [color=orange]Chronium[/color] to power the machine so we can go back!"},
	{"speaker": "player", "text": "Okay, guess I have to find some [color=orange]Chronium[/color] then! Time for adventure!"},
	{"pause": 1},
	{"type": "announcement", "text": "Try moving around using [purple]WASD[/purple] or [color=purple]arrow keys[/color]"},
	{"type": "announcement", "text": "If you ever want to talk to someone press [color=purple]Space[/color]"},
	{"type": "announcement", "text": "Press [color=purple]E[/color] to open your inventory"},
	{"type": "announcement", "text": "You can also rebind these in the settings menu"}
]
------
speaker -> user input, quick options for player and ai, not required for announcement
text -> user input with quick options for:
    [purple]*text*[/purple] -> purple text
    [inv name=*name*] -> inventory icon
    [icon name=*name*] -> general icon
    [b]*text*[/b] -> bold
    [i]*text*[/i] -> italicize
signal -> emit a signal of a user input name
type -> drop down announcement vs normal (only need to set once, will apply until another setting)
pause -> pause for int seconds

After generation, download with a user input name for the file

UI: use LcdSolid-VPzB.tff (from files) as the font, pixel retro game style, 930ad3ff is primary color