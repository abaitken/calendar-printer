from .Color import Color

class TagMapping:
    def __init__(self, jobj):
        self.icon = jobj['icon']
        self.tags = jobj['tags']
        self.color = Color(jobj['color'])
        