import { SubstrateExtrinsic } from "@subql/types";
import { DotWithdrawStatus, DotWithdraw } from "../types";
import type { Extrinsic } from "@polkadot/types/interfaces";
import type { Vec } from "@polkadot/types";

const PARALLEL_REFUND_ADDR = "???";

export const handleBatchAll = async (extrinsic: SubstrateExtrinsic) => {
  await handleDotWithdraw(extrinsic);
};

const handleDotWithdraw = async (extrinsic: SubstrateExtrinsic) => {
  const calls = extrinsic.extrinsic.args[0] as Vec<Extrinsic>;
  if (
    calls.length < 2 ||
    !checkTransaction("system", "remark", calls[0]) ||
    !checkTransaction("balances", "transfer", calls[1])
  ) {
    return;
  }
  const [
    {
      args: [remarkRaw],
    },
    {
      args: [addressRaw, amountRaw],
    },
  ] = calls.toArray();

  if (addressRaw.toString() !== PARALLEL_REFUND_ADDR) {
    return;
  }

  const address = extrinsic.extrinsic.signer.toString();
  const record = DotWithdraw.create({
    id: extrinsic.extrinsic.hash.toString(),
    originHash: extrinsic.extrinsic.hash.toString(),
    address,
    amount: amountRaw.toString(),
    status: DotWithdrawStatus.PENDING,
  });

  logger.info(JSON.stringify(record));

  await record.save();
};

const checkTransaction = (sectionFilter: string, methodFilter: string, call: Extrinsic) => {
  const { section, method } = call.registry.findMetaCall(call.callIndex);
  return section === sectionFilter && method === methodFilter;
};
