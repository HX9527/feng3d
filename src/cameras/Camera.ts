module feng3d
{
	/**
	 * 摄像机
	 * @author feng 2016-08-16
	 */
    export abstract class Camera extends Object3DComponent
    {
        protected _matrix: Matrix3D;
        protected _scissorRect: Rectangle = new Rectangle();
        protected _viewPort: Rectangle = new Rectangle();
        protected _near: number = 0.1;
        protected _far: number = 10000;
        protected _aspectRatio: number = 1;

        protected _matrixInvalid: boolean = true;

        private _unprojection: Matrix3D;
        private _unprojectionInvalid: boolean = true;

        private _viewProjection: Matrix3D = new Matrix3D();
        private _viewProjectionDirty: boolean = true;

		/**
		 * 创建一个摄像机
		 * @param lens 摄像机镜头
		 */
        constructor()
        {
            super();
            this._single = true;
            this._matrix = new Matrix3D();
        }

		/**
		 * 投影矩阵
		 */
        public get matrix(): Matrix3D
        {
            if (this._matrixInvalid)
            {
                this.updateMatrix();
                this._matrixInvalid = false;
            }
            return this._matrix;
        }

        public set matrix(value: Matrix3D)
        {
            this._matrix = value;
            this.invalidateMatrix();
        }

		/**
		 * 最近距离
		 */
        public get near(): number
        {
            return this._near;
        }

        public set near(value: number)
        {
            if (value == this._near)
                return;
            this._near = value;
            this.invalidateMatrix();
        }

		/**
		 * 最远距离
		 */
        public get far(): number
        {
            return this._far;
        }

        public set far(value: number)
        {
            if (value == this._far)
                return;
            this._far = value;
            this.invalidateMatrix();
        }

		/**
		 * 视窗缩放比例(width/height)，在渲染器中设置
		 */
        public get aspectRatio(): number
        {
            return this._aspectRatio;
        }

        public set aspectRatio(value: number)
        {
            if (this._aspectRatio == value || (value * 0) != 0)
                return;
            this._aspectRatio = value;
            this.invalidateMatrix();
        }

		/**
		 * 场景坐标投影到屏幕坐标
		 * @param point3d 场景坐标
		 * @param v 屏幕坐标（输出）
		 * @return 屏幕坐标
		 */
        public project(point3d: Vector3D, v: Vector3D = null): Vector3D
        {
            if (!v)
                v = new Vector3D();
            this.matrix.transformVector(point3d, v);
            v.x = v.x / v.w;
            v.y = -v.y / v.w;

            v.z = point3d.z;

            return v;
        }

		/**
		 * 投影逆矩阵
		 */
        public get unprojectionMatrix(): Matrix3D
        {
            if (this._unprojectionInvalid)
            {
                if (this._unprojection == null)
                    this._unprojection = new Matrix3D();
                this._unprojection.copyFrom(this.matrix);
                this._unprojection.invert();
                this._unprojectionInvalid = false;
            }

            return this._unprojection;
        }

		/**
		 * 投影矩阵失效
		 */
        protected invalidateMatrix()
        {
            this._matrixInvalid = true;
            this._unprojectionInvalid = true;
        }

        /**
		 * 场景投影矩阵，世界空间转投影空间
		 */
        public get viewProjection(): Matrix3D
        {
            if (this._viewProjectionDirty)
            {
                //场景空间转摄像机空间
                this._viewProjection.copyFrom(this.inverseSceneTransform);
                //+摄像机空间转投影空间 = 场景空间转投影空间
                this._viewProjection.append(this.matrix);
                this._viewProjectionDirty = false;
            }

            return this._viewProjection;
        }

        public get inverseSceneTransform()
        {
            return this.parentComponent ? this.parentComponent.transform.inverseGlobalMatrix3D : new Matrix3D();
        }

        public get globalMatrix3D()
        {
            return this.parentComponent ? this.parentComponent.transform.globalMatrix3D : new Matrix3D();
        }

		/**
		 * 更新投影矩阵
		 */
        protected abstract updateMatrix();

        /**
		 * 屏幕坐标投影到场景坐标
		 * @param nX 屏幕坐标X -1（左） -> 1（右）
		 * @param nY 屏幕坐标Y -1（上） -> 1（下）
		 * @param sZ 到屏幕的距离
		 * @param v 场景坐标（输出）
		 * @return 场景坐标
		 */
        public unproject(nX: number, nY: number, sZ: number, v: Vector3D = null): Vector3D
        {
            return this.globalMatrix3D.transformVector(this.unproject(nX, nY, sZ, v), v);
        }

        /**
         * 处理被添加组件事件
         */
        protected onBeAddedComponent(event: ComponentEvent): void
        {
            this.parentComponent.addEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.onSpaceTransformChanged, this);
        }

        /**
         * 处理被移除组件事件
         */
        protected onBeRemovedComponent(event: ComponentEvent): void
        {
            this.parentComponent.removeEventListener(TransformEvent.SCENETRANSFORM_CHANGED, this.onSpaceTransformChanged, this);
        }

        private onSpaceTransformChanged(event: TransformEvent): void
        {
            this._viewProjectionDirty = true;
        }

        /**
		 * 更新渲染数据
		 */
        public updateRenderData(renderContext: RenderContext)
        {
            super.updateRenderData(renderContext);
            //
            this._renderData.uniforms[RenderDataID.u_viewProjection] = this.viewProjection;
            var globalMatrix3d = this.parentComponent ? this.parentComponent.transform.globalMatrix3D : new Matrix3D();
            this._renderData.uniforms[RenderDataID.u_cameraMatrix] = globalMatrix3d;
        }
    }
}