# YouTube Comment Filter Script
Script that filters unwanted comments.
<BR/>
Enjoy.
<BR/><BR/>
Version <strong>2.2.0</strong>

<A HREF="https://github.com/TomONeill/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js">INSTALL</A>

# Screenshots
<IMG SRC="https://raw.githubusercontent.com/TomONeill/youtube-comment-filter-script/master/screenshots/preview.png" width="600" height="100" />
<BR />
<IMG SRC="https://raw.githubusercontent.com/TomONeill/youtube-comment-filter-script/master/screenshots/preview_2.png" width="450" height="200" />

# Description
This repository includes a userscript for Greasemonkey and Tampermonkey that tries to find and remove stupid comments like "first" and "I'm early".

# How it works
The script does a very simple job by comparing each comment with hardcoded commonly used comments (or commonly used word combinations). It checks every now and then (configurable in the code) for new comments (which means that when you scroll down it will look for comments which weren't there before or after clicking the "Load more comments" button) and filters the annoying ones out.

# Turn off certain 'rules'
You can simply turn some of the rules off if you don't like what they are doing. For example if you don't want <i>first</i> comments to be filtered out, simply click the script and find (somewhere above) <i>REMOVE_FIRST</i>. Change true to false and you are good to go :)
Available rules with their default values (everything true by default):

	const MIN_COMMENT_LENGTH = 5;          // Removes any comment that has less than # characters
	const MIN_COMMENT_WORDS = 2;           // Removes any comment that has less than # words
	const MIN_COMMENT_WORDS_FILTER = 3;    // Removes any comment that has less than # characters words in combination with any (non-aggressive) filter
    
    const REMOVE_FIRST = true;             // Removes any comment with suspected combinations of "first"
    const REMOVE_EARLY = true;             // Removes any comment with suspected combinations of "early"
    const REMOVE_EARLY_AGGRESSIVE = true;  // Removes any comment with "early" without looking at MIN_COMMENT_WORDS_FILTER
    const REMOVE_CRINGE_AGGRESSIVE = true; // Removes any comment with "cringe" without looking at MIN_COMMENT_WORDS_FILTER
    const REMOVE_SELF_LIKES = true;        // Removes any comment which has suspicion of asking for likes
    const REMOVE_SELF_PROMO = true;        // Removes any comment which has suspicion of asking for subscribers
    const REMOVE_ATTENTION_SEEKERS = true; // Removes any comment which has suspicion of seeking attention/is unrelated to the video
	
	const FLAG_INSTEAD_OF_REMOVE = true;   // Instead of removing comments, show a "spam" flair
	
# Changelog
<A HREF="https://raw.githubusercontent.com/TomONeill/youtube-comment-filter-script/master/changelog.txt">View changelog</A>

# Donate
If you like my work so much you feel like doing something nice for me, a complete stranger of the internet, you can.<BR />
<A HREF="https://www.paypal.me/TomONeill">Donate here</A>.
