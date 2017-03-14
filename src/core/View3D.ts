module feng3d
{

    /**
     * 3D视图
     * @author feng 2016-05-01
     */
    export class View3D
    {
		/**
		 * 射线坐标临时变量
		 */
        private static tempRayPosition: Vector3D = new Vector3D();
        /**
		 * 射线方向临时变量
		 */
        private static tempRayDirection: Vector3D = new Vector3D();

        //
        private _context3D: Context3D;
        private _camera: CameraObject3D;
        private _scene: Scene3D;
        private _canvas: HTMLCanvasElement;

        /**
         * 默认渲染器
         */
        private defaultRenderer: ForwardRenderer;

        /**
         * 鼠标事件管理器
         */
        private mouse3DManager: Mouse3DManager;

        /**
         * 背景颜色
         */
        public background = new Color(0, 0, 0);

        /**
         * 构建3D视图
         * @param canvas    画布
         * @param scene     3D场景
         * @param camera    摄像机
         */
        constructor(canvas, scene: Scene3D = null, camera: CameraObject3D = null)
        {

            assert(canvas instanceof HTMLCanvasElement, `canvas参数必须为 HTMLCanvasElement 类型！`);
            this._canvas = canvas;

            this._context3D = <Context3D>this._canvas.getContext(contextId, { antialias: false });
            this._context3D.getContextAttributes();

            this.initGL();

            this.scene = scene || new Scene3D();
            this.camera = camera || new CameraObject3D();

            this.defaultRenderer = new ForwardRenderer();
            this.mouse3DManager = new Mouse3DManager();

            ticker.addEventListener(Event.ENTER_FRAME, this.drawScene, this);
        }

        /**
         * 初始化GL
         */
        private initGL()
        {

            this._context3D.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
            this._context3D.clearDepth(1.0);                 // Clear everything
            this._context3D.enable(Context3D.DEPTH_TEST);           // Enable depth testing
            this._context3D.depthFunc(Context3D.LEQUAL);            // Near things obscure far things
        }

        /** 3d场景 */
        public get scene(): Scene3D
        {
            return this._scene;
        }

        public set scene(value: Scene3D)
        {
            this._scene = value;
        }

        /**
         * 绘制场景
         */
        private drawScene(event: Event)
        {
            var viewRect: Rectangle = this.viewRect;

            this.camera.camera.aspectRatio = viewRect.width / viewRect.height;

            //鼠标拾取渲染
            this.mouse3DManager.viewRect.copyFrom(viewRect);
            this.mouse3DManager.draw(this._context3D, this._scene, this._camera.camera);

            // 默认渲染
            this._context3D.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
            this._context3D.clear(Context3D.COLOR_BUFFER_BIT | Context3D.DEPTH_BUFFER_BIT);
            this._context3D.viewport(0, 0, viewRect.width, viewRect.height);
            // Enable alpha blending
            this._context3D.enable(Context3D.BLEND);
            // Set blending function
            this._context3D.blendFunc(Context3D.SRC_ALPHA, Context3D.ONE_MINUS_SRC_ALPHA);
            this.defaultRenderer.draw(this._context3D, this._scene, this._camera.camera);
            this._context3D.disable(Context3D.BLEND);
        }

        /**
         * 更新视窗区域
         */
        public get viewRect()
        {
            var viewRect: Rectangle = new Rectangle();

            this._canvas.width = this._canvas.clientWidth;
            this._canvas.height = this._canvas.clientHeight;
            var viewWidth = this._canvas.width;
            var viewHeight = this._canvas.height;
            var x = 0;
            var y = 0;
            var obj: HTMLElement = this._canvas;
            do
            {
                x += obj.offsetLeft;
                y += obj.offsetTop;
                obj = obj.parentElement;
            }
            while (obj);
            viewRect.setTo(x, y, viewWidth, viewHeight);

            return viewRect;
        }

        /**
         * 摄像机
         */
        public get camera()
        {
            return this._camera;
        }

        public set camera(value)
        {
            this._camera = value;
        }

        /**
         * 鼠标在3D视图中的位置
         */
        public get mousePos()
        {
            var viewRect: Rectangle = this.viewRect;
            var pos = new Point(this.mouse3DManager.mouseX - viewRect.x, this.mouse3DManager.mouseY - viewRect.y);
            return pos;
        }

        /**
		 * 获取鼠标射线（与鼠标重叠的摄像机射线）
		 */
        public getMouseRay3D(): Ray3D
        {
            var pos = this.mousePos;
            return this.getRay3D(pos.x, pos.y);
        }

        /**
		 * 获取与坐标重叠的射线
		 * @param x view3D上的X坐标
		 * @param y view3D上的X坐标
		 * @return
		 */
        public getRay3D(x: number, y: number): Ray3D
        {
            //摄像机坐标
            var rayPosition: Vector3D = this.unproject(x, y, 0, View3D.tempRayPosition);
            //摄像机前方1处坐标
            var rayDirection: Vector3D = this.unproject(x, y, 1, View3D.tempRayDirection);
            //射线方向
            rayDirection.x = rayDirection.x - rayPosition.x;
            rayDirection.y = rayDirection.y - rayPosition.y;
            rayDirection.z = rayDirection.z - rayPosition.z;
            rayDirection.normalize();
            //定义射线
            var ray3D: Ray3D = new Ray3D(rayPosition, rayDirection);
            return ray3D;
        }

        /**
		 * 屏幕坐标投影到场景坐标
		 * @param nX 屏幕坐标X ([0-width])
		 * @param nY 屏幕坐标Y ([0-height])
		 * @param sZ 到屏幕的距离
		 * @param v 场景坐标（输出）
		 * @return 场景坐标
		 */
        public unproject(sX: number, sY: number, sZ: number, v: Vector3D = null): Vector3D
        {
            var gpuPos: Point = this.screenToGpuPosition(new Point(sX, sY));
            return this._camera.camera.unproject(gpuPos.x, gpuPos.y, sZ, v);
        }

        /**
		 * 屏幕坐标转GPU坐标
		 * @param screenPos 屏幕坐标 (x:[0-width],y:[0-height])
		 * @return GPU坐标 (x:[-1,1],y:[-1-1])
		 */
        public screenToGpuPosition(screenPos: Point): Point
        {
            var gpuPos: Point = new Point();
            gpuPos.x = (screenPos.x * 2 - this._canvas.width) / this._canvas.width;
            gpuPos.y = (screenPos.y * 2 - this._canvas.height) / this._canvas.height;
            return gpuPos;
        }

        /**
         * 获取单位像素在指定深度映射的大小
         * @param   depth   深度
         */
        public getScaleByDepth(depth: number)
        {
            var centerX = this.viewRect.width / 2;
            var centerY = this.viewRect.height / 2;
            var lt = this.unproject(centerX - 0.5, centerY - 0.5, depth);
            var rb = this.unproject(centerX + 0.5, centerY + 0.5, depth);
            var scale = lt.subtract(rb).length;
            return scale;
        }
    }
}