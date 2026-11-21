// A product name from the sheet with every year / year range kept together left-to-right on one line,
// so "طبون امامي AMG CLA117 2013-2015" never wraps as "2013-" / "2015" or moves the dash in RTL.
// Only standalone years (not digits glued to a code such as C2062022) are wrapped.
const YEARS = /((?<![\dA-Za-z])(?:19|20)\d\d(?:\s*-\s*(?:19|20)\d\d)?\+?(?![\dA-Za-z]))/;

export default function ProductName({ name }: { name: string }) {
  // split() with one capture group: odd indexes are the year matches.
  return (
    <>
      {name.split(YEARS).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} dir="ltr" className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
