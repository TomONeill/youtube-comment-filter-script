// ==UserScript==
// @name         YouTube Comment Filter
// @namespace    https://www.youtube.com/
// @version      2.4
// @description  Removes typical comments like 'first' and 'I'm early'. Everything can be modified to the users liking.
// @updateURL 	 https://github.com/TomONeill/youtube-comment-filter-script/raw/master/yt-comment-filter-latest.user.js
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @domain       https://www.youtube.com
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2016 - 2018, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, console */
'use strict';

$(function() {
	// TODO:
	// - All comments get checked instead of new ones only.
	// - Test YT's commentfilter properly.

	// CHANGE THESE SETTINGS TO YOUR LIKING:
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
    //const FLAG_INSTEAD_OF_REMOVE = false
	const BLOCKED_USER_URLS = [
		// EXAMPLE: "https://www.youtube.com/channel/abcdefghijklmnop"
https://www.youtube.com/channel/UC_9MEREuQIYD50JYM1ODkyQ
https://www.youtube.com/channel/UCoxz3ojUv_LtKg9szPcOWbA
https://www.youtube.com/channel/UChtHOF58i5mAuiQbYK9t8Bw
https://www.youtube.com/channel/UCfdX80qUCSS0vmVA8-Yiv7g
https://www.youtube.com/channel/UCH4tTq1pvv8uBzeml4krf3A
https://www.youtube.com/channel/UCOzgx6RTUq4WUCj6VTK1jyg
https://www.youtube.com/channel/UC9XEgZxYEdMqvmrxGufT2JQ
https://www.youtube.com/channel/UCXAzDYIwqKvOpLkuujn-i_A
https://www.youtube.com/channel/UCDPUp1dNSBSVMZVZNEdILgQ
https://www.youtube.com/channel/UCQmFtHQzx7U66i3lQ_SlueQ
https://www.youtube.com/channel/UCn-C5BneFJEqpWPn1igWY6A
https://www.youtube.com/channel/UCsRtAUmC3ewXFFCSLejKL7Q
https://www.youtube.com/channel/UC3-3poWKR8eX7-_whMLKOog
https://www.youtube.com/channel/UCKn0EEWRi1xxv7h1DWQicRg
https://www.youtube.com/channel/UC0AWtStG4ftJaCueGEwpvYg
https://www.youtube.com/channel/UCnzSnEld1NHU2g9UjpL2Rpg
https://www.youtube.com/channel/UCdGZbnVuJm3Do8hkLUN45Vw
https://www.youtube.com/channel/UC7l5evya93r2YnQbQtUYztA
https://www.youtube.com/channel/UCm8vlO0WLuwbaNse_uB2wXQ
https://www.youtube.com/channel/UCkf3L4ioAL_u_t2IZ7ixllQ
https://www.youtube.com/channel/UCkJ3f2gOiEdLf1jJXw7GY-Q
https://www.youtube.com/channel/UCYsSOeWnH7OzYGTkHmQEqPA
https://www.youtube.com/channel/UCaok-uoR1huAVOUCierFnFA
https://www.youtube.com/channel/UCIkLHgizD9jAzxyC86_7Cwg
https://www.youtube.com/channel/UC50Z3uKRvl2RHmbEgT8WrCw
https://www.youtube.com/channel/UCChgrlsIRQ1tvzl1ouJtfuw
https://www.youtube.com/channel/UCMOm7CStP9ZftK_kz4QWivw
https://www.youtube.com/channel/UCY_4grkTj5u2Rv8mVXKgUpg
https://www.youtube.com/channel/UCUGMhgUo6Iic12CPEIO1WUg
https://www.youtube.com/channel/UCuYR295iv-ID2PceAFHQzJA
https://www.youtube.com/channel/UCSDYrkcG-2yWZnMvL8eMtmQ
https://www.youtube.com/channel/UC047cKmDquJSfrkFA9k4b2Q
https://www.youtube.com/channel/UCimH221MutxRtAaXyvJT0QQ
https://www.youtube.com/channel/UCEECpi8wkQ0poxz9vH20yVg
https://www.youtube.com/channel/UC3D_-hHsHoGoKbhKpklRNMw
https://www.youtube.com/channel/UC-dxSWeZtdwhiwgGBgsagNA
https://www.youtube.com/channel/UCBizsz4N1h0fpBK68ln8_ZQ
https://www.youtube.com/channel/UC1Z-BGfVudM0gComRcO4bDg
https://www.youtube.com/channel/UC9jSfhpigWGDNcdpWbwOgrA
https://www.youtube.com/channel/UCW3dz-ob3kpnifSQy_7lqtg
https://www.youtube.com/channel/UCKQ_Jev1KQM4wRIEsHMQsuQ
https://www.youtube.com/channel/UCj8IdodovLtI2yy1hE7mI6g
https://www.youtube.com/channel/UCufEy0T3LuO2Cgl0foKdFuw
https://www.youtube.com/channel/UCJTKBKzPiQaGSCBrVp5oi7Q
https://www.youtube.com/channel/UCuoxNjUenK4vq0SMNwhfFFw
https://www.youtube.com/channel/UCDdtv097y769nXr6WOWTYeQ
https://www.youtube.com/channel/UCUGh0owo-idkwXtvU4y9rBw
https://www.youtube.com/channel/UCGLBD41Ccknfg1E88qn7CIQ
https://www.youtube.com/channel/UC6ziCQt3GCDbag6KMmxtACQ
https://www.youtube.com/channel/UCvXH7o15MqRN0LFH7Jd-q9g
https://www.youtube.com/channel/UCEfRRwKsVAD66y2sdvMkwmw
https://www.youtube.com/channel/UCmtjbOMULdQgRji7eKq_gdQ
https://www.youtube.com/channel/UCQpvrgbiPU3ZljOKmNYZ_oA
https://www.youtube.com/channel/UCchoh9WrIfl0-2wCZdpQ2Gw
https://www.youtube.com/channel/UClgeJikr86mkVczpEvuVkZg
https://www.youtube.com/channel/UCAcH2iOPbkYe2Bh-WNZMIGw
https://www.youtube.com/channel/UCf42H-clnnMJ7HeRtSwvdVw
https://www.youtube.com/channel/UCJLFhxVRZDMetLhj2fA9RmQ
https://www.youtube.com/channel/UCqZJkbmjB1hjcxkiXJgaL4w
https://www.youtube.com/channel/UCadSJ5VRKRqE6EBEB4n0wGA
https://www.youtube.com/channel/UCP0PEMORQgtKPymMq6Y0kYg
https://www.youtube.com/channel/UC8wc-mtVlPg1WLys5zl0uKg
https://www.youtube.com/channel/UCf7fbdBH-zWgDEVMuiJHxMw
https://www.youtube.com/channel/UCq4vaY7lLw2VHWikwSPgLmw
https://www.youtube.com/channel/UCOQW-rQVfb-MP10Mfi48LRw
https://www.youtube.com/channel/UCtQE5jUBWQnCYqppbB4OZ6g
https://www.youtube.com/channel/UCBvOzT0jPALPXwUFXSxI3Fg
https://www.youtube.com/channel/UCz8dV9aW0KMdIfmFFKxOPKw
https://www.youtube.com/channel/UCU5JG5fRnGp04pmzYzEfpJw
https://www.youtube.com/channel/UC4Etxkl_hJYLIyV5iln9a8A
https://www.youtube.com/channel/UCmCJiCNATZ_1PzddrzSw-7A
https://www.youtube.com/channel/UCfpRmhLGoybfwXHNCl0h5wQ
https://www.youtube.com/channel/UCF7EXxHTmop35CNCO0Z_tlw
https://www.youtube.com/channel/UChBKUdHpAE2isI_6prLVZ1Q
https://www.youtube.com/channel/UCvRh1yqWsXGayUnDNEYWgFw
https://www.youtube.com/channel/UC6RdAB9UNZj5bBu-7dug9UQ
https://www.youtube.com/channel/UCavqzrIg5ubEH_9KnGCJs9g
https://www.youtube.com/channel/UCCLDYB91ZQyUbyrPM4CldLw
https://www.youtube.com/channel/UCw9ETaZvdNq36899LyPlsxg
https://www.youtube.com/channel/UCOKtXSZFnxhQXuuumb-eREA
https://www.youtube.com/channel/UC40Le18FqZ1AHTUsNmfZ14A
https://www.youtube.com/channel/UCnAiFDPiDwmcTiYH_NIu2ng
https://www.youtube.com/channel/UCvdFYf588vCzpgStV7HfRyg
https://www.youtube.com/channel/UChUV6Z7LKMw62RzfN4vvjhQ
https://www.youtube.com/channel/UCOzv_AKFqPQzoWG2ecPd_Rw
https://www.youtube.com/channel/UCvsT4GPoeb1ACdwpWPQyBCQ
https://www.youtube.com/channel/UC8BXrbBS7N3FaHvUB4pI8IA
https://www.youtube.com/channel/UCEryXc7XyiSi03btkp81ajQ
https://www.youtube.com/channel/UCnLd80LPgiujDsONgEyOg1w
https://www.youtube.com/channel/UCs80lpeZkv-vQabOvOwAnQg
https://www.youtube.com/channel/UCVcswkDpirgFV7bS3IICwrw
https://www.youtube.com/channel/UCeaOVRt0Y9gEXfdMLhmQ9ZQ
https://www.youtube.com/channel/UC5Vevd14DhYP3je1dAwgBew
https://www.youtube.com/channel/UCTnh2_v1aNlQPMxeH6f2P9Q
https://www.youtube.com/channel/UCojiiB3ZhWRsdvH6aNVfyTA
https://www.youtube.com/channel/UCexNS5F4k4uvVzL4WD5qZZg
https://www.youtube.com/channel/UCTge4i7PBDn2aXxQVfxcC_Q
https://www.youtube.com/channel/UCyDCT_U8YeiCnOP7g105qQw
https://www.youtube.com/channel/UCgRdHxKUT4hk4bbH0TmKVzg
https://www.youtube.com/channel/UCFXL7fsHx9wB7bGrMitGxwQ
https://www.youtube.com/channel/UCuthHDUDDyqfgfE0tayOFRA
https://www.youtube.com/channel/UCki14B3PXgKgtW6kbDN09Lg
https://www.youtube.com/channel/UCaWS1UYxWVwSSzuVgMVMLdQ
https://www.youtube.com/channel/UCzrobWGtFO5Fgjr_UzyycGw
https://www.youtube.com/channel/UCDY767IqJEfFhLqyjcCzpdg
https://www.youtube.com/channel/UCjbD_m_OscLkhOVfOCC14TA
https://www.youtube.com/channel/UCqL4CaOriJuodQzK_92H39A
https://www.youtube.com/channel/UCiBf639Ggq_GuRRUW3ygeTw
https://www.youtube.com/channel/UCptviOAslbbjz7rf6ZgxxqQ
https://www.youtube.com/channel/UCqOHnW5y4ERCVFIhpEqs50g
https://www.youtube.com/channel/UCneXcbXGPoozdC88TEcpPuA
https://www.youtube.com/channel/UCzVRhjh9l8TSbVF_mOE5Fig
https://www.youtube.com/channel/UCrmBTwIYNO5fc_JUIPe9MOg
https://www.youtube.com/channel/UCqrowV92nYcYrl1DWhhs-5A
https://www.youtube.com/channel/UCiDZIV5c9LNP0c1u9lATOZw
https://www.youtube.com/channel/UCuq1CCiWaK5qXhjz87L6iQg
https://www.youtube.com/channel/UClHD6yeLyLuD1ERdur-suBg
https://www.youtube.com/channel/UCqfp6W5tZ_XzR0boEh2CS3g
https://www.youtube.com/channel/UCsLiMyPnP2Xd0Rlnblag1ww
https://www.youtube.com/channel/UC2JSfX5yfe-EwkaIblpRiUw
https://www.youtube.com/channel/UCqblhVSCF0jUj6XYriTnexw
https://www.youtube.com/channel/UC4z4vIzrcUi0BKja_3223gA
https://www.youtube.com/channel/UCyCeZX0lvQpfpQ5sZ7pp5aw
https://www.youtube.com/channel/UC92hM8y-I-2Vq_bOH3oRJFQ
https://www.youtube.com/channel/UCCYkWBMMK9IaHjiShbbDjEg
https://www.youtube.com/channel/UCiATUHzIQxZoUFyGhvBQ-hA
https://www.youtube.com/channel/UC4XTKWjlhwHwN1-XQhKQofw
https://www.youtube.com/channel/UCSMUw9BGBK9xtZzPcw3T0-w
https://www.youtube.com/channel/UCqYXmA9diUWvg21jQNdi3aw
https://www.youtube.com/channel/UCAseiw-v6UcXpi7-e8PwtXA
https://www.youtube.com/channel/UCr2H9PcnAKTeiJIOlPYd_2A
https://www.youtube.com/channel/UCJ7ZSXmyW2oj5QZM0xmErzw
https://www.youtube.com/channel/UCuLBpCFdIb0Q9CGb747X85g
https://www.youtube.com/channel/UCMQW4cjfxWTsmbpxFAuYeTA
https://www.youtube.com/channel/UCk_6aOIeKnBnSvMAU83Jkkg
https://www.youtube.com/channel/UC0S68LoIjQ3Rle0IIOG-URw
https://www.youtube.com/channel/UCageDnxXdH0W3n0ISR1kKQQ
https://www.youtube.com/channel/UCDqzNhU79bzeb-40t2Hv71w
https://www.youtube.com/channel/UCaFxlEwz2H1VZAGYNulE7vA
https://www.youtube.com/channel/UCbaR2xaiCCGfC-1HKg7nnxw
https://www.youtube.com/channel/UCvL3LstCmhcJjUSEmaM6HBw
https://www.youtube.com/channel/UCIWvMSsaA5wtmPZ50vhfZnw
https://www.youtube.com/channel/UCf7qM9B0ES1Ye0Sbks53FGA
https://www.youtube.com/channel/UCt6dys60tUHkt_Y-Du98gXQ
https://www.youtube.com/channel/UCc_F9Z_4uRAf1CToUwESiVQ
https://www.youtube.com/channel/UC37YoA3avyxMnT_lOYEKtQg
https://www.youtube.com/channel/UCE8Gb8IpdlB66jlr_Lfuh4A
https://www.youtube.com/channel/UC1mB7w69tHXJjLcUKHkYNjg
https://www.youtube.com/channel/UCU1kxlRtpg-oKRfFP1g488Q
https://www.youtube.com/channel/UCWbbxi_wwYQwLHGMY_P8xpQ
https://www.youtube.com/channel/UCP8LI3EI1II-mRMxaBDOaeA
https://www.youtube.com/channel/UCzQyEro9UzdHiQF1JPyvnAA
https://www.youtube.com/channel/UC0FZ4EQlfqc41clR6z0YY8A
https://www.youtube.com/channel/UCbKphPuKF97LSagQTf8jgrw
https://www.youtube.com/channel/UCeyXE3Tx-92-I0_VYlAywqw
https://www.youtube.com/channel/UCArDGv7dVy-2l2NP0RmV2fA
https://www.youtube.com/channel/UCOwZOcaLc92JZasmu6LfR4g
https://www.youtube.com/channel/UC6bNJ2ucvatE_sDgiV734SQ
https://www.youtube.com/channel/UC0o4koE3Pp3n-igyRK5mHlw
https://www.youtube.com/channel/UCF2UacT6Xa8acY8B9JqtEcA
https://www.youtube.com/channel/UCLPJzOJ3Lov7_swa-dypc9Q
https://www.youtube.com/channel/UCKCBnZ0sR9r1SvYEyXjF0DA
https://www.youtube.com/channel/UCrJs3zDzp43cCveflrl86mw
https://www.youtube.com/channel/UCAHT8Makze0uXbc6rjGnIzg
https://www.youtube.com/channel/UC3IWZkPxJaeQE5E1njMBj3A
https://www.youtube.com/channel/UCj-zfQ2cHoL-LVD43I38HQw
https://www.youtube.com/channel/UCzTBMdIfIZ1xZdMkN23zOVw
https://www.youtube.com/channel/UCtzzTngMhjv2hm87o_Ymnpw
https://www.youtube.com/channel/UCzPZI-6WRsk7JxcVT4FkcIA
https://www.youtube.com/channel/UCZPvbauLBSMEIgpSYJjQhQw
https://www.youtube.com/channel/UCjNqFs9x80ymJmD44NlMDxQ
https://www.youtube.com/channel/UC228WDpmpNILp2ItuhIdWTg
https://www.youtube.com/channel/UCEQc8Hlbpq3PZ8OKYNavLHQ
https://www.youtube.com/channel/UCauJoyTMNl7JR6L_tETd17g
https://www.youtube.com/channel/UC0-BzsGkP5d9wGVm9pQCyxw
https://www.youtube.com/channel/UC4WG17uw0LSQ1v8Pw3K-eQQ
https://www.youtube.com/channel/UCuQPY35DHYoE7DqIXYqL85g
https://www.youtube.com/channel/UCVp45mSoL1J1R7EnEYUuojg
https://www.youtube.com/channel/UCj4bvVVgX-AwIDG5DJHIELw
https://www.youtube.com/channel/UCvR7jcbIPMYWvSNyulkW-6g
https://www.youtube.com/channel/UC8uQj_Hf7OtLzQbJberOF1w
https://www.youtube.com/channel/UCkXEo6IRmeAP1qIMLhL-ogA
https://www.youtube.com/channel/UCa0qnFW7YyqIkmg-x50Ld4w
https://www.youtube.com/channel/UCy4LIPxqvYqi_bT-qKlYEGw
https://www.youtube.com/channel/UCCpKIry8QLpwL8SSk1h1vjA
https://www.youtube.com/channel/UCSwY-GvzQe4EBbF9HtdQmkw
https://www.youtube.com/channel/UCkUlWnpyPICNmKNd87ykZrg
https://www.youtube.com/channel/UCx0YjOJlGQjnWr7WEhmeYjw
https://www.youtube.com/channel/UCoef9ZeiPLS9fAg3wuFmAkw
https://www.youtube.com/channel/UCzcCYR7rdVWainmKOHdkyWg
https://www.youtube.com/channel/UC3ejLwoVWU57dLG3w2YxkHQ
https://www.youtube.com/channel/UCCHEnUdrNT-4-Ht__ebsSvw
https://www.youtube.com/channel/UCCvItwy204YLBKcYksWzwAA
https://www.youtube.com/channel/UCKhtP9Wb4UvWK-H50Bk_Xhg
https://www.youtube.com/channel/UC6NsoZsOVi_DqK0rLPJJ80Q
https://www.youtube.com/channel/UCVMchl0my9iYe-EkY31YHJg
https://www.youtube.com/channel/UCP5ZwP_6fbBfofvSXsD4x4A
https://www.youtube.com/channel/UCvYF4COvhlsN4AUeHwXdcLQ
https://www.youtube.com/channel/UCSKRB53P8e2Xl4Oce6aP7Qw
https://www.youtube.com/channel/UC34m95mVsHeDudoQK7L4UCA
https://www.youtube.com/channel/UCPJMHYNEbqXO62VEiqu7MmA
https://www.youtube.com/channel/UCOD3sx_CDXYYOJQjM3ALxSw
https://www.youtube.com/channel/UCkAHep8FX54KkE-faD65NJw
https://www.youtube.com/channel/UC_cMy6psio8mOjx5TkSLPlA
https://www.youtube.com/channel/UC_3m8w3Fm5800qtIpiAagZw
https://www.youtube.com/channel/UCykmbuEDLdEeYRnKK1yYEcA
https://www.youtube.com/channel/UCKg1hgnfqn5L-ra8GRDGN0g
https://www.youtube.com/channel/UCmsaTIgT7DCFBXaBWDKf5Ig
https://www.youtube.com/channel/UCvMybAEXJHuL-l2qF4nnr0w
https://www.youtube.com/channel/UCHe283AGuZ2wpXjix4lH4Rw
https://www.youtube.com/channel/UC9H5YNaRZIWjOoKyGCA4XZw
https://www.youtube.com/channel/UCCADNbBfU31n-5CkLk3YPxA
https://www.youtube.com/channel/UCSSR1R-dV_Bg1fi5cXpFj1w
https://www.youtube.com/channel/UCM1c6R_YNm6DVIF1GpKkfCg
https://www.youtube.com/channel/UChP_fUssGOl7PWqc8c3wsMQ
https://www.youtube.com/channel/UC4Lq_Jgkk9zCK0jlf-bntxA
https://www.youtube.com/channel/UChwc2FlXU7Tysp-MX_XUWoQ
https://www.youtube.com/channel/UCr0W02XOOvq_m_1JbSj-4Og
https://www.youtube.com/channel/UCbQsBHyeth_dFyz5iheWu9w
https://www.youtube.com/channel/UCewuYt_-HPRotN1rx-YHlFg
https://www.youtube.com/channel/UCPjlrblk4ptWRDXUrblalxg
https://www.youtube.com/channel/UCHcGVdVy3LVOjQ2mq1cYWiQ
https://www.youtube.com/channel/UCYnG8HC_nDOuSZgGNAGcuzw
https://www.youtube.com/channel/UC6Tlo7B-B4GSvAyT263Lezg
https://www.youtube.com/channel/UC5tANjxaL3xiltLC31_H0Sg
https://www.youtube.com/channel/UCLHzqNIppVjzYogMxAzhtTA
https://www.youtube.com/channel/UCXV8a9NXPkGzbETktTm11oQ
https://www.youtube.com/channel/UCwQAIlLL7wDeG-yZTEg8T5g
https://www.youtube.com/channel/UCJGnVVxisqjqrbKjq6s0ZaA
https://www.youtube.com/channel/UC1BUzuGd_EgrE0coArJioFw
https://www.youtube.com/channel/UCX6XtbnZMHKN_trTXtpd72w
https://www.youtube.com/channel/UCH6ajgmJyYzVa8BuZkOke1Q
https://www.youtube.com/channel/UCWBNFmVMN_M_gLCvUZ33-Lg
https://www.youtube.com/channel/UC9eWSLBZQxqPSSkQqyAdKDw
https://www.youtube.com/channel/UCxAgeAl9glzBCi5kQfBNrUQ
https://www.youtube.com/channel/UC0AqCSh1n65uq5Kvd400Axg
https://www.youtube.com/channel/UCJttRUSHFdjhVv-jGVNIpFw
https://www.youtube.com/channel/UCtdHhbmKmoo31QX0EF8oZoA
https://www.youtube.com/channel/UCTlSZ-DQXZw7eDfqFZtbWyw
https://www.youtube.com/channel/UCTmDiItSv-KSPZCwF62ePYg
https://www.youtube.com/channel/UCLsvc9I2HxFPif_WfPT1jzg
https://www.youtube.com/channel/UC07qsRJmdqgcNZ0jg-v5C8Q
https://www.youtube.com/channel/UC3tTWhlFHXdRomz5U8z8VxA
https://www.youtube.com/channel/UC38fgKcE0bu8oPD9RNdDSEw
https://www.youtube.com/channel/UCY1CvMHGwntDdpuQ7NkYW2Q
https://www.youtube.com/channel/UC9n4kyLxWxhFqhT_-W9D3aA
https://www.youtube.com/channel/UCvA9BgR3z49uRxwGOtRwe4A
https://www.youtube.com/channel/UCaQeTDIAxGusPucjCEI-dnw
https://www.youtube.com/channel/UCKk8GmYfqgkoDCisJlGtn0w
https://www.youtube.com/channel/UCndTnYI-flBecyG3FK9LoWA
https://www.youtube.com/channel/UCoGE5pCWJup4JqTTluQDVcQ
https://www.youtube.com/channel/UCSZDdo3JzEDrWpmocW3ZIOg
https://www.youtube.com/channel/UCqRqc4ZMdvQbSBALebDr4vw
https://www.youtube.com/channel/UCTMX4uZlBN5uyyny_7euYfQ
https://www.youtube.com/channel/UCYJ81x8aypiwD4-wAfinTEg
https://www.youtube.com/channel/UCLDciPTwdhcHm9ujqIWSTVQ
https://www.youtube.com/channel/UCVPn9jAn9B00PR-P84Mis8A
https://www.youtube.com/channel/UCxgse9uiLOs00B6Lg2VH1og
https://www.youtube.com/channel/UCoKzWL6ftul500Kld81Nx4Q
https://www.youtube.com/channel/UCqJDMnvTXmRrViGfPpyxd5w
https://www.youtube.com/channel/UCDJgx1HPUzTKSAH_oJpM6Vw
https://www.youtube.com/channel/UC0FJcm7E3vCwnLpVSYTctVg
https://www.youtube.com/channel/UCbtb6qSRP6LpAVGWDg8kByA
https://www.youtube.com/channel/UCSebvw8p6SLasdMfAvEJz3w
https://www.youtube.com/channel/UCPLvUXqxXSS_ntrx7b9Wd8Q
https://www.youtube.com/channel/UCrpt6RhR6QAredyXfIx3_zg
https://www.youtube.com/channel/UC_9oUNNlSGBtSJKnfaU8Ekw
https://www.youtube.com/channel/UC-ycCI1KrBOeEEE5STvhifA
https://www.youtube.com/channel/UCXLOam5YOytDSk2v4UhcPZA
https://www.youtube.com/channel/UCKY2X_x9PYZjyrjtoFtKqxA
https://www.youtube.com/channel/UCGPkNQiNvNmasv4sOvaRtuA
https://www.youtube.com/channel/UCWL4ZfTfatY1TuJD1I-w3iQ
https://www.youtube.com/channel/UCS6HHo5707os7N2jL-OYwyw
https://www.youtube.com/channel/UCa9FnvML4Q-qfKwpJ5wS2kg
https://www.youtube.com/channel/UC6d7ONgRlEoC2dCjgQS2fnw
https://www.youtube.com/channel/UCcDzZTCpPmRsNjDUmKr3zig
https://www.youtube.com/channel/UCImsp3FepiBOChGn8PbbPxg
https://www.youtube.com/channel/UCnb3e4067u9Ublk-cUSnL1Q
https://www.youtube.com/channel/UCyj1Lg1DMbuq7vHxneytqFw
https://www.youtube.com/channel/UCcJJCoNq1L0Zx_oAIFnxF2g
https://www.youtube.com/channel/UCpVvriOzpSgXR1po8aNZiLQ
https://www.youtube.com/channel/UC5pCgdthwjK9z_9ZtLI8eWQ
https://www.youtube.com/channel/UCjJZUYINrakZMGsgAEp-2mQ
https://www.youtube.com/channel/UCUMO6en1XWI9K8EvsH3WfcQ
https://www.youtube.com/channel/UCiJeMUTmEyXfkAlKTG5HyXw
https://www.youtube.com/channel/UC0r6fWfWHfUFZjmGm-rFKUA
https://www.youtube.com/channel/UCJc0DliVidg3lQKZwODUD9g
https://www.youtube.com/channel/UCt-eOZK402y-T22q2zorZIA
https://www.youtube.com/channel/UCuHXYYniF8eTs-yEjmPYh5w
https://www.youtube.com/channel/UCP1kOgZzdfGVxQDKaF7XReg
https://www.youtube.com/channel/UCpCyWj4eYYuWtxV6Hd9UkJA
https://www.youtube.com/channel/UC3QgenVLlAO9Q4kMpQGB_ow
https://www.youtube.com/channel/UC8L3YsjVbFKWrn3JbfC2duQ
https://www.youtube.com/channel/UCa1wQO16NnBzoxWi5yWNWLg
https://www.youtube.com/channel/UCBNG_Ap5xH5BnzKoPjhG5iw
https://www.youtube.com/channel/UCyQfjxrvoWzkQsvE_uoRDbw
https://www.youtube.com/channel/UClExonp0gnjrAdiWzhipAiw
https://www.youtube.com/channel/UCaSq0son6p3K0HaEfjgzbTA
https://www.youtube.com/channel/UCMEPl5eqIBI2lZSH_bB7MHA
https://www.youtube.com/channel/UCt1ScyVYSEgKpEc3uBzxx8w
https://www.youtube.com/channel/UC57jfgPkIuwKf11-Lv8hnXQ
https://www.youtube.com/channel/UCj3YyoHS27k10Rp5JjwhF4g
https://www.youtube.com/channel/UCQCpNEwYL8X5O8t-ahnQdKw
https://www.youtube.com/channel/UCPIH1QQdrQyR1SGacyu7-wg
https://www.youtube.com/channel/UCXvEHm41mMZH2X91JRw1aVw
https://www.youtube.com/channel/UCQihsLoa8rBvlVumXvjAFdw
https://www.youtube.com/channel/UCN7Qos0cejOJOXtroJXXfqA
https://www.youtube.com/channel/UCL_EOMafp01QYkBiFifaSIw
https://www.youtube.com/channel/UCi1EfTUpAsLHp5XG9DiLCcA
https://www.youtube.com/channel/UCtDeGhSNog5UNF21I1kEgaA
https://www.youtube.com/channel/UCe48xt9oWhDeiAAC-pb03RQ
https://www.youtube.com/channel/UCiA-Yr-dnao9LIuj-BTkMzQ
https://www.youtube.com/channel/UCli4vEpoL0gGDBAY4zAErwQ
https://www.youtube.com/channel/UCG0MKYbU2NlQwkDB-8lY6nQ
https://www.youtube.com/channel/UCZ9IEmX_iv3smN-ArAP-Bww
https://www.youtube.com/channel/UCBh_OTBKYHzR2XTzgo9SJBg
https://www.youtube.com/channel/UCV8ezWgYYPbeucN7orDtZ4g
https://www.youtube.com/channel/UC3l-6h1JWm18ymbMVIftAXA
https://www.youtube.com/channel/UCo04-axsoDGlZlkllmdZYdA
https://www.youtube.com/channel/UCk867XLrSGJWHPR7QFLaIVg
https://www.youtube.com/channel/UCgORbIOPCVxprIHbuoY6A0w
https://www.youtube.com/channel/UCLRMCdnnGr1kpprEmrBWpBA
https://www.youtube.com/channel/UCMBi7sdmduofbltybcRAs9g
https://www.youtube.com/channel/UCRTTAK85ezj7Jjt3C11A2kQ
https://www.youtube.com/channel/UC8YS44bKbOivJB-avFjgZoQ
https://www.youtube.com/channel/UCVdB35H8e6yjRSjgd3X8tRw
https://www.youtube.com/channel/UClSssN-AKRiovcC6CtUhi4g
https://www.youtube.com/channel/UCyAP3m_aa63ncyhxW8py-Ag
https://www.youtube.com/channel/UCxEe-NwfPGp-cEUx2dG4IlA
https://www.youtube.com/channel/UCB1CWficw29usolmSizuNOg
https://www.youtube.com/channel/UCVP6fvXk1tU1GK2XbCr_dNg
https://www.youtube.com/channel/UCxP4-FvubHdW3adjmMFqfEg
https://www.youtube.com/channel/UCMjPqLl1rDV6hLdzH-KPElQ
https://www.youtube.com/channel/UCWNyx5Af5cvv5eGlM-LFGhA
https://www.youtube.com/channel/UC6RMnTC_2QE4E262N-FUukA
https://www.youtube.com/channel/UCRXEHnYMqDG6rrB-80gaZlQ
https://www.youtube.com/channel/UCeyITZGFMrf6obehR1UmVrw
https://www.youtube.com/channel/UC0Jo74RUk3G-HoRdChCdORw
https://www.youtube.com/channel/UCASps6fB5Dt6PNM85JOTxTA
https://www.youtube.com/channel/UCmuoiCawZ-W3wRmTIBobjbQ
https://www.youtube.com/channel/UCBn3nobeRvjgLVrzLHa5P2Q
https://www.youtube.com/channel/UCkJdzh5WsE-SyZdcL2WnMzQ
https://www.youtube.com/channel/UCPvKSGMfnwCQCYxrNniucaA
https://www.youtube.com/channel/UCJy0j_l3OmiEEOeriHsgFdg
https://www.youtube.com/channel/UCGBEjBG6ZP_TV_ecuaYNWuQ
https://www.youtube.com/channel/UCFHAVTWeT8Rxao1jR5DtnZw
https://www.youtube.com/channel/UCoWdh6rQhrdGhF8LwOQi-Zw
https://www.youtube.com/channel/UCwHcMK5aL3qwIrnDIvL6oWw
https://www.youtube.com/channel/UCyuHUTQJP9V1i8_kUWlF9YQ
https://www.youtube.com/channel/UCW7vPm7ZlPei05E0l1tooRg
https://www.youtube.com/channel/UCuW8lU5TYxJZYNTcUE8KB1A
https://www.youtube.com/channel/UCMU0WGRnogfnWiYYXdmYYAQ
https://www.youtube.com/channel/UCQh9QZDWwWW83PnQtjeVl-g
https://www.youtube.com/channel/UCPkrkfczHH8-a6QopKWqytw
https://www.youtube.com/channel/UChzh_je1lN8sUY2_Y27UJkw
https://www.youtube.com/channel/UCf2lQyP2e9-DNuSCS_k4Esw
https://www.youtube.com/channel/UCOQV_A-33UbxBALQuTAWKrg
https://www.youtube.com/channel/UCC0qmnc2QpOBYG-dS16jA-A
https://www.youtube.com/channel/UCkg29nv9QZbJqfpr5V28rcg
https://www.youtube.com/channel/UCJI_u39QIvxS0sRaSkDTklA
https://www.youtube.com/channel/UCzge4m0kItBQZcd9YDvrThQ
https://www.youtube.com/channel/UC0fGy12UnjwmxyRk72AYGnA
https://www.youtube.com/channel/UCvDvRaRYBvLatjMc_g7f-eA
https://www.youtube.com/channel/UC0j259nZfveJW-Cko3ldlOQ
https://www.youtube.com/channel/UCnthhOIkB7M4aWjH3WBMBTA
https://www.youtube.com/channel/UCTnVw743ITw29-khyAo3r8Q
https://www.youtube.com/channel/UCIzB34XFTFvC1og2ZMwH5mQ
https://www.youtube.com/channel/UC5dmcTLHassVPfzDFWIoPZQ
https://www.youtube.com/channel/UCao2dEcdWeq6nVa3hMo_ryA
https://www.youtube.com/channel/UCjGjIH6-wSoH9JunceqbTTg
https://www.youtube.com/channel/UCaX-QLiSFhd82weeibVsXqA
https://www.youtube.com/channel/UCWWYR_L8oqagcmh_rTH9OTA
https://www.youtube.com/channel/UCdlZElcmim5qdxUZWPh9Ujg
https://www.youtube.com/channel/UCGDVkBVLOd2humTYu8QbUNg
https://www.youtube.com/channel/UCzYicTLNh5phKvCnC3pLDKQ
https://www.youtube.com/channel/UCKTBYG3XSCJwW3MHyi-OnCw
https://www.youtube.com/channel/UCKENf1edHSHSqaH42oxGUng
https://www.youtube.com/channel/UCVPB7WyolrZFOZ0tZDAbVhg
https://www.youtube.com/channel/UC-DfqwjyNYi5NuHSmu7EsWA
https://www.youtube.com/channel/UCKa_pfn7cGOxe7Aw0BTfcKw
https://www.youtube.com/channel/UCM4BPk9dv2qQIsg_icA02DQ
https://www.youtube.com/channel/UClOlGE-zZgVHmItLyuNxm3w
https://www.youtube.com/channel/UCy52V2ddZ73VtS8ajQ_Z-eA
https://www.youtube.com/channel/UCrk9nbw1CNYHA9GIUk0--_Q
https://www.youtube.com/channel/UC1ymT6a05cdhY3JMvT8kSDQ
https://www.youtube.com/channel/UCAJbI2r-4stMh8OhzhKv5SQ
https://www.youtube.com/channel/UCty0wkjvSMuQ4UpzgyPCffA
https://www.youtube.com/channel/UCVYYYlZwaHHKYMMqfEV0WlQ
https://www.youtube.com/channel/UCbofQtk-XjOIZFOZAtvKjqw
https://www.youtube.com/channel/UC5UI0AQpWX-21fIscVb1HLg
https://www.youtube.com/channel/UCswqnSZdkkZQ9kxpsjNEdcA
https://www.youtube.com/channel/UCcU_igT7wPkQi2_CIEVwmpQ
https://www.youtube.com/channel/UCBM5q9ZS7hN5yZKIFGesKFw
https://www.youtube.com/channel/UCNJJgLCLjbVSP7KneE3pzKA
https://www.youtube.com/channel/UCwc6XHlRy_zYhCLTf5v0jkg
https://www.youtube.com/channel/UC-UrFbSBHLWYekPYNlGG_BA
https://www.youtube.com/channel/UC2KW4XZc09okNnhGKwi7JSw
https://www.youtube.com/channel/UCLr-nY6mdg5e1YIyMdkwoXw
https://www.youtube.com/channel/UCFe3_FjoORUZRp_asDOaaEA
https://www.youtube.com/channel/UCWh6RZzB64XYSybBNqfFZfA
https://www.youtube.com/channel/UCz3Op-q-1R82Dwq9Q6ShHYg
https://www.youtube.com/channel/UCgF5NIOlzyhTdGaE0oLbV3A
https://www.youtube.com/channel/UCXc6np470oJ_oN3doCX29sQ
https://www.youtube.com/channel/UCQn5DRShiveV3LHeCOSUgfw
https://www.youtube.com/channel/UCzVfoiXiphA1Vy7hWZjUpCQ
https://www.youtube.com/channel/UCd3kXrGDSlKjRhe98owNJ1g
https://www.youtube.com/channel/UCLoIzDgJ_DOyiK6axg6GxDA
https://www.youtube.com/channel/UCn8zPM_LqmTW3Q0G69EjYOw
https://www.youtube.com/channel/UCafeSwka4XYI9bIyiXne62A
https://www.youtube.com/channel/UCGyvAuiun7ksK31124u9aYg
https://www.youtube.com/channel/UCDN9HmfgRBY29jIqMoJ4I1g
https://www.youtube.com/channel/UCqvMub5CEhQDk1typAzOH0Q
https://www.youtube.com/channel/UCycuCwK9Bgimxy2hpU15zkg
https://www.youtube.com/channel/UCOgjWL4TOr-dN2ghov3bhsA
https://www.youtube.com/channel/UCiuWHKY8wyu8AMpDH3W6iJQ
https://www.youtube.com/channel/UC7O27Si7efKYXDoFnz2zzEQ
https://www.youtube.com/channel/UCPyfM7ONGn0nLMzakb8rseA
https://www.youtube.com/channel/UCtomDhkusXaYQW1WGfgE5MQ
https://www.youtube.com/channel/UC6O-SXIFwOjqvwVnUk2xY0A
https://www.youtube.com/channel/UCqRG-7x7eqiBDeaVLfnt7kw
https://www.youtube.com/channel/UCsF2g9eLsxDmNdUXq6TyXqg
https://www.youtube.com/channel/UCUM4Ttzy1Ac8_tT15BzZ7jg
https://www.youtube.com/channel/UCOzsMDc3YYwmRIPpvaAtj0w
https://www.youtube.com/channel/UCRDX_hszt3MfnffeM0C6B0w
https://www.youtube.com/channel/UC83wkG-XY33bcWvUncLK3Mg
https://www.youtube.com/channel/UC2_8LYK100YEtshtEapN4xg
https://www.youtube.com/channel/UC4ApxoEy1Z255hOiGULqjwg
https://www.youtube.com/channel/UCggpgPUNudrFX8E3VAsrtRA
https://www.youtube.com/channel/UCeiiU5uDWeKVGFDkOyg_yvA
https://www.youtube.com/channel/UCE3ZOUjw5-rAtik0raDvqpw
https://www.youtube.com/channel/UCIpA6zgliJeLFKw8JL1bWyw
https://www.youtube.com/channel/UC7K8grNZcqvCeyQY6V9B3Qw
https://www.youtube.com/channel/UC2eDGZ0T88r3TsY0ncmIfjw
https://www.youtube.com/channel/UCG1b1hZiFhB4rueITWQNx4w
https://www.youtube.com/channel/UCt3ZmeZecHPPkXAp5Lf5KVA
https://www.youtube.com/channel/UC7IznvG-nP861Zuq_PZADnQ
https://www.youtube.com/channel/UCt6mq01oHLSLpLtXfW0fVuA
https://www.youtube.com/channel/UC44zsib6z6Lt33K-l42TcUQ
https://www.youtube.com/channel/UClOuA-4v6uE09hHHm4mMx4Q
https://www.youtube.com/channel/UCJBKNAADyc9kB9NUBWdtflw
https://www.youtube.com/channel/UCrdcobkWCfhJpq7heidk2WQ
https://www.youtube.com/channel/UCoj61YDim4HaLdEjKvD70qg
https://www.youtube.com/channel/UCeDk4_9OqNoBy0YidTmtXYQ
https://www.youtube.com/channel/UCNah1ooo2jsXRcYDXVhzYgQ
https://www.youtube.com/channel/UCWbe0nM_BT78AAAHjmGALwA
https://www.youtube.com/channel/UCWs57xSjoyti-O9xT6oKa8w
https://www.youtube.com/channel/UCcgO2OAlTp6Y4t5tu6T-xRw
https://www.youtube.com/channel/UCCQYZ_Cd4Sr0dYC8qdP6wbQ
https://www.youtube.com/channel/UC4TWOhoYQ24SqnrqJEegu8Q
https://www.youtube.com/channel/UC9Ij7ea3U3fOkJ7Xp1SMgOw
https://www.youtube.com/channel/UC359xfuux09MK5-IJJNRQag
https://www.youtube.com/channel/UC0mkbT2wVKsJn3zS__1hQhw
https://www.youtube.com/channel/UCIiUsekUtvxuOeRyFN4PZJQ
https://www.youtube.com/channel/UC2lbLi2ZbrjXqtX325PCGjg
https://www.youtube.com/channel/UCnWEeGlwZzjIz9ESyXYFdmw
https://www.youtube.com/channel/UCTd10xO-4hgpjDdt6iBL_Wg
https://www.youtube.com/channel/UCLvy2HnhebqkryisrciPm7A
https://www.youtube.com/channel/UC1rdeLrw5XovLXT6GxxFwAg
https://www.youtube.com/channel/UCgkhZF2GjWVdLN5ZE7oCR0g
https://www.youtube.com/channel/UCuJ0YgYMCF9MkbgCLG0oc3A
https://www.youtube.com/channel/UCTuUcusBC833iswvYkbkVsw
https://www.youtube.com/channel/UCATJLKP4qTX7P5ewBo_ZZfg
https://www.youtube.com/channel/UCcGPtx437bRwm4V4ajCyrzw
https://www.youtube.com/channel/UCSB5Ont1Y113NxEMHSPcJ4Q
https://www.youtube.com/channel/UClkXTkcGat9dQb99EBLvRUQ
https://www.youtube.com/channel/UCJWRpIt6kNYbdbtPBDslYgg
https://www.youtube.com/channel/UCvq7WivexlCg9CMtj7_ymfg
https://www.youtube.com/channel/UCjNWv6bLEIi_aZ4vuEaL_Ag
https://www.youtube.com/channel/UCix2V7p9_Q44nG4afgwKSbw
https://www.youtube.com/channel/UCjpCo5QMTR3-Pb32rkeb-kw
https://www.youtube.com/channel/UCF21CAzec3V2CvgMBxkhcIg
https://www.youtube.com/channel/UChmth9J1gO3f9el_B4a3sDw
https://www.youtube.com/channel/UCmsabRj8vbnGlfO-F92m4XQ
https://www.youtube.com/channel/UCZVwz8VCu1AKKcrIWgAFCmw
https://www.youtube.com/channel/UC1grpe07dv2AXSsUQuvuHYA
https://www.youtube.com/channel/UCQmZmrAi4VRmtDlm0m4EqzA
https://www.youtube.com/channel/UCRvOGaIdRWIUF5Xgs4mQQzg
https://www.youtube.com/channel/UCK9fM-PhaDmRqc1ndNjUmqA
https://www.youtube.com/channel/UCPgqsMq90eGPKWR0PsB7kFw
https://www.youtube.com/channel/UCmqJzjbzFbtcQwagFgaAWBw
https://www.youtube.com/channel/UCoWgnMJwUxpmv_7WYkJ0-UQ
https://www.youtube.com/channel/UCaRQmOK-6NOMiq9jJev5lPg
https://www.youtube.com/channel/UCpYZCddmQsW-oBzpaPloVfg
https://www.youtube.com/channel/UCGnBUXNjhu_n_ojfHl1w_1w
https://www.youtube.com/channel/UCdm_q7RjbS3lMADBY58OpJg
https://www.youtube.com/channel/UCnuwHfZvWjNRMxCROmvJQtA
https://www.youtube.com/channel/UCfauyOCcY3t7oMVEfLkeSDg
https://www.youtube.com/channel/UCULUJgQjAkqkvkqEMBV3lWg
https://www.youtube.com/channel/UCKvtbIkNYe67_3-FX5LbK_w
https://www.youtube.com/channel/UC0V1mTZd7UY2hInTnpOcrRg
https://www.youtube.com/channel/UCZvKNWGj2MA-7PvvW-vPUjQ
https://www.youtube.com/channel/UCO2GNkxkKXIBVb4qd8K5Rig
https://www.youtube.com/channel/UC7j5_8QCedk1aRgEfv-U25g
https://www.youtube.com/channel/UCpn_bo1j4yT5sbkpflIK37w
https://www.youtube.com/channel/UCFIWLpt-qfnd2PIxkAnOCgw
https://www.youtube.com/channel/UCOnfMSUnQ09eYKqMeb9JdZg
https://www.youtube.com/channel/UC2hn9CCW4NdCHSv3h1nt9vw
https://www.youtube.com/channel/UCjLkyZHdM9w46bbEZALH-Uw
https://www.youtube.com/channel/UCphrZwxasA9bnJWkzjX2Bpg
https://www.youtube.com/channel/UCZb7bmOfTCvaMLOKvvxDKOw
https://www.youtube.com/channel/UCiguW3NjzReTLeNqZthqBoQ
https://www.youtube.com/channel/UCxY5DcdQsk1aHDIbAvnGXjQ
https://www.youtube.com/channel/UCQapRSGCC8ZP9irN58hwDsA
https://www.youtube.com/channel/UCzZYlcETXcp4koEVXt7J0fw
https://www.youtube.com/channel/UCR-L6aAf_bPVF2mNPs9N3wg
https://www.youtube.com/channel/UCd7YiKcgRuXW6KRHCRBmTzQ
https://www.youtube.com/channel/UCPZ3Z6liLLk7PSvjv2G4tmg
https://www.youtube.com/channel/UC_BVnUxKtuM3rKnfQ_wGqHQ
https://www.youtube.com/channel/UCKfpw5zl2hZ6eBUr0BdCW4Q
https://www.youtube.com/channel/UCWvNlUPeNiqnTXNRtkXOcbA
https://www.youtube.com/channel/UCBC34R5H9jDWPw_YuQ4Vd0w
https://www.youtube.com/channel/UCPiyegkQK3hkr0Wq4gInvqg
https://www.youtube.com/channel/UCt-ALuVLL_XMOH8mBiqPTVg
https://www.youtube.com/channel/UCN5fyUGSL8EaDOkLEHqvfpA
https://www.youtube.com/channel/UCiSPowsVr3bzvQLZZsoO9Xw
https://www.youtube.com/channel/UCAunX_ovgbg0jYtIzKKJ_ug
https://www.youtube.com/channel/UC00zwoYHuBW9F9Z8x3MG_Bg
https://www.youtube.com/channel/UCds4UgTPX7ZilNTvxMsHWbQ
https://www.youtube.com/channel/UCBy2lNPwqEzC9lgPdkS5yzA
https://www.youtube.com/channel/UCS3_rB7eYlznyvsN-yRiQ4g
https://www.youtube.com/channel/UCNAa2NEBRXTXg03L-meiP_A
https://www.youtube.com/channel/UCl4aXM78KnNNzMlzgZH4JmQ
https://www.youtube.com/channel/UCVEe3TDDnD-MQ0QF7vSHjcQ
https://www.youtube.com/channel/UCIuBZoViJ5ZPc86aM40MMUw
https://www.youtube.com/channel/UCXns2DnwSt8AeNNo-K9bQjg
https://www.youtube.com/channel/UCWHnmUTaMwMOfE6rgllNIQQ
https://www.youtube.com/channel/UCGFht4V-TpJX4cuwbInPsRA
https://www.youtube.com/channel/UCL6_7M0JzzxQ_4sXOi7QXeQ
https://www.youtube.com/channel/UC4aTNH7jpbwNVB4y1rvIbDQ
https://www.youtube.com/channel/UCAtGEBcogzRCXpSg88n3AHQ
https://www.youtube.com/channel/UCEitppQRPKU-mpA0Cs9N6-g
https://www.youtube.com/channel/UC6zr8fIJBUFXnRTJ5wXfkfA
https://www.youtube.com/channel/UCMZoX5xm-mgLoQErCWe3Jig
https://www.youtube.com/channel/UCpKHeZqobS5qt71BthKFZbg
https://www.youtube.com/channel/UCv2BqV__9PnZBoU4uOKFaig
https://www.youtube.com/channel/UCUr2b0Q4TATjvK9iOWdRruQ
https://www.youtube.com/channel/UCuRYTLeq43EHxHanyfgNEHA
https://www.youtube.com/channel/UCGtldgXTB-zQjfHirpn9agQ
https://www.youtube.com/channel/UC2tIPIcgbHQLl2KJooQNigw
https://www.youtube.com/channel/UC60stspLMtR2CvF3yiDgazw
https://www.youtube.com/channel/UCR97yU5NCzEIvJSfHt6fy9A
https://www.youtube.com/channel/UCetFEWS2yO75eJT-WNGwFZQ
https://www.youtube.com/channel/UCdzu6uaYAFPQH-4DEVHqXmg
https://www.youtube.com/channel/UCv7ct6MrpG8U5u70yLu8JvQ
https://www.youtube.com/channel/UC4y1uHRe40KpkM-GfwGqy5Q
https://www.youtube.com/channel/UCH0tv1zJ6g6qa5d6QYgrlRQ
https://www.youtube.com/channel/UCURes72wqcEpid6EKNXWfxw
https://www.youtube.com/channel/UCbFf7xsFxQ8EzthhdQRsp6A
https://www.youtube.com/channel/UCImj5I3JFU6aZ98rVO-Yo5w
https://www.youtube.com/channel/UCewL2TI7lmroIFmTR421VCg
https://www.youtube.com/channel/UC8FHYhBo4P7_-lfHuDMfNoQ
https://www.youtube.com/channel/UC7C5FoV0AFcyNckpDXdpeuA
https://www.youtube.com/channel/UCLoBHOybH_x3PHyR90SVpzw
https://www.youtube.com/channel/UCBmUHRDV5WfP3ulbFfJVLgA
https://www.youtube.com/channel/UCJCmp3ruIIp-WwrzLik8tZQ
https://www.youtube.com/channel/UCxOiL0TU9fTyj7s6rtJy-Zw
https://www.youtube.com/channel/UCTlRIK1wDJyAJS4iWSDLyMg
https://www.youtube.com/channel/UCxqcV8Xv09D7NV7_RBkYBCQ
https://www.youtube.com/channel/UCm-zStzo2XbyzGMdztQ10ig
https://www.youtube.com/channel/UCRiYddg2blgATBxyitXwMVg
https://www.youtube.com/channel/UCCXFcl0FNqQwxn4WFz4tpqg
https://www.youtube.com/channel/UCS8IKjrl2RP8fAKTsccLaQw
https://www.youtube.com/channel/UCRMLnR-Etr9jhhdWa_P0B0Q
https://www.youtube.com/channel/UCIps-T3ikEhhIdcGvqWhdCw
https://www.youtube.com/channel/UCkTAqDlyz1RCjLn_psxryDA
https://www.youtube.com/channel/UCZtpBkyAuBhXu1VOgTRNKIA
https://www.youtube.com/channel/UCfIyi93rf75pZHVKAanJsfw
https://www.youtube.com/channel/UCpspGGqbJe9IA65gQucU5Nw
https://www.youtube.com/channel/UCuaNZ7fgpWGGCURIoN540TQ
https://www.youtube.com/channel/UCzh7xD0Jq6iIFaaSmXXP9cw
https://www.youtube.com/channel/UCatCGGzSfynl40oxd0ESwYw
https://www.youtube.com/channel/UCGYRpcmzJOnAVQVf-pRyyrw
https://www.youtube.com/channel/UCnwhijxeIaL4tDv6iBVQpSQ
https://www.youtube.com/channel/UCDhykycwRb-NibqO_yziLcQ
https://www.youtube.com/channel/UCwY3A5H3ko8qeY4oWxbwNLA
https://www.youtube.com/channel/UClyY_DjKVsIB9qjvJB5lRVw
https://www.youtube.com/channel/UC9fRPBgT_JoMUBdFnQwbfbQ
https://www.youtube.com/channel/UCMCy213QeusOkmQVDBIiLoA
https://www.youtube.com/channel/UCF7HeUoGgl-A4CRdLNZFhOQ
https://www.youtube.com/channel/UCeFaUq9PEwPfuQ0aS32_WmQ
https://www.youtube.com/channel/UC0MnFKDz63E_zzE25_SrW8w
https://www.youtube.com/channel/UCHa03CXIU00XJWvwlrMAueA
https://www.youtube.com/channel/UCaSUGPNxldNk4UgyNOy646Q
https://www.youtube.com/channel/UCa5sBvtZo5PS6WDDjEETacA
https://www.youtube.com/channel/UCIJK2veDExT4sKto7cS3dMA
https://www.youtube.com/channel/UCS7W4-HM9ggoV1FlzhHXfHQ
https://www.youtube.com/channel/UCc6rfOXMhKCIhE4es1cqzGw
https://www.youtube.com/channel/UCAdFmFzOyQLX83HjjVmtyZQ
https://www.youtube.com/channel/UCYWYNCiYTUXTmwxakVNJPWw
https://www.youtube.com/channel/UCF_ZzUWAyfrDuQxA7ol8EJw
https://www.youtube.com/channel/UCHpLCfifq9OJCphJdnkSmgA
https://www.youtube.com/channel/UCLQPY_wH9Nb40IFBclZo3Pg
https://www.youtube.com/channel/UCWSr9MR9VZC7EivaHhyI7wA
https://www.youtube.com/channel/UCqZsLPGElt1YKNw-CDwMcqA
https://www.youtube.com/channel/UCfNXRaAAsUHJerEc57Zck0Q
https://www.youtube.com/channel/UCm860TW3yHz7EUV4MIXxrUQ
https://www.youtube.com/channel/UCKL7fwi0jHkTzAUM9nHMsVQ
https://www.youtube.com/channel/UCAa5B6VKon_X3RQ50iuLjpQ
https://www.youtube.com/channel/UC_2Hf9SxbN8JF27-DfYTKSg
https://www.youtube.com/channel/UCi6A6Q5-Q1VyzfK7VBE_eYQ
https://www.youtube.com/channel/UCcMCllzpS6Gu9WAFvR2260A
https://www.youtube.com/channel/UC3rG7m0VLggudpZXtwO44sQ
https://www.youtube.com/channel/UC9-uo2lsbEGn4zMrou8EFXA
https://www.youtube.com/channel/UCb6jI_EFokhUCu4CHViLo3Q
https://www.youtube.com/channel/UCOA6fVNxGdB_5uy8TMlJM3g
https://www.youtube.com/channel/UC3GN0bSQcwbbFPhi7pM_DaA
https://www.youtube.com/channel/UCtRviow2IfbUjfoWd-mTzAg
https://www.youtube.com/channel/UCOwQ1vMG8o0F4lCB6d-UkyQ
https://www.youtube.com/channel/UCXFPD4XtQ-B6mJXnu0soTUQ
https://www.youtube.com/channel/UCd-CAn8MLIeb-SIdF5iw67Q
https://www.youtube.com/channel/UCroeUIgnSe_NsGTWClYjKMw
https://www.youtube.com/channel/UCXLrOCvGSWbLHg3EGPoT7xg
https://www.youtube.com/channel/UCYz8Jc2ireEr8yRMsgKe9Jw
https://www.youtube.com/channel/UCeWDmbAx27GO7ByGKzfD7hg
https://www.youtube.com/channel/UC9IS1ikJj_Zznbdq5OSuzew
https://www.youtube.com/channel/UCdSUQOe2RnwU12XFW9Rschg
https://www.youtube.com/channel/UCW7t6xyjYDwFtxjvGYS29oA
https://www.youtube.com/channel/UCVfIh-KXER2Pu0i7o80zdmA
https://www.youtube.com/channel/UC4OY7sZejIuHZbdV0bhQUEQ
https://www.youtube.com/channel/UC1Uf8OVd5_0iugmm_VHj6kg
https://www.youtube.com/channel/UCllj1So7BIIbjxkucm-AHbQ
https://www.youtube.com/channel/UCD00ASG2tLBdtSe31H2GuLA
https://www.youtube.com/channel/UCkke6sxHEjVU-30SUbG7i2Q
https://www.youtube.com/channel/UC22QfdAzy5WsvofYrf14u2w
https://www.youtube.com/channel/UCRM6AyB3r9CCSyQnCAwFjOA
https://www.youtube.com/channel/UC30lVi_-DZle5NdVJ0zYbhA
https://www.youtube.com/channel/UCtrL_jbzxpJxaz3E1TRdeDQ
https://www.youtube.com/channel/UCyd_Vw_kcYuoFTbO4F7Pc2Q
https://www.youtube.com/channel/UCHLXK_suXJYP_5Nqm6WQmJA
https://www.youtube.com/channel/UCpjP32sGAeARC-7tDVtSQ-A
https://www.youtube.com/channel/UC7mprAIOApBwR5UencDjNJQ
https://www.youtube.com/channel/UCpOZLgbQl4ResjqfV5jujyA
https://www.youtube.com/channel/UC2UQDNUw6wp-C19LY5Q8V1A
https://www.youtube.com/channel/UCle1xNZT8GXHzq-EFoef5_w
https://www.youtube.com/channel/UChHccQCTTDNc7dG2q1qCGKg
https://www.youtube.com/channel/UC6B6FHVlrK4aSf9yg6CJk3A
https://www.youtube.com/channel/UC9HqlKcp5FaPPQlzeVD-LxQ
https://www.youtube.com/channel/UC3idqW86sF11xwyOrVHWXhg
https://www.youtube.com/channel/UCUzPjgmJ9P7E2Eqtx35dJxQ
https://www.youtube.com/channel/UC9zYvyIMhJHbFBGK_F1eL3g
https://www.youtube.com/channel/UClWeF9FoTpM9VMXjyzcBgUg
https://www.youtube.com/channel/UCL50TbVVcwgnxdJ8o1GX0Lw
https://www.youtube.com/channel/UC6dLKPCgU3-_dlQRBboN7YA
https://www.youtube.com/channel/UC8a4XKtzH4721olIzUdCfgA
https://www.youtube.com/channel/UCKvLeMFNLvnuEzxHazWoJDA
https://www.youtube.com/channel/UC_bB_F4IimuY_iISJgMSbTQ
https://www.youtube.com/channel/UCEle7MajW4Z6G-5noNlr1sQ
https://www.youtube.com/channel/UCjTT8Lpq_KJ4oKEApAviKPw
https://www.youtube.com/channel/UCtMTxOZOrC_D2k2lHUf8vfg
https://www.youtube.com/channel/UCpoNwVnlsyX_k5GYOeuDvyg
https://www.youtube.com/channel/UC9CceC1NxOYTF3K_JVK5Q0g
https://www.youtube.com/channel/UCFK1Zqng0UuMM-XlzYtMm5Q
https://www.youtube.com/channel/UC-3uOGVmLgk47w1neoQMZnA
https://www.youtube.com/channel/UCsp9IpYGXpyW6rUSb-ZxSNQ
https://www.youtube.com/channel/UCK6ueydleAuCRjTiH6SN6Pw
https://www.youtube.com/channel/UCQAS077yueIP8aPw2Q4NtOw
https://www.youtube.com/channel/UCcMU6ESiS7JguALw_oxcopw
https://www.youtube.com/channel/UCM39WqmZbLsCTF0CK9WNTvw
https://www.youtube.com/channel/UCS_ZoScssJL3Uzy4HMTDj2A
https://www.youtube.com/channel/UCqXNGYgrpdUACGVYYs5XDHA
https://www.youtube.com/channel/UCB45wVDn-Jws4LG6Nwsr2hA
https://www.youtube.com/channel/UCxzfEe2rZfzHtBM8ptOgPWw
https://www.youtube.com/channel/UCzyq6O__B_jmbRZ_h-DlGcQ
https://www.youtube.com/channel/UCOqxA6dtCekjT6xAEJ9tqAA
https://www.youtube.com/channel/UCxnyH8uJTwwYt3ldp4m2qRA
https://www.youtube.com/channel/UCqphszlMpFuzbYP26kQKotw
https://www.youtube.com/channel/UCN6uCRpNmVqLAytxfMRCT4Q
https://www.youtube.com/channel/UCMTgxT7SFE9AllR1zamTNow
https://www.youtube.com/channel/UCPfm5zf8lalvwcivePYXA6Q
https://www.youtube.com/channel/UC2sVIROdL61qDHaABFxA9rQ
https://www.youtube.com/channel/UCJwssNpO0F7zrxkWgCGjrOg
https://www.youtube.com/channel/UC5rvwVqZRu_n-suHa3qb4JQ
https://www.youtube.com/channel/UChR-3c_5Yd9swj6QnprLgPA
https://www.youtube.com/channel/UC81Yl8HAtpztOIeXwVoSsYg
https://www.youtube.com/channel/UCJYQh7_atAgSs2mz9Et5DGQ
https://www.youtube.com/channel/UCum2w0wZ7gy6-ofvfzRhZnw
https://www.youtube.com/channel/UCophoVRw1QHjOL3GiaEKfRg
https://www.youtube.com/channel/UCK_AJDO_Oof9bCxnmGGSscQ
https://www.youtube.com/channel/UCwA7__-3JPcDeO_GOSFE4lA
https://www.youtube.com/channel/UCaugMJ8_6FsHfIQiphjHWmw
https://www.youtube.com/channel/UCu-hcAud0y588JRlbn6jI3Q
https://www.youtube.com/channel/UC2Hr-P01P8a4muiZNh3W26g
https://www.youtube.com/channel/UCWD_n6TJRGaqZA6otDhFVOQ
https://www.youtube.com/channel/UCP4XFUQgDP3en0WlY5H4P6w
https://www.youtube.com/channel/UCWFA4BnADZcPItCvDEcCcsw
https://www.youtube.com/channel/UC5AKlQz34W0-otrjbZuvhvw
https://www.youtube.com/channel/UCtBqL7f2nCjwGklaFL6Y9pQ
https://www.youtube.com/channel/UCmIC7ZN4uXd6bXhLfw2qWgQ
https://www.youtube.com/channel/UCJjVo2imh79TKWEwaXvuh4w
https://www.youtube.com/channel/UCPYHnJdmdKgyR8fh1SGbFPA
https://www.youtube.com/channel/UC5_MaRWkTwICiWomX65sfpg
https://www.youtube.com/channel/UCE8-IImALsPXPWLgVMHchlQ
https://www.youtube.com/channel/UCC398yBd6oloy9y1vfs4xZg
https://www.youtube.com/channel/UCc-vtCH-tfa1qY03--13J6Q
https://www.youtube.com/channel/UCJy_SqCUf60GnWQLWv7j1sQ
https://www.youtube.com/channel/UCezlki3cJkLBMEWLqRR_8uw
https://www.youtube.com/channel/UCfGNcEo3UwPOgFA8pLSJaTw
https://www.youtube.com/channel/UC_80MaEEY2ESaWkM0af0UxA
https://www.youtube.com/channel/UC1MQXB5A9QH5ThecO_r5fUw
https://www.youtube.com/channel/UCtYljTELrl6pptn6z8I4w_g
https://www.youtube.com/channel/UCZi1r3heIZMt-7-1pDN8_gA
https://www.youtube.com/channel/UC5FhMLr6_OXKA0Rhd9ckLVg
https://www.youtube.com/channel/UCPmPp0sbk8bqJM42zkf2X2A
https://www.youtube.com/channel/UCBKO1u1e8AErDwlBIDtLA6A
https://www.youtube.com/channel/UCFkypS_KxknDkhYhnLjyy4w
https://www.youtube.com/channel/UCEpItiE0YpuxsZS8YtmGwtg
https://www.youtube.com/channel/UCanUURJhpPSBxC5LJIrs_MQ
https://www.youtube.com/channel/UCMYJvQ3m7YmAzRNAP8vflUw
https://www.youtube.com/channel/UCT6MdQy9hrTMQyZ_7pU68Yg
https://www.youtube.com/channel/UCTT81U4lJ2PkSiHwAwinWyQ
https://www.youtube.com/channel/UCLNuIpq028qdcgBqWt2PipQ
https://www.youtube.com/channel/UCgjpqnnv-sSgiAXqk-SxzKQ
https://www.youtube.com/channel/UC4Ir5Pg1-g4IX8A4Yvbl7aQ
https://www.youtube.com/channel/UCtITEpWtL2YVOHFGB6J-j_w
https://www.youtube.com/channel/UC5b_kbIjIUahz9Yvx-qSNRQ
https://www.youtube.com/channel/UCrh-aEHKF9aiYb9V_HKTuQw
https://www.youtube.com/channel/UCjEXV6KqISTRDnL7MXVBXwQ
https://www.youtube.com/channel/UCtR3rwB7GW_G29811zBf6fQ
https://www.youtube.com/channel/UCCxi0yo3gmH5ue2U-AzAvMg
https://www.youtube.com/channel/UCh_Y0dLa0_xatN46nFugbLg
https://www.youtube.com/channel/UCO6S_TFf5EpIqjO_X29691g
https://www.youtube.com/channel/UCg8t_1V4WwVTnCBfoM6HDQA
https://www.youtube.com/channel/UC16zSM15aTdqpjRJjhCgQWw
https://www.youtube.com/channel/UCyMBwHlHKttzRAbATvYKBTg
https://www.youtube.com/channel/UCdJqZa1pNoTqZqgGvU2fd1Q
https://www.youtube.com/channel/UCjdVqu8KheuhMsJZIx0SvdQ
https://www.youtube.com/channel/UCTQdbfbFmvacVTB7P1g2Ufg
https://www.youtube.com/channel/UC5TSvWXPG5bZpiOnX0ozSlg
https://www.youtube.com/channel/UCwAt-nJprhtq16jMLN_Fz7w
https://www.youtube.com/channel/UCmp3LUbsvzAuwttUeshq3bg
https://www.youtube.com/channel/UCAVIyiyCYu6sVDk0Y2QpjHQ
https://www.youtube.com/channel/UChI9FisnjytdljgHOJCWh7w
https://www.youtube.com/channel/UCfFm2ylol83goBdVAncPLqA
https://www.youtube.com/channel/UCFU0mTPxCNGFlCrqRj6JFsg
https://www.youtube.com/channel/UC4AN4S6rF_ettR2kUlAa3Vw
https://www.youtube.com/channel/UCg0JAOsJC7eAyOWWStyXdvg
https://www.youtube.com/channel/UCInn6P2p9BAS_uxHRKo4LQw
https://www.youtube.com/channel/UCiG0vfqyFKMP1LOrMmxo0zg
https://www.youtube.com/channel/UCdTkNX7_hRFap4RyJ8M4Cug
https://www.youtube.com/channel/UCB0yUkO8ZwPSo3_-FbOmhSw
https://www.youtube.com/channel/UCgG06PVg9sM_eg0BCZ09Vfw
https://www.youtube.com/channel/UCbc56H--P17I__wrBcvO2Eg
https://www.youtube.com/channel/UCGJs-F5kC2vSPzOffTmH7KQ
https://www.youtube.com/channel/UCGEU0o4UBkVRBMrUga0KJVg
https://www.youtube.com/channel/UCiS_UZ4OWtsSGIVhTbmzJ9w
https://www.youtube.com/channel/UCBKundbigTpKpDVRZagrGXw
https://www.youtube.com/channel/UCR67RuvLiqLUs3vTIS42IlA
https://www.youtube.com/channel/UCwAn62OZ1RWGxuploRhfNSg
https://www.youtube.com/channel/UCgcSJgqN39dExT4DZl6WlIg
https://www.youtube.com/channel/UCmNxMDYkAV92ApmFm3PYasA
https://www.youtube.com/channel/UCf24A7QBYiX_bCu3c2W7BfQ
https://www.youtube.com/channel/UCIIWNMbZKFfOix7SeqiUKbw
https://www.youtube.com/channel/UCpSPNQOsfgqSlSlfiILTF_A
https://www.youtube.com/channel/UCDoYntez6SfvzYBq98VmScQ
https://www.youtube.com/channel/UCjKNuVCW6908hY0CSDOt-Wg
https://www.youtube.com/channel/UC4pTP8VNylCJoblLjT5CWUQ
https://www.youtube.com/channel/UCmYJmxwrSGjRuITb8WlWXCw
https://www.youtube.com/channel/UCXJZFrx5pT-5U_0Z2V25nBw
https://www.youtube.com/channel/UCS1Z8vC0na4cM0-42J_9Buw
https://www.youtube.com/channel/UCrTPrUy0N2JUdpRuAGlYKmg
https://www.youtube.com/channel/UCco-dG2sLGPDc67Myec96Lw
https://www.youtube.com/channel/UCZgD6rfrvaICxW_CQvyIMVA
https://www.youtube.com/channel/UC6PYBuryDZVarlxz554H5jw
https://www.youtube.com/channel/UCQAeWaBumCFzC74wXhxxT9g
https://www.youtube.com/channel/UCo4mvmSctM4p7eW2Td53aXg
https://www.youtube.com/channel/UC4GBpAs8HpkmGownVBCuvjA
https://www.youtube.com/channel/UCd0c9AhBPC5L8Bebu3z57Ag
https://www.youtube.com/channel/UCy2mlVq69KdKRA1f80DcRaw
https://www.youtube.com/channel/UCaUeF1spYZmqI9fTSXsqWTA
https://www.youtube.com/channel/UC85Xn9ZTqZWmZLHyAn-JDKQ
https://www.youtube.com/channel/UC2ZfTsfCIW3s6iB5PrwbjuA
https://www.youtube.com/channel/UCBaZO3AHBfDJU8dieTfGkFA
https://www.youtube.com/channel/UCGQzhOfMbEA5WsNM7i3JSeA
https://www.youtube.com/channel/UChyZzXC7IpV9OqnvkST67Fg
https://www.youtube.com/channel/UC6CUSoNiLYroOfHbnbEH4tQ
https://www.youtube.com/channel/UCdBldwAby1MUQqN0ONNbzKw
https://www.youtube.com/channel/UClZyW2svvLjCg4brEUZwwUg
https://www.youtube.com/channel/UCD9AXPGn4Mhl7tHB8DenTRw
https://www.youtube.com/channel/UC4HHO84GLy7bTLPkMUOk0ig
https://www.youtube.com/channel/UCmjKS5kqE4nMriabosCrd7A
https://www.youtube.com/channel/UC3spaQsKHLcKWBPdttptFtA
https://www.youtube.com/channel/UCq3oWtwd7GazZRQpyUr2tCg
https://www.youtube.com/channel/UCYomvzJgD4IDL2oWjNAPsvA
https://www.youtube.com/channel/UCi3HrMDTR3WY8KiKG-UlnKg
https://www.youtube.com/channel/UCtQac7ACmNDmyQYlutN4W8Q
https://www.youtube.com/channel/UC4HwIF5MctkCIhUjVCv5hcQ
https://www.youtube.com/channel/UCNbF_WCxiHNWi_BglENr_XA
https://www.youtube.com/channel/UCHKQF5jjzR_RTUe-bSP82_w
https://www.youtube.com/channel/UCnZRgiOckmh22crUqzucBaA
https://www.youtube.com/channel/UCqD5AaLuevYf7mAMD0WI6Qw
https://www.youtube.com/channel/UCkHhsHu0CAK6Ub2cVsP0P7A
https://www.youtube.com/channel/UCfSyykwrOvYAI4DUV4AhFbA
https://www.youtube.com/channel/UCxZSAIrrOIpXZHuz8_AGt-A
https://www.youtube.com/channel/UCFixuiS5zJlcBJEaxVZXd0g
https://www.youtube.com/channel/UCqPmvyNIhosxLRcXkjmIeQg
https://www.youtube.com/channel/UCdjMaRGymAuGIRJSOb55Drw
https://www.youtube.com/channel/UCLcszw54Tq1WpLtt96N_8Mg
https://www.youtube.com/channel/UCtYo5HREgpI_f_KTVSh5Cdw
https://www.youtube.com/channel/UCTuPn4IsmXr018wPGJhz56A
https://www.youtube.com/channel/UCpzck_tK8zvGUsY2eqFvlyw
https://www.youtube.com/channel/UC3CzLAG3FajUAoT89Rjjd4A
https://www.youtube.com/channel/UCwQj7DbPcQp5guAusyshxcQ
https://www.youtube.com/channel/UCcHXcaR3Xv9lQGgw1sqigkA
https://www.youtube.com/channel/UCsikF0l9b2c4LgTdHgL1F9g
https://www.youtube.com/channel/UCZVVRqDYnLkXfyzKmkEZEtA
https://www.youtube.com/channel/UCTynrODDcErcytee9DKiQ3w
https://www.youtube.com/channel/UCV-w_f5HZyB-zL_XMSHKr8Q
https://www.youtube.com/channel/UCPA8VoSj5bs5k5lFZH61YGw
https://www.youtube.com/channel/UCEegH1sYMg56UkgYPmcJHPQ
https://www.youtube.com/channel/UCt7tyTaDoB9Lll9sqeJEukg
https://www.youtube.com/channel/UCAZLHnh376CUJ7eGl_i-8Sg
https://www.youtube.com/channel/UCQfDxWWonAwH-S6M9ISVS3w
https://www.youtube.com/channel/UCntxrAV70uC2QLH3eqlXF_g
https://www.youtube.com/channel/UCYImfEVbqUUYVj17Zl1q1Eg
https://www.youtube.com/channel/UCV05SVZspvVIOy89fFtYX1g
https://www.youtube.com/channel/UC6nuQvY73JSL8B5CaE0ceow
https://www.youtube.com/channel/UCA49mOeGpUkmLKicy4jB5lQ
https://www.youtube.com/channel/UCgp1TxU7eqrWziNv4nkEtmw
https://www.youtube.com/channel/UC2-QmNuM5PXfV4TFXNnZIiA
https://www.youtube.com/channel/UCoh8AKa16fnvFbECjWwcsQw
https://www.youtube.com/channel/UCVMGfYWPpZM_M8HslF8gblw
https://www.youtube.com/channel/UCPWWxTAS0D0buogLWhjL9BA
https://www.youtube.com/channel/UCxgwsCF4n_DZv84yJKFBKlw
https://www.youtube.com/channel/UCoXFBAzDgp8eYumrk315YlQ
https://www.youtube.com/channel/UCnJOiYH9rDeNNHE3h9q0uGg
https://www.youtube.com/channel/UCBDDpLKc9Os5T9W_WfW44CQ
https://www.youtube.com/channel/UC1oEJKpsgLTppXzYAtxufSg
https://www.youtube.com/channel/UCkvDU4RD1Jn1FtlPaHY7rfQ
https://www.youtube.com/channel/UC3mdKSbeWGB2-JVzx0Va0Eg
https://www.youtube.com/channel/UCd9xwKv7ia9l2UDK5OXSzvg
https://www.youtube.com/channel/UCAjctMvGXvGUw9IN5oER9gQ
https://www.youtube.com/channel/UCBP4G8ILur5dUGlWZAOsuXw
https://www.youtube.com/channel/UCDQGupG7gCxLT2_Y9-8yh6A
https://www.youtube.com/channel/UCgZwrOtibRdZ9nGzmpOi1Tw
https://www.youtube.com/channel/UCiKnIFE9lj40Be5s7UZPjKQ
https://www.youtube.com/channel/UC4zmupsCHiIU8gaX53mdKDA
https://www.youtube.com/channel/UCGIMvpu4_CXLW8AdENqwuaA
https://www.youtube.com/channel/UCmkGbnsecs9QC8L_LBRdlBw
https://www.youtube.com/channel/UC94buu5MaodvFxE-golU7Kw
https://www.youtube.com/channel/UCAVlIBXrE2Uwt6p94xbffsg
https://www.youtube.com/channel/UCakEdSXMoq1-jy0dmnERGGg
https://www.youtube.com/channel/UC5k5HtyBM9Tngj3uXdBPpjQ
https://www.youtube.com/channel/UC_oGJ9iSbI2JuVzz69_lJ3g
https://www.youtube.com/channel/UCBQj5rw-hyHVJbfcYFCalYg
https://www.youtube.com/channel/UC_3iQezO_hTIDVZtzeVgPag
https://www.youtube.com/channel/UC2pyDLT1Tb0gYJvz8zczpzw
https://www.youtube.com/channel/UCuqR4akW3BsBBVY0A3f4CcQ
https://www.youtube.com/channel/UCJsM00kSlerzK3f8PLjk8Fg
https://www.youtube.com/channel/UCBsISNa2spqopfK-2SAGe-Q
https://www.youtube.com/channel/UC4_pf296WA2a79JzEEejroA
https://www.youtube.com/channel/UC0M51kY3oZa07m4FwlzfQCg
https://www.youtube.com/channel/UCTNpvE2hBdOVA9Rlh8gZVSg
https://www.youtube.com/channel/UChqsyEiL-wkXEePTxNMAAPw
https://www.youtube.com/channel/UChiNlJfhP2zi8n9tiEdpw3A
https://www.youtube.com/channel/UC3ZRlFXU0csnexACW0bZAsA
https://www.youtube.com/channel/UCgks81SbNHrtIrsOSKAaJ8Q
https://www.youtube.com/channel/UC1_Dzhr69pZrakQLMFh1aaA
https://www.youtube.com/channel/UCicqdCd7dh9MiNZTYlTRT0Q
https://www.youtube.com/channel/UC9kH-tagoaQqOVmsrsOnuAg
https://www.youtube.com/channel/UCoNBqfxPdVEcT81UNCYwRJA
https://www.youtube.com/channel/UC-UQBVj-GjmhYGKKkwkiSEw
https://www.youtube.com/channel/UChwm0AseGiIHichQxFqEdOQ
https://www.youtube.com/channel/UCkt83Et4mfKvHxW7zSE1V6A
https://www.youtube.com/channel/UCM0a08lK0MByFVTPwEUqWbA
https://www.youtube.com/channel/UCcIXyfLO3aTOR0_Nxl_c0Ug
https://www.youtube.com/channel/UCwFGmv7qOEk6_6PUfE9tKeA
https://www.youtube.com/channel/UCruFoAAwiCaqy2MgWGMhYDg
https://www.youtube.com/channel/UCGQ7wTZUg8ClYd3JDImilLg
https://www.youtube.com/channel/UCjmaaRLVMz-wcuBFDvGoV8w
https://www.youtube.com/channel/UCAOCFYzJ9-M-m3lW1JNMY2Q
https://www.youtube.com/channel/UCJlIGGULdGQmKhUzacWEEDA
https://www.youtube.com/channel/UC7gPlPf_I96A6MRuGQfI2dw
https://www.youtube.com/channel/UC_wcNTK_7DfBA2Ksb8SXu1A
https://www.youtube.com/channel/UCshoNs44SwhVv0qG0U35YLQ
https://www.youtube.com/channel/UCRXT8pWs2tHmZSl1YL931rQ
https://www.youtube.com/channel/UCZmNDO8bfsbHTLMFCMnJlxg
https://www.youtube.com/channel/UCG38sjQq6zKxaQK2ayecSqA
https://www.youtube.com/channel/UCDXyq1AZdpJm6AHwvgpEknA
https://www.youtube.com/channel/UCGsOsLL52IHLOICy_CV3Mww
https://www.youtube.com/channel/UCfXlJw75hRi02l-WhnUTtbg
https://www.youtube.com/channel/UC-tJImRh1xHgexhkRPXW9OQ
https://www.youtube.com/channel/UC8XdE_VfxATof612jQfzWtw
https://www.youtube.com/channel/UC94Btmmdq27DxqwTKuYfgjA
https://www.youtube.com/channel/UCULb3rtc0JOUXhGd4X7hjCw
https://www.youtube.com/channel/UCIYQOV0Vi6NHFVsJLuOL0Sg
https://www.youtube.com/channel/UCkfnKnsIqBRTEPGJMRh9fDw
https://www.youtube.com/channel/UCVgwi5yDzNn5ZuZNEKK-hiQ
https://www.youtube.com/channel/UClW2Qb9pEGam7dAoaVR7KJw
https://www.youtube.com/channel/UCgf5fkeXnudRJJ1W1y9NlGg
https://www.youtube.com/channel/UCsl6h0w3Bsg001ty7wR-z2g
https://www.youtube.com/channel/UCJ1naEo5u5AXREJsUtR0dCw
https://www.youtube.com/channel/UCJYyfOomJGOnBO5wxtu1rkQ
https://www.youtube.com/channel/UCTF07wdeSLhqws25jDgRxag
https://www.youtube.com/channel/UCfVNQPypOeKtAlkHAx5-3kg
https://www.youtube.com/channel/UC0ZwGSwXS_vWJUGLA1P2V6g
https://www.youtube.com/channel/UCqMuIiDXvPEwD8sA2VTTZbQ
https://www.youtube.com/channel/UC_xGPfMhettYn4_j8laZF6w
https://www.youtube.com/channel/UC5Fem-8xUQmswnIEUhRjboA
https://www.youtube.com/channel/UCRYl-j9nM_AU8aqptnlHgLg
https://www.youtube.com/channel/UCs5lbmWulXmkkNwYdzHuwMw
https://www.youtube.com/channel/UCtkiBYvN3IErMhCQraE9wGQ
https://www.youtube.com/channel/UC-8iUFnXl_5FH5M3kGqUGAA
https://www.youtube.com/channel/UCHDGwSRWGXuwwWM40nkPvBw
https://www.youtube.com/channel/UC271NL7gjdt6G7yFBSZ5Bjg
https://www.youtube.com/channel/UC1A3yAdAJN7632UIXLuFXOw
https://www.youtube.com/channel/UCFcbxlsituYqfIOk6SEen3g
https://www.youtube.com/channel/UC77-iLGZMNLYhYXNB-FsaaA
https://www.youtube.com/channel/UC26T46n0Hgwddd_LuNzt69w
https://www.youtube.com/channel/UCIcTLMgOkq6k0zEDGO_H3XA
https://www.youtube.com/channel/UC3TpLAve1DT2xcC5s24uC3A
https://www.youtube.com/channel/UCghCbEdhcgaOeHXaNswdckw
https://www.youtube.com/channel/UCMHwQqfgszCl4AZ-lGl5UFg
https://www.youtube.com/channel/UCpx5HA42aEajqno8yrYLk_Q
https://www.youtube.com/channel/UCx8fpLljOX3Qk47G7NGgJWA
https://www.youtube.com/channel/UCK7HK-7T57oqIkb6RkTpGfw
https://www.youtube.com/channel/UCA34gnI5aLh1EdSC_ccL-hA
https://www.youtube.com/channel/UCpNbMnrq3ku_WkUDJThCXQA
https://www.youtube.com/channel/UC-LCbN3i_HHP3KtJthX2wJw
https://www.youtube.com/channel/UCHqmSb96Oz3ulCTjyfPyB3g
https://www.youtube.com/channel/UC8fQuKEXPP4rzyHPP2CGK0Q
https://www.youtube.com/channel/UCv0Xskj9IwvwW-pnnx6Z4uQ
https://www.youtube.com/channel/UCAh8u0FRVmb9OVxC_sCBJcg
https://www.youtube.com/channel/UCfF4oqATdr3bVAX8fgfwk9w
https://www.youtube.com/channel/UC20uTQfXg4LC2v4RLr3j9vg
https://www.youtube.com/channel/UCfRr4wn4a9dYju6p7SRCwXg
https://www.youtube.com/channel/UCQmDjMiGlf5eZaBW6t7wREQ
https://www.youtube.com/channel/UCF2YkAveNj2pHVi9xwtBGJA
https://www.youtube.com/channel/UCFKkMItphLWDdqtc6X_dN9w
https://www.youtube.com/channel/UCyBb1DzbM4kJCJEBfwOPchQ
https://www.youtube.com/channel/UCSSslp12anNcxR989HKVBkg
https://www.youtube.com/channel/UCY-hKAghkE8I54Q157w6cDw
https://www.youtube.com/channel/UCbTxDQgxREi79XQ1L8tAjWw
https://www.youtube.com/channel/UCTldj5p-18EBtDitlv1xcqQ
https://www.youtube.com/channel/UC-Lh5OY8FQQENgcfbyiL_mw
https://www.youtube.com/channel/UC5n6uD_8TLNQRRjLAwlu8ww
https://www.youtube.com/channel/UC9P-Z3z6lykCBJT7mUP-nYw
https://www.youtube.com/channel/UCSRgoxyc-vmf5geqTwhqxNw
https://www.youtube.com/channel/UCQBT5E46ZCS0gQcw6CoaTNg
https://www.youtube.com/channel/UCO15jxK2LyzVL8Nf6RpDNcg
https://www.youtube.com/channel/UCIxv8vzCVk5kQ9fC8VkWS-w
https://www.youtube.com/channel/UCtw3MEOENbMJsoN_XtDpDkQ
https://www.youtube.com/channel/UCN7pI-LY9DaUAIJ-UaAtUCg
https://www.youtube.com/channel/UCpidCFjoSN3LcLGLrmg2ujw
https://www.youtube.com/channel/UCuE-w87OlqzZJPWzBn3hfHw
https://www.youtube.com/channel/UC3tmf4rv-y_KhFfLQGEf1WA
https://www.youtube.com/channel/UCYplG1D9L2qlNhZUwwx2poA
https://www.youtube.com/channel/UCINwB6JW-LzOimBv2bidJnQ
https://www.youtube.com/channel/UC5NHNFausTjHEQdxjtu3fgQ
https://www.youtube.com/channel/UC18Mm-WL_PT1Sk1zjKRILfw
https://www.youtube.com/channel/UCXtuBLWUJPNxlgvdri-BQ9g
https://www.youtube.com/channel/UCew0_9UfLCXCm7s6WS6WfXQ
https://www.youtube.com/channel/UCBpv-j4_8k7ahKLzEV4yWew
https://www.youtube.com/channel/UC7hMJmFbj-pvnGo2mweqtOQ
https://www.youtube.com/channel/UCHADZxt_VJE-NyyLzGImb8Q
https://www.youtube.com/channel/UC2Uce6ZnWHUGYvvD-2Ii2cA
https://www.youtube.com/channel/UCZ2ZK-fhARl-jzlj3lRjXZA
https://www.youtube.com/channel/UCbibSwdtgULuq4oQQDoyyrA
https://www.youtube.com/channel/UCz8wkTuUXt1AWS7ir0yyPCg
https://www.youtube.com/channel/UCQkqOgpgZbo-j53CxhMnKJw
https://www.youtube.com/channel/UC8aEw2dVeQlKcMzHDNN6UGA
https://www.youtube.com/channel/UChtsgcGMWNJ-f2XiWkSDwKA
https://www.youtube.com/channel/UC9zVtWvSoEtjLXXXgtZFYhQ
https://www.youtube.com/channel/UCRxPw1CNHseWUvNCMk0bfwA
https://www.youtube.com/channel/UCB5mqmJu6NT3wPQt1GfKUIg
https://www.youtube.com/channel/UCFGk-8c0FtJ3CGYXrPf8-iA
https://www.youtube.com/channel/UC7yQ5NpObA0VLIsrFJbNZsA
https://www.youtube.com/channel/UCZ9CrdIhPBa5kv1Bsuv5pEg
https://www.youtube.com/channel/UC9mcpTiesOUTTbetkjHSoAQ
https://www.youtube.com/channel/UCBOaKpUpYwMG4CSTswJyzDw
https://www.youtube.com/channel/UC4CW6YEAUKaMAUe-dgMMOGQ
https://www.youtube.com/channel/UCWox5SNI6EjovJGH3yxljwQ
https://www.youtube.com/channel/UCtz1P1jetSVG1QRZHqBy7nw
https://www.youtube.com/channel/UC1qlT2teWT8i0VuwDKVVnRQ
https://www.youtube.com/channel/UC4TYmctmWlS3c6mEP6EW1kQ
https://www.youtube.com/channel/UCEYQWTy25pDQfE7_lm4K0Yg
https://www.youtube.com/channel/UClaf0NSdYFFxsgfE9LKr4nQ
https://www.youtube.com/channel/UCh7Pjl7wdPWXWyvgFBuT7cw
https://www.youtube.com/channel/UCu7t0uzkuKBlcUC04JCSmHg
https://www.youtube.com/channel/UC-_uaEWooiSkrugzU_gKuww
https://www.youtube.com/channel/UCtKKgKqy8eaVM6__ksU4KVQ
https://www.youtube.com/channel/UCBUX4ZNsrJUoyIch_Z-idRw
https://www.youtube.com/channel/UC8ZhEgSVqHmHr_Tk5f0AXLA
https://www.youtube.com/channel/UCUlFfNuDNevRhvdGylUM7TQ
https://www.youtube.com/channel/UCksDWoGOhRVJokrBQ6qIltA
https://www.youtube.com/channel/UCTYhe8OnyyjTe5wMNweUHMA
https://www.youtube.com/channel/UC-RwT3ODqVMprgzQPLPXEVQ
https://www.youtube.com/channel/UCw4Kk7cOKZVSOOrdKEHNvOg
https://www.youtube.com/channel/UCeRPcVwS3BtZRqaBw_ka1RQ
https://www.youtube.com/channel/UCt_TpzPfJTjIXpci6vzivZw
https://www.youtube.com/channel/UCHXRhd7mgtQiYHU14EIuBzA
https://www.youtube.com/channel/UCha4mkFUmMsXVO8ZaN-w08Q
https://www.youtube.com/channel/UCIH0gL63wrYbO_UGdhAokhg
https://www.youtube.com/channel/UCLrLDBl6YNxsOyYgFKvJEnA
https://www.youtube.com/channel/UCQBAv85WaT6IdqcP1C7o-YA
https://www.youtube.com/channel/UCiqzH0DokxrJcv_cmuuxong
https://www.youtube.com/channel/UCLp_coCH4Ar6Vkh5k_IQWXg
https://www.youtube.com/channel/UCcW_4a_aYqvftOQLUDIK8uw
https://www.youtube.com/channel/UCVwCDymOHdzMQ9NtodB7IlQ
https://www.youtube.com/channel/UCRjFZ403qQlObplib6DSVDQ
https://www.youtube.com/channel/UCMK5toDVf59h7IhEuB1bG0w
https://www.youtube.com/channel/UCJvHqVgI9FFv_9m6EQRWPsQ
https://www.youtube.com/channel/UCrCNFLPDLjQTACU84yRpyOA
https://www.youtube.com/channel/UCo4QHcBK4KRWpqT_6xdFfHQ
https://www.youtube.com/channel/UCjGJl7rfCkfU77eIogEGusw
https://www.youtube.com/channel/UCSLGF1N1hSPwrQRHi0fy8qw
https://www.youtube.com/channel/UCrWaL33DkOFHP9uP5YSCJCQ
https://www.youtube.com/channel/UCJKhunGHrvoowgpPquTI__w
https://www.youtube.com/channel/UCuhPNsX6rd_v9GPH-_t-43g
https://www.youtube.com/channel/UCFBgJrgo1pyiEUt4XSIId5w
https://www.youtube.com/channel/UCffsoM8wc8GEuczaXJV5oeg
https://www.youtube.com/channel/UC_ArB-cpB7c8fVupZRdGNqQ
https://www.youtube.com/channel/UCJz2ibsd4Yqd-0yQEofKYNw
https://www.youtube.com/channel/UC7lSv4I4sLjBBeYozH8DCGA
https://www.youtube.com/channel/UCHFnTU9w44WIAhq6ZCg-zXA
https://www.youtube.com/channel/UClpyA0di3QVP03S0WWQlZVQ
https://www.youtube.com/channel/UCUC7PdmDSfv5Xo9klBYI4vQ
https://www.youtube.com/channel/UC7qsAbZlGDpS8_zhSQYmjPA
https://www.youtube.com/channel/UCFz0VJ3sjNwZQpXPrpZhvuQ
https://www.youtube.com/channel/UCsLl6L1L_bvD_fYTWYriOPQ
https://www.youtube.com/channel/UCQmZIIpzCjWTyCQRiOQA9Hg
https://www.youtube.com/channel/UCzgGvZjQmQpXag0gJGbvymg
https://www.youtube.com/channel/UCl71vFRsCK6R7-y0P3e1Ctw
https://www.youtube.com/channel/UCdkE1acld7OUNofAikcnVsA
https://www.youtube.com/channel/UCDbo0U0W3sLSalO6vP4G70A
https://www.youtube.com/channel/UChVz478-oNh8TmsG2Xk8FnQ
https://www.youtube.com/channel/UCL4KS8Sdoms5nwxSdIrsJmg
https://www.youtube.com/channel/UC0edTWu6HhH-9N_4hjfbzfQ
https://www.youtube.com/channel/UCdfZXM5MROoGai0hro95nXA
https://www.youtube.com/channel/UCw5ju8Yisj_Tfb0CXKv4xvw
https://www.youtube.com/channel/UCOrBBTCFN6EOwuqkQk0pX_g
https://www.youtube.com/channel/UC1XMOeXSd-Vs7YcILvf36RQ
https://www.youtube.com/channel/UCy7hLoZz-KDReLJTH3hxR8w
https://www.youtube.com/channel/UCdIL41PazvrOJ-CSC4StW1w
https://www.youtube.com/channel/UCslfnQg4kZ8uzWCoNoURwVQ
https://www.youtube.com/channel/UC9dAdT5xAFK9Dsp7OQVtG4w
https://www.youtube.com/channel/UCs2C8T6ZGDBDGQddIyCsk3g
https://www.youtube.com/channel/UCjp-0y93cJv5wOD6E2KFUsQ
https://www.youtube.com/channel/UC_3ZnNEMtEQVAtkZZl-3JRQ
https://www.youtube.com/channel/UCXHJeBF5mQZfcgha7TOyEhA
https://www.youtube.com/channel/UCOG5MtisTNhbFT59wyhlUjw
https://www.youtube.com/channel/UCl2eqlbWDalK2YMZQYlDyEA
https://www.youtube.com/channel/UCd-Aw3T04oDgTcE9-ldAKug
https://www.youtube.com/channel/UCg-G-wJh0rWAt7CnZQ729cA
https://www.youtube.com/channel/UCc7oImcr0w1CYZZVk68xhiw
https://www.youtube.com/channel/UCVaBAAcyTLA6x1HQCUZ4BIw
https://www.youtube.com/channel/UCuPxIHvBKZ856JZcrmDkq3A
https://www.youtube.com/channel/UCdmYaaFd0C_0MIAcMSIybQg
https://www.youtube.com/channel/UCB9Ac9JJZg1ntawyc4L8DfQ
https://www.youtube.com/channel/UCxUm01p84eosEA_KDUCTJuA
https://www.youtube.com/channel/UCtexrsOeCyHBtdRti9BuIrA
https://www.youtube.com/channel/UCK5sJB91PCiyHrmnUN0LZ0Q
https://www.youtube.com/channel/UCg9eXM_dhnbMeH7aW5ibSLA
https://www.youtube.com/channel/UCMua9eZn4eOg8Km1rDlXDOQ
https://www.youtube.com/channel/UCdKDCkR2FePFbp5dbl9W2uA
https://www.youtube.com/channel/UCFaZkfmnDjVnB28dJ9duDGA
https://www.youtube.com/channel/UCSNgWrXc_TBa0V_nymd1ABg
https://www.youtube.com/channel/UCW0m-HVcJnlEv8XbPIYCRzA
https://www.youtube.com/channel/UCy7p8KSWAp1BT1XnyLyYjPg
https://www.youtube.com/channel/UCWCeykVdZ1mdoLKgJrGNXlw
https://www.youtube.com/channel/UCv9pBuuTUh2v7HMD70GQjKA
https://www.youtube.com/channel/UC7JbRUSib72Hj-r7wdvNusQ
https://www.youtube.com/channel/UCZ9yLVCHQrviNdDdtDYwYTQ
https://www.youtube.com/channel/UCjfQYlm9nIgF-TT3UsX8j_Q
https://www.youtube.com/channel/UC_YMuUxjWlef0ZMvKJjmmbw
https://www.youtube.com/channel/UCDe7BxWcGYOOn0fDS8f9_TQ
https://www.youtube.com/channel/UCiyPRli1fAdd1USpL-LyiLg
https://www.youtube.com/channel/UC0rF8ab96x38ezh5FO-O5WA
https://www.youtube.com/channel/UC2AKWFHbESXuNWVGsThhEhw
https://www.youtube.com/channel/UCetaLZvEXkRtBOA4nAYz_yg
https://www.youtube.com/channel/UCqmUA-eS7Kh80XsdUT8yfng
https://www.youtube.com/channel/UCY8TLhGFzk6uxm_2nos0R2A
https://www.youtube.com/channel/UCOYgFV9UNFq_to-8lXw8nmw
https://www.youtube.com/channel/UCr9DEwGaNnX1AoVE_XXaddw
https://www.youtube.com/channel/UCwCkJuShKemd22UePRrGEwA
https://www.youtube.com/channel/UCWD6VjaTjllnLi3mjDh4-5Q
https://www.youtube.com/channel/UCxUZfvjv1K-PIpEJSwFW8cw
https://www.youtube.com/channel/UC9ZXbIIhuU3oDnxoOKr_K2A
https://www.youtube.com/channel/UCjZlRYi0oiGs29dTpkrqt4g
https://www.youtube.com/channel/UC0a01tccXEyQ2EnkcVLfg2Q
https://www.youtube.com/channel/UCOcedFrOyMdbG3ANEhHxnuQ
https://www.youtube.com/channel/UC47nFyP3kuHs2uXjh63qDVg
https://www.youtube.com/channel/UC8ln9orTV_NKy6YaI6n3P4Q
https://www.youtube.com/channel/UCZCxW3qb2uTRFN3FfqUBFTg
https://www.youtube.com/channel/UCu4X7gbelTIrzSdypBRrXoQ
https://www.youtube.com/channel/UCR8l2eIqv_hCVKnLKdihyEA
https://www.youtube.com/channel/UCTZK5HiR5ROI-aGPKA9Pn_g
https://www.youtube.com/channel/UCDYKgAObNeP3HZvfVYSEydg
https://www.youtube.com/channel/UC5mKmnHXWp0ikiE9N4Vi_dw
https://www.youtube.com/channel/UCI4jcRnq1pLB6IbG7anxGtg
https://www.youtube.com/channel/UCilRnBZvgcGnJBaaUi4AQtg
https://www.youtube.com/channel/UCgGzVWb6ipR5JcmQedXhJXQ
https://www.youtube.com/channel/UCIc1AnkG7zT1MBdyBBYybcg
https://www.youtube.com/channel/UCV9ml8S_VsyQ-qE_P2xWcZg
https://www.youtube.com/channel/UC0BomNXU-RlDbXUTHw1qVeg
https://www.youtube.com/channel/UC_bY25y-4EbnNJhJ7N8ZTcQ
https://www.youtube.com/channel/UCdN66GDhctqfuuNocCDJA1g
https://www.youtube.com/channel/UCSfjRbQvYavd6xDtKtWGOjQ
https://www.youtube.com/channel/UCBzi__MpzYbLTUi-pXL4KlQ
https://www.youtube.com/channel/UC8sKqac-dFrYBVUTMEfosNg
https://www.youtube.com/channel/UCVnjCvtpJFohlZVv0qJP-VQ
https://www.youtube.com/channel/UC-F4HEw3zKxSt0HW9JXryLg
https://www.youtube.com/channel/UCoESIaXo93To76649yRMDqA
https://www.youtube.com/channel/UCvrG1rF7owBPYw_r1QrvvvQ
https://www.youtube.com/channel/UComtJk3kluxqmRyUv20Sdyw
https://www.youtube.com/channel/UC9vEMGlKxK2LxU39AlTMyZQ
https://www.youtube.com/channel/UC1-B1YytWHoA2tnyN5GUenA
https://www.youtube.com/channel/UCXRm4IdBqkFdYfYaZRVJcDw
https://www.youtube.com/channel/UC0k-pLV5LETr4jzHNy5WqBA
https://www.youtube.com/channel/UCt7UChrdZCBKUkw1fEXubzQ
https://www.youtube.com/channel/UC_RFpi5sU1vT-JNZOQRWOow
https://www.youtube.com/channel/UCAeScw7r156gfl2R81oh5Gg
https://www.youtube.com/channel/UCqkYR_OB2ZqvxGXs04IYblw
https://www.youtube.com/channel/UC0X_goyRIDVFVOBJhal-AZw
https://www.youtube.com/channel/UCMmtBnFFGJ4suClGMTaTJig
https://www.youtube.com/channel/UCTfPiwL0eezp18KH5wz-YxQ
https://www.youtube.com/channel/UCTeqWj17xX8hFUa3Afs8l3g
https://www.youtube.com/channel/UCVisiOGCPDPN4SWqbn6Hyxg
https://www.youtube.com/channel/UCcznISKUwhqNrukVAAVAfAw
https://www.youtube.com/channel/UCDYQka1o4b8nFjmsudvkLRg
https://www.youtube.com/channel/UCk01WLNAHPsNFDrCHWChSyA
https://www.youtube.com/channel/UCDGT02LbhUYtEdU9jm2mBeg
https://www.youtube.com/channel/UCrVYJHaD3KbB7CbJAqnhNTw
https://www.youtube.com/channel/UCnYFAfzcooKJvr4PcpGbL6A
https://www.youtube.com/channel/UCZpQDEQbprPwCzvqhFDoV9A
https://www.youtube.com/channel/UCGiiVMWSei4UARAYYYLz0WA
https://www.youtube.com/channel/UC8c2G0IJN8uFd3_UffW2f5g
https://www.youtube.com/channel/UC7U5mgnENIqsNqDoNyHK2PQ
https://www.youtube.com/channel/UClzEnw54ZMlvIw_2gxSqZOA
https://www.youtube.com/channel/UCewSV6iv_ibYTRM190a2I-A
https://www.youtube.com/channel/UCaIyRGdRqfrS8p5JqtQdXTw
https://www.youtube.com/channel/UCr0ulEGMrm8gGBRtLxIqOOQ
https://www.youtube.com/channel/UCBrMk3fwWnWLudNrbEaS2QQ
https://www.youtube.com/channel/UCXm08D-S8qusOJ5DO5Ll_0A
https://www.youtube.com/channel/UCq0geJEggaJNfDtpbxM8TPg
https://www.youtube.com/channel/UC3D1x6Kql_3afQ3MvJEgY0w
https://www.youtube.com/channel/UCHf3XNyQsTZcWPQV9WS-nXA
https://www.youtube.com/channel/UC5oBx9vOjz5vDmx1ovF-z9Q
https://www.youtube.com/channel/UC-I_duRcEwZrLUmdJQRZ_mA
https://www.youtube.com/channel/UCkf6z10vAAcJsZVX0_1zNsQ
https://www.youtube.com/channel/UCFApB8D_1wWKhzNGbwp6VRQ
https://www.youtube.com/channel/UCEYfZvk-B405asQMNxrSSXA
https://www.youtube.com/channel/UC4C34BN7TqTB4s3DpXeTECg
https://www.youtube.com/channel/UCkN__XGM2usEGolhGKTqXyw
https://www.youtube.com/channel/UCieapHQCk-Y4zDKQ6I1XZKQ
https://www.youtube.com/channel/UCuyMhdRvBC3EtfDokPJr50w
https://www.youtube.com/channel/UCiAICIsHfVksNApRtRNvFHw
https://www.youtube.com/channel/UCqfF4o-1CcOIjmm-5S2xHVQ
https://www.youtube.com/channel/UCPNr1RLtLwPY2j4-1tvEdqQ
https://www.youtube.com/channel/UCrMzyGRJYuSLfUZwm1xEuNg
https://www.youtube.com/channel/UCJEutDT_YBDrELScpNlDSeg
https://www.youtube.com/channel/UCwnpYKAXw7m34YyyfMAZxMQ
https://www.youtube.com/channel/UClevYTz7bITyoSjYeUWqm5A
https://www.youtube.com/channel/UCUYaiGs8FgckjOzpz74bsbA
https://www.youtube.com/channel/UCTsxWLXYYxLauatC4mKGpFA
https://www.youtube.com/channel/UCoXZhtGV_t1ooQrdhwb6zEw
https://www.youtube.com/channel/UCflS0IWhVAEaIYV0ZXwwCNA
https://www.youtube.com/channel/UC7Oo2Meb6jRz2vtrQJ-L6IA
https://www.youtube.com/channel/UC9TfXH7JZRWvDV-FMJwM1HQ
https://www.youtube.com/channel/UCEUchLjLeGR3OcNJKbHggeQ
https://www.youtube.com/channel/UC_TtdTVtI-BWm7krAwPvFCQ
https://www.youtube.com/channel/UCd3y4jDLqr41r5zh97nW19A
https://www.youtube.com/channel/UCQRungAfuAiHOBpI0Uhb8jQ
https://www.youtube.com/channel/UCs8S0C_4sf9jWWJd613RYCA
https://www.youtube.com/channel/UCmkGJx1xGijQPmbDlfMhOrw
https://www.youtube.com/channel/UCEazpFGpAghOWoteFMnlbCQ
https://www.youtube.com/channel/UCRHXShKuDabJTzype0CxxDw
https://www.youtube.com/channel/UC6CYvtzXwtfy8qT_kdDfaDg
https://www.youtube.com/channel/UC7lx3p5H0oBKdLKXAd_rZPg
https://www.youtube.com/channel/UCaDy1l4rdQJe_A4Z4hWBesA
https://www.youtube.com/channel/UCHxhn0mPFfHGpu_45zpKAuw
https://www.youtube.com/channel/UCWhoQqw2UHSVfDb3FQiFGgg
https://www.youtube.com/channel/UCP5JFJiYHuRp3NTtixDEc3Q
https://www.youtube.com/channel/UCe3bpumKGb2CMRkeAP61XSw
https://www.youtube.com/channel/UCeIsaxRG3oCAsejbrn53Kkg
https://www.youtube.com/channel/UCoNYj9OFHZn3ACmmeRCPwbA
https://www.youtube.com/channel/UCDk4Jv_Q64gpKP4JJ2FhOHw
https://www.youtube.com/channel/UC6Iv92nZE21XWt0B1ZTCd6Q
https://www.youtube.com/channel/UCKQVSNdzGBJSXaUmS4TOWww
https://www.youtube.com/channel/UCLG2sbIo3Rktb77h6q9yuDw
https://www.youtube.com/channel/UCnnp2fWa77PP2h08T7WAzzw
https://www.youtube.com/channel/UCxInriP-JiroBE6ktMzm3AQ
https://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig
https://www.youtube.com/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ
https://www.youtube.com/channel/UCTdwdrpdFAW6ExPMhCaxDKw
https://www.youtube.com/channel/UCAHVcpAcTBR7HPJOjfKbSTg
https://www.youtube.com/channel/UC4UTHUrJXIqE1at_I-vZcRQ
https://www.youtube.com/channel/UCdqA21Fp2DELyZ0jlArjDwQ
https://www.youtube.com/channel/UCJEPmk_8MGZ2MMh-ovu96Pw
https://www.youtube.com/channel/UCVLYk3KU1cPuoCgxhV1KMNw
https://www.youtube.com/channel/UC2L8MRMkV_97eA2KCjHKPrA
https://www.youtube.com/channel/UC1iTi0TW9_UZeYL2dM6OhHQ
https://www.youtube.com/channel/UCGZLi0REiJOZAKCmBAZ7nKg
https://www.youtube.com/channel/UCJ0KVle-6k23o4X_DlUx_pQ
https://www.youtube.com/channel/UCPApjKbzaa7wDBKkn5yl5RQ
https://www.youtube.com/channel/UCId9ZcO0KLs4teYv7b7omnA
https://www.youtube.com/channel/UCfhGOkyTOb0Pc8ZL6kKTfNw
https://www.youtube.com/channel/UCVhVlRgeR9jRQlZW3ivfYyQ
https://www.youtube.com/channel/UCST1HquDZvUdo2HROTmAgxQ
https://www.youtube.com/channel/UCy9QO3pm_VhaEeyMpBOv-fA
https://www.youtube.com/channel/UChqBGo5TMFOiq1ldcaYsO_A
https://www.youtube.com/channel/UCauCgfc5CwafPernPNP0IGA
https://www.youtube.com/channel/UCKlEphWhJ8c4trq2JKc4RKw
https://www.youtube.com/channel/UCV1weUWqAhg199-Rzn8geig
https://www.youtube.com/channel/UCJ8KVdbef3ATyPQHAJPEhFQ
https://www.youtube.com/channel/UCobZAp9S9Pa16774D2VsTGw
https://www.youtube.com/channel/UCJOSUJrq7tNe30KX-L-A0mg
https://www.youtube.com/channel/UCegxEzt4BpkrGo3JCscrJJA
https://www.youtube.com/channel/UCxBRxWv-whTsS7oLQUdl-1Q
https://www.youtube.com/channel/UCQ4h_yRpzVaeqP5g0irOpMQ
https://www.youtube.com/channel/UC4N045ddy5cL2qugylaH6pg
https://www.youtube.com/channel/UC66RuKoMXcnyrKDsKzEOkUA
https://www.youtube.com/channel/UC0pwmWPMS3eQ41KDhcEfvgg
https://www.youtube.com/channel/UCS7FykD6nUYB8s-qY03m43Q
https://www.youtube.com/channel/UC731f0CxVOSq5dwnLceS0xQ
https://www.youtube.com/channel/UCGRbWZGq8xpSw-2-pjLjHAg
https://www.youtube.com/channel/UCj5qM1RhJVcBWTgM8JpR3cA
https://www.youtube.com/channel/UCvuHQot9DtmZg6O5V1Ztsbw
https://www.youtube.com/channel/UCJyg8UaP9qBDGPS6Nt0-cfQ
https://www.youtube.com/channel/UC5M6c6nboioNkCBngmD-Pew
https://www.youtube.com/channel/UCMM1IQdOXmN6h_0MGFvLmmw
https://www.youtube.com/channel/UC1-XTj1gI5nYDldvzzLo0Rw
https://www.youtube.com/channel/UCsfEFLVZKxeEgKnIlRfYmfA
https://www.youtube.com/channel/UCBSW0gow0S_-KxevZA243Cw
https://www.youtube.com/channel/UCzWOk2a9B35c1EaGS8C6kDw
https://www.youtube.com/channel/UCM_PuUQK9WkChkgvmXkboyw
https://www.youtube.com/channel/UCEMUkSqcnkaHs9OVA_zTYBA
https://www.youtube.com/channel/UCXdI9QK09I8SNVs0Lamjnag
https://www.youtube.com/channel/UCgMJrRgSpaBCD382UznTYrA
https://www.youtube.com/channel/UC6Zo-JyLA9a4vYerWG0HO0g
https://www.youtube.com/channel/UCGJqdpVcUMa2oWfKcaKrWBg
https://www.youtube.com/channel/UCKWQf84QIEn5g09P__yXYuA
https://www.youtube.com/channel/UCNwLWzuI0cZFMt9jN-uu_eQ
https://www.youtube.com/channel/UCiGFAZ0JhxsMf5Tqd03mD1w
https://www.youtube.com/channel/UCmFzNgDuljhZxGMnc7aC9og
https://www.youtube.com/channel/UC8IU50WYxw846V_xKbYAfug
https://www.youtube.com/channel/UCKRckuHeTDstXy1aLpXo2-A
https://www.youtube.com/channel/UCBXfSkd7xibqTQhjF-yrPlA
https://www.youtube.com/channel/UCkOGSyPh38sf2VUkXOeMwrg
https://www.youtube.com/channel/UCC0KQW0YHVnHEAE17ed_16Q
https://www.youtube.com/channel/UCUCmasHnT8wvvcJXc9PYfOw
https://www.youtube.com/channel/UCShAsFu_wZwZT_9Oxt40r-A
https://www.youtube.com/channel/UCLlHFd-68bYAUTNmztT_QQA
https://www.youtube.com/channel/UCoZscSBajnf_6hH5YTwYzBA
https://www.youtube.com/channel/UCYu6UJ47nbJhSKQTsrSWMIw
https://www.youtube.com/channel/UCUeIXetK_5K9Gq03Zkqrazg
https://www.youtube.com/channel/UC8eaNxduosOMlHClhejnCHA
https://www.youtube.com/channel/UCg_SR4myvvVTRlxHVW7AlEg
https://www.youtube.com/channel/UC7w-t4Xwpn_sZNJhscQILBQ
https://www.youtube.com/channel/UCnOfEby-ffsF8Ba0rbSiMDw
https://www.youtube.com/channel/UC5-sRch06XJPOww24UtvhGA
https://www.youtube.com/channel/UCtSUDIAAZjL4etJzqlqAJKw
https://www.youtube.com/channel/UCeEWKc54saWwhZ0L-2HI7AQ
https://www.youtube.com/channel/UCCs9ysL259cqnzfLlsK4I0g
https://www.youtube.com/channel/UCQeQKazeZndUZDHo6JFK5YQ
https://www.youtube.com/channel/UCV6FItfp9E789OYECtHceXA
https://www.youtube.com/channel/UCaD2-ylHSfv_VBURxlrSgoQ
https://www.youtube.com/channel/UCj0_gs7hv7rayoFpcyxWYJg
https://www.youtube.com/channel/UCdRNZQj9Ux6LKSVuBZXO74A
https://www.youtube.com/channel/UCYZZIi7dfdI2HQVVH-rw0ww
https://www.youtube.com/channel/UCJwXd2Y_sJ2HYTOulbxDwwQ
https://www.youtube.com/channel/UCr4Ljjtz8AWDb5qC_yFyT8g
https://www.youtube.com/channel/UC4Tf6JtDtj4Mr9Kpg5bja1Q
https://www.youtube.com/channel/UCPEwsXH55h9YqXUgeARFPRQ
https://www.youtube.com/channel/UCNIOReI2ypfjT8HsFkTG0Rg
https://www.youtube.com/channel/UClZB3tfqatgvdVB7Ck1dEBg
https://www.youtube.com/channel/UCGx-WvhX35CuqP0G6fVquQQ
https://www.youtube.com/channel/UC2FdyayZ_eaDhNe0Kp6HK6Q
https://www.youtube.com/channel/UCH6gcsRGgVWOWkv7xLXLEuw
https://www.youtube.com/channel/UC5vcyVibAsc-fC6itfqRczw
https://www.youtube.com/channel/UCSuX5k8xWIzg67gbDEdYZow
https://www.youtube.com/channel/UCsgXIOF43ZqgcmLwnKjsndQ
https://www.youtube.com/channel/UCPK8Tm7P3fw-DyKdesJ15Sw
https://www.youtube.com/channel/UCUzfKol5pSpFyotTjpAWbPA
https://www.youtube.com/channel/UCNbhvDQuOBAIHUWGZZ9JEIA
https://www.youtube.com/channel/UCCYZQQxiAJVJrkWkO5ukeiA
https://www.youtube.com/channel/UCqREUocuAIrdUDyXbkxniVw
https://www.youtube.com/channel/UCiUB5LyeiXgLpMbGPGJx9Mw
https://www.youtube.com/channel/UCRLcSMAMm-h2oGJDYX_bH0w
https://www.youtube.com/channel/UC85DaBbxbyDC0y-i2D09Vng
https://www.youtube.com/channel/UCEjO5C1eCsrZ_K9tY4xBi1g
https://www.youtube.com/channel/UCe_iKSyZto6a17TZN39_SqQ
https://www.youtube.com/channel/UCn-jtPSS5DDrK5XJ4otYnAg
https://www.youtube.com/channel/UCxosRj0ESXuHVDhMq2H92EA
https://www.youtube.com/channel/UCOKZ9rCIokVTKNljgmmqRWQ
https://www.youtube.com/channel/UCu6SEbgN06FR5OSNnH0BX5A
https://www.youtube.com/channel/UCcV0_AUAe7JIFZj_RlN_GfQ
https://www.youtube.com/channel/UCqdL4ODZWaeCgcw1RtmHkQw
https://www.youtube.com/channel/UCrwz4ot1WVwENqXSIQeB3dA
https://www.youtube.com/channel/UCI1mVJyrTw3cIBPJ9WNuQLA
https://www.youtube.com/channel/UC-vof-aVN7j0C5vTNseX8zg
https://www.youtube.com/channel/UCwp3169FhrAL_M2EuK-mVaw
https://www.youtube.com/channel/UCttXfj90iLoEVli9U_TxMBg
https://www.youtube.com/channel/UCaFxLWaaLzK0OjXHTg4uTcQ
https://www.youtube.com/channel/UCkXeRrqTY0Aa3vIlqp0XEUw
https://www.youtube.com/channel/UCQyFm2RmsevE1xNYyW41JBA
https://www.youtube.com/channel/UCH7RWMW8qkXf2qKwS9cXpHQ
https://www.youtube.com/channel/UC7yqowrsdolipG3WpJobBIQ
https://www.youtube.com/channel/UC9ybr8akTqoAJ3ZFmsorWGw
https://www.youtube.com/channel/UCxkzofCE3XPXuxvPSACwSUw
https://www.youtube.com/channel/UCeueVS1vrwbV9FpsnQ9Wplw
https://www.youtube.com/channel/UCGP1wPtitMJCL0v22xoFFiw
https://www.youtube.com/channel/UCzR-MwBshbNQUZ94EybgZRA
https://www.youtube.com/channel/UCNszPIg0PcyxnNr1BeCcNXw
https://www.youtube.com/channel/UCLAGCTbOGqsiWYAwToXbQnQ
https://www.youtube.com/channel/UCZpH5jdgDAGy4b_fG6Ecm5w
https://www.youtube.com/channel/UCxtlLowHjPS6jAd-pLPUgFQ
https://www.youtube.com/channel/UCoOGZwJrlzivsfPjqGwP1YA
https://www.youtube.com/channel/UCCo6USYQ_VoFN3kS1Vk7vUw
https://www.youtube.com/channel/UCORUmnIfyTFkF2GCOUoTyOA
https://www.youtube.com/channel/UCXMEezhMw5ZHX9beGFy9Yrw
https://www.youtube.com/channel/UCGAaeUclhgnKHExQF6C0NLA
https://www.youtube.com/channel/UC67qtGR2fG66NLWdlXbvUKg
https://www.youtube.com/channel/UCjBYDMY_I99137RhOAiHxCg
https://www.youtube.com/channel/UCJq-bnG8iO4xMdflMoyVKZQ
https://www.youtube.com/channel/UCq4iugT3TCtUUTGRbaNSqWw
https://www.youtube.com/channel/UCVeGtnAZAimbtreMvJyRyCA
https://www.youtube.com/channel/UC_98Sqib7B6UPTvRs233XBA
https://www.youtube.com/channel/UCE1fhCt_rQY-DQs6wyCJeZg
https://www.youtube.com/channel/UCZs68ez6Cg_9HRMwWgrlWhw
https://www.youtube.com/channel/UCFWWUYFaG7O4YY3uu97RSBQ
https://www.youtube.com/channel/UCLZYVLk7QxJw5Wpab-Kmhzw
https://www.youtube.com/channel/UCTwOP3YAuxfxRvXc9hJjkOQ
https://www.youtube.com/channel/UCsdtTNtCdeB3i9NKNkpJWnA
https://www.youtube.com/channel/UC5ZJBxsmTn4ardiSDPf4rDQ
https://www.youtube.com/channel/UCtCDS6lhw_R7rfpVNYrSjww
https://www.youtube.com/channel/UCyZu_kaswDOo9ddu2CgM10g
https://www.youtube.com/channel/UC1npG7PEINgTCR2dwgnVutg
https://www.youtube.com/channel/UCX5VwCi-TZkJj7_F8igrJAw
https://www.youtube.com/channel/UCSJeDl3FgZTGY-Fxgpy4oFw
https://www.youtube.com/channel/UCkA45LoTdbRuufCYFzHEf8w
https://www.youtube.com/channel/UCUXp18gJ6RAseyi7MOR-gfg
https://www.youtube.com/channel/UC5NgImK001nd58Mlx18CacA
https://www.youtube.com/channel/UCV3s9GPYlOAW3FWP80XaJ-w
https://www.youtube.com/channel/UC3xtMw8JBjInKHekuw2UpoA
https://www.youtube.com/channel/UCy60ICpVQCDY5zE89uozXlA
https://www.youtube.com/channel/UCfN5wmdWevmLH-sKGHLSP5w
https://www.youtube.com/channel/UCPfe7ccRO-PzA-DT0ZGSzng
https://www.youtube.com/channel/UCyrzSV8d0YpovmpkGVOOQkw
https://www.youtube.com/channel/UC18RPjIFvFi6HUpGwAe4Ygg
https://www.youtube.com/channel/UCNBVK0f-rX9cEalcpo7yDLw
https://www.youtube.com/channel/UCyP0dLRAKrWJ6ga3sAsE6Qw
https://www.youtube.com/channel/UCbwhyiLMYzR0CR5F1pgztQQ
https://www.youtube.com/channel/UCswlAC7RTRTFkd88q2gbKdQ
https://www.youtube.com/channel/UCQy4gMvmih7m_OYc8GikGDQ
https://www.youtube.com/channel/UCNI1SmjyPVK-EjxkxFn4N6w
https://www.youtube.com/channel/UC47yTSV4j4vkqKoJk-ynvPw
https://www.youtube.com/channel/UCLHcOLK_mDEUno8mDmkLcww
https://www.youtube.com/channel/UCjAAC5ZFIm0s2Czj2M_Opxg
https://www.youtube.com/channel/UC0HKjgHk-xcxVA4T_7fHvKg
https://www.youtube.com/channel/UCYUMVmEdZjd66rbzzDzy8xw
https://www.youtube.com/channel/UC9Mc9R0i5UkoqvOfXy62qEg
https://www.youtube.com/channel/UCzwz7LKuJR6SDkkQdPGb2Tw
https://www.youtube.com/channel/UCOSCtijO54Te8crrJkoH1Cw
https://www.youtube.com/channel/UCEBz6iNaUVAggAP899cXFMw
https://www.youtube.com/channel/UC9ldcKX8b1YDy2BDyjqgOsQ
https://www.youtube.com/channel/UCyM0ICxsPUv5canYu_AHhDA
https://www.youtube.com/channel/UCyh4qbWR3LqtgPfR19WbLpA
https://www.youtube.com/channel/UCXvx3oSC66veRllK0P2hipg
https://www.youtube.com/channel/UCq3iEfOBwCA4uZlNNDTIpNw
https://www.youtube.com/channel/UCPGvXRVRi31jO-GXHRiuecQ
https://www.youtube.com/channel/UCHffjZBGtRODfZi61cNAIkw
https://www.youtube.com/channel/UCTDgMoTgJ4XK2o1LrgQV0Hg
https://www.youtube.com/channel/UCUeGSgsRZnesruPwP5rhNpA
https://www.youtube.com/channel/UCChvRK2F9b_jTJP69jBA0ag
https://www.youtube.com/channel/UCF92olTFp2P44pdbl_K5eEg
https://www.youtube.com/channel/UCNztmEFo7z5o4GrSmMPHSOg
https://www.youtube.com/channel/UCMiaBDF4iCNJhqtd20CqmDg
https://www.youtube.com/channel/UCdjWJ6t3dvvw0dezSbbwWxw
https://www.youtube.com/channel/UC1zZeoAjBzF8SuABH4hu9Qg
https://www.youtube.com/channel/UCJ8mkrJqZuiPm7jBWhTrmJQ
https://www.youtube.com/channel/UCH6inI_G1S6PI2cy2TIix5w
https://www.youtube.com/channel/UC1RLRPkOJekYpGImP4ZDFpg
https://www.youtube.com/channel/UCgr8zLNoO7ps957hVr9CmaQ
https://www.youtube.com/channel/UCP_QWZLZvKCzsdzsKLJC_Zg
https://www.youtube.com/channel/UCJsECJ9V9dAjnpRzikmPTKQ
https://www.youtube.com/channel/UCpLyQOwNvSClUTjIvBsPrtQ
https://www.youtube.com/channel/UCj0LBFe7u6h6lIg-PNxCRBQ
https://www.youtube.com/channel/UCouGXK3JC1Cvm1NvPlFFtCA
https://www.youtube.com/channel/UC4Qx-Q2NbzvRCv7fO4P-F-g
https://www.youtube.com/channel/UCN6BPx6XLgkOd_YfHmdNtyA
https://www.youtube.com/channel/UCfZ6Yx0wCxpqDc92-L2_yHA
https://www.youtube.com/channel/UCVL0Lj41em8S5_hYOBwoR_g
https://www.youtube.com/channel/UC5MxsLlVFIdZq-T39hGDPWg
https://www.youtube.com/channel/UCWagbetb7nxza9Yx1NDtQjw
https://www.youtube.com/channel/UCIwP9aSSXzP_2Bp4BSU2ndg
https://www.youtube.com/channel/UC-3IIuRVO1z668-HLoNuCVA
https://www.youtube.com/channel/UCHJ3IXgZbXfRLwZeI8Kb0Aw
https://www.youtube.com/channel/UCYvaEY6HP8iRAMIxV5mG-Rw
https://www.youtube.com/channel/UCuirLz5QHQj-qu7k_swOWvw
https://www.youtube.com/channel/UCkThfOYldPQ6P_L04kbGKFw
https://www.youtube.com/channel/UC4VTHbT5sbs7fadUhHVznhA
https://www.youtube.com/channel/UCAAfUanzGr4KkqxDcqqyYgA
https://www.youtube.com/channel/UCqwP0XHUnh50LPVJ9cTfsjA
https://www.youtube.com/channel/UCBgCS8IRQ1BwWcCwLF-vu2A
https://www.youtube.com/channel/UC4zs_JIzIlMW3StHzMOOF6g
https://www.youtube.com/channel/UCH1_KIazmYM9FFgxMCcA1lA
https://www.youtube.com/channel/UCrPoC3gMPaWr5_IJA71RNow
https://www.youtube.com/channel/UCe6-1tLCxmTfd2QiAH1L4Rw
https://www.youtube.com/channel/UCHGH3POj19mG39uewasi6Yw
https://www.youtube.com/channel/UCw2ROIJf9UCnNriMEBdBPZQ
https://www.youtube.com/channel/UCkeXS-4QzJOuLYfv8glSabA
https://www.youtube.com/channel/UC98q_roPhpX8FujmY8xO83g
https://www.youtube.com/channel/UCnu9GpfC73TQa5PzeVngukg
https://www.youtube.com/channel/UCWTLqZ91iIkUtu9v6JWOWEw
https://www.youtube.com/channel/UCAa5DSGpI51KFmsqM6RWLwg
https://www.youtube.com/channel/UCe2_urY6C0S3lE2yRcVNg_A
https://www.youtube.com/channel/UCLu7c8CfcQI4liHpZv_nhIQ
https://www.youtube.com/channel/UCEmDpuHByfDyHOyWcyn6rQQ
https://www.youtube.com/channel/UCCi59lZizkpXHgM2Z1Jzeug
https://www.youtube.com/channel/UCzeqVzaJyy8ZxrMbiHN6NWw
https://www.youtube.com/channel/UCnVxsHxy1OMb075OnBZhJxg
https://www.youtube.com/channel/UCC_4-_CVeOpn7N2TeR_CNew
https://www.youtube.com/channel/UCBS0egX3SC6jLgfkWRtj2tg
https://www.youtube.com/channel/UCW9DVq-q_HKvFxDvzkz4lMA
https://www.youtube.com/channel/UC5Gbfxhj6-M2FWwMYAMnFZA
https://www.youtube.com/channel/UCvwhfURJF6uVOlbjU4_eb8g
https://www.youtube.com/channel/UCHK0l1k64QzXpjzTVo8rcAQ
https://www.youtube.com/channel/UCrW5doIOlhao71rWewXzFXA
https://www.youtube.com/channel/UCQWEB_4rSqyAvTSyG98e-ow
https://www.youtube.com/channel/UCnTpIMvtKjqF3H4QE_oJ56Q
https://www.youtube.com/channel/UCBNjdFiLgcZZh1DuvRivREA
https://www.youtube.com/channel/UCclEwsm-Ii2Hcqzq3V1hC1A
https://www.youtube.com/channel/UCwIaWAMTOtkxA1TXwHbLv6A
https://www.youtube.com/channel/UCk8-ryFKlydqaCll0ZAX5wg
https://www.youtube.com/channel/UC9k4EhUDFrkGVzyrewP0bHQ
https://www.youtube.com/channel/UCsSbsiwrtrMLU_oO8yVlZMw
https://www.youtube.com/channel/UCoH9JZxAwUNIsXK08EXHRng
https://www.youtube.com/channel/UCbHanVa9mffr6TA5Oft_obA
https://www.youtube.com/channel/UCp3WE2pGeLcdmZ0Ja1Vw3CQ
https://www.youtube.com/channel/UCR0G7XLDtTNZ28RKGuUmJ2g
https://www.youtube.com/channel/UCHz951WkPUm664C-rjMcfyA
https://www.youtube.com/channel/UC4YbWR4VbiQGxWZAmS4CqUw
https://www.youtube.com/channel/UCwKSkv59iyJQ4yCF8UusAoA
https://www.youtube.com/channel/UCJyV4zh2UesVrtyE4cBj-Dw
https://www.youtube.com/channel/UCSAb_qqk7kPSkfZiXeEHT5g
https://www.youtube.com/channel/UC_1adZf3P2WPT2LCh7LjdAg
https://www.youtube.com/channel/UC3wneH4qoj0o6pXWklgZe4A
https://www.youtube.com/channel/UC2BmNh1hJYZZlFkNNcRVZpg
https://www.youtube.com/channel/UCnsCGGHlyYNX07hiaQvkwgw
https://www.youtube.com/channel/UCVY-8bsxRncbk_IZa9QGFeA
https://www.youtube.com/channel/UCXIi14tOWdK2OJzi7cNuCaQ
https://www.youtube.com/channel/UCjWUDrzgup0svYe_mz4S-rA
https://www.youtube.com/channel/UC278AibI4zCWjvL2tSLK7cQ
https://www.youtube.com/channel/UCebAQRwM3AgEXKFMZZrEGXg
https://www.youtube.com/channel/UC8vWoxBzaKPjwTwEFI986Kw
https://www.youtube.com/channel/UCHOYVFZYsu8-5oNhXKBEwTQ
https://www.youtube.com/channel/UCR6sc-NW-HU4PB3e9x-UJvQ
https://www.youtube.com/channel/UCoBGS3epPsu6Z__9_GrLyWQ
https://www.youtube.com/channel/UCIV9ZylsYieZSN5K1LFBx3w
https://www.youtube.com/channel/UCme9rn6bthuO0Ugp57Wb9Bw
https://www.youtube.com/channel/UCEc_-hsoo1dGPoWepbDk7pQ
https://www.youtube.com/channel/UCr2SqAGmvPp4o7D7kIUIlSQ
https://www.youtube.com/channel/UCFMsXstesUU7PyMrf61FINA
https://www.youtube.com/channel/UCbFiLxQrpDtzzd_Mvv1WCgw
https://www.youtube.com/channel/UC7T4frUs8LmjvodEEAqbMZA
https://www.youtube.com/channel/UC1eHly9DPasmFKAXwkM5Wjw
https://www.youtube.com/channel/UCgi7hOS8BOZf8k-Ky2NOiiA
https://www.youtube.com/channel/UC5_a22posGNJAAzxf6BhPgw
https://www.youtube.com/channel/UC_-QVKbh4BvkwFZvbAaAkaA
https://www.youtube.com/channel/UC8WF0dtXmRuXT3Pe-5f8hxQ
https://www.youtube.com/channel/UCtjUZ2smGncaZbqiz4i5j0A
https://www.youtube.com/channel/UCaqwCrOfZhEVxCCCA1dGCcQ
https://www.youtube.com/channel/UCv67ZVs-DuzZxdNBhi1-R4w
https://www.youtube.com/channel/UCo9AW7EvRTFncQkWsPhyOcg
https://www.youtube.com/channel/UCVpv7PRFAi6NbLxdCuC0VeQ
https://www.youtube.com/channel/UC-yi9ncH0O36KUq8p_drQvQ
https://www.youtube.com/channel/UCj3PG41gFKi_j22liH7cHRQ
https://www.youtube.com/channel/UCs80RHQffIb2SaW3uLDImRg
https://www.youtube.com/channel/UCrBlXWXvI0FGTKnHskott7g
https://www.youtube.com/channel/UCYPBBXDzoj8RR6PWa78uEBQ
https://www.youtube.com/channel/UC5mhBuazPYH_tkTUawkTByg
https://www.youtube.com/channel/UC44bacbUfT33MTd70QUNXDQ
https://www.youtube.com/channel/UC1WI6WhVKzHbAkx9r4y8AjQ
https://www.youtube.com/channel/UC_ljK9-KldgG5762IMg5p3g
https://www.youtube.com/channel/UCNJ4EPkZu2AAr9DDAbjsjWA
https://www.youtube.com/channel/UCYRDYpGQq8u07hr85nnYshA
https://www.youtube.com/channel/UC4vlP5H7ZlYQDdA3SsL24fw
https://www.youtube.com/channel/UCk31fwsAdXQ3nA6uTpCG51Q
https://www.youtube.com/channel/UCvD40LzF7NdoBxzJGR5FGWA
https://www.youtube.com/channel/UCwg9kcRAH86tl_KV1S71P7w
https://www.youtube.com/channel/UC67nkEiYnUBAfMcuSSVCimw
https://www.youtube.com/channel/UCtrEIWDfbB7VpQJO2Kiy-xQ
https://www.youtube.com/channel/UCozjTnUFoWaWbIV_xrzBtGg
https://www.youtube.com/channel/UC2OU0JusixMWexlMT4PPteg
https://www.youtube.com/channel/UCf6DUVLaEiz2wzm_kPaRZbQ
https://www.youtube.com/channel/UCjOC3lRJAWKnjEKiFe1cscQ
https://www.youtube.com/channel/UCgB7Ju6sR6UaGVwX-xnZNgA
https://www.youtube.com/channel/UC2s6yGzUHoe_ahiT4JIKu2A
https://www.youtube.com/channel/UCz8FWP1GRzcsto5ELrLvy-Q
https://www.youtube.com/channel/UCqrZTfSTB2uXhkGTzxF-bHA
https://www.youtube.com/channel/UCHrkvfuollkwjgGWAga8LLA
https://www.youtube.com/channel/UCAS8QqEyGGH71xYgFzNSbuw
https://www.youtube.com/channel/UCiWXd0nmBjlKROwzMyPV-Nw
https://www.youtube.com/channel/UCWmilV4nUobkSq0JzoeX6aw
https://www.youtube.com/channel/UCkQDeS5LbR5njbJo6aGhUtQ
https://www.youtube.com/channel/UCBuHkb1AS_yRQ71meFNQ3VQ
https://www.youtube.com/channel/UCaHvWPMrGgcd42waw4WYQ6w
https://www.youtube.com/channel/UCTqPBBnP2T57kmiPQ87986g
https://www.youtube.com/channel/UCcWBxfaO69GPOFHSArNET2Q
https://www.youtube.com/channel/UCtZnYMV8Rn_tBqOkoBCAuhQ
https://www.youtube.com/channel/UCvTe3Z7TZsjGzUERx4Ce6zA
https://www.youtube.com/channel/UCtLgwBOza-dnuaBg6W6YXog
https://www.youtube.com/channel/UCGekZ_Ig4dP3NDcJCdOK6aA
https://www.youtube.com/channel/UCKpgd4u2ANo1HSQVEGX3iVg
https://www.youtube.com/channel/UCNQ4sJJO-d8YJl_FK-bmt_g
https://www.youtube.com/channel/UC1mx_wcSHtfpLk5N_zY0TRg
https://www.youtube.com/channel/UCHQDjDDW8w2RieO-IuqYlyg
https://www.youtube.com/channel/UCXGgrKt94gR6lmN4aN3mYTg
https://www.youtube.com/channel/UCxMjw6DCP7mSAWqnV9Vx1ng
https://www.youtube.com/channel/UC2Ov25mKWtjMICagWbcBvig
https://www.youtube.com/channel/UCW9NeKfgO_uMy5-MqLNtiVw
https://www.youtube.com/channel/UCUGJ-yKqQHl4FSZwUmGpiUg
https://www.youtube.com/channel/UCkQMrI3g9wV2F5CsIi6odmQ
https://www.youtube.com/channel/UC9v3JGut2Z1PxrXEpGzgEAA
https://www.youtube.com/channel/UCkM35W6j3lUl0-uQRxbrzkw
https://www.youtube.com/channel/UCeUJO1H3TEXu2syfAAPjYKQ
https://www.youtube.com/channel/UCx0qWZrjq84_D0qVGeCh5Kw
https://www.youtube.com/channel/UCuWFpdiSBqXFOvB9XWLU63Q
https://www.youtube.com/channel/UCfn4IWFcdfT2POAxbt4v6pw
https://www.youtube.com/channel/UCopwDG5Syp_a_U9bRWYqoeA
https://www.youtube.com/channel/UCBVx3LFr71s8ANsWL6LclWQ
https://www.youtube.com/channel/UC7RL3bksyvu7rH7T6KFFkjw
https://www.youtube.com/channel/UCQ5URCSs1f5Cz9rh-cDGxNQ
https://www.youtube.com/channel/UCd4JzeAkgTsyJDEkWC11PoA
https://www.youtube.com/channel/UCVTifvD7WFz1Z-AnEzUoUUA
https://www.youtube.com/channel/UCcG2HsNjnAbWOT6E1DRxjGA
https://www.youtube.com/channel/UCUMzET2JdWLxZGhvTKCIK-A
https://www.youtube.com/channel/UCWpyqUnOedVd7vO9C7Kl_sg
https://www.youtube.com/channel/UCK5LUK8viFrysSXt7sh2yGA
https://www.youtube.com/channel/UCddc73x05KtHLenrdGlSkyA
https://www.youtube.com/channel/UCfHZuPM18myKEvw4G7Yhk1w
https://www.youtube.com/channel/UCN3mX39lfxvohWxN4kcrXIQ
https://www.youtube.com/channel/UC6scQH5jmzTnrRlfb1QsJfw
https://www.youtube.com/channel/UCDNeEBgigHHGtJJOpHSnadA
https://www.youtube.com/channel/UC4c-wTOqEID-_vH4MhNs06w
https://www.youtube.com/channel/UCMb7dIM1FrJ2MjFv7tuYa-w
https://www.youtube.com/channel/UCinF3VdzcRzWc7cKPPaiOkw
https://www.youtube.com/channel/UCz84tiwYn7WXzTkVS24VEYw
https://www.youtube.com/channel/UCLgGLSFMZQB8c0WGcwE49Gw
https://www.youtube.com/channel/UCCkMW93Am1pLfk2nZFKAmbQ
https://www.youtube.com/channel/UCSi3noC0JkukKm1rl-tt9YA
https://www.youtube.com/channel/UC_7aK9PpYTqt08ERh1MewlQ
https://www.youtube.com/channel/UC2Tc0TsvFxC83zF1w5x1PWQ
https://www.youtube.com/channel/UCJUHiJfgDE5aeqbk4iZBPHA
https://www.youtube.com/channel/UCDk3ScYL7OaeGbOPdDIqIlQ
https://www.youtube.com/channel/UCTEanMUzF8pyGFqfbr65z2A
https://www.youtube.com/channel/UCt4e57VMVckUbzNhZ6V6guw
https://www.youtube.com/channel/UCAIVa1BAAJNsdKfP1bFljKQ
https://www.youtube.com/channel/UC5gKJBCtvcBThDvhjxkci-g
https://www.youtube.com/channel/UCoRY1lWAIKxqTiemuJHuTzQ
https://www.youtube.com/channel/UCguWXCDo0KqTMvGEpcs-52g
https://www.youtube.com/channel/UCQxl7lyRaCMCvcOMIA3J2fg
https://www.youtube.com/channel/UCiOGM5hoSXYTcOpqEtYlV4g
https://www.youtube.com/channel/UC09w0slTCXt5FFRy3mbNIaw
https://www.youtube.com/channel/UCpGv68xxhxb91Ic6ql-pNdQ
https://www.youtube.com/channel/UCLzWMcpNlhHo0c0yOyWksvQ
https://www.youtube.com/channel/UC_XRq7JriAORvDe1lI1RAsA
https://www.youtube.com/channel/UCgxXuXHJ4VwovSTvDiWlzZQ
https://www.youtube.com/channel/UCnEiGCE13SUI7ZvojTAVBKw
https://www.youtube.com/channel/UCllMvuz1DIPIoqNnur7_Pig
https://www.youtube.com/channel/UC5kaTJqvA2I0d7K5Lgfx4sw
https://www.youtube.com/channel/UCao639tdBRxLqIFrLGexxeQ
https://www.youtube.com/channel/UCMDcOT4z7GS1SRGG2g7z43g
https://www.youtube.com/channel/UCJCrncqSm65zk5txuJaUy3w
https://www.youtube.com/channel/UCqRiv7rQuxge63bqJ2hVNUQ
https://www.youtube.com/channel/UCsdc_0ZTXikARFEn2dRDJhg
https://www.youtube.com/channel/UCRb241PllW0OA8uVoj-ySfw
https://www.youtube.com/channel/UCv3hNzy4n-onHRorHGK0_ig
https://www.youtube.com/channel/UCiczXOhGpvoQGhOL16EZiTg
https://www.youtube.com/channel/UC_scf0U4iSELX22nC60WDSg
https://www.youtube.com/channel/UCkJmdDhLzb4Sxur2FHWiChQ
https://www.youtube.com/channel/UCeWwpyA9T2a92NDkYQKvF8g
https://www.youtube.com/channel/UCzcPto5seI08Yo2guoWlpUQ
https://www.youtube.com/channel/UC4YaOt1yT-ZeyB0OmxHgolA
https://www.youtube.com/channel/UCutKH473vNcid5CIKCqAk3g
https://www.youtube.com/channel/UCKxvQVb1NviBG3PfERTOeMA
https://www.youtube.com/channel/UCU3z3Vp8L1D7uZ3w0sEYLGA
https://www.youtube.com/channel/UCJk5KVaJVBEEl_jP5gKjoDw
https://www.youtube.com/channel/UC1hTVMHtymDyki6jrfH8baQ
https://www.youtube.com/channel/UCtpB66XKjAtFZfZyzmC-_Cg
https://www.youtube.com/channel/UCbS1oNSvFZf87Qwj2CMQjUw
https://www.youtube.com/channel/UC873OURVczg_utAk8dXx_Uw
https://www.youtube.com/channel/UC-vbQ6G2FaW0aAP1RcoMCmA
https://www.youtube.com/channel/UCTHgZseiNxrD8ZTE61kaz9g
https://www.youtube.com/channel/UCOJDuGX9SqzPkureXZfS60w
https://www.youtube.com/channel/UCLRCP-juSDl3icIfyw0XsWQ
https://www.youtube.com/channel/UCUBhobCkTLhgfUNRAgHSYmw
https://www.youtube.com/channel/UCIF_gt4BfsWyM_2GOcKXyEQ
https://www.youtube.com/channel/UCgdHSFcXvkN6O3NXvif0-pA
https://www.youtube.com/channel/UC50A6Qra-LVdovHw4hH449w
https://www.youtube.com/channel/UCSs4A6HYKmHA2MG_0z-F0xw
https://www.youtube.com/channel/UCWYa0v8bpGyYr0ycqGXifVQ
https://www.youtube.com/channel/UC833fxO053brHVUW2BK-ryA
https://www.youtube.com/channel/UCPr4Q5jEgaLev7a3AOtItaQ
https://www.youtube.com/channel/UCyW62qO710YjU-BMDXX4r-Q
https://www.youtube.com/channel/UCpOlOeQjj7EsVnDh3zuCgsA
https://www.youtube.com/channel/UCy_r_YSQg-CrKPSYCWdgMRg
https://www.youtube.com/channel/UC57oK_yu62CvUHaD7NFmSNA
https://www.youtube.com/channel/UCS0N5baNlQWJCUrhCEo8WlA
https://www.youtube.com/channel/UCi4UZoZM0Iw9_tTeRjZd_bA
https://www.youtube.com/channel/UCx74OaAnnBDV6ml8Mc01qKQ
https://www.youtube.com/channel/UCXmfS5whB0JOyDCqtDgcytA
https://www.youtube.com/channel/UCPKkgMdAgGUeLFNVOxtfeQQ
https://www.youtube.com/channel/UCGGrblndNzi86WY5lJkQJiA
https://www.youtube.com/channel/UCOmxt6hJpmwTHnDj0vkR2Ew
https://www.youtube.com/channel/UC8nk3dP5q5z_z60n0DRWgeQ
https://www.youtube.com/channel/UCtR5okwgTMghi_uyWvbloEg
https://www.youtube.com/channel/UC1tp9qN7mqIJ7CLVNVvsKzg
https://www.youtube.com/channel/UChIs72whgZI9w6d6FhwGGHA
https://www.youtube.com/channel/UCE7UCIEDIbinkMnNOtSyqzg
https://www.youtube.com/channel/UCZoE5OhPeozu88vfPDcy3NQ
https://www.youtube.com/channel/UC33DZIOL5BhWju6kq1-bqmA
https://www.youtube.com/channel/UCRB_w0cCi7FdLuf7s869CVQ
https://www.youtube.com/channel/UCyW-leqPXUunrXXxFjpZ7VA
https://www.youtube.com/channel/UCVh6Z8gLCoZsTMPhf-v48-w
https://www.youtube.com/channel/UCWEXBk3zCFDZzXIlqYyohAA
https://www.youtube.com/channel/UCcDpEbrETwvQfJxnpqY6idw
https://www.youtube.com/channel/UC33JlHZwWy0GVL3mZhzizNg
https://www.youtube.com/channel/UCg3qsVzHeUt5_cPpcRtoaJQ
https://www.youtube.com/channel/UCaGafVgmIE7nL_P4vpFu5iA
https://www.youtube.com/channel/UCYtBrkqkULTUdHGPEkxxbVw
https://www.youtube.com/channel/UCocgpvsIUN5YwSdZCF4BFFw
https://www.youtube.com/channel/UCjU51lhtpje-r0eF4b0jpbw
https://www.youtube.com/channel/UCCIks3d17EIF_DQoWlxpcqA
https://www.youtube.com/channel/UC6h3VbJP93d9mMFZRoVvIXA
https://www.youtube.com/channel/UC2QkZhNFNOKLyELXJfbpXxg
https://www.youtube.com/channel/UCSeCz9wAMaU8KbckzerrH3A
https://www.youtube.com/channel/UC6mSZWbzU_ZX2Krx7FiuPEA
https://www.youtube.com/channel/UCe70_JXJ080OegKY_H148DA
https://www.youtube.com/channel/UCkUNA_ociQ8aFXAYWZ4d7ug
https://www.youtube.com/channel/UCPzy3l0-orGovZoN0fx5C_A
https://www.youtube.com/channel/UC6mIxFTvXkWQVEHPsEdflzQ
https://www.youtube.com/channel/UC4DbtlSPQ9IEtwccTX6XC3w
https://www.youtube.com/channel/UCYXCd8v9BsTUUoFVRJlSd-Q
https://www.youtube.com/channel/UCOFkZVaDCfPgzkKalpE4Szg
https://www.youtube.com/channel/UCe-aiAhNCXlQKNBpoE-wciw
https://www.youtube.com/channel/UCVhUJtQSeJGyAuuzOdkCDkQ
https://www.youtube.com/channel/UC2vv4lRtArsLAXY1zGyaoyg
https://www.youtube.com/channel/UCQQk988_F2-Gf7anWMprD7w
https://www.youtube.com/channel/UCCkfJCOZggjhkoG0M6PbrPQ
https://www.youtube.com/channel/UCQtO-jMdrVT-_B9JrMGCm5A
https://www.youtube.com/channel/UCek8vSxDxt5zJCd3kiPlCAQ
https://www.youtube.com/channel/UC-dApCrVZgumBgypKQyyq4w
https://www.youtube.com/channel/UCc6q1GulqzafxPkEYOVdBdw
https://www.youtube.com/channel/UCmldttGmpgcq_-zJTS5YnlA
https://www.youtube.com/channel/UCOCs-78lWcrComhGsX1i2nA
https://www.youtube.com/channel/UCs37nY4OalSLbHGMeJHdlTQ
https://www.youtube.com/channel/UCI7DZeb2u4DwzLjTWsJE-bg
https://www.youtube.com/channel/UCi26rmAPVDbeHH2TTtz3-hg
https://www.youtube.com/channel/UCaCpZXesfk6U64MiCbwdxrQ
https://www.youtube.com/channel/UCoKt7uddy_KYlq7i886__RA
https://www.youtube.com/channel/UCCFueYy0x6UN_JyajXw5OoQ
https://www.youtube.com/channel/UCshGwPlNiTPdrRPVIBZ1Lig
https://www.youtube.com/channel/UCPJDbRN8GoMfvi864hvvVPA
https://www.youtube.com/channel/UCOYrnEORao5xeqQ8_TuzKWg
https://www.youtube.com/channel/UCfU3VgaBvzINlPqp2rKF3Ug
https://www.youtube.com/channel/UCPYV_e32ECTTwnpARiM5P0A
https://www.youtube.com/channel/UC53g9AcHzl5bZQj4julJdsA
https://www.youtube.com/channel/UCoihOWMGM1iY6FgLnSOTocQ
https://www.youtube.com/channel/UCsOBCws0hoieKXLvJOWgmeA
https://www.youtube.com/channel/UC3Yrx0W7ADwrM-gdUPc4hkg
https://www.youtube.com/channel/UCDKhjeB3wTEfh7w1TVqmf7g
https://www.youtube.com/channel/UC1npk8h5-tuKm9QmNvQQuoA
https://www.youtube.com/channel/UC0__cIEaoVVjaCdJ1SgAIUg
https://www.youtube.com/channel/UCRU5cBAg4KoW53M4x4udj5A
https://www.youtube.com/channel/UCqlOGqKovzQRh8ri02c6Lsw
https://www.youtube.com/channel/UCjyNthhbVquwW3DvNPBwJEQ
https://www.youtube.com/channel/UC-y_GqPV25bzVf8VaIM15vQ
https://www.youtube.com/channel/UCBSly5HCL9VZ3_w876na6EQ
https://www.youtube.com/channel/UCnLXPknxLfKbsCbdEENx_jw
https://www.youtube.com/channel/UCGJ6SggctE0Rgxhkp9ZTn-w
https://www.youtube.com/channel/UCHKWcWQWfNsc62wXwjdlWJQ
https://www.youtube.com/channel/UCc-SvFq1_gov1ZIFls-hMuQ
https://www.youtube.com/channel/UCRrnWZ2ZygKjjlswxrhfalw
https://www.youtube.com/channel/UC7aEzIJZFUI4GBJGt-Ew8iQ
https://www.youtube.com/channel/UCJll0WtwkbSBJjmJvNV4Q-A
https://www.youtube.com/channel/UC5SUCorG-t3sShNtG3Cge-w
https://www.youtube.com/channel/UCqfQoR3yT_AliwZ734jDvpg
https://www.youtube.com/channel/UCo3Mn4ugtUhptoGVTP1BH2g
https://www.youtube.com/channel/UCV04zJdt_4mWLJhs0jKcuOw
https://www.youtube.com/channel/UCadIfIEfzad-y-TSYoIQNSQ
https://www.youtube.com/channel/UCQ8y2DGkv22_tmJ9jrT3anQ
https://www.youtube.com/channel/UCKzCZpNMWPhH01Zj-GNIcyA
https://www.youtube.com/channel/UCbMQAKsf8I6o-z_NBhLVzCQ
https://www.youtube.com/channel/UCds6GCNf9IGFjuwS6hxHBnA
https://www.youtube.com/channel/UCLvaYa43temIynKAJLCjAEQ
https://www.youtube.com/channel/UCj9PIMskIU9k8iW3Y9L7Ccg
https://www.youtube.com/channel/UCdwlghsOUBBAVf3MBZcPQkQ
https://www.youtube.com/channel/UCBVTRcO0vKoGWFAfxvjRhQA
https://www.youtube.com/channel/UCzM_Y1jA9sL5S-d1X0VG6qw
https://www.youtube.com/channel/UCaG1bI2FsddpQcqfmGQxX4A
https://www.youtube.com/channel/UC2FqgQcIzgGzfsHJ1i4C04g
https://www.youtube.com/channel/UCGwDX2P8XQHB14nex9oe4ng
https://www.youtube.com/channel/UCmaGDEZMUffLCqq2zWpFmZw
https://www.youtube.com/channel/UCqwr2DEA0aWKMj6IIaiDJ_Q
https://www.youtube.com/channel/UCaUupJIK5bonLrjtHH7MCgA
https://www.youtube.com/channel/UCOca7i7-pqwRPvSvt277a3g
https://www.youtube.com/channel/UCfVIwN4c58Hibj7ELPJKAVw
https://www.youtube.com/channel/UCL-Xx4D2FntAbBvRyO_TfeA
https://www.youtube.com/channel/UCd-Xdmv3gBZk3L7VNmq_S6Q
https://www.youtube.com/channel/UCLOCPHVEU8HyKSTd-iCyKIQ
https://www.youtube.com/channel/UCQg-YLbXlmkjKPPM8R11qHg
https://www.youtube.com/channel/UC9FuU-PZ_7Ui6pPGZr5nuAg
https://www.youtube.com/channel/UCAmcOwyY3YJniP5F37Vr6yw
https://www.youtube.com/channel/UCRo7jLI_wonR4cXdnO2XjkA
https://www.youtube.com/channel/UC_I5wHVFR8ePU-FKFGEZ-IQ
https://www.youtube.com/channel/UC0xakFaTTrADIJLxxWdj3cA
https://www.youtube.com/channel/UCLX_5YhWFVeiWX9Epxooikw
https://www.youtube.com/channel/UCooO8wm2sqCRfYLqiYissDA
https://www.youtube.com/channel/UCtN9KNpgXryGM2NuOjAbqog
https://www.youtube.com/channel/UCTAJ_OqH6Ffu6q9PQzvCfXw
https://www.youtube.com/channel/UCOkXrLref_VR31vVsUh4ZUA
https://www.youtube.com/channel/UC83pFF045kBscJE8I1IcqZw
https://www.youtube.com/channel/UCHyMx7455kVhIV0ZqnjDcwA
https://www.youtube.com/channel/UCPbDoHd5xKQC47Meb6VQugg
https://www.youtube.com/channel/UC2mlYIN5ZlxxfBr3AzX5Eag
https://www.youtube.com/channel/UCmZXHylTpsU4y1K83e3spVQ
https://www.youtube.com/channel/UCtxNHLW6H3ryDZD4DD65eug
https://www.youtube.com/channel/UC7yeB18yD0C7qqeMOBi_Pvw
https://www.youtube.com/channel/UCTtTaIGEHh58ezCjq8o1ujg
https://www.youtube.com/channel/UCJyRmYWUMnr4jZY3EqTW3kA
https://www.youtube.com/channel/UCr1oPg6GVTsn7ghEFOxmobA
https://www.youtube.com/channel/UC9GmKGRhnGf-t3JwO3APa3g
https://www.youtube.com/channel/UCw17cjykZHas9PjBOXZzkUg
https://www.youtube.com/channel/UCtasqMAmSDkCsfl9Ds1nXUg
https://www.youtube.com/channel/UCKi_r87hLu1jKCRXZX8RzKg
https://www.youtube.com/channel/UCG3unzifge8CUXxF7v286kg
https://www.youtube.com/channel/UCq91x3bi--xht3eHWv-JXnw
https://www.youtube.com/channel/UC1XqZ5J8i4mdIq43k3PK0Pg
https://www.youtube.com/channel/UCkH5PqCarI1FgdmqubLe0NA
https://www.youtube.com/channel/UCQxPYEp1fekhlwVAzvepcCQ
https://www.youtube.com/channel/UCfLLxd91TRynh6rtzUrZHFg
https://www.youtube.com/channel/UCzXlxTumM4a8mn9GQr0Zz-A
https://www.youtube.com/channel/UCFpo78cqzG7QxbJv0kAv2Xw
https://www.youtube.com/channel/UCuOh4oTvqeTFhvH6FHRAgUg
https://www.youtube.com/channel/UClGFxF3mhq9D19FWKQu-lnQ
https://www.youtube.com/channel/UCXBXGGMxSkVzzs48lWQR1vQ
https://www.youtube.com/channel/UCM7Gx96qZqdYJBhv5Mjg9vw
https://www.youtube.com/channel/UCrdcP8rRldBnM44McXnE7Kw
https://www.youtube.com/channel/UCCVPkdHS6XpgLZzB4OcnLUA
https://www.youtube.com/channel/UClbIrrj051ma2QrM4z3gH1A
https://www.youtube.com/channel/UCOdqXuRnFSW-zu6GVFPrnuQ
https://www.youtube.com/channel/UCe1wW3woUrYDLBpE4Ba_2ZA
https://www.youtube.com/channel/UC1LQw-wyyG3KmXv0n-Uk5iQ
https://www.youtube.com/channel/UCXlZ4waZIfhocF9mc8zddIw
https://www.youtube.com/channel/UCkaxlWyCnbu_Bo9zNYXbQrg
https://www.youtube.com/channel/UCnW26Rxq6lZL1oFiJ0128ew
https://www.youtube.com/channel/UCUOOs0DueMGXXLBpYywXaeA
https://www.youtube.com/channel/UChp83P8KsxXD_E7cQDBb1Tw
https://www.youtube.com/channel/UCDkhRX4uOGgRtx0trWksbLw
https://www.youtube.com/channel/UCJucHn-T5Nyiy2mW3PmRYYQ
https://www.youtube.com/channel/UCXRKwKsbT5ZwWuU6qokddlQ
https://www.youtube.com/channel/UCSgRHugZcwJcpWK_vS0-8rw
https://www.youtube.com/channel/UCV6Iyt6DuELQ_cpzrwsnVNg
https://www.youtube.com/channel/UCnwQGtgq-kOizI9kwgI93kA
https://www.youtube.com/channel/UCMETDPIW3xGJWUgIUdAhR6Q
https://www.youtube.com/channel/UCvdHX8W1P-h3Cdjd-z_v2zA
https://www.youtube.com/channel/UCRk4TGKskCG820FQezSd0Tg
https://www.youtube.com/channel/UCph1kew-DUQ8w5sCLn5Ioew
https://www.youtube.com/channel/UCe3Zhaxt5C1TRuL3K-jjkCA
https://www.youtube.com/channel/UCZfPAQ2ORRbQi2zloH3DMCQ
https://www.youtube.com/channel/UC9YbazZawza9BDMjmXmiKGA
https://www.youtube.com/channel/UCrdeQuMqP0xf-LffHVbE4VA
https://www.youtube.com/channel/UCezqaRfM_vGLwLnQop0njqA
https://www.youtube.com/channel/UCv0yCUN9J4zwcEALuC2uIMg
https://www.youtube.com/channel/UCwJbOv3fOUnlYiXKkwW8thQ
https://www.youtube.com/channel/UCz3UJUhYDm7MxlBbIGYWaVA
https://www.youtube.com/channel/UC4u4-gMZf0q2RxG9iHgCQjQ
https://www.youtube.com/channel/UCsd_uhqeP61u4V3E2Zca7Cg
https://www.youtube.com/channel/UCwFaT0lNmwKfmzYlKaRT_dw
https://www.youtube.com/channel/UCQuPnPW4CATPtrVNCWUoSbQ
https://www.youtube.com/channel/UCwZF7cEZ-W7_fhM-SM7XT5Q
https://www.youtube.com/channel/UCMtpKUudSRKY9fOjou-A2_w
https://www.youtube.com/channel/UC8HnEcXVJQ3FE9d8h6J9jAA
https://www.youtube.com/channel/UC1mjgLsW25Mu5RTcB4A0SLA
https://www.youtube.com/channel/UCpy6DT9aUCXtTZKO7W6nMHQ
https://www.youtube.com/channel/UCzkkPMpK1yVdUlMUKvZATuw
https://www.youtube.com/channel/UCX8nYh_a5zloDOJSmQ_EZYQ
https://www.youtube.com/channel/UC7p1j6_IdXOSD2seX89pPrw
https://www.youtube.com/channel/UCpiiGTUi4xEJkuVa1zzTymQ
https://www.youtube.com/channel/UCt8B5jx2cvicrga8eMVrqMQ
https://www.youtube.com/channel/UCTzXVDI4o9BSJNfUvB_c6Ug
https://www.youtube.com/channel/UCt_0vcxelGFN9046Rh76EJA
https://www.youtube.com/channel/UCnK98_0bz2w9R3s7VUPS3eQ
https://www.youtube.com/channel/UCULWlZjHhV5IqWUkgddw0cg
https://www.youtube.com/channel/UCk9ugRdds_1ukGbOYzP8sJw
https://www.youtube.com/channel/UC95aubZVErD5ejukia617Ag
https://www.youtube.com/channel/UCzTXO335eSw6wUr6DLe0tjg
https://www.youtube.com/channel/UCOFSwI8vgDnPdaKZFUHHVeQ
https://www.youtube.com/channel/UCkJRqMvGQHIeEydNknK5tyA
https://www.youtube.com/channel/UClRDFHclujY2rj4txggJ5MQ
https://www.youtube.com/channel/UC7g-HrC-uEZWADDI6cF7_DA
https://www.youtube.com/channel/UCXSNM2VrUjnrmn1N37-uRiw
https://www.youtube.com/channel/UCEpGRejGSTgiZXsNSU3b5Sw
https://www.youtube.com/channel/UCdX3z-2-Cx7xKUk7bYQk0OQ
https://www.youtube.com/channel/UCjRWkK-lA0q-BPc-HbXgHQQ
https://www.youtube.com/channel/UCojM1-ei2fHYx95vA68EOpw
https://www.youtube.com/channel/UCDOxu2pVj-YpocpRvtZpxdA
https://www.youtube.com/channel/UC2KNKVFhIYFvC7sT1m2WfEA
https://www.youtube.com/channel/UCbOJ6pTINeEeDqyeSXCNPYA
https://www.youtube.com/channel/UCP4I_iG5BJ7QI2KWdb-FhOQ
https://www.youtube.com/channel/UCn7Fkmz87EMnXOhUL4zHoxw
https://www.youtube.com/channel/UCbGQSO-OjwfpalmPXoHB-bQ
https://www.youtube.com/channel/UCPrnRZyldfdWoFB4t6yrY2g
https://www.youtube.com/channel/UCgletb8QXH3uQag0bGJ05uw
https://www.youtube.com/channel/UCh5voslazDhUadFE05c5eLQ
https://www.youtube.com/channel/UCV4fpNecfxHGLmUiuQ_mMOQ
https://www.youtube.com/channel/UCMli469xMzAOwJAxSUeVuiw
https://www.youtube.com/channel/UC5-VhbwrNHuTSHX9nnRxDBw
https://www.youtube.com/channel/UCLpSXIad5-rw8wOHHseRs1g
https://www.youtube.com/channel/UCP4gR6sftOCABpML7ePM-vA
https://www.youtube.com/channel/UCEU1K0Dd5y2xcrUQGJSYo-w
https://www.youtube.com/channel/UCPESk4k9yDKz6MbNpzKG5zg
https://www.youtube.com/channel/UClQ4N6Me0mpw16iUeTtHmEw
https://www.youtube.com/channel/UCuE63rgPbYRbYaZPvshMNSw
https://www.youtube.com/channel/UCvUxvfkAx3_WwlCQlbH4c7A
https://www.youtube.com/channel/UCMILNIxB23_CQWcw4nrrMaA
https://www.youtube.com/channel/UCnyI9OPEntJ901c-zecNCAw
https://www.youtube.com/channel/UCTXD_PyxGcu3DvkixDPJp5g
https://www.youtube.com/channel/UCQZ3pdgmHoRNB0hQcIdxSag
https://www.youtube.com/channel/UCY28ojfPoiRrR6sDtroGziA
https://www.youtube.com/channel/UCitRdLr4KpVjKPjbN5q_UAw
https://www.youtube.com/channel/UC7EvQabTG9IwAPmkR0j0E2Q
https://www.youtube.com/channel/UCVwtzCXqAt6DCJv6NRbeHjw
https://www.youtube.com/channel/UC24rk8RcQZPWLpibPCiSJuQ
https://www.youtube.com/channel/UCukeI9-tLN4wMq_NUM-pAHw
https://www.youtube.com/channel/UC5XzoCi3GEyUbfAUeJAARYg
https://www.youtube.com/channel/UCJ8F9dSPfCirllG_4wsPIIw
https://www.youtube.com/channel/UCv6IrqVuKIAzENSYZIunGiA
https://www.youtube.com/channel/UCz24ySK8hDNfFLgeh9-e1rw
https://www.youtube.com/channel/UCk9FivcWa64dyfd8cqAmjdg
https://www.youtube.com/channel/UColBjltsPSCfiXqnZHFTIdg
https://www.youtube.com/channel/UCeyZVTtC1gzHv9whvNv5xuQ
https://www.youtube.com/channel/UCRcF_zo2wY7iNMqrF8dsqfw
https://www.youtube.com/channel/UCwujqWTz8QigwJFamVlaQkQ
https://www.youtube.com/channel/UCVVd2IAxq6zyCBFWMJAcT5w
https://www.youtube.com/channel/UCjQHLbB1Z0_FIAbdcMc2f_g
https://www.youtube.com/channel/UCzB2yC2JWkiBuq5H-CQEHGQ
https://www.youtube.com/channel/UCSNeOrwIw5UlSnUTtBEYFJw
https://www.youtube.com/channel/UCbtYuzrkHm7hTF6YrizLakg
https://www.youtube.com/channel/UCsXguFFXn3HwBYsVQDAyPww
https://www.youtube.com/channel/UCDb0DtCgM5SbrUT9_2kax7w
https://www.youtube.com/channel/UCfOILM6PtTZZiJ5qrqlZVpQ
https://www.youtube.com/channel/UCOLbSgHdulVSmtVvkcTJpoA
https://www.youtube.com/channel/UCIiw9speAo8CUDzmJdHvexw
https://www.youtube.com/channel/UC9EvvV7mzloJXzRVwnrdjtw
https://www.youtube.com/channel/UCnfBBfRdDDQV-vdAGa1pUIg
https://www.youtube.com/channel/UCiYl_d2-MHDF_Ydej3G8b0w
https://www.youtube.com/channel/UCo6ZY-fekQOVx319D1ZvDWw
https://www.youtube.com/channel/UCeyKeTFErwgLU3W1np8-_4w
https://www.youtube.com/channel/UCfGaeGC1tDkXZwXNl8gZBAw
https://www.youtube.com/channel/UCBd0EBBPWTJbnJfYuY0CKdg
https://www.youtube.com/channel/UCxgodLWQgeabYI0C3s4RPKQ
https://www.youtube.com/channel/UCL0Ge2xsql8i3WyB2bukL9Q
https://www.youtube.com/channel/UCqs3JKQE5rV0SJxOsIw12Xw
https://www.youtube.com/channel/UCxns-9PhqrFGKnmnw64SR0w
https://www.youtube.com/channel/UCd7jwanRuJ8i4Kty9ysYqIg
https://www.youtube.com/channel/UCLZHcdF8Lni-951SScHqorg
https://www.youtube.com/channel/UCzfrEoc0SGnm82mNoID6Zzw
https://www.youtube.com/channel/UC3zjZvTvvmAG67HlvvtIRNA
https://www.youtube.com/channel/UCMMjsWgBWTtEl2ssLPl2W1g
https://www.youtube.com/channel/UCBV-6p_MLwp7WbIUR4NgUrg
https://www.youtube.com/channel/UCS0g3xP2CVlxJuxeiHv41lA
https://www.youtube.com/channel/UCwKRcnIj8fhop1QjRtWcgNw
https://www.youtube.com/channel/UCxlkME7vFfnzpjKcbW5fW2A
https://www.youtube.com/channel/UCFi6nIGVktNxLCj728Mjv5A
https://www.youtube.com/channel/UCRwp-SpVh8CYtH_PaMLM7Zg
https://www.youtube.com/channel/UCkxcdhZxlR975Il5enZfepQ
https://www.youtube.com/channel/UCFmb0IZ0BXpMddnewX5e33Q
https://www.youtube.com/channel/UCR1xEB6qxrIXbR6AazGwDHg
https://www.youtube.com/channel/UCFX09LmDNADTOaDQK06iR9g
https://www.youtube.com/channel/UCo6rjTacxK58TwpreBnsJSg
https://www.youtube.com/channel/UCBa8vzkexirv8rSPnzSCXxw
https://www.youtube.com/channel/UCF6uLp4rf3aWySvtvmaPbZQ
https://www.youtube.com/channel/UCdmptRZ-ky4HT39e7tt1x_w
https://www.youtube.com/channel/UCnDVYJFcqI6peYHHe6rFbTw
https://www.youtube.com/channel/UCc1-JKdaePiebic6JAZ-GqQ
https://www.youtube.com/channel/UC3eDU5edzhLqPoc3j-NtOIA
https://www.youtube.com/channel/UCLi3tUo5jDpgQ39V7fks6Hg
https://www.youtube.com/channel/UCaqHUyRlmg50o2NBce8QyMw
https://www.youtube.com/channel/UCeOn2jOLyoa31WcvmRqnLzA
https://www.youtube.com/channel/UCTCvMdeY1oFqtkLlkR-4Iww
https://www.youtube.com/channel/UCnGXKMeL8rKbJGdxrFHH7hQ
https://www.youtube.com/channel/UCA5PkmM5B9D3e1me2TmJdkQ
https://www.youtube.com/channel/UCaqEDHvKTP83N3Te4L6eQAQ
https://www.youtube.com/channel/UC2fu4699j0FXIOXgtuP_Kfw
https://www.youtube.com/channel/UCX5w_cCQN3jaoFJUiQHZufA
https://www.youtube.com/channel/UCFeejDcyZ_h3-_6zklfEalw
https://www.youtube.com/channel/UCa2odN6xdvCHuYRqubpmGHA
https://www.youtube.com/channel/UCOQ2Q5dAAfLbXx4GpaUnGlA
https://www.youtube.com/channel/UCRbb4cian_YM-iu_NxJ5rTA
https://www.youtube.com/channel/UC9X6rpnSphB8kFQbB1W3vhQ
https://www.youtube.com/channel/UCqcTBo54lw-2rFltfp7WokA
https://www.youtube.com/channel/UChwmfvsdH-uU3-LK1GC3t-A
https://www.youtube.com/channel/UC64kTGTwb9ahqiLoZ4fbTJg
https://www.youtube.com/channel/UCBa8IAm87a6vQc4HcqSnaVw
https://www.youtube.com/channel/UCTlqU2vVhsz8B5CDMb61zUA
https://www.youtube.com/channel/UCGs17PjvzJnztLQMo-dS5Vw
https://www.youtube.com/channel/UCFX_T6FTdAs8i3XXkboPFIw
https://www.youtube.com/channel/UCwW7nd4HbLukqLlN1iYUnEg
https://www.youtube.com/channel/UCRZXdm_Q3weA_N0Jq2IVudw
https://www.youtube.com/channel/UCRAooCzgpzDyPNviIEN6bIQ
https://www.youtube.com/channel/UCN5UYhvmC5paMMwOZnN4YJA
https://www.youtube.com/channel/UCP7RxeAQucIJEJXUniv52oA
https://www.youtube.com/channel/UCapnYEsoO4oUVK8UODdnP3g
https://www.youtube.com/channel/UC0ZsJiytfP73-M6NiI12C2Q
https://www.youtube.com/channel/UCVRxrNCWyUDP1POkI00hdMQ
https://www.youtube.com/channel/UCzPIDkmXCsyL3XcCLT2luQQ
https://www.youtube.com/channel/UCpQuj-LP2vHk3j9wRWfm6tA
https://www.youtube.com/channel/UCk7vbEPoFy8YYjneOb19iCQ
https://www.youtube.com/channel/UCtBBV81J0-96k8ErZuCmvXw
https://www.youtube.com/channel/UCx2AW6HW9RXMrL-FckBkmXQ
https://www.youtube.com/channel/UCmT6AhkRe3MvJ9k4RQPauwQ
https://www.youtube.com/channel/UCsKkTwaFEgfYMQnBG0VGNZg
https://www.youtube.com/channel/UCWoqlqC2E_Ry2g7OwfHlEDw
https://www.youtube.com/channel/UCWrkvnfYBLjh-6XXUM7bQog
https://www.youtube.com/channel/UC5bm3WRVVWdtBaO0hsrpfjg
https://www.youtube.com/channel/UCjpOOKIK95umtMHKecNsawQ
https://www.youtube.com/channel/UCoEE0pHYIqQLgSD2NkdIkzA
https://www.youtube.com/channel/UCBOEKmzEkHEibLEEwleFryg
https://www.youtube.com/channel/UCQL76fzCRhDGuz5983a5A-w
https://www.youtube.com/channel/UCp0HrXLq8LtJUKFVO4RWM6Q
https://www.youtube.com/channel/UCPIbQ0omTaTtY-3kPMgSMug
https://www.youtube.com/channel/UCzzF0ZQLRKizDv-qCdLXF9g
https://www.youtube.com/channel/UCfcg-41ovXLXN27HoTRSA2w
https://www.youtube.com/channel/UCj43BtRCNogQMK_ARcEYD0Q
https://www.youtube.com/channel/UCVVACtyhjOVpPlwx-0vEvTQ
https://www.youtube.com/channel/UCSg8-kR9KRqXg_HPMKouFkw
https://www.youtube.com/channel/UCNkJ7tlRlRrU0yGaOxSWviA
https://www.youtube.com/channel/UCRWzgPNQK87bHH4atysgk1w
https://www.youtube.com/channel/UCBABdxHl3JTTXy9KoHSrfyg
https://www.youtube.com/channel/UCFqSG3Pv7q_NJkHaPyoW1rA
https://www.youtube.com/channel/UCr7V5A6y_wRysvIY8YiZ5nQ
https://www.youtube.com/channel/UC1Ppwt7OUOBIGFr67nagplA
https://www.youtube.com/channel/UCh0hkZr84C6_nUexqMTtKKQ
https://www.youtube.com/channel/UCu7LV45Cw57seI_-WBhECQw
https://www.youtube.com/channel/UCrrz6tmG_35w9gjsZMzyH1g
https://www.youtube.com/channel/UCb05U6Ilf3LUeq6tj8Zu7ag
https://www.youtube.com/channel/UCc-MD6zUE_dRmszcBwQIn7A
https://www.youtube.com/channel/UCGASt5Cu03qJdin8gE-RzPw
https://www.youtube.com/channel/UCYg0RXijF8IL9sAE5RhrLYQ
https://www.youtube.com/channel/UCGev6lR7KzFPjuCnz88nJbA
https://www.youtube.com/channel/UCiPzD_fY8AnI36V2SIHMY4g
https://www.youtube.com/channel/UCsq0UFV_L1pPY1zqjaqlMdQ
https://www.youtube.com/channel/UCQddfeSYyh2cXxiwuOZFv0w
https://www.youtube.com/channel/UCjIa9fkNJoLd9YfJNdisnng
https://www.youtube.com/channel/UC_X7CLixnJPTTKjiCwwci0w
https://www.youtube.com/channel/UCIC0MXoLqObJJNNROXsGyVg
https://www.youtube.com/channel/UCQ2BIoS9VlX-3m1s8HvwpvQ
https://www.youtube.com/channel/UCVKYXL5LeSaML3Tr5v45G3A
https://www.youtube.com/channel/UCEJhy7ytFhasuklAPk9ZoAg
https://www.youtube.com/channel/UCLX5d3DhSTrQPYWAnQqdp3w
https://www.youtube.com/channel/UC3g120mbRGe9CnA38XSNdXw
https://www.youtube.com/channel/UCwXeldhnbVFNj-2EQGNhBrg
https://www.youtube.com/channel/UCC2cNxttWwogZzq_F0BSraQ
https://www.youtube.com/channel/UCyPsItNBCphXbAJlOZO1mmw
https://www.youtube.com/channel/UCVFH7Ij4_rKhbQuXnCyhbZw
https://www.youtube.com/channel/UCEkZq_3376DzYhzHCehUftA
https://www.youtube.com/channel/UCGIQbT80iUbZZhdmlDZzPig
https://www.youtube.com/channel/UCtBnQFYyWFEiL_cMknRFXrA
https://www.youtube.com/channel/UCHOvytq4jaJrYMDcyqTUOEg
https://www.youtube.com/channel/UCAOgW8rojMe1-bA8rAAFrzw
https://www.youtube.com/channel/UCvbkmam729gQk3K-utshGIA
https://www.youtube.com/channel/UC8VbWWJEmw9qxPYPY8aCynw
https://www.youtube.com/channel/UCGeWYlI5UY1O6w52foOnIfQ
https://www.youtube.com/channel/UCSL5RkAqTmAF6kNVIi8UrUA
https://www.youtube.com/channel/UC93pvscxc-UXI_pzEQxc1gw
https://www.youtube.com/channel/UCgIYoWSyDRRfMnZZn1eIpSA
https://www.youtube.com/channel/UCVjpJEkz55ZQqT-ENbZZS9A
https://www.youtube.com/channel/UCVcEAqUjgTcHd3zAmArwjyg
https://www.youtube.com/channel/UCZ5oYH32OmEkJkofiTvWd3A
https://www.youtube.com/channel/UCwXQ1vRXbJmZ_X7iNumgO8w
https://www.youtube.com/channel/UC6omVRxL_gmVW9kRhvA0AUw
https://www.youtube.com/channel/UCX1O-wY4gnITHSOyHjvYbhA
https://www.youtube.com/channel/UCjePA08U39fUknPQz2xk9Mg
https://www.youtube.com/channel/UCUA5ah42exBCcDkPdQ4BdOg
https://www.youtube.com/channel/UCVuMH3CefzJB7ECKG-m-j1g
https://www.youtube.com/channel/UCN2AOA0-Y_k3dfYd3kgucaQ
https://www.youtube.com/channel/UCbLW8GQukQfebDEJkvbrJqA
https://www.youtube.com/channel/UCesJ_OYNNeD7jQFGWUakSVQ
https://www.youtube.com/channel/UC5j-6WF2kdzj5MfeNU3D1PA
https://www.youtube.com/channel/UCSngqsAHFZ_KgblZ-m-NM3w
https://www.youtube.com/channel/UC83DwUt-95eGjcsfLQ8EWQg
https://www.youtube.com/channel/UC-2hM-Y77rV5fDUcjfsJ-3g
https://www.youtube.com/channel/UC3UQ4H1KbWxxoR2GR_ThkAQ
https://www.youtube.com/channel/UCJeUama-h5aIfUEYA4ERMGw
https://www.youtube.com/channel/UCE_XQS94vZA0s-5KyTrr-AA
https://www.youtube.com/channel/UCnzAY0nJSk9-sft0LVwT8WQ
https://www.youtube.com/channel/UCWpvS0oSgSaP5WYW0f0YjqA
https://www.youtube.com/channel/UCYXiq8L3d8QAUz5LlfK8iVQ
https://www.youtube.com/channel/UCg8ncMwNrvP--ULY9fr0reQ
https://www.youtube.com/channel/UCPfeCYsETd-w43Cr7kKTe2g
https://www.youtube.com/channel/UC6kgh80VG0GoxFDCRUA-r1Q
https://www.youtube.com/channel/UCBJxo4QEBfh6Km-S17fsqKw
https://www.youtube.com/channel/UCorJhSM639ATvEK-gWgIYsw
https://www.youtube.com/channel/UCFZHd6iSBBFaWfHoTCIaYIg
https://www.youtube.com/channel/UC8xp73N8bifWPjLWcKKp35Q
https://www.youtube.com/channel/UCKD9Z9BA9CzQ-l-ma2AyT6w
https://www.youtube.com/channel/UCAqmU2XCKVXyexYsonvU9qA
https://www.youtube.com/channel/UCwQ9SqZU1ZmlC-LA0utxWRA
https://www.youtube.com/channel/UCYq4TSjRNKFY_J54eEDjHiw
https://www.youtube.com/channel/UC_Q_eqZCItA5ECGM_b7xi0g
https://www.youtube.com/channel/UCQBDcpMqIMnm_mHQo8kzm4Q
https://www.youtube.com/channel/UCO8h8xCJnAM8HI3ubAqdPsA
https://www.youtube.com/channel/UC5GxOqj2CfUA096OEbRZobw
https://www.youtube.com/channel/UCWJTW2kL24lUyVY5vsUdqsw
https://www.youtube.com/channel/UC-WKwpBGHmkWdw58KS1oQ6A
https://www.youtube.com/channel/UC5a72KzqFN87Yitbj-KM6dA
https://www.youtube.com/channel/UC7Sl_fkRMnlaTT-iRdH9Q6A
https://www.youtube.com/channel/UCYWdvEIGI3xpAJOu353aIWA
https://www.youtube.com/channel/UCCPmqMAPX8BGW3PZ_qoMG0A
https://www.youtube.com/channel/UCpA-HQ1HBYBs9jtEkyS-NfA
https://www.youtube.com/channel/UCUd7d3MNupBHtbKorPVjs9w
https://www.youtube.com/channel/UC6Zx_UT4AV604a4QclgWeUQ
https://www.youtube.com/channel/UC3BFk_82iv0Cs5ZAC4aboMQ
https://www.youtube.com/channel/UC9I7mlqxZBCvA28l8jLrtGQ
https://www.youtube.com/channel/UCn462TfYWffVrQD4IS4vngQ
https://www.youtube.com/channel/UCPs9l1Y34HMNi9YHob4fvkg
https://www.youtube.com/channel/UCt_d63hbJnLRDgtMw8RJwQw
https://www.youtube.com/channel/UCgn7rsKJTRTwLAlyGdkUVGQ
https://www.youtube.com/channel/UCX0VoTPvtC0TKpgU_EyGa2Q
https://www.youtube.com/channel/UCkxzUosb55RGT7-Ywi0s1fA
https://www.youtube.com/channel/UCZM7AVPdNOiJ9mV-nxVJXMQ
https://www.youtube.com/channel/UCNB_qdxJRzDzhKIPx4nb6uQ
https://www.youtube.com/channel/UCtnZZEQQhcj_z7jJ7OyIS2g
https://www.youtube.com/channel/UCQTYnPVMXIJ3xDbzCkaVryw
https://www.youtube.com/channel/UCosCV96jiGTyJbdzrmLkNrw
https://www.youtube.com/channel/UChGZNmZ45JbvxJe1R-1TB2Q
https://www.youtube.com/channel/UCXlRIVFK-Jc1-2bxROG8CTA
https://www.youtube.com/channel/UCiy492TY7vpUvlDjOdvb6EQ
https://www.youtube.com/channel/UCpGBZvVTY_Wc-fkWkJL8b8w
https://www.youtube.com/channel/UCBiy4ACZcsNTy-UDWlNTCKQ
https://www.youtube.com/channel/UCW8Vt639nRQcYher5J-__pw
https://www.youtube.com/channel/UCzUUuey5Vfdog_qMGpG120w
https://www.youtube.com/channel/UCGVIZZ39vT_aK89XhL5OIbQ
https://www.youtube.com/channel/UCFUE049aGeNJpic2CdYSBag
https://www.youtube.com/channel/UCqeTDuCvXerxldAe05MAFXg
https://www.youtube.com/channel/UCyQizpwEmFKo1KKY6TT58sw
https://www.youtube.com/channel/UCYD7V_JvZRl0AT7972jQ3Cg
https://www.youtube.com/channel/UCmy6mO_ojmNSisTU9egzf9Q
https://www.youtube.com/channel/UCwluxc6IwMvN29_S1TA_kOw
https://www.youtube.com/channel/UC-YbQF9EP6x1SDm_F-qAHEw
https://www.youtube.com/channel/UCSDJ_Vfw_fRdJQ4otC4HrNw
https://www.youtube.com/channel/UCh6oK3GMP-jOoHPngfXXswA
https://www.youtube.com/channel/UCRe7hTtop2MQ3b5XmXizMfg
https://www.youtube.com/channel/UCnFtfAwqHy9D_HhxUAB8X8g
https://www.youtube.com/channel/UCACTd-AO2hOVWmxPlmfojaA
https://www.youtube.com/channel/UC_fXHu95UE-Eb9ndfaLGL2A
https://www.youtube.com/channel/UCo8vpseUNp023FgRa37ypww
https://www.youtube.com/channel/UCXzTnmgy0_IoPWRrI52mCmQ
https://www.youtube.com/channel/UCG_35Qt2l4GIa5yCc7QTAoA
https://www.youtube.com/channel/UCLWOYpk0NIHqUKEjS8A9SUQ
https://www.youtube.com/channel/UCmVlOkyqX76XX_jkWXaerCA
https://www.youtube.com/channel/UCi_3lJG0Fh3xFatnGp4_FvQ
https://www.youtube.com/channel/UCkbeN6ME4y5j8TeVRIyj0-Q
https://www.youtube.com/channel/UCQWorGQ_sDqECwdvaF2GA2w
https://www.youtube.com/channel/UCkhRbKa0QCDQ9CWrxsXkFkQ
https://www.youtube.com/channel/UCt2gmdtpq6Bt7H7i7PyEaqg
https://www.youtube.com/channel/UC3rQlXa_qGu-jWdcfkdI7Vw
https://www.youtube.com/channel/UC0gT0cVDBFvhn8rdpUTaJlg
https://www.youtube.com/channel/UCCRacrBAqpMBwWXCdfCfiNA
https://www.youtube.com/channel/UCG4-u0IxZ2DseZ9NaWsZZXQ
https://www.youtube.com/channel/UCsBca--agXFL0lXx--tlC8A
https://www.youtube.com/channel/UCfZXaatbETsfRpy-sa7-sNw
https://www.youtube.com/channel/UCb7mhG5OEp7WLF1GHx1RaRw
https://www.youtube.com/channel/UCDoKRU7B5-b9XOT16_d_6nw
https://www.youtube.com/channel/UCd53iGu2fC_mv5rpkVbu5gw
https://www.youtube.com/channel/UCh-5klAHntv99hBTzexGJZQ
https://www.youtube.com/channel/UCegzOhOs3HtUmWbqo6bOV3A
https://www.youtube.com/channel/UC0XUDfLyY_T0ujDbUqhXJrQ
https://www.youtube.com/channel/UCozgirpjGQIKAoq1nRys4tw
https://www.youtube.com/channel/UCn3DIMbdm20gqrsGmpcitSQ
https://www.youtube.com/channel/UCe66N1SF3tCnLZ2ETxPD2hQ
https://www.youtube.com/channel/UC9bt3iokUKsyAcyV6AMJ4Hw
https://www.youtube.com/channel/UClQnxMRyNgwSzhDDuaoLcCA
https://www.youtube.com/channel/UCGQKQ2SwI6mWAz37sz4eLaQ
https://www.youtube.com/channel/UCZYXWRimVzPFZiu4FggoevA
https://www.youtube.com/channel/UCK0IHlquAfTmy81PDE4eqMw
https://www.youtube.com/channel/UCe-gqh-wvy6C-_rIwUSIDow
https://www.youtube.com/channel/UCFS5lXVNTcKBBkhgJ1fqapg
https://www.youtube.com/channel/UCg9MrqJGxqP3qK3N1giUlpw
https://www.youtube.com/channel/UCfQaxX5KmSgDRwkKBiFCXhQ
https://www.youtube.com/channel/UCJjjoS1nZ6RFC9zw5I9QW1g
https://www.youtube.com/channel/UCp49JzTJOXPMbtFXXMtHy6g
https://www.youtube.com/channel/UCN2En7jsTIz8t0lNnapBEbw
https://www.youtube.com/channel/UC7DsZNmJsin6DRDE61Ez9Ig
https://www.youtube.com/channel/UC9U73CgmOdHyp2DSuP-zjlw
https://www.youtube.com/channel/UCY_9y9xyz71au6dAj4GGLmQ
https://www.youtube.com/channel/UCU7c0Fwitl3eV74VPZzPACQ
https://www.youtube.com/channel/UC4k61Nk8-l3vnu0OTeRbK4g
https://www.youtube.com/channel/UCuZjrVL8mLEELZ1XMX5WbJg
https://www.youtube.com/channel/UCwL5e7aCZ81Jlo8MEcIwW2g
https://www.youtube.com/channel/UCp-qSiKJNlqk_TUXXZdDVng
https://www.youtube.com/channel/UChva1-CYTre7NUK6DuUN0ZQ
https://www.youtube.com/channel/UCHg3GByEF41kXtyFHqPkUyA
https://www.youtube.com/channel/UCFxsFQDS1ld7cTh8jD_lSUg
https://www.youtube.com/channel/UClJsJZ5Gz7eMwqZlHG0fPPA
https://www.youtube.com/channel/UCjje7VFnYBUI69_P4hQng8w
https://www.youtube.com/channel/UCf2392cmsUfyqYNBucEo2yw
https://www.youtube.com/channel/UCFuEiO37mUAB61We2H--fEg
https://www.youtube.com/channel/UCDqScgC9c6r-quVyvX8Jksg
https://www.youtube.com/channel/UC9vPNcbQokds0g_Pb3ROXQw
https://www.youtube.com/channel/UC5MlbPOEuN8HG3T_9_1O6cA
https://www.youtube.com/channel/UCVtzQyJhPUHriKWBqJEvmzA
https://www.youtube.com/channel/UCEKHHQZn0LP_XgMkFI8tstw
https://www.youtube.com/channel/UCrgM29_7_7XgvDw3D8r_fVw
https://www.youtube.com/channel/UCCNqXG0VAL2j_SdlkNhuCYQ
https://www.youtube.com/channel/UCNdKy7YlGoJF0fIE04-pArA
https://www.youtube.com/channel/UCkIgTkpychZ1Z0XHR-5mcwg
https://www.youtube.com/channel/UCNQM5M27XKLLsWe2gyw4VBw
https://www.youtube.com/channel/UCvHlqEQ5yBblxOX5VKIgMFQ
https://www.youtube.com/channel/UCKvejVf9ly-PKLuIPMKwjkw
https://www.youtube.com/channel/UCgNfqo5vWx6hW6gRmrwC76A
https://www.youtube.com/channel/UCBBm53jUdAAUx1uLLng1biQ
https://www.youtube.com/channel/UCLg5IITbGnlownesqN07X7w
https://www.youtube.com/channel/UCRC2jdh31550YvfuajnNi_g
https://www.youtube.com/channel/UCoQeWUmEpUkm5PXRk5-KK7A
https://www.youtube.com/channel/UCsEeR27_sg5UXRyvD0n3Skg
https://www.youtube.com/channel/UCd8kMC-Ap8G5SWykSporKdA
https://www.youtube.com/channel/UCBZLtJuDuDocjhhL6dOS_kQ
https://www.youtube.com/channel/UCZKcBgsTwLihFhzspS8xWvQ
https://www.youtube.com/channel/UCSdgOsZTHx2U71HoR3cxUyw
https://www.youtube.com/channel/UC82fLGjQ0whCT-O0Oxw6vlw
https://www.youtube.com/channel/UCuLBtd8RFDy30iu7Ntna9Ig
https://www.youtube.com/channel/UCdaQes3_QeTNJlwEvPI36nA
https://www.youtube.com/channel/UCpt2905uXGRi6jdIgJUOVgQ
https://www.youtube.com/channel/UCFYLQ_0yVZDfOnTlLqFbTHg
https://www.youtube.com/channel/UChpW6uS84zpAoTm-XY0Y0wQ
https://www.youtube.com/channel/UC7kr1vN2Y7iCJX_4X1JzuNQ
https://www.youtube.com/channel/UCVBjSmlo_SI5xZYd2aLzbZQ
https://www.youtube.com/channel/UCHmPYqKp_uvPdxrJ5-BWOdg
https://www.youtube.com/channel/UCv7Y9zIQ22bxOHUobTx0c6w
https://www.youtube.com/channel/UCKy6TFBqMWICm5x-yX4iU4w
https://www.youtube.com/channel/UCd9Dk_4iF7cR7QTlzBk_MPA
https://www.youtube.com/channel/UCa74-Zp2DyRde_eCOE39M4A
https://www.youtube.com/channel/UCaZx1FkXBmq_d6PnctopcrA
https://www.youtube.com/channel/UCyKyfQnZ5GLk99D6QEiIpaQ
https://www.youtube.com/channel/UCN6OT6Iop_T9vIHiiMOa4vw
https://www.youtube.com/channel/UCb8aA5KSMklocWqr_v96YWA
https://www.youtube.com/channel/UC_peM0FGhlEs8XAhN1JSNoA
https://www.youtube.com/channel/UCYL9Hl6Mw9xa7ygIPwCjKbg
https://www.youtube.com/channel/UC871HE0LGZfK0e8hhKhsEpg
https://www.youtube.com/channel/UCVUp0E_l6Vyh9bZQFBP3gVw
https://www.youtube.com/channel/UC1VZzK1wT5KaLQqsyRpkYfA
https://www.youtube.com/channel/UCfCthUE-6YVcAHbHYQx0b5Q
https://www.youtube.com/channel/UCFZV6zLjX3hHZgqmtEbeJ6A
https://www.youtube.com/channel/UCb6FFDhiqY4cWiMWm2j2iAQ
https://www.youtube.com/channel/UCx0pAidIaXwISr8TBcM7xqg
https://www.youtube.com/channel/UCOwvIRmRhVy7E_rNDAHI2Ng
https://www.youtube.com/channel/UCjqY5OYg45fXp-qlalCqPbA
https://www.youtube.com/channel/UCkz2dV20fg3mvcD_z7FJMog
https://www.youtube.com/channel/UC8soUsWdUZc2nXU9p0EcJHg
https://www.youtube.com/channel/UC-rZMQgJLiTmRjmXCk_nn7Q
https://www.youtube.com/channel/UCzHfR5muQitWA6gxfCY1dEg
https://www.youtube.com/channel/UCZMGH4ELQmKoJzYNHLENTlQ
https://www.youtube.com/channel/UCbipY6TOjhnHoGSgFoNzYyQ
https://www.youtube.com/channel/UC8mb1NVsabimB56HkFLp9PA
https://www.youtube.com/channel/UCrWDlWcjjXYDlR1nMuliR-A
https://www.youtube.com/channel/UCSF1GDfCckx52RvCuHAmKqw
https://www.youtube.com/channel/UC-r1IXvCwGXyGPmNPmTcuzg
https://www.youtube.com/channel/UC1_ENLrr5WMJFxZcofaJ4wA
https://www.youtube.com/channel/UCDV0Rgm3HLs7RqvjIipJVjQ
https://www.youtube.com/channel/UCGW3SEbVPU_oq2mppaZP93g
https://www.youtube.com/channel/UC9DLBLMKN29CUlx2nCYiwog
https://www.youtube.com/channel/UCLDJn9-MFRWeV1xYtmRYnvg
https://www.youtube.com/channel/UCD9BzyicGk6FaRHvAdRioDA
https://www.youtube.com/channel/UChErdvSvQM6ktcMbHQAOwkg
https://www.youtube.com/channel/UCNb02yjqhpOHWNCS63Geb7A
https://www.youtube.com/channel/UC5RlLKihTd3Vt5B08xXk8Vw
https://www.youtube.com/channel/UCphPzOq0gAIMRpSmZVG0jmw
https://www.youtube.com/channel/UCqvodw_kIpnGHlRFoM0Odeg
https://www.youtube.com/channel/UCGCa4y8_iHfHjecO92vNz2A
https://www.youtube.com/channel/UCEp6r7ljbs0Fy8v8sqQIs_w
https://www.youtube.com/channel/UC0pwYVaDLuh1xQnREPxrkHw
https://www.youtube.com/channel/UCdlhElNJDDKOhYzr3AyI6zw
https://www.youtube.com/channel/UC0Xq-PyNdssa1jZ-yIOT1RA
https://www.youtube.com/channel/UCOj5ywrdGm6wbr2am_PfCkw
https://www.youtube.com/channel/UCdMBszfNvycP9Hft5pH2WgA
https://www.youtube.com/channel/UC2iz4WTwA2Y6qKCMraziKwQ
https://www.youtube.com/channel/UCMB9zERmB-yO7lo-EgLZNZw
https://www.youtube.com/channel/UC3AKB86KYZm_v1qAv6iFAGg
https://www.youtube.com/channel/UCELrXu8gV1RsgxWfJ-moXHA
https://www.youtube.com/channel/UCPK592iDE1ifjy6UW0OAxOQ
https://www.youtube.com/channel/UCVZueLAB3C-qlHFurnyeNag
https://www.youtube.com/channel/UCIU9jR-ldG2XjnMHumsIEDw
https://www.youtube.com/channel/UCnk6HWm5rI6mWHQf6yEjHmQ
https://www.youtube.com/channel/UC9zlpDij9cq_RQi8z_OzEmg
https://www.youtube.com/channel/UCIlI0D8ndD5iL3fjYfKBIGA
https://www.youtube.com/channel/UCRi2YbBc0FDLOiF_WbyKD4Q
https://www.youtube.com/channel/UCQtM1RZOpf90vnuuqWMytjw
https://www.youtube.com/channel/UCG6JiaS5AlOXaaw-V-8BP0w
https://www.youtube.com/channel/UClzI1MFMLiWo234ej3Qsjsg
https://www.youtube.com/channel/UClEWmJxxgXVLYr9SXeZH2XQ
https://www.youtube.com/channel/UCkfVi7vsyVKOloyf7I6VJvA
https://www.youtube.com/channel/UCIeKVkpBGdvuGicKFwVV7IA
https://www.youtube.com/channel/UCKdlfzBjIrAlIR8fnytZacg
https://www.youtube.com/channel/UCF3V597v-JwXJEymuAiEFpQ
https://www.youtube.com/channel/UC9tL_JsJyl9XMbsSjgj5L3w
https://www.youtube.com/channel/UCkrh_QA-ZKcfw5yy0x9jzgQ
https://www.youtube.com/channel/UClqnfZRu71p5aMrvqXjDOSg
https://www.youtube.com/channel/UC2x4VwrOhe5znsgxhCSSpMQ
https://www.youtube.com/channel/UCIPy8NdeTf1kx7Zt-INc_0w
https://www.youtube.com/channel/UCi3VImoY4YmHdxfogkMZsrA
https://www.youtube.com/channel/UCcta78-G-H13dqLqmAWN7hQ
https://www.youtube.com/channel/UCUY33uHJMNmH2M108V0BSdA
https://www.youtube.com/channel/UCE71i2g55jLLS1NsretLo9Q
https://www.youtube.com/channel/UCXg8lnd8ImH8R3gsB5KbBqQ
https://www.youtube.com/channel/UC0NqyTBsE8pE1FSFlv7O0tw
https://www.youtube.com/channel/UC0Zgxm9LQhMGWbybOvrczoQ
https://www.youtube.com/channel/UCcK30a5AuovaUAO1tLTj9Yg
https://www.youtube.com/channel/UCvFu4BBHfLqAzm93CdHRGRA
https://www.youtube.com/channel/UCdNCDkOrycH9GlJBOo8abQQ
https://www.youtube.com/channel/UCaX1VOv9gRtJPnngM--Nh-g
https://www.youtube.com/channel/UCQHPeQsp08b_Y4uR8LvFZLQ
https://www.youtube.com/channel/UCfE9WGC7fYwPoxnjtw_u-IQ
https://www.youtube.com/channel/UCiPHxbV7AcYQwFlP2_fawOg
https://www.youtube.com/channel/UCmQaaNukLt8A1QlwRnjJ57w
https://www.youtube.com/channel/UCguv_b_XFLupDYXN2zZVyhg
https://www.youtube.com/channel/UCPpFs40TBY6JuErYqgZ6jKw
https://www.youtube.com/channel/UCbkKHQ_H7WrO4EVXy8z252g
https://www.youtube.com/channel/UCvvTjvvoci1oJM0zYXpHMfw
https://www.youtube.com/channel/UCSu30NGWG7uhtW2PqjIQjzg
https://www.youtube.com/channel/UCQX1XsIEBGzUCH668v44ntw
https://www.youtube.com/channel/UC-ulBFIUbKtFDsk8VXFxRoQ
https://www.youtube.com/channel/UCXC8mpl4PBSokgx0-2qAv2A
https://www.youtube.com/channel/UCDGCvrQRynqQLkpchw01aMg
https://www.youtube.com/channel/UCa94e1Tb0Wphw117okX4vLw
https://www.youtube.com/channel/UC33b1jMf37PbOMgZaEMdQ9Q
https://www.youtube.com/channel/UCk2UBy6Hv-s9LY3v--qPoCw
https://www.youtube.com/channel/UCfa7Ts6xh9LgPFdCawkEPRw
https://www.youtube.com/channel/UCnziM0UDzcSh2_flhLKOSIA
https://www.youtube.com/channel/UCPPHHjJ-VYljcnZHqp6kOkQ
https://www.youtube.com/channel/UC8hzPt4vG_vST7qc1YFmm0A
https://www.youtube.com/channel/UCsmxKo0qp5p54dWSipfmSFQ
https://www.youtube.com/channel/UCq2qmn1AaE2gXybeiMSN5ow
https://www.youtube.com/channel/UCvrIl1gWY8UBDTYr38lCMbQ
https://www.youtube.com/channel/UCyCsgsmZ8jWuTgguKBfnHIA
https://www.youtube.com/channel/UCmt8KLRq1xl8oZPdudsySsw
https://www.youtube.com/channel/UCS_XKJ8S-sNJKB7Fiwr1IoA
https://www.youtube.com/channel/UCoQb4NZGs_4jxQUf-LXLBDA
https://www.youtube.com/channel/UCPuKgMw-MuIHJmm7O7hMMNQ
https://www.youtube.com/channel/UCGBiZNSswaMAQK_Dyg4xiyg
https://www.youtube.com/channel/UCXdgjxGcZSmauVW5ntIkm4Q
https://www.youtube.com/channel/UCzVGwwp7KjDysSJxK4HDbdw
https://www.youtube.com/channel/UCHC3S7b4Sv62Mdq7_WlQVBw
https://www.youtube.com/channel/UC6n7Ise4Y3ElD55Ju4WWB8A
https://www.youtube.com/channel/UCrlORHnKPyEqbvGyCNtfjYA
https://www.youtube.com/channel/UCBrtgBmytRbVFtUiTBuUQtA
https://www.youtube.com/channel/UCYoT0rKr8qBQuDIBXnGZR3w
https://www.youtube.com/channel/UCoYp_dPNibmWtbVb9g_BpZg
https://www.youtube.com/channel/UC1BKONnExrfSm0pTpq4ozJQ
https://www.youtube.com/channel/UCZ6jE2Ciojd5zxJR8kwTrNQ
https://www.youtube.com/channel/UCxvwchDOnuuprj0QIM_dfRw
https://www.youtube.com/channel/UCYxuFqGfilM_IptENibImVg
https://www.youtube.com/channel/UCH5jFlUtsQnGXOHibCTAm2A
https://www.youtube.com/channel/UCtWX8zQGkPOKKNgFjszz3vw
https://www.youtube.com/channel/UCZTxoVWoepCsSmxT5faPjlg
https://www.youtube.com/channel/UCXIhYZ6cCMog7IU3sGCbMIw
https://www.youtube.com/channel/UC5xMNbPves7t8GVj_2bhpFA
https://www.youtube.com/channel/UCE4h47Lityw-UWyl_8_xtqA
https://www.youtube.com/channel/UC5A1oPFfgyTHjek8c0g292Q
https://www.youtube.com/channel/UCa69hw5kY-5YD8Gj2zliW0w
https://www.youtube.com/channel/UCI0O4qRoakf1XdX1ZickwYg
https://www.youtube.com/channel/UCleU7Eg3KAagEKeP-_re41g
https://www.youtube.com/channel/UC1x3DnBKSDRARvgK7UbbffQ
https://www.youtube.com/channel/UCzrAwSNgINX9XW_KShrbRKA
https://www.youtube.com/channel/UCSmWizU-3HrwGmCHwUyVTqQ
https://www.youtube.com/channel/UCsYnGtdKjIZN5JrBUN9cNEA
https://www.youtube.com/channel/UCIi4dre3gNm44IWwSXwS86g
https://www.youtube.com/channel/UCSULB8yUkvaRK9mj364Ohbg
https://www.youtube.com/channel/UC3qW9lAeHctb6zCDo_ozxIA
https://www.youtube.com/channel/UCE6yZ6zGP-gL67zmx4A5U-A
https://www.youtube.com/channel/UCIC40WsQQCX11sQsxtQmsew
https://www.youtube.com/channel/UCaobQmlcaglAbyQB6jvYsDg
https://www.youtube.com/channel/UC3tMy-IthGxHtM04GLgmCOA
https://www.youtube.com/channel/UCI9BT88ZDpTkjHJ0D2cX0Ug
https://www.youtube.com/channel/UCZytfCFPWakajLBdoGG7uRQ
https://www.youtube.com/channel/UCWYQ-Iu65Uq5cQh10BRMAmA
https://www.youtube.com/channel/UCAOF_2VYrmrZb_m9yuPVqtQ
https://www.youtube.com/channel/UCBTwlQF5WkunGsynauc9yoQ
https://www.youtube.com/channel/UC4kecAjzAQqtl7hjq_e78-Q
https://www.youtube.com/channel/UCm9_6JRE9f03N-gZP3J8d1Q
https://www.youtube.com/channel/UCYMkRQ9_uxZ_44tCYul96Bw
https://www.youtube.com/channel/UC6ZmifUM6Q4DCdj1H-69gZQ
https://www.youtube.com/channel/UCUqxRmnxR1sCl6mq29UdqbA
https://www.youtube.com/channel/UCdi3EWGjVFJd8yUQcb5d4iw
https://www.youtube.com/channel/UC_bU_3kIGSKAt2VuputM1ww
https://www.youtube.com/channel/UCiJ0I80-woyjkoufv43NWUQ
https://www.youtube.com/channel/UCMETG9GsJKxQ7mXqTgsThCQ
https://www.youtube.com/channel/UCoQm0mbUYBEDWltDaquInog
https://www.youtube.com/channel/UCnPVzS8_5Faxs2mPivQXyfg
https://www.youtube.com/channel/UCdXw8PlkedwvXYy8l2d_Flw
https://www.youtube.com/channel/UC0XP7lTzmSR7azvpah2jz0Q
https://www.youtube.com/channel/UCH62aC2NWk4CtyXVuUD4i7g
https://www.youtube.com/channel/UCC74mYB7hui0Ixq5r6oyV_g
https://www.youtube.com/channel/UCYjnG4bh_7rSP8WUWbdJFYA
https://www.youtube.com/channel/UCW-7I3Xw9KtF_JHxaFI2dKw
https://www.youtube.com/channel/UCrgxauMN0qrlD8RrF__bqNw
https://www.youtube.com/channel/UCpB8fqLcHzLPskygB60Llfw
https://www.youtube.com/channel/UCa6ERCDt3GzkvLye32ar89w


	];

    // MISC SETTINGS:
    const CONVERT_DIACRITICS = true; // Convert special unicode characters to plain characters

    const DEBUG = true;
	const INTERVAL = 300; // ms
	// END OF SETTINGS. PLEASE DO NOT MODIFY ANYTHING BELOW THIS LINE IF YOU DON'T KNOW WHAT YOU ARE DOING

	const _spamFlair = "<span class='spam-flair' style='font-family: Roboto, Arial, sans-serif; font-size: 10px; color: #f5511e; margin-left: 10px; margin-top: 4px;'>我是五毛或者垃圾</span>";

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
			if (DEBUG) { console.log(`YTCF: New comments found (${currentCommentCount - commentCount}).`); }

			removeComments();
		}

		return setTimeout(function() {
			listenForNewComments(currentCommentCount);
		}, INTERVAL);
	}

	function removeComments() {
		$('ytd-comment-renderer')
			.each((index, detectedComment) => {
			let comment = $(detectedComment).find('#content-text').html().toLowerCase();

            if (CONVERT_DIACRITICS) {
                comment = removeDiacritics(comment);
            }

			const commentAuthorUrl = $(detectedComment).find('#author-text').attr('href');
			const commentWordCount = comment.split(' ').length;

			if (BLOCKED_USER_URLS.some((blockedUserUrl) => blockedUserUrl.includes(commentAuthorUrl))) {
				if (DEBUG) { console.log(`YTCF: Comment "${comment}" flagged because the user was in BLOCKED_USER_URLS`); }

				processCommentRemoval(detectedComment);
				return true;
			}

			if (comment.length < MIN_COMMENT_LENGTH) {
				if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the MIN_COMMENT_LENGTH rule (${comment.length}/${MIN_COMMENT_LENGTH})`); }

				processCommentRemoval(detectedComment);
				return true;
			}

			if (commentWordCount < MIN_COMMENT_WORDS) {
				if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the MIN_COMMENT_WORDS rule (${commentWordCount}/${MIN_COMMENT_WORDS})`); }

				processCommentRemoval(detectedComment);
				return true;
			}

			if (REMOVE_FIRST) {
				const first = [
"BBB"
				];

				for (var f in first) {
					if (comment.indexOf(first[f]) > -1 &&
						commentWordCount < MIN_COMMENT_WORDS_FILTER) {
						if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_FIRST rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_EARLY_AGGRESSIVE) {
				const early = "early";
				if (comment.indexOf(early) > -1 &&
					commentWordCount < MIN_COMMENT_WORDS_FILTER) {
					if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_EARLY_AGGRESSIVE rule.`); }

					processCommentRemoval(detectedComment);
					return true;
				}
			}

			if (REMOVE_EARLY) {
				const earlyOptions = [
"BB",
"人话",
"三飞",
"飞弹",
"专卖",
"反攻大陆",
"开枪",
"逼",
"东风",
"DF",
"巨浪",
"厉害",
"台独",
"台湾国",
"民共",
"民进党",
"灭",
"用爱发",
"优越",
"传染",
"奸",
"孙中山",
"导弹",
"穷",
"朱学恒",
"蒋",
"辽宁号",
"你妈",
"吹",
"呆湾",
"尼马",
"歼1",
"歼2",
"歼6",
"没钱",
"灿荣",
"纸上谈兵",
"诈菜",
"走狗",
"囼",
"国税局",
"宝杰",
"玩过",
"组织",
"经国号",
"轰",
"这",
"哔",
"威尔刚",
"弯弯",
"战",
"毒气",
"洁",
"烂",
"相声",
"看门狗",
"统一",
"党",
"剥削",
"爱国",
"畜",
"脏",
"脑",
"舰",
"三飞",
"飞弹",
"梦",
"渔船",
"着吗",
"野种",
"强调",
"智商",
"智障",
"渣",
"湾",
"猪",
"装备",
"傻B",
"意淫",
"签",
"腦",
"愿意",
"榨菜",
"熊三",
"操过",
"孽",
"彎彎",
"灣灣",
"湾湾",
"美帝",
"来宾",
"称霸",
"喝尿",
"兴奋",
"智商",
"Sb",
"SB",
"打个"
				];

				for (var eo in earlyOptions) {
					if (comment.indexOf(earlyOptions[eo]) > -1) {
						if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_EARLY rule.`); }

						processCommentRemoval(detectedComment);
						return true;
					}
				}
			}

			if (REMOVE_CRINGE_AGGRESSIVE) {
				const cringe = "cringe";

				if (comment.indexOf(cringe) > -1 &&
					commentWordCount < MIN_COMMENT_WORDS_FILTER) {
					if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_CRINGE_AGGRESSIVE rule.`); }

					processCommentRemoval(detectedComment);
					return true;
				}
			}

			if (REMOVE_SELF_LIKES) {
				const selfLikes = [
					"can i get a thumbs up",
					"can i have likes",
					"can i get a few likes",
					"like my comment",
					"like my own comment",
					"i get top rated",
					"i get top comment",
					"every person who likes this comment",
					"comment when done",
					"sub=",
					"sub =",
					"sub:",
					"like=",
					"like =",
					"like:",
					"dislike: ",
					"like if you're watching in",
"国"
				];

				for (var sl in selfLikes) {
					if (comment.indexOf(selfLikes[sl]) > -1) {
						if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_SELF_LIKES rule.`); }

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
						if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_SELF_PROMO rule.`); }

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
						if (DEBUG) { console.log(`YTCF: Comment "${comment}" violates the REMOVE_ATTENTION_SEEKERS rule.`); }

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
			if (FLAIR_INSTEAD_OF_REMOVE) { console.log(`YTCF: Flaired ${_removedComments} comments this run. Total flaired comments: ${_removedCommentsTotal}.`); }
			else { console.log(`YTCF: Removed ${_removedComments} comments this run. Total removed comments: ${_removedCommentsTotal}.`); }
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
			spamCounter.html(` (已處理${newSpamCount} 筆五毛留言)`);
		}
	}

	function listenToFilterClicks() {
		$(document).click((event) => {
			if (!$(event.target).parent().is('yt-sort-filter-sub-menu-renderer paper-item')) {
				return;
			}

			if (DEBUG) { console.log(`YTCF: Filter has changed.`); }
			resetCounters();
		});
	}

	function resetCounters() {
		if (DEBUG) { console.log(`YTCF: Resetting counters.`); }
		_removedComments = 0;
		_removedCommentsTotal = 0;
		const spamCounter = $('ytd-comments-header-renderer #count #spamCount');
		spamCounter.html(` (0 Spam)`);
	}

    const defaultDiacriticsRemovalMap = [
        {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
        {'base':'AA','letters':/[\uA732]/g},
        {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
        {'base':'AO','letters':/[\uA734]/g},
        {'base':'AU','letters':/[\uA736]/g},
        {'base':'AV','letters':/[\uA738\uA73A]/g},
        {'base':'AY','letters':/[\uA73C]/g},
        {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
        {'base':'DZ','letters':/[\u01F1\u01C4]/g},
        {'base':'Dz','letters':/[\u01F2\u01C5]/g},
        {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
        {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
        {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
        {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
        {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
        {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
        {'base':'LJ','letters':/[\u01C7]/g},
        {'base':'Lj','letters':/[\u01C8]/g},
        {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
        {'base':'NJ','letters':/[\u01CA]/g},
        {'base':'Nj','letters':/[\u01CB]/g},
        {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
        {'base':'OI','letters':/[\u01A2]/g},
        {'base':'OO','letters':/[\uA74E]/g},
        {'base':'OU','letters':/[\u0222]/g},
        {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
        {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
        {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
        {'base':'TZ','letters':/[\uA728]/g},
        {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
        {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'base':'VY','letters':/[\uA760]/g},
        {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
        {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
        {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
        {'base':'aa','letters':/[\uA733]/g},
        {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
        {'base':'ao','letters':/[\uA735]/g},
        {'base':'au','letters':/[\uA737]/g},
        {'base':'av','letters':/[\uA739\uA73B]/g},
        {'base':'ay','letters':/[\uA73D]/g},
        {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
        {'base':'dz','letters':/[\u01F3\u01C6]/g},
        {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
        {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
        {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
        {'base':'hv','letters':/[\u0195]/g},
        {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
        {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
        {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
        {'base':'lj','letters':/[\u01C9]/g},
        {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
        {'base':'nj','letters':/[\u01CC]/g},
        {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
        {'base':'oi','letters':/[\u01A3]/g},
        {'base':'ou','letters':/[\u0223]/g},
        {'base':'oo','letters':/[\uA74F]/g},
        {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
        {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
        {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
        {'base':'tz','letters':/[\uA729]/g},
        {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
        {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'base':'vy','letters':/[\uA761]/g},
        {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];

    let changes;
    function removeDiacritics(str) {
        if (!changes) {
            changes = defaultDiacriticsRemovalMap;
        }
        for (let i = 0; i < changes.length; i++) {
            str = str.replace(changes[i].letters, changes[i].base);
        }
        return str;
    }

    if (DEBUG) { console.log("YTCF: YouTube Comment Filter (YTCF) script active."); }
});
