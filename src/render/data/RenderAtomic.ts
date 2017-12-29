namespace feng3d
{
    /**
     * 渲染原子（该对象会收集一切渲染所需数据以及参数）
     * @author feng 2016-06-20
     */
    export class RenderAtomic
    {
        /**
         * 顶点索引缓冲
         */
        indexBuffer: Index;

        /**
         * 渲染参数
         */
        renderParams = new RenderParams();

        /**
         * 渲染程序
         */
        shader = new Shader();

        /**
         * 属性数据列表
         */
        attributes: Attributes = <any>{};

        /**
         * Uniform渲染数据
         */
        uniforms: LazyUniforms = <any>{};

        /**
         * 渲染实例数量
         */
        instanceCount: Lazy<number>;

        /**
         * 可渲染条件，当所有条件值均为true是可以渲染
         */
        renderableCondition: RenderableCondition = {}

        constructor()
        {
            this.uniforms.s_ambient
        }
    }

    export interface RenderableCondition
    {

    }
}