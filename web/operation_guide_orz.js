import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "OrzTools.OperationGuideOrz",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== "OperationGuideOrz") return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        
        nodeType.prototype.onNodeCreated = function() {
            const result = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
            
            // 获取控件
            const textWidget = this.widgets.find(w => w.name === "guide_text");
            const fontSizeWidget = this.widgets.find(w => w.name === "font_size");
            const lockedWidget = this.widgets.find(w => w.name === "locked");
            
            if (!textWidget || !fontSizeWidget || !lockedWidget) return result;
            
            // 保存当前值
            let currentText = textWidget.value;
            let currentFontSize = fontSizeWidget.value;
            let isLocked = lockedWidget.value;
            let isPasswordProtected = false; // 密码保护状态
            let isUnlocked = false; // 是否已解锁
            
            // 隐藏原始控件
            [textWidget, fontSizeWidget, lockedWidget].forEach(widget => {
                widget.type = "hidden";
                if (widget.parentElement) {
                    widget.parentElement.style.display = "none";
                }
            });
            
            // 创建自定义UI容器
            const container = document.createElement("div");
            container.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: rgba(35, 35, 35, 0.9);
                border-radius: 8px;
                border: 2px solid #444;
                overflow: hidden;
                box-sizing: border-box;
            `;
            
            // 创建紧凑控制栏 - 初始状态为隐藏
            const controls = document.createElement("div");
            controls.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0; /* 初始内边距为0 */
                background: rgba(50, 50, 50, 0.9);
                border-bottom: none; /* 初始无边框 */
                min-height: 0; /* 初始最小高度为0 */
                flex-shrink: 0;
                box-sizing: border-box;
                opacity: 0; /* 初始透明度为0 */
                height: 0; /* 初始高度为0 */
                overflow: hidden; /* 隐藏溢出内容 */
                transition: all 0.3s ease; /* 添加过渡动画 */
                transform: translateY(-100%); /* 初始向上完全隐藏 */
            `;
            
            // 字体大小控制
            const fontSizeControl = document.createElement("div");
            fontSizeControl.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                color: #bbb;
            `;
            
            const fontSizeLabel = document.createElement("span");
            fontSizeLabel.textContent = "A";
            fontSizeLabel.style.cssText = `
                font-weight: bold;
                opacity: 0.8;
            `;
            
            const fontSizeValue = document.createElement("span");
            fontSizeValue.textContent = currentFontSize;
            fontSizeValue.style.cssText = `
                min-width: 16px;
                text-align: center;
                font-weight: bold;
                font-size: 10px;
            `;
            
            const fontSizeSlider = document.createElement("input");
            fontSizeSlider.type = "range";
            fontSizeSlider.min = "8";
            fontSizeSlider.max = "32";
            fontSizeSlider.value = currentFontSize;
            fontSizeSlider.style.cssText = `
                width: 50px;
                height: 3px;
                background: #666;
                outline: none;
                opacity: 0.8;
                transition: opacity 0.2s;
                cursor: pointer;
            `;
            
            fontSizeSlider.addEventListener("input", (e) => {
                currentFontSize = parseInt(e.target.value);
                fontSizeValue.textContent = currentFontSize;
                fontSizeWidget.value = currentFontSize;
                
                // 更新文本框字体大小
                if (textArea && (!isPasswordProtected || isUnlocked)) {
                    textArea.style.fontSize = currentFontSize + "px";
                }
                
                if (this.onInputChanged) {
                    this.onInputChanged();
                }
            });
            
            // 滑块悬停效果
            fontSizeSlider.addEventListener("mouseenter", () => {
                fontSizeSlider.style.opacity = "1";
            });
            
            fontSizeSlider.addEventListener("mouseleave", () => {
                fontSizeSlider.style.opacity = "0.8";
            });
            
            fontSizeControl.appendChild(fontSizeLabel);
            fontSizeControl.appendChild(fontSizeSlider);
            fontSizeControl.appendChild(fontSizeValue);
            
            // 紧凑锁定按钮
            const lockButton = document.createElement("div");
            lockButton.innerHTML = isLocked ? "🚫" : "📝";
            lockButton.title = isLocked ? "Locked - Click to unlock" : "Editable - Click to lock";
            lockButton.style.cssText = `
                width: 24px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                background: ${isLocked ? "rgba(255, 107, 107, 0.3)" : "rgba(76, 175, 80, 0.3)"};
                border: 1px solid ${isLocked ? "#ff6b6b" : "#4CAF50"};
                transition: all 0.2s;
                user-select: none;
                flex-shrink: 0;
            `;
            
            lockButton.addEventListener("click", () => {
                if (isPasswordProtected && !isUnlocked) return; // 密码保护未解锁时不能操作锁定
                
                isLocked = !isLocked;
                lockedWidget.value = isLocked;
                
                lockButton.innerHTML = isLocked ? "🚫" : "📝";
                lockButton.style.background = isLocked ? "rgba(255, 107, 107, 0.3)" : "rgba(76, 175, 80, 0.3)";
                lockButton.style.borderColor = isLocked ? "#ff6b6b" : "#4CAF50";
                lockButton.title = isLocked ? "Locked - Click to unlock" : "Editable - Click to lock";
                
                // 更新文本框可编辑状态
                if (textArea) {
                    textArea.readOnly = isLocked || (isPasswordProtected && !isUnlocked);
                    updateTextAreaAppearance();
                }
                
                if (this.onInputChanged) {
                    this.onInputChanged();
                }
            });
            
            // 锁定按钮悬停效果
            lockButton.addEventListener("mouseenter", () => {
                lockButton.style.transform = "scale(1.1)";
            });
            
            lockButton.addEventListener("mouseleave", () => {
                lockButton.style.transform = "scale(1)";
            });
            
            // 密码保护按钮 - 只有两个状态：解锁(绿色)和加密(黄色)
            const passwordButton = document.createElement("div");
            passwordButton.innerHTML = isPasswordProtected ? "🔐" : "🔓";
            passwordButton.title = isPasswordProtected ? 
                "Password Protected - Click to unlock" : 
                "Click to enable password protection";
            passwordButton.style.cssText = `
                width: 24px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                background: ${isPasswordProtected ? "rgba(255, 193, 7, 0.3)" : "rgba(76, 175, 80, 0.3)"};
                border: 1px solid ${isPasswordProtected ? "#FFC107" : "#4CAF50"};
                transition: all 0.2s;
                user-select: none;
                flex-shrink: 0;
            `;
            
            passwordButton.addEventListener("click", () => {
                if (isPasswordProtected && !isUnlocked) {
                    // 如果已经启用密码保护但未解锁，点击时弹出密码输入框
                    promptForPassword();
                    return;
                }
                
                // 切换密码保护状态
                isPasswordProtected = !isPasswordProtected;
                
                // 如果开启密码保护，重置解锁状态
                if (isPasswordProtected) {
                    isUnlocked = false;
                }
                
                // 更新密码按钮状态
                updatePasswordButton();
                
                // 更新文本框状态
                if (textArea) {
                    textArea.readOnly = isLocked || (isPasswordProtected && !isUnlocked);
                    updateTextAreaAppearance();
                }
                
                if (this.onInputChanged) {
                    this.onInputChanged();
                }
            });
            
            // 更新密码按钮状态的函数
            const updatePasswordButton = () => {
                passwordButton.innerHTML = isPasswordProtected ? "🔐" : "🔓";
                passwordButton.style.background = isPasswordProtected ? 
                    "rgba(255, 193, 7, 0.3)" : 
                    "rgba(76, 175, 80, 0.3)";
                passwordButton.style.borderColor = isPasswordProtected ? 
                    "#FFC107" : 
                    "#4CAF50";
                passwordButton.title = isPasswordProtected ? 
                    "Password Protected - Click to unlock" : 
                    "Click to enable password protection";
            };
            
            // 密码按钮悬停效果
            passwordButton.addEventListener("mouseenter", () => {
                passwordButton.style.transform = "scale(1.1)";
            });
            
            passwordButton.addEventListener("mouseleave", () => {
                passwordButton.style.transform = "scale(1)";
            });
            
            // 右侧按钮容器
            const rightButtons = document.createElement("div");
            rightButtons.style.cssText = `
                display: flex;
                gap: 4px;
            `;
            
            rightButtons.appendChild(lockButton);
            rightButtons.appendChild(passwordButton);
            
            controls.appendChild(fontSizeControl);
            controls.appendChild(rightButtons);
            
            // 创建文本框
            const textArea = document.createElement("textarea");
            textArea.value = currentText;
            
            // 更新文本框外观的函数
            const updateTextAreaAppearance = () => {
                if (isPasswordProtected && !isUnlocked) {
                    // 密码保护且未解锁状态
                    textArea.style.background = "rgba(60, 60, 60, 0.7)";
                    textArea.style.color = "transparent";
                    textArea.style.textShadow = "0 0 8px rgba(200, 200, 200, 0.3)";
                    textArea.style.cursor = "pointer";
                    textArea.readOnly = true;
                    textArea.placeholder = "请解锁";
                } else {
                    // 正常状态或已解锁状态
                    textArea.style.background = isLocked ? "rgba(60, 60, 60, 0.7)" : "rgba(40, 40, 40, 0.9)";
                    textArea.style.color = "#e8e8e8";
                    textArea.style.textShadow = "none";
                    textArea.style.cursor = isLocked ? "not-allowed" : "text";
                    textArea.readOnly = isLocked;
                    textArea.placeholder = "";
                    
                    // 确保字体大小可以调节
                    if (currentFontSize) {
                        textArea.style.fontSize = currentFontSize + "px";
                    }
                }
            };
            
            // 初始设置文本框外观
            textArea.style.cssText = `
                flex: 1;
                width: 100%;
                min-height: 60px;
                border: none;
                padding: 10px;
                font-size: ${currentFontSize}px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                resize: none;
                outline: none;
                line-height: 1.4;
                box-sizing: border-box;
                overflow: auto;
                transition: all 0.3s ease;
            `;
            updateTextAreaAppearance();
            
            textArea.addEventListener("input", (e) => {
                if (isPasswordProtected && !isUnlocked) return; // 密码保护未解锁时不能编辑
                
                currentText = e.target.value;
                textWidget.value = currentText;
                
                if (this.onInputChanged) {
                    this.onInputChanged();
                }
            });
            
            // 密码输入提示函数
            const promptForPassword = () => {
                const password = prompt("请输入密码查看内容:", "");
                if (password === "Orz") {
                    // 密码验证成功后直接切换到解锁状态
                    isUnlocked = true;
                    isPasswordProtected = false; // 关闭密码保护
                    updatePasswordButton(); // 更新密码按钮状态
                    updateTextAreaAppearance();
                } else if (password !== null) {
                    alert("密码错误，请重试！");
                }
            };
            
            // 点击文本框时如果密码保护未解锁，弹出密码输入框
            textArea.addEventListener("click", (e) => {
                if (isPasswordProtected && !isUnlocked) {
                    promptForPassword();
                }
            });
            
            // 显示控制栏的函数
            const showControls = () => {
                controls.style.opacity = "1";
                controls.style.height = "auto";
                controls.style.minHeight = "20px";
                controls.style.padding = "6px 8px";
                controls.style.borderBottom = "1px solid #555";
                controls.style.overflow = "visible";
                controls.style.transform = "translateY(0)"; /* 向下移动到正常位置 */
                
                // 调整文本框高度以适应控制栏显示
                const controlsHeight = controls.offsetHeight;
                const containerHeight = container.offsetHeight;
                const availableHeight = containerHeight - controlsHeight;
                textArea.style.height = availableHeight + "px";
            };
            
            // 隐藏控制栏的函数
            const hideControls = () => {
                controls.style.opacity = "0";
                controls.style.height = "0";
                controls.style.minHeight = "0";
                controls.style.padding = "0";
                controls.style.borderBottom = "none";
                controls.style.overflow = "hidden";
                controls.style.transform = "translateY(-100%)"; /* 向上完全隐藏 */
                
                // 恢复文本框高度
                const containerHeight = container.offsetHeight;
                textArea.style.height = containerHeight + "px";
            };
            
            // 鼠标移入文本框时显示调节框
            textArea.addEventListener("mouseenter", () => {
                showControls();
            });
            
            // 鼠标移出文本框时隐藏调节框
            textArea.addEventListener("mouseleave", (e) => {
                // 检查鼠标是否移到了控制栏上
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && controls.contains(relatedTarget)) {
                    return; // 如果鼠标移到了控制栏上，不隐藏
                }
                
                hideControls();
            });
            
            // 鼠标移入控制栏时保持显示
            controls.addEventListener("mouseenter", () => {
                showControls();
            });
            
            // 鼠标移出控制栏时隐藏
            controls.addEventListener("mouseleave", (e) => {
                // 检查鼠标是否移到了文本框上
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && textArea.contains(relatedTarget)) {
                    return; // 如果鼠标移到了文本框上，不隐藏
                }
                
                hideControls();
            });
            
            // 组装UI
            container.appendChild(controls);
            container.appendChild(textArea);
            
            // 将自定义UI添加到节点
            this.widgets = this.widgets.filter(w => !['guide_text', 'font_size', 'locked'].includes(w.name));
            this.addDOMWidget("operation_guide_ui", "custom", container, {
                serialize: false
            });
            
            // 存储引用用于调整大小处理
            this.customTextArea = textArea;
            this.customContainer = container;
            this.customControls = controls;
            
            // 设置初始节点大小
            this.size = [320, 240];
            
            // 使用ResizeObserver检测节点大小变化
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver((entries) => {
                    for (let entry of entries) {
                        const { width, height } = entry.contentRect;
                        if (this.customContainer && this.customTextArea) {
                            const controlsHeight = this.customControls.offsetHeight;
                            const availableHeight = height - controlsHeight;
                            
                            // 确保文本框填充可用空间
                            this.customTextArea.style.height = Math.max(60, availableHeight) + 'px';
                        }
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