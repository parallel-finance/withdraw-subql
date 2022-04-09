import { SubstrateExtrinsic } from "@subql/types";
import { DotWithdraw } from "../types";
import type { Extrinsic } from "@polkadot/types/interfaces";
import type { Vec } from "@polkadot/types";

const PARALLEL_REFUND_ADDR = "p8BDTWhQXouTCuVSSQTSYYDCxAC523iDZXNS9zT8ujgvnbyBh";

export const handleBatchAll = async (extrinsic: SubstrateExtrinsic) => {
  await handleDotWithdraw(extrinsic);
};

const handleDotWithdraw = async (extrinsic: SubstrateExtrinsic) => {
  const calls = extrinsic.extrinsic.args[0] as Vec<Extrinsic>;
  if (
    calls.length < 2 ||
    !checkTransaction("system", "remark", calls[0]) ||
    !checkTransaction("assets", "transfer", calls[1])
  ) {
    logger.info(`Invalid extrinsic format ${calls.hash.toString()}`);
    return;
  }
  const [
    {
      args: [remarkRaw],
    },
    {
      args: [idRaw, addressRaw, amountRaw],
    },
  ] = calls.toArray();

  if (addressRaw.toString() !== PARALLEL_REFUND_ADDR) {
    logger.info(`Irrelated address: ${addressRaw.toString()}`);
    return;
  }

  const address = extrinsic.extrinsic.signer.toString();
  const blockHeight = extrinsic.block.block.header.number.toNumber();
  const record = DotWithdraw.create({
    id: `${blockHeight}-${extrinsic.idx}`,
    originHash: extrinsic.extrinsic.hash.toString(),
    address,
    amount: amountRaw.toString(),
    blockHeight,
  });

  logger.info(JSON.stringify(record));

  await record.save();
};

const checkTransaction = (sectionFilter: string, methodFilter: string, call: Extrinsic) => {
  const { section, method } = call.registry.findMetaCall(call.callIndex);
  return section === sectionFilter && method === methodFilter;
};
