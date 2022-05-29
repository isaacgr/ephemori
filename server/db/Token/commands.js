exports.createVerifyTokenCommand = `
INSERT INTO verification_tokens(token, user_id)
VALUES ($1, $2)
RETURNING token
`;

exports.getVerifyTokenForUserCommand = `
SELECT 
  token, 
  created_at
FROM verification_tokens
WHERE user_id = $1
`;

exports.createResetTokenCommand = `
INSERT INTO reset_tokens(token, user_id)
VALUES ($1, $2)
RETURNING token
`;

exports.getResetTokenForUserCommand = `
SELECT 
  token,
  created_at
FROM reset_tokens
WHERE user_id = $1
`;

exports.getResetTokenCommand = `
SELECT
  token,
  created_at
FROM reset_tokens
WHERE user_id = $1
`;

exports.deleteVerifyTokenCommand = `
DELETE from verification_tokens
WHERE user_id = $1
AND token = $2
RETURNING *
`;

exports.deleteVerifyTokensCommand = `
DELETE from verification_tokens
WHERE created_at <= NOW() - INTERVAL '1 DAY'
RETURNING *
`;

exports.deleteResetTokensCommand = `
DELETE from reset_tokens
WHERE created_at <= NOW() - INTERVAL '1 DAY'
RETURNING *
`;

exports.deleteResetTokenCommand = `
DELETE from reset_tokens
WHERE user_id = $1
AND token = $2
RETURNING *
`;
