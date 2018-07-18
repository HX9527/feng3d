namespace feng3d
{
    export class LightPicker
    {
        private _meshRenderer: MeshRenderer

        constructor(meshRenderer: MeshRenderer)
        {
            this._meshRenderer = meshRenderer;
        }

        preRender(renderAtomic: RenderAtomic)
        {
            var pointLights: PointLight[] = [];
            var directionalLights: DirectionalLight[] = [];

            var scene3d = this._meshRenderer.gameObject.scene;
            if (scene3d)
            {
                pointLights = scene3d.collectComponents.pointLights.list;
                directionalLights = scene3d.collectComponents.directionalLights.list;
            }

            renderAtomic.shaderMacro.NUM_LIGHT = pointLights.length + directionalLights.length;
            //设置点光源数据

            renderAtomic.uniforms.u_pointLights = pointLights;
            renderAtomic.shaderMacro.NUM_POINTLIGHT = pointLights.length;

            //
            var castShadowDirectionalLights: DirectionalLight[] = [];
            var unCastShadowDirectionalLights: DirectionalLight[] = [];
            var directionalShadowMatrix: Matrix4x4[] = [];
            var directionalShadowMaps: Texture2D[] = [];
            directionalLights.forEach(element =>
            {
                if (!element.isVisibleAndEnabled) return;
                if (element.castShadows)
                {
                    castShadowDirectionalLights.push(element);
                    directionalShadowMatrix.push(element.shadow.camera.viewProjection);
                    directionalShadowMaps.push(element.shadowMap);
                } else
                {
                    unCastShadowDirectionalLights.push(element);
                }
            });

            renderAtomic.shaderMacro.NUM_DIRECTIONALLIGHT = unCastShadowDirectionalLights.length;
            renderAtomic.uniforms.u_directionalLights = unCastShadowDirectionalLights;
            //
            renderAtomic.shaderMacro.NUM_DIRECTIONALLIGHT_CASTSHADOW = castShadowDirectionalLights.length;
            renderAtomic.uniforms.u_castShadowDirectionalLights = castShadowDirectionalLights;
            renderAtomic.uniforms.u_directionalShadowMatrix = directionalShadowMatrix;
            renderAtomic.uniforms.u_directionalShadowMaps = directionalShadowMaps;
        }
    }
}