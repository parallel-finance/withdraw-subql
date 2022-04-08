"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotWithdraw = void 0;
const tslib_1 = require("tslib");
const assert_1 = (0, tslib_1.__importDefault)(require("assert"));
class DotWithdraw {
    constructor(id) {
        this.id = id;
    }
    async save() {
        let id = this.id;
        (0, assert_1.default)(id !== null, "Cannot save DotWithdraw entity without an ID");
        await store.set('DotWithdraw', id.toString(), this);
    }
    static async remove(id) {
        (0, assert_1.default)(id !== null, "Cannot remove DotWithdraw entity without an ID");
        await store.remove('DotWithdraw', id.toString());
    }
    static async get(id) {
        (0, assert_1.default)((id !== null && id !== undefined), "Cannot get DotWithdraw entity without an ID");
        const record = await store.get('DotWithdraw', id.toString());
        if (record) {
            return DotWithdraw.create(record);
        }
        else {
            return;
        }
    }
    static create(record) {
        (0, assert_1.default)(typeof record.id === 'string', "id must be provided");
        let entity = new DotWithdraw(record.id);
        Object.assign(entity, record);
        return entity;
    }
}
exports.DotWithdraw = DotWithdraw;
