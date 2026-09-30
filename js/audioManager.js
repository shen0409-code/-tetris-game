export class AudioManager {
    constructor() {
        this.audios = {};
        this.isMuted = false;
        this.bgmStarted = false;
    }

    init(audioAssets) {
        this.audios = audioAssets;
        if (this.audios.bgm) {
            this.audios.bgm.loop = true;
            this.audios.bgm.volume = 0.4;
        }
    }

    playBGM() {
        if (this.isMuted || !this.audios.bgm) return;
        this.audios.bgm.play().then(() => {
            this.bgmStarted = true;
        }).catch(() => {
            // 處理瀏覽器自動播放限制
        });
    }

    stopBGM() {
        if (this.audios.bgm) {
            this.audios.bgm.pause();
            this.audios.bgm.currentTime = 0;
        }
    }

    playSFX(key) {
        if (this.isMuted || !this.audios[key]) return;
        const sound = this.audios[key].cloneNode();
        sound.volume = 0.6;
        sound.play().catch(() => {});
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.audios.bgm) this.audios.bgm.pause();
        } else {
            if (this.audios.bgm) this.audios.bgm.play().catch(() => {});
        }
        return this.isMuted;
    }
}