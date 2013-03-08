exports.Branch = function(repo, name, checkoutPath, tmpPath)
{
    this._repo = repo;
    this._name = name;
    this._checkoutPath = checkoutPath + "/" + this._name;
    this._tmpPath = tmpPath;
    this._url = this._repo.url + this._name;
}

exports.Branch.prototype = {
    get name()
    {
        return this._name;
    },

    get url()
    {
        return this._url;
    },

    get checkoutPath()
    {
        return this._checkoutPath;
    },

    initialize: function()
    {
        if (!this.modUtil)
            this.modUtil = require("util")

        if (!this.modChildProcess)
            this.modChildProcess = require('child_process');

        //FIXME: Remove the duplicate usage of modFS with something like a FSManager which
        //manages the File System access.
        if (!this.modFS)
            this.modFS = require("fs");

        this.modFS.mkdir(this._checkoutPath + "/" + this._name);

        var cmdSvnLog = "svn log --xml " + this.url + " > " + this._tmpPath + "/" + this.name + ".xml";

        console.log(cmdSvnLog);

        this.modChildProcess.exec(cmdSvnLog, this._onSvnLog.bind(this));
    },

    _onSvnLog: function(error, stdout, stderr)
    {
        var fileContent = this.modFS.readFileSync(this._tmpPath + "/" + this.name + ".xml", "utf8");

        if (!this.modXmlDOM)
            this.modXmlDOM = require("xmldom");

        var document = new this.modXmlDOM.DOMParser().parseFromString(fileContent, "text/xml");

        var logEntries = document.getElementsByTagName("logentry");
        for (var i = 0; i < logEntries.length; ++i) {
            //console.log(logEntries.item(i).getAttribute("revision"));
        }
        this._checkoutBranch(logEntries.item(0).getAttribute("revision"));
    },

    _checkoutBranch: function(revision)
    {
        var cmdSvnCheckout = "svn co " + this.url + " -r " + revision + " " + this._checkoutPath;
        console.log(cmdSvnCheckout);
    }

}
