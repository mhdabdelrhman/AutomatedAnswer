export var generateId = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
};

export var deepClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

export var saveToLocalStorage = function (chainObject, storage) {
    if (chainObject) {
        localStorage.setItem(storage, JSON.stringify(chainObject));
    }
};

export var loadFromLocalStorage = function (storage) {
    if (localStorage.getItem(storage) && localStorage.getItem(storage).length > 0) {
        return JSON.parse(localStorage.getItem(storage));
    }
    return null;
};