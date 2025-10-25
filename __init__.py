from .nodes.video_size_selec_orz import VideoSizeSelectionOrz, VideoSizeSelection2Orz

NODE_CLASS_MAPPINGS = {
    "VideoSizeSelectionOrz": VideoSizeSelectionOrz,
    "VideoSizeSelection2Orz": VideoSizeSelection2Orz,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoSizeSelectionOrz": "视频尺寸选择 Orz",
    "VideoSizeSelection2Orz": "视频尺寸选择2 Orz",
}

WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]