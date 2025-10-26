class VideoSizeSelectionOrz:
    """
    视频尺寸选择器 - 提供六种常用视频尺寸的互斥选择
    """
    
    # 尺寸定义：显示名称 → (宽, 高)
    RESOLUTIONS = {
        "竖版480×832 (约9:16)": (480, 832),
        "竖版576×1024 (9:16)": (576, 1024),
        "竖版720×1280 (9:16)": (720, 1280),
        "横版832×480 (约16:9)": (832, 480),
        "横版1024×576 (16:9)": (1024, 576),
        "横版1280×720 (16:9)": (1280, 720),
    }

    @classmethod
    def INPUT_TYPES(cls):
        """使用单个字符串输入来存储当前选择"""
        resolution_names = list(cls.RESOLUTIONS.keys())
        return {
            "required": {
                "selected_size": ("STRING", {"default": "横版1280×720 (16:9)"}),
            }
        }

    RETURN_TYPES = ("INT", "INT")
    RETURN_NAMES = ("宽度", "高度")
    FUNCTION = "get_selected_size"
    CATEGORY = "Orz-Tools/视频"
    OUTPUT_NODE = False

    def get_selected_size(self, selected_size):
        """
        根据选中的尺寸返回对应的宽高
        """
        if selected_size in self.RESOLUTIONS:
            width, height = self.RESOLUTIONS[selected_size]
            print(f"VideoSizeSelectionOrz: 选中 {selected_size} -> {width}x{height}")
            return (width, height)
        
        # 兜底：如果没有匹配的，返回默认值
        print("VideoSizeSelectionOrz: 尺寸选择无效，使用默认值 1280x720")
        return (1280, 720)


class VideoSizeSelection2Orz:
    """
    视频尺寸选择器2 - 使用下拉框选择尺寸
    """
    
    # 尺寸定义：显示名称 → (宽, 高)
    RESOLUTIONS = {
        "竖版480×832 (约9:16)": (480, 832),
        "竖版576×1024 (9:16)": (576, 1024),
        "竖版720×1280 (9:16)": (720, 1280),
        "横版832×480 (约16:9)": (832, 480),
        "横版1024×576 (16:9)": (1024, 576),
        "横版1280×720 (16:9)": (1280, 720),
    }

    @classmethod
    def INPUT_TYPES(cls):
        """定义输入类型 - 下拉菜单"""
        resolution_names = list(cls.RESOLUTIONS.keys())
        return {
            "required": {
                "尺寸选择": (resolution_names, {"default": "横版1280×720 (16:9)"}),
            }
        }

    RETURN_TYPES = ("INT", "INT")
    RETURN_NAMES = ("宽度", "高度")
    FUNCTION = "get_selected_size"
    CATEGORY = "Orz-Tools/视频"
    OUTPUT_NODE = False

    def get_selected_size(self, 尺寸选择):
        """
        根据下拉菜单选择返回对应的宽高尺寸
        """
        if 尺寸选择 in self.RESOLUTIONS:
            width, height = self.RESOLUTIONS[尺寸选择]
            print(f"VideoSizeSelection2Orz: 选中 {尺寸选择} -> {width}x{height}")
            return (width, height)
        
        # 兜底：如果没有匹配的，返回默认值
        print("VideoSizeSelection2Orz: 尺寸选择无效，使用默认值 1280x720")
        return (1280, 720)