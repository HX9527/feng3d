namespace feng3d
{
    export interface ComponentMap { Behaviour: Behaviour; }

    /**
     * 行为
     * 
     * 可以控制开关的组件
     */
    export class Behaviour extends Component
    {

        /**
         * 是否启用update方法
         */
        @oav()
        @serialize
        enabled = true;

        /**
         * 可运行环境
         */
        runEnvironment = RunEnvironment.all;

        /**
         * Has the Behaviour had enabled called.
         * 是否所在GameObject显示且该行为已启动。
         */
        get isVisibleAndEnabled()
        {
            var v = this.enabled && this.gameObject && this.gameObject.visible;
            return v;
        }

        /**
         * 每帧执行
         */
        update(interval?: number)
        {
        }

        dispose()
        {
            this.enabled = false;
            super.dispose();
        }
    }
}