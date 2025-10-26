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
            
            // 分辨率选项 - 更丰富的文字信息
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
            
            // 创建自定义按钮组容器 - 单列布局
            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = `
                padding: 6px 4px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 100%;
                align-items: center;
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
                    padding: 6px 10px;
                    border: 1px solid #555;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 10px;
                    width: 100%; /* 修改这里：从90%改为100% */
                    background-color: ${res.value === currentSelected ? "rgba(76, 175, 80, 0.8)" : "rgba(68, 68, 68, 0.6)"};
                    color: ${res.value === currentSelected ? "white" : "#ddd"};
                    transition: all 0.2s ease;
                    overflow: hidden;
                    height: 24px;
                    backdrop-filter: blur(4px);
                    gap: 8px;
                    text-align: center;
                `;
                
                // 创建图标元素
                const icon = document.createElement("span");
                icon.textContent = res.icon;
                icon.style.cssText = `
                    font-size: 12px;
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
                    width: 16px;
                    text-align: center;
                `;
                
                // 创建类型元素
                const type = document.createElement("span");
                type.textContent = res.type;
                type.style.cssText = `
                    font-weight: 600;
                    width: 28px;
                `;
                
                // 创建尺寸元素
                const size = document.createElement("span");
                size.textContent = res.size;
                size.style.cssText = `
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    width: 70px;
                    text-align: center;
                `;
                
                // 创建比例元素
                const ratio = document.createElement("span");
                ratio.textContent = res.ratio;
                ratio.style.cssText = `
                    opacity: 0.9;
                    font-size: 9px;
                    width: 40px;
                    text-align: center;
                `;
                
                // 将元素添加到按钮
                button.appendChild(icon);
                button.appendChild(type);
                button.appendChild(size);
                button.appendChild(ratio);
                
                // 鼠标悬停效果
                button.addEventListener("mouseenter", () => {
                    if (res.value !== currentSelected) {
                        button.style.backgroundColor = "rgba(85, 85, 85, 0.8)";
                        button.style.borderColor = "#777";
                        button.style.transform = "translateY(-1px)";
                        button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                    }
                });
                
                button.addEventListener("mouseleave", () => {
                    if (res.value !== currentSelected) {
                        button.style.backgroundColor = "rgba(68, 68, 68, 0.6)";
                        button.style.borderColor = "#555";
                        button.style.transform = "translateY(0px)";
                        button.style.boxShadow = "none";
                    }
                });
                
                // 点击事件
                button.addEventListener("click", () => {
                    // 更新所有按钮状态
                    buttons.forEach(btn => {
                        const isSelected = btn === button;
                        btn.style.backgroundColor = isSelected ? "rgba(76, 175, 80, 0.8)" : "rgba(68, 68, 68, 0.6)";
                        btn.style.color = isSelected ? "white" : "#ddd";
                        btn.style.borderColor = isSelected ? "#4CAF50" : "#555";
                        btn.style.transform = isSelected ? "translateY(-1px)" : "translateY(0px)";
                        btn.style.boxShadow = isSelected ? "0 2px 4px rgba(76, 175, 80, 0.3)" : "none";
                    });
                    
                    // 更新隐藏输入的值
                    currentSelected = res.value;
                    stringWidget.value = res.value;
                    
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
            this.addDOMWidget("custom_buttons", "custom", buttonContainer, {});
            
            // 设置节点尺寸 - 单列布局，宽度增加以容纳更多内容
            this.size = [220, 200];
            
            return result;
        };
    }
});