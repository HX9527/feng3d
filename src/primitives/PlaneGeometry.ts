namespace feng3d
{
    export interface GeometryMap { PlaneGeometry: PlaneGeometry }

    /**
     * 平面几何体
     */
    export class PlaneGeometry extends Geometry
    {

        __class__: "feng3d.PlaneGeometry";

        /**
         * 宽度
         */
        @oav()
        @serialize
        get width()
        {
            return this._width;
        }
        set width(v)
        {
            if (this._width == v) return;
            this._width = v;
            this.invalidateGeometry();
        }
        private _width = 1;

        /**
         * 高度
         */
        @oav()
        @serialize
        get height()
        {
            return this._height;
        }
        set height(v)
        {
            if (this._height == v) return;
            this._height = v;
            this.invalidateGeometry();
        }
        private _height = 1;

        /**
         * 横向分割数
         */
        @oav()
        @serialize
        get segmentsW()
        {
            return this._segmentsW;
        }
        set segmentsW(v)
        {
            if (this._segmentsW == v) return;
            this._segmentsW = v;
            this.invalidateGeometry();
        }
        private _segmentsW = 1;

        /**
         * 纵向分割数
         */
        @oav()
        @serialize
        get segmentsH()
        {
            return this._segmentsH;
        }
        set segmentsH(v)
        {
            if (this._segmentsH == v) return;
            this._segmentsH = v;
            this.invalidateGeometry();
        }
        private _segmentsH = 1;

        /**
         * 是否朝上
         */
        @oav()
        @serialize
        get yUp()
        {
            return this._yUp;
        }
        set yUp(v)
        {
            if (this._yUp == v) return;
            this._yUp = v;
            this.invalidateGeometry();
        }
        private _yUp = true;

        name = "Plane";

        /**
         * 构建几何体数据
         */
        protected buildGeometry()
        {
            var vertexPositionData = this.buildPosition();
            this.setVAData("a_position", vertexPositionData, 3);

            var vertexNormalData = this.buildNormal();
            this.setVAData("a_normal", vertexNormalData, 3)

            var vertexTangentData = this.buildTangent();
            this.setVAData("a_tangent", vertexTangentData, 3)

            var uvData = this.buildUVs();
            this.setVAData("a_uv", uvData, 2);

            var indices = this.buildIndices();
            this.indices = indices;
        }

        /**
         * 构建顶点坐标
         * @param this.width 宽度
         * @param this.height 高度
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        private buildPosition()
        {
            var vertexPositionData: number[] = [];
            var x: number, y: number;
            var positionIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi)
            {
                for (var xi = 0; xi <= this.segmentsW; ++xi)
                {
                    x = (xi / this.segmentsW - .5) * this.width;
                    y = (yi / this.segmentsH - .5) * this.height;

                    //设置坐标数据
                    vertexPositionData[positionIndex++] = x;
                    if (this.yUp)
                    {
                        vertexPositionData[positionIndex++] = 0;
                        vertexPositionData[positionIndex++] = y;
                    }
                    else
                    {
                        vertexPositionData[positionIndex++] = y;
                        vertexPositionData[positionIndex++] = 0;
                    }
                }
            }
            return vertexPositionData;
        }

        /**
         * 构建顶点法线
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        private buildNormal()
        {
            var vertexNormalData: number[] = [];

            var normalIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi)
            {
                for (var xi = 0; xi <= this.segmentsW; ++xi)
                {

                    //设置法线数据
                    vertexNormalData[normalIndex++] = 0;
                    if (this.yUp)
                    {
                        vertexNormalData[normalIndex++] = 1;
                        vertexNormalData[normalIndex++] = 0;
                    }
                    else
                    {
                        vertexNormalData[normalIndex++] = 0;
                        vertexNormalData[normalIndex++] = 1;
                    }
                }
            }
            return vertexNormalData;
        }

        /**
         * 构建顶点切线
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        private buildTangent()
        {
            var vertexTangentData: number[] = [];
            var tangentIndex = 0;
            for (var yi = 0; yi <= this.segmentsH; ++yi)
            {
                for (var xi = 0; xi <= this.segmentsW; ++xi)
                {
                    if (this.yUp)
                    {
                        vertexTangentData[tangentIndex++] = 1;
                        vertexTangentData[tangentIndex++] = 0;
                        vertexTangentData[tangentIndex++] = 0;
                    }
                    else
                    {
                        vertexTangentData[tangentIndex++] = -1;
                        vertexTangentData[tangentIndex++] = 0;
                        vertexTangentData[tangentIndex++] = 0;
                    }
                }
            }
            return vertexTangentData;
        }

        /**
         * 构建顶点索引
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         * @param this.yUp 正面朝向 true:Y+ false:Z+
         */
        private buildIndices()
        {
            var indices: number[] = [];
            var tw = this.segmentsW + 1;

            var numIndices = 0;
            var base: number;
            for (var yi = 0; yi <= this.segmentsH; ++yi)
            {
                for (var xi = 0; xi <= this.segmentsW; ++xi)
                {
                    //生成索引数据
                    if (xi != this.segmentsW && yi != this.segmentsH)
                    {
                        base = xi + yi * tw;
                        if (this.yUp)
                        {
                            indices[numIndices++] = base;
                            indices[numIndices++] = base + tw;
                            indices[numIndices++] = base + tw + 1;
                            indices[numIndices++] = base;
                            indices[numIndices++] = base + tw + 1;
                            indices[numIndices++] = base + 1;
                        } else
                        {
                            indices[numIndices++] = base;
                            indices[numIndices++] = base + tw + 1;
                            indices[numIndices++] = base + tw;
                            indices[numIndices++] = base;
                            indices[numIndices++] = base + 1;
                            indices[numIndices++] = base + tw + 1;
                        }
                    }
                }
            }

            return indices;
        }

        /**
         * 构建uv
         * @param this.segmentsW 横向分割数
         * @param this.segmentsH 纵向分割数
         */
        private buildUVs()
        {
            var data: number[] = [];
            var index = 0;

            for (var yi = 0; yi <= this.segmentsH; ++yi)
            {
                for (var xi = 0; xi <= this.segmentsW; ++xi)
                {
                    if (this.yUp)
                    {
                        data[index++] = xi / this.segmentsW;
                        data[index++] = 1 - yi / this.segmentsH;
                    } else
                    {
                        data[index++] = 1 - xi / this.segmentsW;
                        data[index++] = 1 - yi / this.segmentsH;
                    }
                }
            }

            return data;
        }
    }

    export interface DefaultGeometry
    {
        Plane: PlaneGeometry;
    }

    Geometry.setDefault("Plane", new PlaneGeometry(), { width: 10, height: 10 });
}