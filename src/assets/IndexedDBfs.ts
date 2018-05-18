namespace feng3d
{
    /**
     * 索引数据文件系统
     */
    export var indexedDBfs: IndexedDBfs;

    /**
     * 索引数据文件系统
     */
    export class IndexedDBfs implements ReadWriteFS
    {
        get type()
        {
            return FSType.indexedDB;
        }

        /**
         * 数据库名称
         */
        DBname: string;
        /**
         * 项目名称（表单名称）
         */
        projectname: string;

        constructor(DBname = "feng3d-editor", projectname = "testproject")
        {
            this.DBname = DBname;
            this.projectname = projectname;
        }

        /**
         * 读取文件
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readFile(path: string, callback: (err: Error, data: ArrayBuffer) => void)
        {
            storage.get(this.DBname, this.projectname, path, (err, data) =>
            {
                callback(null, data ? data.data : null);
            });
        }

        /**
         * 获取文件绝对路径
         * @param path （相对）路径
         * @param callback 回调函数
         */
        getAbsolutePath(path: string, callback: (err: Error, absolutePath: string) => void): void
        {
            callback(null, path);
        }

        /**
         * 获取文件信息
         * @param path 文件路径
         * @param callback 回调函数
         */
        stat(path: string, callback: (err: Error, stats: FileInfo) => void): void
        {
            storage.get(this.DBname, this.projectname, path, (err, data) =>
            {
                if (data)
                {
                    callback(null, {
                        path: path,
                        birthtime: data.birthtime.getTime(),
                        mtime: data.birthtime.getTime(),
                        isDirectory: data.isDirectory,
                        size: 0
                    });
                }
                else
                {
                    callback(new Error(path + " 不存在"), null);
                }
            });
        }

        /**
         * 读取文件夹中文件列表
         * @param path 路径
         * @param callback 回调函数
         */
        readdir(path: string, callback: (err: Error, files: string[]) => void): void
        {
            storage.getAllKeys(this.DBname, this.projectname, (err, allfilepaths) =>
            {
                if (!allfilepaths)
                {
                    callback(err, null);
                    return;
                }
                var subfilemap = {};
                allfilepaths.forEach(element =>
                {
                    if (element.substr(0, path.length) == path && element != path)
                    {
                        var result = element.substr(path.length);
                        var index = result.indexOf("/");
                        if (index != -1)
                            result = result.substring(0, index + 1);
                        subfilemap[result] = 1;
                    }
                });
                var files = Object.keys(subfilemap);
                callback(null, files);
            });
        }

        /**
         * 新建文件夹
         * @param path 文件夹路径
         * @param callback 回调函数
         */
        mkdir(path: string, callback: (err: Error) => void): void
        {
            storage.set(this.DBname, this.projectname, path, { isDirectory: true, birthtime: new Date() }, callback);
        }

        /**
         * 删除文件
         * @param path 文件路径
         * @param callback 回调函数
         */
        deleteFile(path: string, callback: (err: Error) => void)
        {
            storage.delete(this.DBname, this.projectname, path, callback);
        }

        /**
         * 写文件
         * @param path 文件路径
         * @param data 文件数据
         * @param callback 回调函数
         */
        writeFile(path: string, data: ArrayBuffer, callback?: (err: Error) => void)
        {
            storage.set(this.DBname, this.projectname, path, { isDirectory: false, birthtime: new Date(), data: data }, callback);
        }

        /**
         * 获取所有文件路径
         * @param callback 回调函数
         */
        getAllPaths(callback: (err: Error, allPaths: string[]) => void)
        {
            storage.getAllKeys(this.DBname, this.projectname, callback);
        }
    }

    indexedDBfs = new IndexedDBfs();

    export type FileInfo = { path: string, birthtime: number, mtime: number, isDirectory: boolean, size: number };
}