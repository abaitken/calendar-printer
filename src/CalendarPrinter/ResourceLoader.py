from os import path
from pathlib import Path

class ResourceLoader:
    def __init__(self):
        source_path = Path(__file__).resolve()
        self.source_dir = source_path.parent
        
    def ReadFile(self, name: str):
        resourcefile = Path(path.join(self.source_dir, name))
        return resourcefile.read_text()
    