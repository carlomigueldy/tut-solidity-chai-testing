import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from "../typechain";

describe("Greeter", function () {
  let contract: Greeter;

  beforeEach(async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    contract = await Greeter.deploy();
  });

  describe("sum", () => {
    it("should return 5 when given parameters are 2 and 3", async function () {
      await contract.deployed();

      const sum = await contract.sum(2, 3);

      expect(sum).to.be.not.undefined;
      expect(sum).to.be.not.null;
      expect(sum).to.be.not.NaN;
      expect(sum).to.equal(5);
    });
  });

  describe("getMyLuckyNumber", () => {
    it("should return 5 when given 5", async () => {
      await contract.deployed();

      await contract.saveLuckyNumber(5);
      const myLuckyNumber = await contract.getMyLuckyNumber();

      expect(myLuckyNumber).to.be.not.undefined;
      expect(myLuckyNumber).to.be.not.null;
      expect(myLuckyNumber.toNumber()).to.equal(5);
    });
  });

  describe("saveLuckyNumber", () => {
    it("should revert with message 'Lucky number should not be 0.', when given 0", async () => {
      await contract.deployed();

      await expect(contract.saveLuckyNumber(0)).to.be.revertedWith(
        "Lucky number should not be 0."
      );
    });

    it("should revert with message 'You already have a lucky number.', when owner already have saved a lucky number", async () => {
      await contract.deployed();

      await contract.saveLuckyNumber(6);

      await expect(contract.saveLuckyNumber(7)).to.be.revertedWith(
        "You already have a lucky number."
      );
    });
  });

  describe("setLuckyNumber", () => {
    it("should revert with message '', when the given lucky number does not match with their existing lucky number", async () => {
      await contract.deployed();
      await contract.saveLuckyNumber(6);

      await expect(contract.setLuckyNumber(8, 99)).to.be.revertedWith(
        "Not your previous lucky number."
      );
    });

    it("should update their lucky number, when given the exact existing lucky number stored", async () => {
      await contract.deployed();
      await contract.saveLuckyNumber(2);

      const newLuckyNumber = await contract.getMyLuckyNumber();

      await expect(contract.setLuckyNumber(2, 22)).to.be.not.revertedWith(
        "Not your previous lucky number."
      );
      expect(newLuckyNumber).to.be.not.undefined;
      expect(newLuckyNumber).to.be.not.null;
      expect(newLuckyNumber.toNumber()).to.be.equal(2);
    });
  });
});
