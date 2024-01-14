class TagsToIconConverter:
    def __init__(self, mapping):
        self._mapping = mapping

    def GetIcon(self, tags):
        if len(tags) == 0:
            return None
        
        for mapping in self._mapping:
            if TagsToIconConverter.ContainsTags(mapping.tags, tags):
                return mapping
                
        return None
        
    def ContainsTags(needles, haystack):
        for needle in needles:
            if not needle in haystack:
                return False
        
        return True
