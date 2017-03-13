module feng3d
{

    /**
     * 几何体
     * @author feng 2016-04-28
     */
    export class Geometry extends RenderDataHolder
    {
        private _isDirty = true;

        /**
		 * 创建一个几何体
		 */
        constructor()
        {
            super();
            this._single = true;
        }

        /**
		 * 更新渲染数据
		 */
        public updateRenderData(renderContext: RenderContext)
        {
            if (this._isDirty)
            {
                this.buildGeometry();
                this._isDirty = false;
            }
            super.updateRenderData(renderContext);
        }

        /**
         * 几何体变脏
         */
        protected invalidate()
        {
            this._isDirty = true;
        }

        /**
         * 构建几何体
         */
        protected buildGeometry()
        {

        }

		/**
		 * 更新顶点索引数据
		 */
        public setIndices(indices: Uint16Array)
        {
            this._renderData.indexBuffer = new IndexRenderData();
            this._renderData.indexBuffer.indices = indices;
            this._renderData.indexBuffer.count = indices.length;
            this.dispatchEvent(new GeometryEvent(GeometryEvent.CHANGED_INDEX_DATA));
        }

		/**
		 * 设置顶点属性数据
		 * @param vaId          顶点属性编号
		 * @param data          顶点属性数据
         * @param stride        顶点数据步长
		 */
        public setVAData(vaId: string, data: Float32Array, stride: number)
        {
            this._renderData.attributes[vaId] = new AttributeRenderData(data, stride);
            this.dispatchEvent(new GeometryEvent(GeometryEvent.CHANGED_VA_DATA, vaId));
        }

		/**
		 * 获取顶点属性数据
		 * @param vaId 数据类型编号
		 * @return 顶点属性数据
		 */
        public getVAData(vaId: string): AttributeRenderData
        {
            this.dispatchEvent(new GeometryEvent(GeometryEvent.GET_VA_DATA, vaId));
            return this._renderData.attributes[vaId];
        }

        /**
         * 顶点数量
         */
        public get numVertex()
        {
            var numVertex = 0;
            for (var attributeName in this._renderData.attributes)
            {
                var attributeRenderData = this._renderData.attributes[attributeName];
                numVertex = attributeRenderData.data.length / attributeRenderData.stride;
                break;
            }
            return numVertex;
        }

        /**
         * 附加几何体
         */
        public addGeometry(geometry: Geometry)
        {
            var attributes = this._renderData.attributes;
            var addAttributes = geometry._renderData.attributes;
            //当前顶点数量
            var oldNumVertex = this.numVertex;
            //合并索引
            var indices = this._renderData.indexBuffer.indices;
            var targetIndices = geometry._renderData.indexBuffer.indices;
            var totalIndices = new Uint16Array(indices.length + targetIndices.length);
            totalIndices.set(indices, 0);
            for (var i = 0; i < targetIndices.length; i++)
            {
                totalIndices[indices.length + i] = targetIndices[i] + oldNumVertex;
            }
            this.setIndices(totalIndices);
            //合并后顶点数量
            var totalVertex = oldNumVertex + geometry.numVertex;
            //合并属性数据
            for (var attributeName in attributes)
            {
                var stride = attributes[attributeName].stride;
                var data = new Float32Array(totalVertex * stride);
                data.set(attributes[attributeName].data, 0);
                data.set(addAttributes[attributeName].data, oldNumVertex * stride);
                this.setVAData(attributeName, data, stride);
            }
        }

        /**
         * 克隆一个几何体
         */
        public clone()
        {
            var geometry = new Geometry();
            geometry._renderData.indexBuffer = this._renderData.indexBuffer;
            geometry._renderData.attributes = this._renderData.attributes;
            return geometry;
        }

        /**
         * 从一个几何体中克隆数据
         */
        public cloneFrom(geometry: Geometry)
        {
            this._renderData.indexBuffer = geometry._renderData.indexBuffer;
            this._renderData.attributes = geometry._renderData.attributes;
        }
    }
}