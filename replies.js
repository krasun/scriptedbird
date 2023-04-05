// 1. Open a new browser window solely for tweet processing.
// 2. Open a notifications tab: https://twitter.com/notifications
// 3. Open the developer console and execute the script.
// 4. The script will open numerous tabs with unanswered replies.
// 5. Don't forget to unblock opening tabs from twitter.com.
// 6. Close the Notifications tab if you have enough tabs to reply.
// 7. Reply to all tweets and close the browser.

const preferences = {
    openNewWindowDelayMs: 500,
    scrollTimes: 20,
    scrollWaitTimeMilliseconds: 1000,
};

const openUnrepliedReplies = () => {
    const likeButtons = document.querySelectorAll('[data-testid=like]');
    console.log(`found ${likeButtons.length} replies with like buttons`);
    let unrepliedReplies = 0;
    for (const likeButton of likeButtons) {
        const ariaLabel = likeButton.getAttribute('area-label');
        if (ariaLabel && ariaLabel.toLowerCase().indexOf("liked")) {
            continue;
        }

        console.log(`found not processed reply, searching for the parent tweet container`);
        let parent = likeButton.parentNode;
        while (parent != null) {
            if (parent.dataset.testid == "tweet") {
                const tweetLinks = parent.querySelectorAll('a');
                for (const tweetLink of tweetLinks) {
                    if (tweetLink.hasChildNodes() && tweetLink.firstChild.tagName.toLowerCase() == "time") {
                        console.log(`found link to the tweet ${tweetLink.href}, opening in a new tab`);
                        setTimeout(() => {
                            window.open(tweetLink.href, "_blank");
                        }, preferences.openNewWindowDelayMs * unrepliedReplies);
                        unrepliedReplies++;
                    }
                }

                break;
            }
            parent = parent.parentNode;
        }
    }
};

let scrolled = 0;
let interval = null;
let previousScrollHeight = null;
function autoScrolling() {
    if (scrolled >= preferences.scrollTimes) {
        clearInterval(interval);
        return;
    }
    if (previousScrollHeight == document.body.scrollHeight) {
        return;
    }        
    openUnrepliedReplies();

    window.scrollTo(0, document.body.scrollHeight);
    previousScrollHeight = document.body.scrollHeight;
    scrolled++;    
}
interval = setInterval(autoScrolling, preferences.scrollWaitTimeMilliseconds);
