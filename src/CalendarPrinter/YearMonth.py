
class YearMonth:
    @staticmethod
    def Parse(s: str) -> 'YearMonth':    
        parts = s.split('-')

        if len(parts) != 2:
            raise ValueError("Expected 2 parts")

        year = YearMonth.__ParseYear(parts[0])
        month = YearMonth.__ParseMonth(parts[1])
        return YearMonth(year, month)

    @staticmethod
    def __ParseYear(s: str) -> int:
        if len(s) != 4:
            raise ValueError("Expected 4 characters denoting year")

        if s.isnumeric():
            return int(s)
        
        raise ValueError('Unable to parse year')

    @staticmethod
    def __ParseMonth(s: str) -> int:
        if len(s) != 2:
            raise ValueError("Expected 2 characters denoting month")

        if s.isnumeric():
            return int(s)
        
        raise ValueError('Unable to parse month')
        
    def __init__(self, year: int, month: int):
        if year is None or month is None:
            raise ValueError()

        if year < 0 or month < 0 or month > 12:
            raise ValueError()
            
        self.year = year
        self.month = month
        
    def NextMonth(self) -> 'YearMonth':
        month = self.month
        year = self.year
        
        month += 1
        if month > 12:
            month = 1
            year += 1
        
        return YearMonth(year, month)
    
    def compare(self, other: 'YearMonth') -> int:
        if self.year > other.year:
            return 1
        
        if self.year < other.year:
            return -1
        
        if self.month > other.month:
            return 1
        
        if self.month < other.month:
            return -1
        
        return 0
    
    def equals(self, other: 'YearMonth') -> bool:
        return (self.year == other.year and self.month == other.month)

    def __eq__(self, other: 'YearMonth') -> bool:
        return self.equals(other)

    def __ne__(self, other: 'YearMonth') -> bool:
        return not self.equals(other)

    def __gt__(self, other: 'YearMonth') -> bool:
        return self.compare(other) == 1

    def __ge__(self, other: 'YearMonth') -> bool:
        return self.compare(other) >= 1

    def __lt__(self, other: 'YearMonth') -> bool:
        return self.compare(other) == -1

    def __le__(self, other: 'YearMonth') -> bool:
        return self.compare(other) <= 0
        
        