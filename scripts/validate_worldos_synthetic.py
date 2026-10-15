"""Read-only synthetic WorldOS checks, not a live route authority."""
def validate_case(c):
    errors = []
    kind = c.get('kind')
    if kind == 'chronology':
        year, start, end = c.get('event_dr'), c.get('start_dr'), c.get('end_dr')
        if type(year) is not int or type(start) is not int:
            errors.append('UNKNOWN_DATE')
        elif year < start:
            errors.append('BEFORE_EXISTENCE')
        if end is not None:
            if type(end) is not int:
                errors.append('UNKNOWN_END_DATE')
            elif type(year) is int and year > end:
                errors.append('AFTER_EXISTENCE')
        if c.get('post_death') and not c.get('post_death_explanation_verified'):
            errors.append('POST_DEATH_REVIEW_REQUIRED')
    elif kind == 'geography':
        locations, planes = set(c.get('known_locations', [])), set(c.get('known_planes', []))
        origin, dest = c.get('origin'), c.get('destination')
        if not origin or not dest or origin not in locations or dest not in locations:
            errors.append('UNKNOWN_LOCATION')
        if c.get('plane') not in planes:
            errors.append('UNKNOWN_PLANE')
        if (origin, dest) not in [tuple(edge) for edge in c.get('approved_directed_edges', [])]:
            errors.append('ROUTE_NOT_APPROVED')
    elif kind == 'traversal':
        book, nxt = c.get('from_book'), c.get('to_book')
        trav, next_trav = c.get('from_traversal'), c.get('to_traversal')
        if type(book) is not int or type(nxt) is not int or not 1 <= book <= 30 or not 1 <= nxt <= 30:
            errors.append('INVALID_BOOK')
        elif nxt != (1 if book == 30 else book + 1):
            errors.append('INVALID_BOOK_LINK')
        if type(trav) is not int or type(next_trav) is not int or not 1 <= trav <= 7 or not 1 <= next_trav <= 7:
            errors.append('INVALID_TRAVERSAL')
        elif next_trav != (trav + 1 if book == 30 else trav):
            errors.append('INVALID_TRAVERSAL_TRANSITION')
        if c.get('rewrites_historical_date'):
            errors.append('HISTORICAL_REWRITE_FORBIDDEN')
    else:
        errors.append('UNKNOWN_CASE_KIND')
    return sorted(set(errors))
