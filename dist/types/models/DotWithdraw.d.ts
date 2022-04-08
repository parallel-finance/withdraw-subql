import { Entity, FunctionPropertyNames } from "@subql/types";
declare type DotWithdrawProps = Omit<DotWithdraw, NonNullable<FunctionPropertyNames<DotWithdraw>>>;
export declare class DotWithdraw implements Entity {
    constructor(id: string);
    id: string;
    originHash: string;
    address: string;
    amount: string;
    blockHeight: number;
    save(): Promise<void>;
    static remove(id: string): Promise<void>;
    static get(id: string): Promise<DotWithdraw | undefined>;
    static create(record: DotWithdrawProps): DotWithdraw;
}
export {};
