import { ReviewWebhook } from './ReviewWebhook.ts';

const API_KEY = "${{reviewsApiKey}}";

const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

export async function reviewAutoRespond(webhook: any) {
    // Process Webhook
    const webhook_payload: ReviewWebhook = webhook;
    // Make a call to the Assets:List endpoint
    const request = new Request (`https://api.yextapis.com/v2/accounts/me/assets?v=20230401&api_key=${API_KEY}`, {
      method: 'GET',  
      headers: {
      "content-type": "application/json",
      },
      });
      const response = await fetch(request).then(response => response.json());
      // Filter assets by review labels
      const reviewLabelNames = webhook_payload.review.reviewLabels?.map((label) => label.name);
      const reviewLabelAssets = response.response.assets.filter(asset => asset.labels.some(label => reviewLabelNames?.includes(label)));
      // Find assets with "autoresponse" usage and store their values in review response array
      const reviewResponseArray: string[] = [];
      reviewLabelAssets.forEach(asset => {
          if (asset.usage.length === 1 && asset.usage[0].type === 'REVIEW_RESPONSE') {
              reviewResponseArray.push(asset.value);
          }
      });
      // Choose a review response asset at random
      const reviewResponse = reviewResponseArray[Math.floor(Math.random() * reviewResponseArray.length)];
      console.log(reviewResponseArray)
      // Check the following conditions:
      //// Review is new
      //// There are no previous comments
      if (webhook_payload.meta.eventType === 'REVIEW_CREATED' && webhook_payload.review.comments.length === 0){
          console.log(reviewLabelNames);
          // Exit if review has content and user doesn't want to respond to reviews with content
                console.log("Attempting to post...");
                // Wait 10s to avoid race condition
                await delay(10000);
                // Post response via API
                await respondViaApi(webhook_payload.review.id, reviewResponse);
            }
}
export async function respondViaApi(review_id: number, review_response: any) {
  try {
    const requestUri = 'https://api.yextapis.com/v2/accounts/me/reviews/' + review_id.toString() + '/comments?v=20230401&api_key=' + API_KEY;
    const response = await fetch(requestUri, {
      method: 'POST',
      body: JSON.stringify({
        content: review_response,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response_json = await response.json();
    console.log(response_json);
  } catch (error) {
    console.log('here');
    console.log(error);
  }
}