const { EmbedBuilder } = require("discord.js");

module.exports = class Music {
    title; // music name(video title)
    videoId;
    url;
    author;
    thumbnail;
    requestMember;

    setTitle(title) {
        this.title = title;
        return this;
    }
    setVideoId(videoId) {
        this.videoId = videoId;
        return this
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setAuthor(author) {
        this.author = author;
        return this;
    }
    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }
    setRequestMember(requestMember) {
        this.requestMember = requestMember;
        return this;
    }

    nowPlayingMessageEmbed() {
        return new EmbedBuilder()
            .setTitle("Now Playing...").setURL(this.url)
            .setDescription(this.title)
            .setThumbnail(this.thumbnail.url).data;
    }
    queueAddedMessageEmbed() {
        return new EmbedBuilder()
            .setTitle("Queue added!").setURL(this.url)
            .setDescription(this.title).data
    }
}