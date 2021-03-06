namespace feng3d
{

    export interface ComponentMap { Animation: Animation; }

    export class Animation extends Behaviour
    {
        @oav({ component: "OAVDefault", componentParam: { dragparam: { accepttype: "animationclip", datatype: "animationclip" } } })
        @serialize
        get animation()
        {
            return this._animation;
        }
        set animation(v)
        {
            if (this._animation == v) return;
            this._animation = v;
            this.onAnimationChanged();
        }
        private _animation: AnimationClip;

        @oav({ component: "OAVArray", componentParam: { dragparam: { accepttype: "animationclip", datatype: "animationclip" }, defaultItem: () => new AnimationClip() } })
        @serialize
        animations: AnimationClip[] = [];

        /**
         * 动画事件，单位为ms
         */
        @oav()
        get time()
        {
            return this._time;
        }
        set time(v)
        {
            if (this._time == v) return;
            this._time = v;
            this.onTimeChanged();
        }
        private _time = 0;

        @oav()
        @serialize
        isplaying = false;

        /**
         * 播放速度
         */
        @oav()
        @serialize
        playspeed = 1;

        /**
         * 动作名称
         */
        get clipName()
        {
            return this.animation ? this.animation.name : null;
        }

        get frame()
        {
            if (!this.animation) return -1;
            var cycle = this.animation.length;
            var cliptime = (this.time % cycle + cycle) % cycle;
            var _frame = Math.round(this._fps * cliptime / 1000);
            return _frame;
        }

        update(interval: number)
        {
            if (this.isplaying) this.time += interval * this.playspeed;
        }

        dispose()
        {
            this.animation = <any>null;
            this.animations = <any>null;
            super.dispose();
        }

        private num = 0;
        private _fps = 24;
        private _objectCache = new Map();

        private updateAni()
        {
            if (!this.animation) return;
            if ((this.num++) % 2 != 0) return;

            var cycle = this.animation.length;
            var cliptime = (this.time % cycle + cycle) % cycle;

            var propertyClips = this.animation.propertyClips;

            for (var i = 0; i < propertyClips.length; i++)
            {
                var propertyClip = propertyClips[i];

                var propertyValues = propertyClip.propertyValues;
                if (propertyValues.length == 0) continue;
                var propertyHost = this.getPropertyHost(propertyClip);
                if (!propertyHost) continue;
                propertyHost[propertyClip.propertyName] = propertyClip.getValue(cliptime, this._fps);
            }
        }

        private getPropertyHost(propertyClip: PropertyClip)
        {
            if (propertyClip.cacheIndex && this._objectCache[propertyClip.cacheIndex])
                return this._objectCache[propertyClip.cacheIndex];

            if (!propertyClip.cacheIndex)
                propertyClip.cacheIndex = autoobjectCacheID++;

            var propertyHost: any = this.gameObject;
            var path = propertyClip.path;

            for (var i = 0; i < path.length; i++)
            {
                var element = path[i];
                switch (element[0])
                {
                    case PropertyClipPathItemType.GameObject:
                        propertyHost = propertyHost.find(element[1]);
                        break;
                    case PropertyClipPathItemType.Component:
                        var componentType = classUtils.getDefinitionByName(element[1]);
                        propertyHost = propertyHost.getComponent(componentType);
                        break;
                    default:
                        console.error(`无法获取 PropertyHost ${element}`);
                }
                if (propertyHost == null)
                    return null;
            }
            this._objectCache[propertyClip.cacheIndex] = propertyHost;
            return propertyHost;
        }

        private onAnimationChanged()
        {
            this.time = 0;
        }

        private onTimeChanged()
        {
            this.updateAni();
        }
    }
    var autoobjectCacheID = 1;
}