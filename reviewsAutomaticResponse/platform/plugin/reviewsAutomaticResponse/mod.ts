import { ReviewWebhook } from './ReviewWebhook.ts'

declare const BASE_URI = 'https://api.yext.com/v2/accounts/me/reviews/'
const RESPONSE = "${{response}}";
//const RESPONSE = "Thanks for your review - Automated Response";
const API_KEY = "${{reviewsApiKey}}";
//const API_KEY = "5664c5d1c35ceb387f41f63d028a6b8f";
const MIN_RATING = "${{minimumRating}}";
//const MIN_RATING = "5";
const RESPOND_TO_CONTENT = "${{respondToReviewsWithContent}}";
//const RESPOND_TO_CONTENT = "No";




const delay = (ms: number|undefined) => new Promise(res => setTimeout(res, ms));


export async function reviewAutoRespond(webhook: any) {
    // Process Webhook
    const webhook_payload: ReviewWebhook = webhook;

    // Check the following conditions:
    //// Review is new
    //// There are no previous comments
    if (webhook_payload.meta.eventType === 'REVIEW_CREATED' && webhook_payload.review.comments.length === 0){
        // Check Rating meets user-supplied threshhold
        if ( webhook_payload.review.rating >= Number(MIN_RATING) ) {
            // Exit if review has content and user doesn't want to respond to reviews with content
            if ( webhook_payload.review.content != '' && RESPOND_TO_CONTENT == 'No') {
                return
            }
            else {
                console.log("Attempting to post response...")
                // Wait 10s to avoid race condition
                await delay(10000);
                // Post response via API
                await respondViaApi(webhook_payload.review.id, RESPONSE)
            }
        }
    }
    return
}

export async function respondViaApi(review_id: number, review_response: any) {
    try {
        let requestUri = 'https://api.yext.com/v2/accounts/me/reviews/' + review_id.toString() + '/comments?v=20221220&api_key=' + API_KEY;

        const response = await fetch(requestUri, {
            method: 'POST',
            body: JSON.stringify({
                content: review_response,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const response_json = await response.json()
        console.log(response_json)

    } catch (error) {
        console.log('here')
        console.log(error)
    }
}