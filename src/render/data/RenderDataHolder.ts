module feng3d {

    /**
	 * 渲染数据拥有者
	 * @author feng 2016-6-7
	 */
	export class RenderDataHolder extends Component {

		private indexBuffer: IndexRenderData;
		private programBuffer: ProgramRenderData;
		private attributes: { [name: string]: AttributeRenderData } = {};
		private uniforms: { [name: string]: UniformRenderData } = {};
		private shaderParams: { [shaderParam: string]: any } = {};

		/**
		 * 创建Context3D数据缓冲
		 */
		constructor() {

			super();

			this.addEventListener(Context3DBufferEvent.GET_INDEXBUFFER, this.onGetIndexBuffer, this);
			this.addEventListener(Context3DBufferEvent.GET_ATTRIBUTEBUFFER, this.onGetAttributeBuffer, this);
			this.addEventListener(Context3DBufferEvent.GET_UNIFORMBUFFER, this.onGetUniformBuffer, this);
			this.addEventListener(Context3DBufferEvent.GET_PROGRAMBUFFER, this.onGetProgramBuffer, this);
			this.addEventListener(Context3DBufferEvent.GET_SHADERPARAM, this.onGetShaderParam, this);
		}

		/**
		 * 映射索引缓冲
		 */
		mapIndexBuffer(value: Uint16Array) {
			var indexBuffer = this.indexBuffer = this.indexBuffer || new IndexRenderData();
			indexBuffer.indices = value;
		}

		/**
		 * 映射属性缓冲
		 */
		mapAttributeBuffer(name: string, value: Float32Array, stride: number) {

			var attributeBuffer = this.attributes[name] = this.attributes[name] || new AttributeRenderData();
			attributeBuffer.name = name;
			attributeBuffer.data = value;
			attributeBuffer.size = stride;
		}

		/**
		 * 映射程序缓冲
         * @param vertexCode        顶点渲染程序代码
         * @param fragmentCode      片段渲染程序代码
         */
		mapProgram(vertexCode: string, fragmentCode: string) {

			var programBuffer = this.programBuffer = this.programBuffer || new ProgramRenderData();
			programBuffer.vertexCode = vertexCode;
			programBuffer.fragmentCode = fragmentCode;
		}

		/**
		 * 映射常量
		 */
		mapUniform(name: string, data: Matrix3D | Vec4) {

			var uniformBuffer = this.uniforms[name] = this.uniforms[name] || new UniformRenderData();
			uniformBuffer.name = name;
			uniformBuffer.data = data;
		}

		/**
		 * 映射渲染参数
		 */
		mapShaderParam(shaderParamID: ShaderParamID, param) {

			this.shaderParams[shaderParamID] = param;
		}

        /**
         * 处理获取索引缓冲事件
         */
		private onGetIndexBuffer(event: Context3DBufferEvent) {

			var eventData: GetIndexBufferEventData = event.data;
			eventData.buffer = eventData.buffer || this.indexBuffer;
		}

		/**
         * 处理获取属性缓冲事件
         */
		private onGetAttributeBuffer(event: Context3DBufferEvent) {

			var eventData: GetAttributeBufferEventData = event.data;
			eventData.buffer = eventData.buffer || this.attributes[eventData.name];
		}

		/**
         * 处理获取缓冲事件
         */
		private onGetUniformBuffer(event: Context3DBufferEvent) {

			var eventData: GetUniformBufferEventData = event.data;
			eventData.buffer = eventData.buffer || this.uniforms[eventData.name];
		}

		/**
         * 处理获取缓冲事件
         */
		private onGetProgramBuffer(event: Context3DBufferEvent) {

			var eventData: GetProgramBufferEventData = event.data;
			eventData.buffer = eventData.buffer || this.programBuffer;
		}

		/**
         * 处理获取缓冲事件
         */
		private onGetShaderParam(event: Context3DBufferEvent) {

			var eventData: GetShaderParamEventData = event.data;
			if (this.shaderParams[eventData.shaderParamID]) {
				eventData.data = this.shaderParams[eventData.shaderParamID];
			}
		}

	}
}