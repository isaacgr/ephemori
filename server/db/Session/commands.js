exports.getSessionCommand = `
SELECT data
FROM sessions
WHERE sid = $1
`;

exports.deleteSessionTokensCommand = `
DELETE from sessions
RETURNING *
`;
