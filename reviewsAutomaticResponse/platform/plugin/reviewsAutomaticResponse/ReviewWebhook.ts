export interface Comment {
    id: number;
    publisherDate: number;
    authorName: string;
    authorEmail: string;
    authorRole: string;
    content: string;
    visibility: string;
}

export interface ReviewLabel {
    id: number;
    name: string;
}
export interface ReviewWebhook {
    review : {
        id: number;
        rating: number;
        content?: string;
        status: string;
        entityId: string;
        authorName: string;
        comments: Comment[];
        reviewLabels: ReviewLabel[];
    },
    meta: {
        uuid: string;
        timestamp: number;
        accountId: string;
        appSpecificAccountId: string;
        eventType: string;
    }
}