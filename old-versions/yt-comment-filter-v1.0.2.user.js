// ==UserScript==
// @name         YouTube Comment Filter
// @namespace    https://www.youtube.com/
// @version      1.0.2
// @description  Removes typical comments like 'first' and 'I'm early'. Everything can be modified to the users liking.
// @updateURL 	 https://github.com/TomONeill/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js
// @match        https://www.youtube.com/*
// @run-at       document-start
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
	// - Not sure if replies to comment get filtered.
    // - Code is not that pretty.
	
	// CHANGE THESE SETTINGS TO YOUR LIKING:
	var MIN_COMMENT_LENGTH = 5;          // Removes any comment that has less than # characters
	var MIN_COMMENT_WORDS = 2;           // Removes any comment that has less than # words
	var MIN_COMMENT_WORDS_FILTER = 3;    // Removes any comment that has less than # characters words in combination with any (non-aggressive) filter
    
    var REMOVE_FIRST = true;             // Removes any comment with suspected combinations of "first"
    var REMOVE_EARLY = true;             // Removes any comment with suspected combinations of "early"
    var REMOVE_EARLY_AGGRESSIVE = true;  // Removes any comment with "early" without looking at MIN_COMMENT_WORDS_FILTER
    var REMOVE_CRINGE_AGGRESSIVE = true; // Removes any comment with "cringe" without looking at MIN_COMMENT_WORDS_FILTER
    var REMOVE_SELF_LIKES = true;        // Removes any comment which has suspicion of asking for likes
    var REMOVE_SELF_PROMO = true;        // Removes any comment which has suspicion of asking for subscribers
    var REMOVE_ATTENTION_SEEKERS = true; // Removes any comment which has suspicion of seeking attention/is unrelated to the video
	
	var translation_spam = "Spam";
	
    var DEBUG = false;
	var INTERVAL = 500; // ms
	// END OF SETTINGS
    
    var _removedComments = 0;
    var _removedCommentsTotal = 0;
    
	checkIsLoading();
	
	function checkIsLoading() {
		var isLoading = $('#watch-discussion').find('.action-panel-loading').length;

		if (isLoading) {
			setTimeout(function() {
				checkIsLoading();
			}, 500);
		} else {
			if (DEBUG) { console.log("YTACR: Comment section loaded."); }
			removeComments();
			
			var commentCount = $('.comment-thread-renderer').length;
			listenForNewComments(commentCount);
		}
	}
	
	function listenForNewComments(commentCount) {
		var currentCommentCount = $('.comment-thread-renderer').length;

		if (commentCount !== currentCommentCount) {
			if (DEBUG) { console.log("YTACR: New comments found."); }
			
			removeComments();
		}
		
		setTimeout(function() {
			listenForNewComments(currentCommentCount);
		}, INTERVAL);
	}
	
	function removeComments() {
        
		$('.comment-thread-renderer').each(
			function(index) {
				var comment = $(this).find('.comment-renderer-text-content').html().toLowerCase();
                var commentWordCount = comment.split(' ').length;
				
				if (comment.length < MIN_COMMENT_LENGTH) {
                    if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the MIN_COMMENT_LENGTH rule (${comment.length}/${MIN_COMMENT_LENGTH})`); }
					this.remove();
					_removedComments++;
					return true;
				}
				
				if (commentWordCount < MIN_COMMENT_WORDS) {
                    if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the MIN_COMMENT_WORDS rule (${commentWordCount}/${MIN_COMMENT_WORDS})`); }
					this.remove();
					_removedComments++;
					return true;
				}
				
                if (REMOVE_FIRST) {
                    var first = [
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
                            this.remove();
                            _removedComments++;
							return true;
                        }
                    }
                }
				
                if (REMOVE_EARLY_AGGRESSIVE) {
                    var early = "early";
                    if (comment.indexOf(early) > -1 &&
                        commentWordCount < MIN_COMMENT_WORDS_FILTER) {
                        if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_EARLY_AGGRESSIVE rule.`); }
                        this.remove();
                        _removedComments++;
						return true;
                    }
                }
				
                if (REMOVE_EARLY) {
                    var earlyOptions = [
                        "i was this early",
                        "i am so early",
                        "i'm early",
                        "im early"
                    ];

                    for (var eo in earlyOptions) {
                        if (comment.indexOf(earlyOptions[eo]) > -1) {
                            if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_EARLY rule.`); }
                            this.remove();
                            _removedComments++;
							return true;
                        }
                    }
                }
				
                if (REMOVE_CRINGE_AGGRESSIVE) {
                    var cringe = "cringe";

                    if (comment.indexOf(cringe) > -1 &&
                        commentWordCount < MIN_COMMENT_WORDS_FILTER) {
                        if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_CRINGE_AGGRESSIVE rule.`); }
                        this.remove();
                        _removedComments++;
						return true;
                    }
                }
				
                if (REMOVE_SELF_LIKES) {
                    var selfLikes = [
                        "can i get a thumbs up",
                        "like my comment",
                        "i get top rated",
                        "i get top comment"
                    ];

                    for (var sl in selfLikes) {
                        if (comment.indexOf(selfLikes[sl]) > -1) {
                            if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_SELF_LIKES rule.`); }
                            this.remove();
                            _removedComments++;
							return true;
                        }
                    }
                }
				
                if (REMOVE_SELF_PROMO) {
                    var selfPromos = [
                        "on my channel"
                    ];

                    for (var sp in selfPromos) {
                        if (comment.indexOf(selfPromos[sp]) > -1) {
                            if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_SELF_PROMO rule.`); }
                            this.remove();
                            _removedComments++;
							return true;
                        }
                    }
                }
				
                if (REMOVE_ATTENTION_SEEKERS) {
                    var attentionPhrases = [
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
                        "first like",
                        "second like",
                        "fifth like",
                        "5th like",
                        "first comment",
                        "early comment",
                        "this sea of comments",
                        "of you will skip this but",
                        "scrolling through the comments"
                    ];

                    for (var ap in attentionPhrases) {
                        if (comment.indexOf(attentionPhrases[ap]) > -1) {
                            if (DEBUG) { console.log(`YTACR: Comment "${comment}" violates the REMOVE_ATTENTION_SEEKERS rule.`); }
                            this.remove();
                            _removedComments++;
							return true;
                        }
                    }
                }
			}
		);
		
		_removedCommentsTotal += _removedComments;
		setCommentCounter(_removedComments, _removedCommentsTotal);
        if (DEBUG) { console.log(`YTACR: Removed ${_removedComments} comments this run. Total removed comments: ${_removedCommentsTotal}.`); }
		_removedComments = 0;
	}
    
	function setCommentCounter(removedComments, removedCommentsTotal) {
		var isUsingImperial = false;
		var commentCounter = $('h2.comment-section-header-renderer');
		var span = "<span class=\"alternate-content-link\"></span>";
		var commentCounterText = commentCounter.find('b').first().text();
		
		var getCommentCountsRegex = /• (.*)<span/;
		var commentCountsHtml = commentCounter.html();
 		var commentCounts = getCommentCountsRegex.exec(commentCountsHtml);
		var currentTotalComments = commentCounts[1];
		
		if (currentTotalComments.indexOf(',') !== -1) {
			isUsingImperial = true;
			currentTotalComments = currentTotalComments.replace(',', '');
		} else {
			currentTotalComments = currentTotalComments.replace('.', '');
		}

 		var newCommentCount = (currentTotalComments - removedComments);
 		var newSpamCount = removedCommentsTotal;
		
		if (isUsingImperial) {
			newCommentCount = newCommentCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1,").split("").reverse().join("");
			newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1,").split("").reverse().join("");
		} else {
			newCommentCount = newCommentCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1.").split("").reverse().join("");
			newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1.").split("").reverse().join("");
		}

        commentCounter.html(`
            <b>${commentCounterText}</b> • ${newCommentCount + span}
            <b>${translation_spam}</b> • ${newSpamCount}
        `);
	}
	
    if (DEBUG) { console.log("YTACR: YouTube Annoying Comments Remover (YTACR) script active."); }
});