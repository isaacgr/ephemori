exports.getImportantDatesCommand = `
SELECT
  id,
  date,
  color,
  significance
FROM important_dates
WHERE user_id = $1
ORDER BY date
`;

exports.getImportantDateCommand = `
SELECT
  id,
  date,
  color,
  significance
FROM important_dates
WHERE user_id = $1
AND id = $2
`;

exports.getImportantDatesCountCommand = `
SELECT COUNT(*) as total
FROM important_dates
WHERE user_id = $1
`;

exports.removeImportantDatesCommand = `
DELETE FROM
important_dates
WHERE user_id = $1
AND id = $2
RETURNING *
`;

exports.addImportantDatesCommand = `
INSERT INTO
important_dates(date, color, significance, user_id)
VALUES($1, $2, $3, $4)
RETURNING date, color, significance, id
`;
