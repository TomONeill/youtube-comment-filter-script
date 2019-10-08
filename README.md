# YouTube Comment Filter Script-五毛評論過濾器
Script that filters unwanted comments.
<BR/>
Enjoy.
<BR/><BR/>
Version <strong>2.4</strong>
# 功能描述
針對Youyube上惱人的五毛與屁孩訊息做過濾，可實現過濾字詞、屏蔽帳號等功能，可自行讀說明進行添加與設定規則。
# 前置作業
Chrome請安裝附加元件<A HREF="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW&utm_source=chrome-ntp-launcher">Tampermonkey</A><BR/>
Firefox請安裝<A HREF="https://addons.mozilla.org/zh-TW/firefox/addon/greasemonkey/">Greasemonkey</A>
# 正式安裝YouTube Comment Filter Script-五毛評論過濾器
<A HREF="https://github.com/MoutatsuLai/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js">點我安裝</A>

# 截圖
<IMG SRC="https://raw.githubusercontent.com/MoutatsuLai/youtube-comment-filter-script/master/screenshots/preview.png" width="600" height="100" />
<BR />
<IMG SRC="https://raw.githubusercontent.com/MoutatsuLai/youtube-comment-filter-script/master/screenshots/preview_2.png" width="450" height="200" />


    const FLAIR_INSTEAD_OF_REMOVE = true; // true會淡化處理五毛留言，false會直接過濾處理五毛留言
	
    const MIN_COMMENT_LENGTH = 0;// 刪除少於＃個字符的任何回應
    const MIN_COMMENT_WORDS = 0; //刪除少於＃個單詞的任何回應
    const MIN_COMMENT_WORDS_FILTER = 100; //刪除任何少於＃個字符的回應，並與任何（非攻擊性）過濾器結合使用

    const REMOVE_FIRST = true; //刪除帶有“ first”組合的任何註釋
    const REMOVE_EARLY = true; //刪除所有帶有“early”組合的評論
    const REMOVE_EARLY_AGGRESSIVE = false; //刪除所有帶有“early”的評論，而無需查看MIN_COMMENT_WORDS_FILTER
    const REMOVE_CRINGE_AGGRESSIVE = false; //刪除所有帶有“CRINGE”的評論，而無需查看MIN_COMMENT_WORDS_FILTER
    const REMOVE_SELF_LIKES = false; //刪除任何懷疑喜歡的評論
    const REMOVE_SELF_PROMO = false; //刪除任何懷疑要求訂閱者的評論
    const REMOVE_ATTENTION_SEEKERS = false; //刪除所有可能引起關注或與視頻無關的評論

*New*:
Ability to block users by their url (right click on user name and select "Copy url", paste it in this list within quotes)
	
	const BLOCKED_USER_URLS = [
		// EXAMPLE: "https://www.youtube.com/channel/abcdefghijklmnop"
		""
	];
	
# 更新記錄
<A HREF="https://raw.githubusercontent.com/MoutatsuLai/youtube-comment-filter-script/master/changelog.txt">View changelog</A>

# 贊助原作者
If you like my work so much you feel like doing something nice for me, a complete stranger of the internet, you can.<BR />
<A HREF="https://www.paypal.me/TomONeill">Donate here</A>.
