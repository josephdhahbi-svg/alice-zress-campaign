import unittest
from scripts.validate_worldos_synthetic import validate_case
class WorldOSTests(unittest.TestCase):
    def test_birth(self):
        self.assertIn('BEFORE_EXISTENCE', validate_case(dict(kind='chronology', event_dr=99, start_dr=100)))
    def test_unknown(self):
        self.assertIn('UNKNOWN_DATE', validate_case(dict(kind='chronology', event_dr=None, start_dr=100)))
    def test_undead_review(self):
        self.assertIn('POST_DEATH_REVIEW_REQUIRED', validate_case(dict(kind='chronology', event_dr=110, start_dr=1, post_death=True)))
    def test_undead_verified(self):
        self.assertEqual([], validate_case(dict(kind='chronology', event_dr=110, start_dr=1, post_death=True, post_death_explanation_verified=True)))
    def test_reverse(self):
        c=dict(kind='geography', origin='B', destination='A', known_locations=['A','B'], plane='P', known_planes=['P'], approved_directed_edges=[['A','B']])
        self.assertIn('ROUTE_NOT_APPROVED', validate_case(c))
    def test_plane(self):
        c=dict(kind='geography', origin='A', destination='B', known_locations=['A','B'], plane='X', known_planes=['P'], approved_directed_edges=[['A','B']])
        self.assertIn('UNKNOWN_PLANE', validate_case(c))
    def test_boundary(self):
        self.assertEqual([], validate_case(dict(kind='traversal', from_book=30,to_book=1,from_traversal=3,to_traversal=4)))
    def test_rewrite(self):
        self.assertIn('HISTORICAL_REWRITE_FORBIDDEN',validate_case(dict(kind='traversal',from_book=30,to_book=1,from_traversal=3,to_traversal=4,rewrites_historical_date=True)))
    def test_eighth(self):
        self.assertIn('INVALID_TRAVERSAL',validate_case(dict(kind='traversal',from_book=30,to_book=1,from_traversal=7,to_traversal=8)))
    def test_skipped_book(self):
        self.assertIn('INVALID_BOOK_LINK',validate_case(dict(kind='traversal',from_book=10,to_book=12,from_traversal=2,to_traversal=2)))
if __name__ == '__main__': unittest.main()
