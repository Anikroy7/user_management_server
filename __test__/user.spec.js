const {
  getAllUsers,
  createUser,
  loginUser,
} = require("../controllers/user.controller");
const {
  getAllUsersServices,
  userLoginServices,
  createUserServices,
} = require("../services/user.service");

const path = require('path');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require("fs");
const { hashedPassword, comparePassword } = require("../utils/helpers");
const { query } = require("express");
jest.mock("fs");
jest.mock("../utils/helpers.js");
jest.mock("../services/user.service");
jest.mock("../models/User");
jest.mock("jsonwebtoken");

describe('getAllUsers API', () => {
  test('should return status 200 and users data on success', async () => {
    const mockReq = {
      query: {
        _start: 0, 
        _limit: 10, 
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUsers(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      data: expect.any(Array), 
    });
  });

  test('should return status 500 and error message on failure', async () => {
    const mockReq = {

    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUsers(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: expect.any(String), 
    });
  });
});

describe("createUser API", () => {
  test("should return status 200 and success message on success", async () => {
    const mockReq = {
      body: {
        _id: "tst",
        name: "test",
        email: "test@gmail.com",
        password: "stes",
        phone: "01786335131",
        address: "Naogaon, Rajshahi",
        role: "test",
      },
      file: { path: "mock/file/path" },
      query: {}
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockResult = mockReq;
    createUserServices.mockResolvedValueOnce(mockResult);
    hashedPassword.mockReturnValueOnce("hash");
    await createUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "success",
      message: "user post successfully",
      data: mockResult,
    });
  });
});

describe("loginUser", () => {
  const mockReq = {
    body: {
      email: "test@gamil.com",
      password: "password123",
    },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return status 200 and token on successful login", async () => {
    const mockUser = [
      {
        email: "test@example.com",
        password: "hashedPassword",
      },
    ];
    comparePassword.mockReturnValueOnce("hash");
    userLoginServices.mockResolvedValueOnce(mockUser);
    jwt.sign.mockReturnValueOnce("mockToken");

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "success",
      message: "Loing successfull",
      token: "mockToken",
      data: mockUser,
    });
  });

  test("should return status 403 and error message on invalid password", async () => {
    const mockUser = [
      {
        email: "test@example.com",
        password: "hashedPassword",
        role: "user",
      },
    ];
    userLoginServices.mockResolvedValueOnce(mockUser);
    jwt.sign.mockReturnValueOnce("mockToken");
    comparePassword.mockReturnValueOnce(false);

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "failed",
      message: "Authentication failed!",
    });
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
  });

  test("should return status 403 and error message on failed login", async () => {
    userLoginServices.mockRejectedValueOnce(new Error("Failed to login"));

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "failed",
      message: "Failed to login",
      error: "Failed to login",
    });
  });
});


