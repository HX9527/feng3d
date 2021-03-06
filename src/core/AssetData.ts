namespace feng3d
{
    /**
     * 资源数据
     * 
     * 该对象可由资源文件中读取，或者保存为资源
     */
    export class AssetData extends Feng3dObject
    {
        /**
         * 资源名称
         */
        @serialize
        get name()
        {
            var asset = rs.getAsset(this.assetId);
            if (asset)
                this._name = asset.fileName;
            return this._name;
        }
        set name(v) { this._name = v; }
        private _name: string;

        /**
         * 资源编号
         */
        @serialize
        get assetId()
        {
            return this._assetId;
        }
        set assetId(v)
        {
            if (this._assetId == v) return;

            if (this._assetId != undefined) { debuger && console.error(`不允许修改 assetId`); return; }

            this._assetId = v;
        }
        private _assetId: string;

        /**
         * 资源类型，由具体对象类型决定
         */
        assetType: AssetType;

        /**
         * 新增资源数据
         * 
         * @param assetId 资源编号
         * @param data 资源数据
         */
        static addAssetData<T extends AssetData>(assetId: string, data: T)
        {
            if (!data) return;
            if (data.assetId != assetId)
                console.warn(`同一个材质被保存在多个资源中！`);

            this.assetMap.set(data, assetId);
            this.idAssetMap.set(assetId, data);
            return data;
        }

        /**
         * 删除资源数据
         * 
         * @param data 资源数据
         */
        static deleteAssetData(data: AssetData)
        {
            if (!data) return;
            debuger && console.assert(this.assetMap.has(data));
            var assetId = this.assetMap.get(data);
            this._delete(assetId, data);
        }

        static deleteAssetDataById(assetId: string)
        {
            debuger && console.assert(this.idAssetMap.has(assetId));
            var data = this.idAssetMap.get(assetId);
            this._delete(assetId, data);
        }

        private static _delete(assetId, data: any)
        {
            this.assetMap.delete(data);
            this.idAssetMap.delete(assetId);
        }

        /**
         * 判断是否为资源数据
         * 
         * @param asset 可能的资源数据
         */
        static isAssetData(asset: any): asset is AssetData
        {
            if (!asset || asset.assetId == undefined) return false;
            if (asset instanceof AssetData) return true;
            if (classUtils.getDefaultInstanceByName(asset[CLASS_KEY]) instanceof AssetData) return true;
        }

        /**
         * 资源属性标记名称
         */
        private static assetPropertySign = "assetId";

        /**
         * 序列化
         * 
         * @param asset 资源数据
         */
        static serialize(asset: AssetData)
        {
            var obj = <any>{};
            obj[CLASS_KEY] = classUtils.getQualifiedClassName(asset);
            obj.assetId = asset.assetId;
            return obj;
        }

        /**
         * 反序列化
         * 
         * @param object 资源对象
         */
        static deserialize(object: any)
        {
            var result = this.getLoadedAssetData(object.assetId);
            debuger && console.assert(!!result, `资源 ${object.assetId} 未加载，请使用 ReadRS.deserializeWithAssets 进行序列化包含加载的资源对象。`)
            return result;
        }

        /**
         * 获取已加载的资源数据
         * 
         * @param assetId 资源编号
         */
        static getLoadedAssetData(assetId: string)
        {
            return this.idAssetMap.get(assetId);
        }

        /**
         * 获取所有已加载资源数据
         */
        static getAllLoadedAssetDatas()
        {
            return Map.getKeys(this.assetMap);
        }

        /**
         * 资源与编号对应表
         */
        static assetMap = new Map<AssetData, string>();

        /**
         * 编号与资源对应表
         */
        static idAssetMap = new Map<string, AssetData>();
    }
}