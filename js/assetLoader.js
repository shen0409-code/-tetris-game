export class AssetLoader {
    constructor() {
        this.images = {};
        this.audios = {};
    }

    loadImage(key, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`[AssetLoader] 圖片載入失敗: ${src}，自動切換為繪製模式。`);
                this.images[key] = null;
                resolve(null);
            };
            img.src = src;
        });
    }

    loadAudio(key, src) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.audios[key] = audio;
                resolve(audio);
            };
            audio.onerror = () => {
                console.warn(`[AssetLoader] 音訊載入失敗: ${src}`);
                this.audios[key] = null;
                resolve(null);
            };
            audio.src = src;
        });
    }

    async loadAll(assetsConfig) {
        const promises = [];

        if (assetsConfig.images) {
            for (const [key, src] of Object.entries(assetsConfig.images)) {
                promises.push(this.loadImage(key, src));
            }
        }

        if (assetsConfig.audios) {
            for (const [key, src] of Object.entries(assetsConfig.audios)) {
                promises.push(this.loadAudio(key, src));
            }
        }

        await Promise.all(promises);
        return { images: this.images, audios: this.audios };
    }
}