# YouTube Comment Filter Script 2.4-分叉成五毛評論過濾器
原作者是TomONeill開發的留言過濾器，本人只是改寫針對五毛特化而已
<BR/>
簡言之，還我清淨的Youtube。
<BR/><BR/>
# 功能描述
針對Youyube上惱人的五毛與屁孩訊息做過濾，可實現過濾字詞、屏蔽帳號等功能，可自行讀說明進行添加與設定規則。
五毛名單來自黄智贤的夜问、CCTV等五毛熱門影片的幾千則留言名單。
	
# 截圖
<IMG SRC="https://github.com/MoutatsuLai/youtube-comment-filter-script/blob/master/screenshots/2019-10-08_001.jpg?raw=true" width="500" height="700" />
<BR />
<IMG SRC="https://github.com/MoutatsuLai/youtube-comment-filter-script/blob/master/screenshots/1.gif" width="442" height="473" />

# 安裝步驟1
Chrome請安裝附加元件<A HREF="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW&utm_source=chrome-ntp-launcher">Tampermonkey</A><BR/>
Firefox請安裝<A HREF="https://addons.mozilla.org/zh-TW/firefox/addon/greasemonkey/">Greasemonkey</A>
# 安裝步驟2 YouTube Comment Filter Script-五毛評論過濾器
<A HREF="https://github.com/MoutatsuLai/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js">點我安裝</A>


# 設定方法

    const FLAIR_INSTEAD_OF_REMOVE = true; // true會淡化處理五毛留言，false會直接過濾處理五毛留言，強烈建議在確認效果後使用false
	
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
		// 可以自行添加網址，右鍵E可以複製連結，如下這些是五毛個人頁面。
"https://www.youtube.com/channel/UC_9MEREuQIYD50JYM1ODkyQ",
"https://www.youtube.com/channel/UCoxz3ojUv_LtKg9szPcOWbA",
"https://www.youtube.com/channel/UChtHOF58i5mAuiQbYK9t8Bw",
"https://www.youtube.com/channel/UCfdX80qUCSS0vmVA8-Yiv7g",
"https://www.youtube.com/channel/UCH4tTq1pvv8uBzeml4krf3A",
"https://www.youtube.com/channel/UCOzgx6RTUq4WUCj6VTK1jyg"
	];


# 更新記錄
<A HREF="https://raw.githubusercontent.com/MoutatsuLai/youtube-comment-filter-script/master/changelog.txt">View changelog</A>
# 我不是原作者，喜歡本應用，麻煩協助提供我五毛帳號
[我是五毛帳號收集區](https://github.com/TomONeill/youtube-comment-filter-script/pull/2)
<IMG SRC="https://github.com/MoutatsuLai/youtube-comment-filter-script/blob/master/screenshots/5m.gif?raw=true" width="565" height="368" />
# 贊助原作者TomONeill
If you like my work so much you feel like doing something nice for me, a complete stranger of the internet, you can.<BR />
<A HREF="https://www.paypal.me/TomONeill">Donate here</A>.
