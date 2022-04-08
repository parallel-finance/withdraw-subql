"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBatchAll = void 0;
const types_1 = require("../types");
const PARALLEL_REFUND_ADDR = "p8F4qJh9mpENkatLLRgL5kVHmL95WSeKMhDEcFBjMGztktkiJ";
const handleBatchAll = async (extrinsic) => {
    await handleDotWithdraw(extrinsic);
};
exports.handleBatchAll = handleBatchAll;
const handleDotWithdraw = async (extrinsic) => {
    const calls = extrinsic.extrinsic.args[0];
    if (calls.length < 2 ||
        !checkTransaction("system", "remark", calls[0]) ||
        !checkTransaction("assets", "transfer", calls[1])) {
        logger.info(`Invalid extrinsic format ${calls.hash.toString()}`);
        return;
    }
    const [{ args: [remarkRaw], }, { args: [idRaw, addressRaw, amountRaw], },] = calls.toArray();
    if (addressRaw.toString() !== PARALLEL_REFUND_ADDR) {
        logger.info(`Irrelated address: ${addressRaw.toString()}`);
        return;
    }
    const address = extrinsic.extrinsic.signer.toString();
    const blockHeight = extrinsic.block.block.header.number.toNumber();
    const record = types_1.DotWithdraw.create({
        id: `${blockHeight}-${extrinsic.idx}`,
        originHash: extrinsic.extrinsic.hash.toString(),
        address,
        amount: amountRaw.toString(),
        blockHeight,
    });
    logger.info(JSON.stringify(record));
    await record.save();
};
const checkTransaction = (sectionFilter, methodFilter, call) => {
    const { section, method } = call.registry.findMetaCall(call.callIndex);
    return section === sectionFilter && method === methodFilter;
};
