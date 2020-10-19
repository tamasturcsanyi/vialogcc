'use strict';

let video = {
    videoId: Number,
    objType: String,
    eventName: String,
    video_token: String,
    replyTo: Number,
    created: Date,
    duration: Number,
    videoResolution: String,
    label: String,
    threadId: Number,
    position: Number,
    views: Number,
    moderatedBy: String,
    moderationDate: Date,
    communityManagerNotes: String,
    rewards: Number,
    video_state: String,
    video_type: String
};


class Video {

    async create(type, videoId, eventName, video_token, replyTo, created, duration, videoResolution, label, threadId, position, views, moderatedBy, moderationDate, communityManagerNotes, rewards, video_state, video_type) {
        
        video.objType = type;
        video.eventName = eventName;
        video.videoId = videoId;
        video.video_token = video_token;
        video.replyTo = replyTo;
        video.created = created;
        video.duration = duration;
        video.videoResolution = videoResolution;
        video.label = label;
        video.threadId = threadId;
        video.position = position;
        video.views = views;
        video.moderatedBy = moderatedBy;
        video.moderationDate = moderationDate;
        video.communityManagerNotes = communityManagerNotes;
        video.rewards = rewards;
        video.video_state = video_state;
        video.video_type = video_type;

        return video;
    }

    async getStateId() {
        return video.objType + video.videoId;
    }
}

module.exports = {
    Video
};