class Color:
    def __init__(self, value: str):
        self.value = value

    def __str__(self) -> str:
        return self.value
    
    def Black() -> 'Color':
        return Color('black')
    def Crimson() -> 'Color':
        return Color('crimson')
    def Grey() -> 'Color':
        return Color('grey')
    def Gray() -> 'Color':
        return Color('gray')
    