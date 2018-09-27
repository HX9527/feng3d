namespace feng3d
{
    export interface ComponentMap { Model: Model }

    export class Model extends Behaviour
    {
        __class__: string;

        get single() { return true; }

        /**
         * 几何体
         */
        @oav({ component: "OAVPick", tooltip: "几何体，提供模型以形状", componentParam: { accepttype: "geometry", datatype: "geometry" } })
        @serializeAssets
        @watch("onGeometryChanged")
        geometry: Geometrys;

        /**
         * 材质
         */
        @oav({ component: "OAVPick", tooltip: "材质，提供模型以皮肤", componentParam: { accepttype: "material", datatype: "material" } })
        @serializeAssets
        @watch("onMaterialChanged")
        material: Material;

        /**
         * 是否投射阴影
         */
        @oav()
        @serialize
        castShadows = true;

        /**
         * 是否接受阴影
         */
        @oav()
        @serialize
        receiveShadows = true;

        /**
         * 启用的材质
         */
        get activeMaterial()
        {
            return this._activeMaterial;
        }

        /**
		 * 自身局部包围盒
		 */
        get selfLocalBounds()
        {
            if (!this._selfLocalBounds)
                this.updateBounds();

            return this._selfLocalBounds;
        }

		/**
		 * 自身世界包围盒
		 */
        get selfWorldBounds()
        {
            if (!this._selfWorldBounds)
                this.updateWorldBounds();

            return this._selfWorldBounds;
        }

        constructor()
        {
            super();
            this._lightPicker = new LightPicker(this);
        }

        init(gameObject: GameObject)
        {
            super.init(gameObject);
            this.on("scenetransformChanged", this.onScenetransformChanged, this);
        }

        beforeRender(gl: GL, renderAtomic: RenderAtomic, scene3d: Scene3D, camera: Camera)
        {
            renderAtomic.uniforms.u_modelMatrix = () => this.transform.localToWorldMatrix;
            renderAtomic.uniforms.u_ITModelMatrix = () => this.transform.ITlocalToWorldMatrix;
            renderAtomic.uniforms.u_mvMatrix = () => lazy.getvalue(renderAtomic.uniforms.u_modelMatrix).clone().append(lazy.getvalue(renderAtomic.uniforms.u_viewMatrix));
            renderAtomic.uniforms.u_ITMVMatrix = () => lazy.getvalue(renderAtomic.uniforms.u_mvMatrix).clone().invert().transpose();

            //
            this._activeGeometry.beforeRender(renderAtomic);
            this._activeMaterial.beforeRender(renderAtomic);
            this._lightPicker.beforeRender(renderAtomic);
        }

        /**
          * 判断射线是否穿过对象
          * @param ray3D
          * @return
          */
        isIntersectingRay(ray3D: Ray3D)
        {
            var localNormal = new Vector3();

            //转换到当前实体坐标系空间
            var localRay = new Ray3D();

            this.transform.worldToLocalMatrix.transformVector(ray3D.position, localRay.position);
            this.transform.worldToLocalMatrix.deltaTransformVector(ray3D.direction, localRay.direction);

            //检测射线与边界的碰撞
            var rayEntryDistance = this.selfLocalBounds.rayIntersection(localRay.position, localRay.direction, localNormal);
            if (rayEntryDistance < 0)
                return null;

            //保存碰撞数据
            var pickingCollisionVO: PickingCollisionVO = {
                gameObject: this.gameObject,
                localNormal: localNormal,
                localRay: localRay,
                rayEntryDistance: rayEntryDistance,
                ray3D: ray3D,
                rayOriginIsInsideBounds: rayEntryDistance == 0,
                geometry: this._activeGeometry,
                cullFace: this._activeMaterial.renderParams.cullFace,
            };

            return pickingCollisionVO;
        }

        /**
         * 销毁
         */
        dispose()
        {
            this.geometry = <any>null;
            this.material = <any>null;
            super.dispose();
        }

        //
        private _lightPicker: LightPicker;
        private _selfLocalBounds: Box;
        private _selfWorldBounds: Box;
        /**
         * 启用的几何体
         */
        @watch("onActiveGeometryChanged")
        private _activeGeometry: Geometrys = Geometry.cube;
        private _activeMaterial = Material.default;

        private onGeometryChanged()
        {
            this._activeGeometry = this.geometry || Geometry.cube;
            this.onBoundsInvalid();
        }

        private onMaterialChanged()
        {
            this._activeMaterial = this.material || Material.default;
        }

        private onActiveGeometryChanged(property: string, oldValue: Geometrys, value: Geometrys)
        {
            if (oldValue)
            {
                oldValue.off("boundsInvalid", this.onBoundsInvalid, this);
            }
            if (value)
            {
                value.on("boundsInvalid", this.onBoundsInvalid, this);
            }
        }

        private onScenetransformChanged()
        {
            this._selfWorldBounds = null;
        }

		/**
		 * 更新世界边界
		 */
        private updateWorldBounds()
        {
            this._selfWorldBounds = this.selfLocalBounds.applyMatrix3DTo(this.transform.localToWorldMatrix);
        }

        /**
         * 处理包围盒变换事件
         */
        private onBoundsInvalid()
        {
            this._selfLocalBounds = null;
            this._selfWorldBounds = null;
        }

        /**
		 * @inheritDoc
		 */
        private updateBounds()
        {
            this._selfLocalBounds = this._activeGeometry.bounding;
        }
    }
}