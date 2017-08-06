namespace feng3d
{
    export class BillboardComponent extends Component
    {
        /**
         * 相对
         */
        get camera()
        {
            return this._camera;
        }
        set camera(value)
        {
            if (this._camera == value)
                return;
            if (this._camera)
                this._camera.transform.off("scenetransformChanged", this.invalidHoldSizeMatrix, this);
            this._camera = value;
            if (this._camera)
                this._camera.transform.on("scenetransformChanged", this.invalidHoldSizeMatrix, this);
            this.invalidHoldSizeMatrix();
        }

        private _holdSize = 1;
        private _camera: Camera;

        constructor(gameobject: GameObject)
        {
            super(gameobject);
            this.transform.on("updateLocalToWorldMatrix", this.updateLocalToWorldMatrix, this);
        }

        private invalidHoldSizeMatrix()
        {
            this.transform.invalidateSceneTransform();
        }

        private updateLocalToWorldMatrix()
        {
            var _localToWorldMatrix = this.transform["_localToWorldMatrix"];
            if (this._camera)
            {
                var camera = this._camera;
                var parentInverseSceneTransform = (this.transform.parent && this.transform.parent.worldToLocalMatrix) || new Matrix3D();
                var cameraPos = parentInverseSceneTransform.transformVector(camera.transform.localToWorldMatrix.position);
                var yAxis = parentInverseSceneTransform.deltaTransformVector(Vector3D.Y_AXIS);
                this.transform.lookAt(cameraPos, yAxis);
            }
        }

        dispose()
        {
            this.camera = null;
            this.transform.off("updateLocalToWorldMatrix", this.updateLocalToWorldMatrix, this);
            super.dispose();
        }
    }
}