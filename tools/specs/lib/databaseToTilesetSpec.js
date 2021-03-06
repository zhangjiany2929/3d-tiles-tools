'use strict';
var fsExtra = require('fs-extra');
var Promise = require('bluebird');
var databaseToTileset = require('../../lib/databaseToTileset');
var fileExists = require('../../lib/fileExists');
var isGzipped = require('../../lib/isGzipped');

var fsExtraReadFile = Promise.promisify(fsExtra.readJson);
var fsExtraRemove = Promise.promisify(fsExtra.remove);

var inputFile = './specs/data/tileset.3dtiles';
var outputDirectory = './specs/data/Tileset/';
var tilesetJsonFile = './specs/data/TilesetOfTilesets/tileset.json';

describe('databaseToTileset', function() {
    afterEach(function (done) {
        fsExtraRemove(outputDirectory)
            .then(function() {
                done();
            });
    });

    it('creates a tileset from an sqlite database', function(done) {
        expect(databaseToTileset(inputFile, outputDirectory)
            .then(function() {
                return fileExists(tilesetJsonFile)
                    .then(function(exists) {
                        expect(exists).toEqual(true);
                        return fsExtraReadFile(tilesetJsonFile);
                    }).then(function(data) {
                        expect(isGzipped(data)).toBe(false);
                    });
            }), done).toResolve();
    });

    it('throws an error if no input file is provided', function() {
        expect(function() {
            databaseToTileset(undefined, outputDirectory);
        }).toThrowError('inputFile is required.');
    });

    it('works when no output directory is provided', function(done) {
        expect(databaseToTileset(inputFile)
            .then(function() {
                return fileExists(tilesetJsonFile)
                    .then(function(exists) {
                        expect(exists).toBe(true);
                    });
            }), done).toResolve();
    });
});
