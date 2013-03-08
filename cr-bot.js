CrBotApplication = function()
{
}

CrBotApplication.prototype = {
    run: function()
    {
        this._initialize();
    },

    _initialize: function()
    {
        if (!this.modFS)
            this.modFS = require("fs");

        this.modFS.readFile("config.json", this._onReadConfigFile.bind(this));
    },

    _onReadConfigFile: function(err, data)
    {
        if (err)
            throw err;

        jsonConfig = JSON.parse(data);

        if (!jsonConfig)
            throw "Error: Config file error";

        if (!jsonConfig.checkoutPath)
            jsonConfig.checkoutPath = "./bot";

        jsonConfig.tmpPath = process.cwd() + "/tmp";

        this.modFS.mkdir(jsonConfig.checkoutPath);
        this.modFS.mkdir(jsonConfig.tmpPath);

        this.modFS.realpath(jsonConfig.checkoutPath, this._onReady.bind(this));
    },

    _onReady: function(err, path)
    {
        jsonConfig.checkoutPath = path;

        if (!this.modCrBOT)
            this.modRepository = require("./Repository.js");
        this.repository = new this.modRepository.Repository(jsonConfig);

        this.repository.initialize();
    }
}

new CrBotApplication().run();
