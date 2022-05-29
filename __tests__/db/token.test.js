const { db, Database, createDatabase } = require("../db");
const database = new Database(db);
const TokenController = require("../../server/db/Token");
const { InvalidTokenError } = require("../../server/utils/errors");

const tokenController = new TokenController(db);

const user = {
  credentials: {
    email: "testsuite@gmail.com",
    password: "password"
  }
};

describe("DATABASE TokenService", () => {
  let userId = null;
  beforeAll(async () => {
    try {
      const result = await createDatabase();
      await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  beforeEach(async () => {
    try {
      const result = await database.createTables();
      console.log(result);
      const res = await db.query(
        "INSERT INTO users(email, password) VALUES($1, $2) RETURNING id",
        [user.credentials.email, user.credentials.password]
      );
      userId = res.rows[0].id;
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterEach(async () => {
    jest.clearAllMocks();
    try {
      const result = await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterAll(() => {
    database.db.end();
  });
  describe("verification tokens", () => {
    it("should create a verification token for a given user", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token = await tokenController.createVerifyToken(userId);
      expect(typeof token).toBe("string");
      expect(token.length).toBe(tokenController.EMAIL_TOKEN_LENGTH);
      expect(generateTokenSpy).toHaveBeenCalled();
    });
    it("should return the old verification token if one already exists for the user", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token1 = await tokenController.createVerifyToken(userId);
      const token2 = await tokenController.createVerifyToken(userId);
      expect(token1).toEqual(token2);
      expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    });
    it("should return a new verification token if the existing token is expired", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token1 = await tokenController.createVerifyToken(userId);
      await db.query(
        "UPDATE verification_tokens SET created_at = NOW() - INTERVAL '2 DAYS' RETURNING *"
      );
      const token2 = await tokenController.createVerifyToken(userId);
      expect(generateTokenSpy).toHaveBeenCalled();
      expect(token1).not.toEqual(token2);
    });
    it("should delete a single verification token", async () => {
      const token = await tokenController.createVerifyToken(userId);
      const { message } = await tokenController.deleteVerifyToken(
        userId,
        token
      );
      expect(typeof message).toBe("string");
      expect(message).toContain("Deleted verification token. [1]");
    });
    it("should delete all verification tokens older than a day", async () => {
      await tokenController.createVerifyToken(userId);
      await db.query(
        "UPDATE verification_tokens SET created_at = NOW() - INTERVAL '2 DAYS' RETURNING *"
      );
      const { message } = await tokenController.deleteVerifyTokens();
      expect(typeof message).toBe("string");
      expect(message).toContain("Deleted verification token(s). [1]");
    });
  });
  describe("reset tokens", () => {
    it("should create a reset token for a given user", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token = await tokenController.createResetToken(userId);
      expect(typeof token).toBe("string");
      expect(token.length).toBe(tokenController.RESET_TOKEN_LENGTH);
      expect(generateTokenSpy).toHaveBeenCalled();
    });
    it("should return the old reset token if one already exists for the user", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token1 = await tokenController.createResetToken(userId);
      const token2 = await tokenController.createResetToken(userId);
      expect(token1).toEqual(token2);
      expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    });
    it("should return a new reset token if the existing token is expired", async () => {
      const generateTokenSpy = jest.spyOn(
        TokenController.prototype,
        "generateToken"
      );
      const token1 = await tokenController.createResetToken(userId);
      await db.query(
        "UPDATE reset_tokens SET created_at = NOW() - INTERVAL '2 DAYS' RETURNING *"
      );
      const token2 = await tokenController.createResetToken(userId);
      expect(generateTokenSpy).toHaveBeenCalled();
      expect(token1).not.toBe(token2);
    });
    it("should get the reset token for the given user", async () => {
      const token = await tokenController.createResetToken(userId);
      const result = await tokenController.getResetToken(userId, token);
      expect(result.token).toEqual(token);
      expect(typeof result.createdAt).toBe("object");
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });
    it("should delete a single reset token", async () => {
      const token = await tokenController.createResetToken(userId);
      const { message } = await tokenController.deleteResetToken(userId, token);
      expect(typeof message).toBe("string");
      expect(message).toContain("Deleted reset token. [1]");
    });
    it("should delete all reset tokens older than a day", async () => {
      await tokenController.createResetToken(userId);
      await db.query(
        "UPDATE reset_tokens SET created_at = NOW() - INTERVAL '2 DAYS' RETURNING *"
      );
      const { message } = await tokenController.deleteResetTokens();
      expect(typeof message).toBe("string");
      expect(message).toContain("Deleted reset token(s). [1]");
    });
    it("should throw an error if no token is found for the user", async () => {
      const e = async () => {
        await tokenController.getResetToken(userId, "token");
      };
      await expect(e()).rejects.toThrow(InvalidTokenError);
      await expect(e()).rejects.toThrow("No token found for user");
    });
    it("should throw an error if given token does not match whats in the database", async () => {
      const e = async () => {
        await tokenController.createResetToken(userId);
        await tokenController.getResetToken(userId, "token");
      };
      await expect(e()).rejects.toThrow(InvalidTokenError);
      await expect(e()).rejects.toThrow("Token invalid for user");
    });
    it("should throw an error if given token is expired", async () => {
      const token = await tokenController.createResetToken(userId);
      await db.query("UPDATE reset_tokens SET created_at = $1", [
        new Date(new Date().setDate(new Date().getDate() - 1))
      ]);
      const e = async () => {
        await tokenController.getResetToken(userId, token);
      };
      await expect(e()).rejects.toThrow(InvalidTokenError);
      await expect(e()).rejects.toThrow("Token is expired");
    });
  });
});
