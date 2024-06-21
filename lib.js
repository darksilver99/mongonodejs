const functions = {
    messageDefault() {
        return "success";
    },
    async messageDefault2() {
        var aaa = await this.delayAndReturn();
        return aaa;
    },
    delayAndReturn(milliseconds = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve("Delayed value");
            }, milliseconds);
        });
    }
};


module.exports = functions;