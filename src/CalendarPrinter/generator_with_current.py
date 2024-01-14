from typing import Generator


class generator_with_current(object):
    def __init__(self, generator: Generator):
        self.__gen = generator
        self.current = None

    def __iter__(self):
        return self

    def __next__(self):        
        nextValue = next(self.__gen, None)
        if nextValue is not None:
            self.current = nextValue
        return nextValue

    def __call__(self):
        return self