import ConfigData from "../data/ConfigData";

export default class Util {

    private static _data: ConfigData;
    private static _isUserOwnerOrAdmin: boolean;

    public static get data(): ConfigData {
        return this._data;
    }

    public static get isUserOwnerOrAdmin(): boolean {
        return this._isUserOwnerOrAdmin;
    }

    static setup(data: ConfigData, isUserOwnerOrAdmin: boolean) {
        this._data = data;
        this._isUserOwnerOrAdmin = isUserOwnerOrAdmin;
    }
}