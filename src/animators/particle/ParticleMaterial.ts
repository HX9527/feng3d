namespace feng3d
{

    export interface UniformsMap { particle: ParticleUniforms }

    export class ParticleUniforms extends StandardUniforms
    {
        __class__: "feng3d.ParticleUniforms" = "feng3d.ParticleUniforms";

        s_diffuse = UrlImageTexture2D.defaultParticle;
    }

    shaderConfig.shaders["particle"].cls = ParticleUniforms;

    Feng3dAssets.setAssets(Material.particle = new Material().value({
        name: "Particle-Material", assetsId: "Particle-Material", shaderName: "particle",
        renderParams: { enableBlend: true, sfactor: BlendFactor.SRC_COLOR, dfactor: BlendFactor.ONE_MINUS_SRC_COLOR },
        hideFlags: HideFlags.NotEditable,
    }));
}