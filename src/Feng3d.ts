type gPartial<T> = {
    [P in keyof T]?: gPartial<T[P]>;
};

namespace feng3d
{
    /**
     * 运行环境枚举
     */
    export enum RunEnvironment
    {
        feng3d,
        /**
         * 运行在编辑器中
         */
        editor,
    }

    /**
     * feng3d的版本号

     */
    export var revision: string = "2018.08.02";
    /**
     * 是否开启调试(主要用于断言)
     */
    export var debuger = true;

	/**
     * 快捷键
     */
    export var shortcut = new ShortCut();

    /**
     * 运行环境
     */
    export var runEnvironment = RunEnvironment.feng3d;

    /**
     * 资源路径
     */
    export var assetsRoot = "";

    export var componentMap = {
        Transform: Transform,
    };

    log(`feng3d version ${revision}`)
}