namespace feng3d
{
    export interface GeometryMap { SegmentGeometry: SegmentGeometry }

    /**
     * 线段组件
     */
    export class SegmentGeometry extends Geometry
    {

        __class__: "feng3d.SegmentGeometry";

        name = "Segment";

		/**
		 * 线段列表
         * 修改数组内数据时需要手动调用 invalidateGeometry();
		 */
        @serialize
        @oav({ component: "OAVArray", tooltip: "在指定时间进行额外发射指定数量的粒子", componentParam: { defaultItem: () => { return new Segment(); } } })
        get segments()
        {
            return this._segments;
        }
        set segments(v)
        {
            if (this._segments == v) return;
            this._segments = v;
            this.invalidateGeometry();
        }
        private _segments: Segment[] = [];

        /**
         * 添加线段
         * 
         * @param segment 线段
         */
        addSegment(segment: Partial<Segment>)
        {
            var s = new Segment();
            serialization.setValue(s, segment);
            this.segments.push(s);
            this.invalidateGeometry();
        }

        constructor()
        {
            super();
        }

        /**
         * 更新几何体
         */
        protected buildGeometry()
        {
            var numSegments = this.segments.length;
            var indices: number[] = [];
            var positionData: number[] = [];
            var colorData: number[] = [];

            for (var i = 0; i < numSegments; i++)
            {
                var element = this.segments[i];
                var start = element.start || Vector3.ZERO;
                var end = element.end || Vector3.ZERO;;
                var startColor = element.startColor || Color4.WHITE;
                var endColor = element.endColor || Color4.WHITE;

                indices.push(i * 2, i * 2 + 1);
                positionData.push(start.x, start.y, start.z, end.x, end.y, end.z);
                colorData.push(startColor.r, startColor.g, startColor.b, startColor.a,
                    endColor.r, endColor.g, endColor.b, endColor.a);
            }

            this.setVAData("a_position", positionData, 3);
            this.setVAData("a_color", colorData, 4);
            this.indices = indices;
        }
    }

    /**
     * 线段
     */
    export class Segment
    {
        /**
         * 起点坐标
         */
        @serialize
        @oav({ tooltip: "起点坐标" })
        start = new Vector3();

        /**
         * 终点坐标
         */
        @serialize
        @oav({ tooltip: "终点坐标" })
        end = new Vector3();

        /**
         * 起点颜色
         */
        @serialize
        @oav({ tooltip: "起点颜色" })
        startColor = new Color4();

        /**
         * 终点颜色
         */
        @serialize
        @oav({ tooltip: "终点颜色" })
        endColor = new Color4();
    }
}