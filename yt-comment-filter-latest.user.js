// ==UserScript==
// @name         YouTube Comment Filter
// @namespace    https://www.youtube.com/
// @version      0.0.4
// @description  Removes typical comments like 'first' and 'I'm early'. Everything can be modified to the users liking.
// @updateURL 	 https://github.com/TomONeill/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @domain       https://www.youtube.com
// @require      http://code.jquery.com/jquery-1.12.2.min.js
// @author       Tom
// @copyright    2016+, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, console */
'use strict';

$(function() {
	// TODO:
	// - Comment replies (fixed?).
	// - Code cleaning and stuff. All of this is done in a very short period of time. Am too lazy to do it properly for now.
	
	// SETTINGS:
	var INTERVAL = 500; // ms
	
	var MIN_LENGTH = 5; // minimal comment characters
	var ABSOLUTE_MIN_WORD_COUNT = 2; // minimal comment words
	var MIN_WORD_COUNT = 3; // minimal comment words in combination with the filter
	
	var translation_spam = "Spam";
	
	checkIsLoading();
	
	function checkIsLoading() {
		var isLoading = $('#watch-discussion').find('.action-panel-loading').length;

		if (isLoading) {
			setTimeout(function() {
				checkIsLoading();
			}, 500);
		} else {
			console.log("YTACR: Comment section loaded.");
			removeComments();
			
			var commentCount = $('.comment-thread-renderer').length;
			listenForNewComments(commentCount);
		}
	}
	
	function listenForNewComments(commentCount) {
		var currentCommentCount = $('.comment-thread-renderer').length;

		if (commentCount !== currentCommentCount) {
			console.log("YTACR: New comments found.");
			
			removeComments();
		}
		
		setTimeout(function() {
			listenForNewComments(currentCommentCount);
		}, INTERVAL);
	}
	
	function removeComments() {
		var removedComments = 0;
		
		$('.comment-thread-renderer').each(
			function(index) {
				var comment = $(this).find('.comment-renderer-text-content').html().toLowerCase();
				
				if (comment.length < MIN_LENGTH) {
					this.remove();
					removedComments++;
				}
				
				if (comment.split(' ').length < ABSOLUTE_MIN_WORD_COUNT) {
					this.remove();
					removedComments++;
				}
				
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
					    comment.split(' ').length < MIN_WORD_COUNT) {
						this.remove();
						removedComments++;
					}
				}
				
				var early = "early";
				if (comment.indexOf(early) > -1 &&
					comment.split(' ').length < MIN_WORD_COUNT) {
					this.remove();
					removedComments++;
				}
				
				var earlyOptions = [
					"i was this early",
					"i am so early",
					"i'm early",
					"im early"
				];
				
				for (var eo in earlyOptions) {
					if (comment.indexOf(earlyOptions[eo])) {
						this.remove();
						removedComments++;
					}
				}
				
				var cringe = "cringe";

				if (comment.indexOf(cringe) > -1 &&
					comment.split(' ').length < MIN_WORD_COUNT) {
					this.remove();
					removedComments++;
				}
				
				var selfLikes = [
					"can i get a thumbs up",
					"like my comment",
					"i get top rated",
					"i get top comment"
				];

				for (var sl in selfLikes) {
					if (comment.indexOf(selfLikes[sl]) > -1) {
						this.remove();
						removedComments++;
					}
				}
				
				var selfPromos = [
					"on my channel"
				];

				for (var sp in selfPromos) {
					if (comment.indexOf(selfPromos[sp]) > -1) {
						this.remove();
						removedComments++;
					}
				}
				
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
						this.remove();
						removedComments++;
					}
				}
			}
		);
		
		setCommentCounter(removedComments);
		console.log("YTACR: Removed " + removedComments + " comments.");
	}
	
	function setCommentCounter(removedComments) {
		var isUsingImperial = false;
		var commentCounter = $('h2.comment-section-header-renderer');
		var span = "<span class=\"alternate-content-link\"></span>";
		var commentCounterText = commentCounter.find('b').first().text();
		
		var getCommentCountsRegex = /• (.*)<span/;
		var commentCountsHtml = commentCounter.html();
 		var commentCounts = getCommentCountsRegex.exec(commentCountsHtml);
		var currentTotalComments = commentCounts[1];
		
		var getSpamCountsRegex = /\s(\w+)$/;
 		var spamCounts = getSpamCountsRegex.exec(commentCountsHtml);
		var currentSpamComments = "0";
		if (spamCounts !== null) {
			currentSpamComments = spamCounts[1];
		}
		
		if (currentTotalComments.indexOf(',') !== -1) {
			isUsingImperial = true;
			currentTotalComments = currentTotalComments.replace(',', '');
			currentSpamComments = currentSpamComments.replace(',', '');
		} else {
			currentTotalComments = currentTotalComments.replace('.', '');
			currentSpamComments = currentSpamComments.replace('.', '');
		}

 		var newCommentCount = (currentTotalComments - removedComments);
 		var newSpamCount = (parseInt(currentSpamComments) + removedComments);
		
		if (isUsingImperial) {
			newCommentCount = newCommentCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1,").split("").reverse().join("");
			newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1,").split("").reverse().join("");
		} else {
			newCommentCount = newCommentCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1.").split("").reverse().join("");
			newSpamCount = newSpamCount.toString().split("").reverse().join("").replace(/(.{3})/g, "$1.").split("").reverse().join("");
		}
		
 		commentCounter.html("<b>" + commentCounterText + "</b> • " + newCommentCount + span
						  + "<b>" + translation_spam + "</b> • " + newSpamCount);
	}
	
	console.log("YTACR: YouTube Annoying Comments Remover (YTACR) script active.");
});
