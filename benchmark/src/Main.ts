/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private textContainer:egret.Sprite;
    /**
     * 创建游戏场景
     */
    private createGameScene():void{

        var suite = new Benchmark.Suite;
        var stage:egret.Stage = this.stage;

        var parent:egret.DisplayObjectContainer = stage;
        for (var i = 0 ; i < 10 ; i++){
            var container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            parent.addChild(container);
            parent = container;
        }


        var func =  function (event) {
            var eventMap = event._eventPhase == 1 ? this._captureEventsMap : this._eventsMap;
            if (!eventMap) {
                return true;
            }
            var list = eventMap[event._type];

            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
//            list = list.concat();
            for (var i = 0; i < length; i++) {
                var eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (event._isPropagationImmediateStopped) {
                    break;
                }
            }
            return !event._isDefaultPrevented;
        };




        var matrix = new egret.Matrix();

        egret.Matrix.prototype.append = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        };


// add tests
        suite.add('stage._updateTransform1', function() {
//            dragonBones.animation.WorldClock.clock.advanceTime(100 / 1000);
//            var touchEvent:egret.TouchEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN,true);
//            container.dispatchEvent(touchEvent)
            stage._updateTransform();
//            matrix.append(2,0,0,2,100,100);
        })
            .add("stage._updateTransform2", function() {
//                dragonBones.animation.WorldClock.clock.advanceTime(100 / 1000);
                stage._updateTransform();
//                matrix.append(2,0,0,2,100,100);
//                var event:egret.TouchEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN,true);
//                container.dispatchEvent(event)
            })

// add listeners
            .on('cycle', function(event) {
                console.log(String(event.target));

//                egret.EventDispatcher.prototype._notifyListener = func;
//                return;
                egret.Matrix.prototype.append = function (a, b, c, d, tx, ty) {
                    var a1 = this.a;
                    var b1 = this.b;
                    var c1 = this.c;
                    var d1 = this.d;
                    if (a != 1 || b != 0 || c != 0 || d != 1) {

                        this.a = a * a1 + b * c1;
                        this.b = a * b1 + b * d1;
                        this.c = c * a1 + d * c1;
                        this.d = c * b1 + d * d1;
                    }
                    this.tx = tx * a1 + ty * c1 + this.tx;
                    this.ty = tx * b1 + ty * d1 + this.ty;
                    return this;
                };


                egret.DisplayObject.prototype._dispatchPropagationEvent = function (event, list, targetIndex) {
                    return;
                    var length = list.length;
//                    for (var i = 0; i < length; i++) {
//                        var currentTarget = list[i];
//                        event._currentTarget = currentTarget;
//                        event._target = this;
//                        if (i < targetIndex)
//                            event._eventPhase = 1;
//                        else if (i == targetIndex)
//                            event._eventPhase = 2;
//                        else
//                            event._eventPhase = 3;
////                        currentTarget._notifyListener(event);
//                        if (event._isPropagationStopped || event._isPropagationImmediateStopped) {
//                            break;
//                        }
//                    }
                };



                egret.EventDispatcher.prototype._notifyListener = function (event) {
                    return !event._isDefaultPrevented;
                    var eventMap = this._eventsMap;
                    if (!eventMap) {
                        return true;
                    }
                    var list = eventMap[event._type];

                    if (!list) {
                        return true;
                    }
                    var length = list.length;
                    if (length == 0) {
                        return true;
                    }
                    list = list.concat();
                    for (var i = 0; i < length; i++) {
                        var eventBin = list[i];
                        eventBin.listener.call(eventBin.thisObject, event);
                        if (event._isPropagationImmediateStopped) {
                            break;
                        }
                    }
                    return !event._isDefaultPrevented;
                };
//                var _getMatrix:Function = function(){
//                    var matrix = egret.Matrix.identity.identity();
//                    var anchorX, anchorY;
//                    if (this.anchorX != 0 || this.anchorY != 0) {
//                        var bounds = this.getBounds(egret.Rectangle.identity);
//                        anchorX = bounds.width * this.anchorX;
//                        anchorY = bounds.height * this.anchorY;
//                    } else {
//                        anchorX = this.anchorOffsetX;
//                        anchorY = this.anchorOffsetY;
//                    }
//                    matrix.appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, anchorX, anchorY);
//                    return matrix;
//                }
//                egret.DisplayObject.prototype._getMatrix = _getMatrix;

            })
            .on('reset', function(event) {
                console.log(String(event.target));
            })
            .on('complete', function() {
                console.log('Fastest is ' + this.filter('fastest').pluck('name'));
            })
            .run({ 'async': true });

    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}


