export var generateId =  function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
};

export var deepClone = function(obj,type){
    let plainObj = JSON.parse(JSON.stringify(obj));
    if(!type)
        return plainObj;
    // convert plainObj to  type
    return  Object.assign(type, plainObj);    
};


