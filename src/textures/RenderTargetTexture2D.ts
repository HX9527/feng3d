namespace feng3d
{
    /**
     * 渲染目标纹理
     */
    export class RenderTargetTexture2D extends Texture2D
    {
        @watch("invalidate")
        OFFSCREEN_WIDTH = 1024;

        @watch("invalidate")
        OFFSCREEN_HEIGHT = 1024;

        constructor(raw?: gPartial<RenderTargetTexture2D>)
        {
            super(raw);
            this._isRenderTarget = true;
            this.format = TextureFormat.RGBA;
            this.minFilter = TextureMinFilter.NEAREST;
            this.magFilter = TextureMagFilter.NEAREST;
        }
    }
}