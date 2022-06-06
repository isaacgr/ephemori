exports.createUserCommand = `
INSERT INTO 
users(email, password)
VALUES ($1, $2)
RETURNING *
`;

exports.getUserByIdCommand = `
SELECT
  id,
  email,
  display_name,
  date_of_birth,
  is_user_set
FROM users
WHERE id = $1
`;

exports.getUserPasswordCommand = `
SELECT 
  password
FROM users
WHERE email = $1
`;

exports.getUserTierCommand = `
SELECT
  tier
FROM users
WHERE id = $1
`;

exports.getUserByCredentialsCommand = `
SELECT 
  id,
  email,
  display_name,
  date_of_birth,
  is_user_set
FROM users
WHERE email = $1
`;

exports.setUserVerifiedCommand = `
UPDATE users
SET
  verified = $1
WHERE id IN (
  SELECT
    l.id
  FROM users l
  INNER JOIN verification_tokens r ON
    r.user_id = l.id
  WHERE
    r.token = $2
)
RETURNING *
`;

exports.checkUserVerfiedCommand = `
SELECT
  l.verified
FROM users l
INNER JOIN verification_tokens r ON
  r.user_id = l.id
WHERE
  r.token = $1
`;

exports.getUserVerifiedCommand = `
SELECT
  verified
FROM users
WHERE email = $1
`;

exports.updateUserCommand = `
UPDATE users
SET
  date_of_birth = $1,
  is_user_set = $2
WHERE id = $3
RETURNING id, date_of_birth, is_user_set
`;

exports.updatePasswordCommand = `
UPDATE users
SET
  password = $1
WHERE id = $2
RETURNING id
`;
