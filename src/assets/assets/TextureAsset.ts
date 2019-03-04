namespace feng3d
{
    /**
     * 纹理文件
     */
    export class TextureAsset extends FileAsset
    {
        /**
         * 材质
         */
        @oav({ component: "OAVObjectView" })
        data = new Texture2D();

        extenson: ".jpg" | ".png" | ".jpeg" | ".gif" = ".png";

        /**
         * 图片
         */
        get image() { return this._image; }

        set image(v: HTMLImageElement)
        {
            this._image = v;
            this.data["_pixels"] = v;
        }
        private _image: HTMLImageElement;

        assetType = AssetType.texture;

        saveFile(callback?: (err: Error) => void)
        {
            this.data.assetId = this.assetId;
            this.rs.fs.writeImage(this.assetPath, this.image, (err) =>
            {
                callback && callback(err);
            });
        }

        /**
         * 读取文件
         * 
         * @param callback 完成回调
         */
        readFile(callback?: (err: Error) => void)
        {
            this.rs.fs.readImage(this.assetPath, (err, img: HTMLImageElement) =>
            {
                this.image = img;
                this.data.assetId = this.assetId;
                callback && callback(err);
            });
        }

        /**
         * 读取元标签
         * 
         * @param callback 完成回调 
         */
        readMeta(callback?: (err?: Error) => void)
        {
            super.readMeta((err) =>
            {
                this.data = serialization.deserialize(this.meta["texture"]);
                callback && callback(err);
            });
        }

        /**
         * 写元标签
         * 
         * @param callback 完成回调
         */
        writeMeta(callback?: (err: Error) => void)
        {
            this.meta["texture"] = serialization.serialize(this.data);
            this.rs.fs.writeObject(this.metaPath, this.meta, callback);
        }
    }
}