import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "OrzTools.VideoSizeSelectionOrz",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "VideoSizeSelectionOrz") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        
        nodeType.prototype.onNodeCreated = function() {
            const result = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
            
            // 找到字符串输入控件并隐藏它
            const stringWidget = this.widgets.find(w => w.name === "selected_size");
            if (!stringWidget) return result;
            
            // 保存当前选中的值
            let currentSelected = stringWidget.value;
            
            // 隐藏原始控件
            stringWidget.type = "hidden";
            if (stringWidget.parentElement) {
                stringWidget.parentElement.style.display = "none";
            }
            
            // 分辨率选项
            const resolutions = [
                { 
                    icon: "📱",
                    type: "竖版",
                    size: "480×832",
                    ratio: "约9:16", 
                    value: "竖版480×832 (约9:16)" 
                },
                { 
                    icon: "📱",
                    type: "竖版",
                    size: "576×1024",
                    ratio: "9:16", 
                    value: "竖版576×1024 (9:16)" 
                },
                { 
                    icon: "📱",
                    type: "竖版",
                    size: "720×1280",
                    ratio: "9:16", 
                    value: "竖版720×1280 (9:16)" 
                },
                { 
                    icon: "🖥️",
                    type: "横版",
                    size: "832×480",
                    ratio: "约16:9", 
                    value: "横版832×480 (约16:9)" 
                },
                { 
                    icon: "🖥️",
                    type: "横版",
                    size: "1024×576",
                    ratio: "16:9", 
                    value: "横版1024×576 (16:9)" 
                },
                { 
                    icon: "🖥️",
                    type: "横版",
                    size: "1280×720",
                    ratio: "16:9", 
                    value: "横版1280×720 (16:9)" 
                }
            ];
            
            // 创建自定义按钮组容器 - 左右各预留4px内边距
            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 8px 4px; /* 左右各预留4px内边距 */
                box-sizing: border-box;
                overflow: hidden;
            `;
            
            // 存储按钮引用
            const buttons = [];
            
            // 为每个分辨率创建按钮
            resolutions.forEach((res, index) => {
                // 创建按钮容器
                const button = document.createElement("div");
                button.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px 8px;
                    border: 1px solid #555;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                    width: 100%;
                    min-height: 23px;
                    background-color: rgba(68, 68, 68, 0.6);
                    color: #ddd;
                    transition: all 0.2s ease;
                    overflow: hidden;
                    backdrop-filter: blur(4px);
                    gap: 6px;
                    text-align: center;
                    box-sizing: border-box;
                    flex: 1; /* 关键属性 - 让按钮均匀分配高度 */
                `;
                
                // 创建图标元素
                const icon = document.createElement("span");
                icon.textContent = res.icon;
                icon.style.cssText = `
                    font-size: 12px;
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
                    width: 16px;
                    text-align: center;
                    flex-shrink: 0;
                `;
                
                // 创建类型元素
                const type = document.createElement("span");
                type.textContent = res.type;
                type.style.cssText = `
                    font-weight: 600;
                    width: 24px;
                    font-size: 10px;
                    flex-shrink: 0;
                `;
                
                // 创建尺寸元素
                const size = document.createElement("span");
                size.textContent = res.size;
                size.style.cssText = `
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    width: 65px;
                    text-align: center;
                    font-size: 10px;
                    flex-shrink: 0;
                `;
                
                // 创建比例元素
                const ratio = document.createElement("span");
                ratio.textContent = res.ratio;
                ratio.style.cssText = `
                    opacity: 0.9;
                    font-size: 9px;
                    width: 35px;
                    text-align: center;
                    flex-shrink: 0;
                `;
                
                // 将元素添加到按钮
                button.appendChild(icon);
                button.appendChild(type);
                button.appendChild(size);
                button.appendChild(ratio);
                
                // 鼠标悬停效果
                button.addEventListener("mouseenter", () => {
                    button.style.backgroundColor = "rgba(85, 85, 85, 0.8)";
                    button.style.borderColor = "#777";
                    button.style.transform = "translateY(-1px)";
                    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                });
                
                button.addEventListener("mouseleave", () => {
                    button.style.backgroundColor = "rgba(68, 68, 68, 0.6)";
                    button.style.borderColor = "#555";
                    button.style.transform = "translateY(0px)";
                    button.style.boxShadow = "none";
                });
                
                // 点击事件
                button.addEventListener("click", () => {
                    // 更新隐藏输入的值
                    currentSelected = res.value;
                    stringWidget.value = res.value;
                    
                    // 触发绿色闪烁效果
                    button.style.backgroundColor = "rgba(76, 175, 80, 0.8)";
                    button.style.borderColor = "#4CAF50";
                    button.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";
                    
                    // 300毫秒后恢复原样
                    setTimeout(() => {
                        button.style.backgroundColor = "rgba(68, 68, 68, 0.6)";
                        button.style.borderColor = "#555";
                        button.style.boxShadow = "none";
                    }, 300);
                    
                    // 触发节点更新
                    if (this.onInputChanged) {
                        this.onInputChanged();
                    }
                    
                    console.log(`选择了: ${res.value}`);
                });
                
                buttons.push(button);
                buttonContainer.appendChild(button);
            });
            
            // 将按钮组添加到节点
            this.addDOMWidget("custom_buttons", "custom", buttonContainer, {
                serialize: false
            });
            
            // 设置节点初始尺寸 - 宽度210px，高度260px
            this.size = [210, 260];
            
            // 存储引用用于调整大小处理
            this.customButtonContainer = buttonContainer;
            this.customButtons = buttons;
            
            // 使用ResizeObserver确保按钮随节点大小自适应
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver((entries) => {
                    for (let entry of entries) {
                        const { width, height } = entry.contentRect;
                        
                        // 当节点高度改变时，按钮高度会自动适应，因为设置了flex: 1
                        console.log(`节点尺寸变化: ${width}x${height}`);
                    }
                });
                
                // 开始观察节点元素
                if (this.el) {
                    this.resizeObserver.observe(this.el);
                }
            }
            
            return result;
        };
        
        // 节点移除时清理ResizeObserver
        const onRemoved = nodeType.prototype.onRemoved;
        nodeType.prototype.onRemoved = function() {
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            if (onRemoved) {
                return onRemoved.apply(this, arguments);
            }
        };
    }
});