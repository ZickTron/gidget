class StructureError extends Error {
    constructor(error) {
        super();
        this.name = "StructureError";
        this.message = error;
    }
}
const prefix = require("./database/models/prefix");
const cr = require("./database/models/customresponses");
const level = require("./database/models/levelconfig");
const { Structures } = require("discord.js");

Structures.extend('Guild', Guild => {
    return class extends Guild {
        constructor(client, data) {
            super(client, data);
            this.queue = null;
            this.musicVariables = null;
            this.prefix = "g%";
            this.customresponses = {};
            this.levelconfig = {};
            this.cache = {
                prefix: false,
                customresponses: false,
                levelconfig: false,
            };
        }
        /**
         * @returns {String} The actual guild prefix
         */
        async getPrefix() {
            const doc = await prefix.findOne({ guildId: this.id });
            if (doc) {
                this.prefix = doc.prefix;
                this.cache.prefix = true;
                return doc.prefix;
            } else {
                this.prefix = "g%";
                this.cache.prefix = true;
                return "g%"
            }
        }
        /**
         * 
         * @param {String} newPrefix The new server prefix
         * @returns {String} The new prefix
         */
        async setPrefix(newPrefix) {
            const doc = await prefix.findOneAndUpdate({ guildId: this.id }, { prefix: newPrefix });
            if (doc) {
                this.prefix = newPrefix;
                this.cache.prefix = true;
                return newPrefix;
            } else {
                const algo = await prefix.create({
                    guildId: this.id,
                    prefix: newPrefix,
                });
                this.prefix = newPrefix;
                this.cache.prefix = true;
                return newPrefix;
            }
        }
        /**
         * 
         * @param {String} match The text string to check in each message
         * @param {Object} message The Discord.js message object to send
         * @returns {Boolean} Although if there is an error this will just throw it away.
         */
        async addCustomResponse(match, message) {
            const doc = await cr.findOne({ guildId: this.id });
            if (doc) {
                const check = Object.keys(doc.responses).find(e => e === match);
                if (check) throw new StructureError("A key with that match already exists. To avoid data loss problems first remove the key.");
                else {
                    doc.responses[match] = message;
                    await doc.updateOne({ responses: doc.responses });
                    this.customresponses = doc;
                    this.cache.customresponses = true;
                    return true;
                }
            } else {
                const algo = {};
                algo[match] = message;
                const esto = await cr.create({
                    guildId: this.id,
                    responses: algo
                });
                this.customresponses = esto;
                this.cache.customresponses = true;
                return true;
            }
        }
        /**
         * 
         * @param {Number} index Number of index in the object to delete
         * @returns {Boolean} Although if there is an error this will just throw it away.
         */
        async deleteCustomResponse(index) {
            const doc = await cr.findOne({ guildId: this.id });
            if (!cr) {
                this.customresponses = {}
                this.cache.customresponses = true;
                throw new StructureError("There are no custom responses on this server...")
            } else {
                const keys = Object.keys(doc.responses);
                if (!keys.length) throw new StructureError("There are no custom responses on this server...");
                if (index <= keys.length && index >= 1) {
                    let word = keys[index - 1];
                    if (responses.hasOwnProperty(word)) {
                        delete responses[word];
                        const a = Object.keys(responses);
                        if (a.length < 1) {
                            await msgDocument.deleteOne()
                            this.customresponses = {}
                            this.cache.customresponses = true;
                            return true;
                        } else {
                            await msgDocument.updateOne({ responses: responses })
                            this.customresponses = doc.responses;
                            this.cache.customresponses = true;
                            return true;
                        }
                    } else throw new StructureError("Doesn't have their own property? Report this to AndreMor")
                } else throw new StructureError("Invalid ID")
            }
        }
        async getCustomResponses() {
            const doc = await cr.findOne({ guildId: this.id });
            if (doc) {
                this.customresponses = doc;
                this.cache.customresponses = true;
                return doc;
            } else {
                this.customresponses = {};
                this.cache.customresponses = true;
                return {};
            }
        }
        async getLevelConfig() {
            const doc = await level.findOne({ guildId: this.id });
            if(doc) {
                this.levelconfig = doc;
                this.cache.levelconfig = true;
                return doc;
            } else {
                this.levelconfig = {},
                this.cache.levelconfig = true;
                return {};
            }
        }
        /**
         * 
         * @param {String} config Config type 
         * @param {Boolean} value New value
         * @returns {Boolean} If the/a document was created/updated
         */
        async changeLevelConfig(config, value) {
            if(typeof value !== "boolean") return false;
            const doc = await level.findOne({ guildId: this.id });
            if(doc) {
                if(config === "levelnotif") {
                    doc.levelnotif = value;
                    await doc.updateOne({ levelnotif: value });
                    this.levelconfig = doc;
                    this.cache.levelconfig = true;
                    return true;
                } else if(config === "levelsystem") {
                    doc.levelsystem = value;
                    await doc.updateOne({ levelsystem: value });
                    this.levelconfig = doc;
                    this.cache.levelconfig = true;
                    return true;
                } else return false;
            } else {
                const esto = await level.create({
                    guildId: this.id,
                    levelnotif: config === "levelnotif" ? value : false,
                    levelsystem: config === "levelsystem" ? value : false,
                    roles: []
                });
                this.levelconfig = esto;
                this.cache.levelconfig = true;
                return true;
            }
        }
        noCache(){
            this.cache.customresponses = false;
            this.cache.prefix = false;
            this.cache.levelconfig = false;
            return true;
        }
    };
});