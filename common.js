const { PrismaClient } = require("./generated/prisma/client.js");
const prisma = new PrismaClient();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = { prisma,router, jwt, bcrypt };

