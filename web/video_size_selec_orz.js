import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "OrzTools.VideoSizeSelectionOrz",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // 只处理第一个节点（按钮版）
        if (nodeData.name === "VideoSizeSelectionOrz") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            // 重写节点创建方法
            nodeType.prototype.onNodeCreated = function() {
                const result = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
                
                // 获取所有布尔控件
                const booleanWidgets = this.widgets.filter(w => w.type === "BOOLEAN");
                if (booleanWidgets.length === 0) return result;
                
                // 为每个布尔控件自定义显示文本
                booleanWidgets.forEach(widget => {
                    // 保存原始的onDraw方法
                    const originalOnDraw = widget.onDraw;
                    
                    // 重写onDraw方法，将true/false显示为yes/no
                    widget.onDraw = function(ctx) {
                        // 先调用原始onDraw方法
                        if (originalOnDraw) {
                            originalOnDraw.apply(this, arguments);
                        }
                        
                        // 获取画布上下文
                        const node = this.node;
                        const size = node.size;
                        
                        // 找到这个widget对应的DOM元素
                        const widgetIndex = node.widgets.indexOf(this);
                        if (widgetIndex === -1) return;
                        
                        // 查找对应的输入元素
                        const widgetElement = node.el.querySelectorAll(".lgraphnode")[0]?.childNodes[widgetIndex];
                        if (!widgetElement) return;
                        
                        // 查找布尔值显示元素
                        const booleanDisplay = widgetElement.querySelector("button, .comfy-boolean-display");
                        if (booleanDisplay) {
                            // 将显示文本从true/false改为yes/no
                            if (this.value === true) {
                                booleanDisplay.textContent = "yes";
                                booleanDisplay.style.backgroundColor = "#4a4"; // 绿色背景表示选中
                                booleanDisplay.style.color = "white";
                            } else {
                                booleanDisplay.textContent = "no";
                                booleanDisplay.style.backgroundColor = "#444"; // 灰色背景表示未选中
                                booleanDisplay.style.color = "#ccc";
                            }
                        }
                    };
                    
                    // 保存原始回调
                    const originalCallback = widget.callback;
                    
                    // 重写回调，确保值改变后重新绘制
                    widget.callback = (value, widgetInstance, node) => {
                        // 执行原始回调
                        if (originalCallback) {
                            const result = originalCallback(value, widgetInstance, node);
                        }
                        
                        // 强制重新绘制
                        if (widgetInstance.onDraw) {
                            widgetInstance.onDraw();
                        }
                        
                        return true;
                    };
                    
                    // 初始绘制
                    setTimeout(() => {
                        if (widget.onDraw) {
                            widget.onDraw();
                        }
                    }, 100);
                });
                
                return result;
            };
        }
        
        // 第二个节点（下拉框版）不需要特殊处理，使用ComfyUI默认行为
    }
});