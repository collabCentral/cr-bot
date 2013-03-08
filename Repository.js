var modBranch = require("./Branch.js");

exports.Repository = function(jsonConfig)
{
    this._url = jsonConfig.repository.url;
    this._branches = [];
    this._checkoutPath = jsonConfig.checkoutPath;
    this._tmpPath = jsonConfig.tmpPath;

    var brArray = jsonConfig.repository.branches;
    for (var i = 0; i < brArray.length; ++i) {
        var branch = new modBranch.Branch(this, brArray[i], this._checkoutPath, this._tmpPath);
        this._branches.push(branch);
    }
}

exports.Repository.prototype = {
    get url()
    {
        return this._url;
    },

    get branches()
    {
        return this._branches;
    },

    initialize: function()
    {
        for (var i = 0; i < this._branches.length; ++i)
            this._branches[i].initialize();
    }
}
