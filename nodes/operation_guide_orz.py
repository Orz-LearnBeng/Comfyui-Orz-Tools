class OperationGuideOrz:
    """
    Operation Guide Node - For adding instructions and notes to workflow
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "guide_text": ("STRING", {
                    "multiline": True,
                    "default": "# Operation Guide\n\nAdd your instructions here...\n\n- Step 1\n- Step 2\n- Important notes",
                    "dynamicPrompts": False
                }),
                "font_size": ("INT", {
                    "default": 26,  # 默认字体26号
                    "min": 8,
                    "max": 32,
                    "step": 1,
                    "display": "slider"
                }),
                "locked": ("BOOLEAN", {
                    "default": False,
                    "label_on": "Locked",
                    "label_off": "Editable"
                }),
            }
        }

    RETURN_TYPES = ()
    RETURN_NAMES = ()
    FUNCTION = "process_guide"
    CATEGORY = "Orz-Tools/Tools"
    OUTPUT_NODE = False

    def process_guide(self, guide_text, font_size, locked):
        """
        This is a guide node, does not perform any operations
        """
        # Just print log, no return value
        status = "Locked" if locked else "Editable"
        print(f"OperationGuideOrz: Status={status}, Font Size={font_size}, Content Length={len(guide_text)}")
        return ()