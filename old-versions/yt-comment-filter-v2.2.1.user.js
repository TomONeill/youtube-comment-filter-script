﻿// ==UserScript==
// @name         YouTube Comment Filter
// @namespace    https://www.youtube.com/
// @version      2.2.1
// @description  Removes typical comments like 'first' and 'I'm early'. Everything can be modified to the users liking.
// @updateURL 	 https://github.com/TomONeill/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// @domain       https://www.youtube.com
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2016 - 2017, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, console */
'use strict';

$(function() {
	// TODO:
	// - All comments get checked instead of new ones only.
	// - Test YT's commentfilter properly.
	
	// CHANGE THESE SETTINGS TO YOUR LIKING:
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
	
	const FLAIR_INSTEAD_OF_REMOVE = true;  // Instead of removing comments, show a "spam" flair
	
    const DEBUG = false;
	const INTERVAL = 300; // ms
	// END OF SETTINGS
    
	const _spamFlair = "<span class='spam-flair' style='font-family: Roboto, Arial, sans-serif; font-size: 10px; color: #f5511e; margin-left: 10px; margin-top: 4px;'>SPAM</span>";
	
    let _removedComments = 0;
    let _removedCommentsTotal = 0;
	
	listenForNewComments();
	listenToFilterClicks();
	
	function listenForNewComments(commentCount = 0) {
		const currentCommentCount = $('ytd-comments').find('ytd-comment-renderer').length;
		
		if (currentCommentCount === 0 && _removedCommentsTotal > 0) {
			resetCounters();
		}

		if (currentCommentCount !== 0 && commentCount !== currentCommentCount) {
			if (DEBUG) { console.log(`YTACR: New comments found (${currentCommentCount - commentCount}).`); }
			
			removeComments();
		}
		
		return setTimeout(function() {
			listenForNewComments(currentCommentCount);
		}, INTERVAL);
	}
	
	function removeComments() {
		$('ytd-comment-renderer')
			.each((index, detectedComment) => {
			const comment = $(detectedComment).find('#content-text').html().toLowerCase();
			const commentWordCount = comment.split(' ').length;
			
			if (comment.length < MIN_COMMENT_LENGTH) {
				if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the MIN_COMMENT_LENGTH rule (${comment.length}/${MIN_COMMENT_LENGTH})`); }

				processCommentRemoval(detectedComment);
				return true;
			}

			if (commentWordCount < MIN_COMMENT_WORDS) {
				if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the MIN_COMMENT_WORDS rule (${commentWordCount}/${MIN_COMMENT_WORDS})`); }

				processCommentRemoval(detectedComment);
				return true;
			}

			if (REMOVE_FIRST) {
				const first = [
					"first",
					"frist",
					"1st",
					"second",
					"2nd",
					"3rd",
					"4th"
				];

				for (var f in first) {
					if (comment.indexOf(first[f]) > -1 &&
						commentWordCount < MIN_COMMENT_WORDS_FILTER) {
						if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_FIRST rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_EARLY_AGGRESSIVE) {
				const early = "early";
				if (comment.indexOf(early) > -1 &&
					commentWordCount < MIN_COMMENT_WORDS_FILTER) {
					if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_EARLY_AGGRESSIVE rule.`); }

					processCommentRemoval(detectedComment);
					return true;
				}
			}

			if (REMOVE_EARLY) {
				const earlyOptions = [
					"i was this early",
					"i am so early",
					"i'm early",
					"im early",
					"who else is early"
				];

				for (var eo in earlyOptions) {
					if (comment.indexOf(earlyOptions[eo]) > -1) {
						if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_EARLY rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_CRINGE_AGGRESSIVE) {
				const cringe = "cringe";

				if (comment.indexOf(cringe) > -1 &&
					commentWordCount < MIN_COMMENT_WORDS_FILTER) {
					if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_CRINGE_AGGRESSIVE rule.`); }

					processCommentRemoval(detectedComment);
					return true;
				}
			}

			if (REMOVE_SELF_LIKES) {
				const selfLikes = [
					"can i get a thumbs up",
					"can I have likes",
					"like my comment",
					"like my own comment",
					"i get top rated",
					"i get top comment",
					"every person who likes this comment",
					"comment when done",
					"sub=",
					"sub:",
					"like if you're watching in"
				];

				for (var sl in selfLikes) {
					if (comment.indexOf(selfLikes[sl]) > -1) {
						if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_SELF_LIKES rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_SELF_PROMO) {
				const selfPromos = [
					"on my channel"
				];

				for (var sp in selfPromos) {
					if (comment.indexOf(selfPromos[sp]) > -1) {
						if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_SELF_PROMO rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_ATTENTION_SEEKERS) {
				const attentionPhrases = [
					"if your reading this",
					"if you are reading this",
					"if you're reading this",
					"if you read this",
					"i get top comment",
					"notification squad",
					"hisss",
					"darude",
					"who is watching this",
					"watching this in",
					"who is watching in",
					"first like",
					"second like",
					"fifth like",
					"5th like",
					"first comment",
					"early comment",
					"this sea of comments",
					"of you will skip this but",
					"scrolling through the comments",
					"want free subscribers",
					"find the difference"
				];

				for (var ap in attentionPhrases) {
					if (comment.indexOf(attentionPhrases[ap]) > -1) {
						if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_ATTENTION_SEEKERS rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}
		}
				 );

		_removedCommentsTotal += _removedComments;
		setCommentCounter(_removedComments, _removedCommentsTotal);
		if (DEBUG) {
			if (FLAIR_INSTEAD_OF_REMOVE) { console.log(`YTACR: Flaired ${_removedComments} comments this run. Total flaired comments: ${_removedCommentsTotal}.`); }
			else { console.log(`YTACR: Removed ${_removedComments} comments this run. Total removed comments: ${_removedCommentsTotal}.`); }
		}
		_removedComments = 0;
	}
	
	function processCommentRemoval(comment) {
		_removedComments++;
		
		if (FLAIR_INSTEAD_OF_REMOVE) {
			if ($(comment).find('.spam-flair').length === 0) {
			$(comment)
				.css({ opacity: 0.5 })
				.mouseenter(function () { $(this).animate({ 'opacity': 1 }, 237); })
				.mouseleave(function () { $(this).animate({ 'opacity': 0.5 }, 237); })
				.find("#header-author")
				.append(_spamFlair);
			}
		} else {
			comment.remove();
		}
	}
    
	function setCommentCounter(removedComments, newSpamCount) {
		const commentCounter = $('ytd-comments-header-renderer #count');
		
		if (newSpamCount > 999) {
			let isUsingImperial = false;

			const commentCounterText = commentCounter.find('yt-formatted-string').text();
			if (commentCounterText.indexOf(',') !== -1) {
				isUsingImperial = true;
			}

			if (isUsingImperial) {
				newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1,").split("").reverse().join("");
			} else {
				newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1.").split("").reverse().join("");
			}
		}
		
		const spamCounter = commentCounter.find('#spamCount');
		if (spamCounter.length === 0) {
			commentCounter.append(`<span id="spamCount" class="count-text style-scope ytd-comments-header-renderer"> (${newSpamCount} Spam)</span>`);
		} else {
			spamCounter.html(` (${newSpamCount} Spam)`);
		}
	}
	
	function listenToFilterClicks() {
		$(document).click((event) => {
			if (!$(event.target).parent().is('yt-sort-filter-sub-menu-renderer paper-item')) {
				return;
			}
			
			if (DEBUG) { console.log(`YTACR: Filter has changed.`); }
			resetCounters();
		});
	}
	
	function resetCounters() {
		if (DEBUG) { console.log(`YTACR: Resetting counters.`); }
		_removedComments = 0;
		_removedCommentsTotal = 0;
		const spamCounter = $('ytd-comments-header-renderer #count #spamCount');
		spamCounter.html(` (0 Spam)`);
	}
	
    if (DEBUG) { console.log("YTACR: YouTube Annoying Comments Remover (YTACR) script active."); }
});
