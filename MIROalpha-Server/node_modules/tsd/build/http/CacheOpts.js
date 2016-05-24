'use strict';
var CacheMode = require('./CacheMode');
var CacheOpts = (function () {
    function CacheOpts(mode) {
        this.compressStore = false;
        this.splitDirLevel = 0;
        this.splitDirChunk = 1;
        this.cacheRead = true;
        this.cacheWrite = true;
        this.remoteRead = true;
        this.allowClean = false;
        this.jobTimeout = 0;
        if (mode) {
            this.applyCacheMode(mode);
        }
    }
    CacheOpts.prototype.applyCacheMode = function (mode) {
        switch (mode) {
            case 2 /* forceRemote */:
                this.cacheRead = false;
                this.remoteRead = true;
                this.cacheWrite = false;
                this.allowClean = false;
                break;
            case 3 /* forceUpdate */:
                this.cacheRead = false;
                this.remoteRead = true;
                this.cacheWrite = true;
                this.allowClean = true;
                break;
            case 5 /* allowUpdate */:
                this.cacheRead = true;
                this.remoteRead = true;
                this.cacheWrite = true;
                this.allowClean = true;
                break;
            case 1 /* forceLocal */:
                this.cacheRead = true;
                this.remoteRead = false;
                this.cacheWrite = false;
                this.allowClean = false;
                break;
            case 4 /* allowRemote */:
            default:
                this.cacheRead = true;
                this.remoteRead = true;
                this.cacheWrite = false;
                this.allowClean = false;
                break;
        }
    };
    return CacheOpts;
})();
module.exports = CacheOpts;
